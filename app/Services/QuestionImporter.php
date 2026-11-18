<?php
namespace App\Services;

use App\Core\DB;
use RuntimeException;
use Throwable;

// Memproses impor soal perangkat dan singkatan dari array sheet spreadsheet ke database.
class QuestionImporter
{
    public const VALID_CATEGORIES = [
        'Input'       => 'Input',
        'Output'      => 'Output',
        'Pemroses'    => 'Pemroses',
        'Pendingin'   => 'Pendingin',
        'Daya'        => 'Daya',
        'Rangka'      => 'Rangka',
        'Penyimpanan' => 'Penyimpanan',
        'Jaringan'    => 'Jaringan',
        'Port'        => 'Port',
    ];

    /**
     * Mengimpor soal dari file Excel (.xlsx) atau CSV (.csv).
     * @param string $mode 'upsert' (default, tambah/update) atau 'replace' (kosongkan dulu lalu isi)
     */
    public static function importFile(string $filePath, string $mode = 'upsert'): array
    {
        $sheets = ExcelReader::readSheets($filePath);
        return self::importSheets($sheets, $mode);
    }

    public static function importSheets(array $sheets, string $mode = 'upsert'): array
    {
        $parsed = self::parseAllSheets($sheets);
        $devices = $parsed['devices'];
        $abbrs = $parsed['abbreviations'];
        $errors = $parsed['errors'];

        if (empty($devices) && empty($abbrs)) {
            $msg = 'Tidak ada baris soal yang valid ditemukan.';
            if (!empty($errors)) $msg .= ' Contoh masalah: ' . implode('; ', array_slice($errors, 0, 3));
            throw new RuntimeException($msg);
        }

        $stats = [
            'mode'             => $mode,
            'devices_imported' => 0,
            'devices_updated'  => 0,
            'abbr_imported'    => 0,
            'abbr_updated'     => 0,
            'errors'           => $errors,
        ];

        DB::transaction(function () use (&$stats, $devices, $abbrs, $mode) {
            if ($mode === 'replace') {
                if (!empty($devices)) DB::statement("DELETE FROM devices");
                if (!empty($abbrs)) DB::statement("DELETE FROM abbreviations");
            }

            foreach ($devices as $d) {
                $exists = (int) DB::value("SELECT COUNT(*) FROM devices WHERE word = ?", [$d['word']]);
                if ($exists > 0) {
                    DB::statement(
                        "UPDATE devices SET category = ?, clue = ?, image = ?, image_credit = ?, image_source = ?, is_active = ? WHERE word = ?",
                        [$d['category'], $d['clue'], $d['image'], $d['image_credit'], $d['image_source'], $d['is_active'], $d['word']]
                    );
                    $stats['devices_updated']++;
                } else {
                    DB::statement(
                        "INSERT INTO devices (word, category, clue, image, image_credit, image_source, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)",
                        [$d['word'], $d['category'], $d['clue'], $d['image'], $d['image_credit'], $d['image_source'], $d['is_active']]
                    );
                    $stats['devices_imported']++;
                }
            }

            foreach ($abbrs as $a) {
                $exists = (int) DB::value("SELECT COUNT(*) FROM abbreviations WHERE short = ?", [$a['short']]);
                if ($exists > 0) {
                    DB::statement("UPDATE abbreviations SET long_form = ?, is_active = ? WHERE short = ?", [$a['long_form'], $a['is_active'], $a['short']]);
                    $stats['abbr_updated']++;
                } else {
                    DB::statement("INSERT INTO abbreviations (short, long_form, is_active) VALUES (?, ?, ?)", [$a['short'], $a['long_form'], $a['is_active']]);
                    $stats['abbr_imported']++;
                }
            }
        });

        $stats['total_devices'] = (int) DB::value("SELECT COUNT(*) FROM devices WHERE is_active = 1");
        $stats['total_abbr'] = (int) DB::value("SELECT COUNT(*) FROM abbreviations WHERE is_active = 1");
        return $stats;
    }

    public static function parseAllSheets(array $sheets): array
    {
        $devices = [];
        $abbrs = [];
        $errors = [];

        foreach ($sheets as $sheetName => $rows) {
            if (empty($rows)) continue;
            $header = array_shift($rows);
            $colMap = self::detectColumns($header);
            $type = self::detectSheetType($sheetName, $colMap);

            $rowNum = 2; // Baris 1 adalah header
            foreach ($rows as $row) {
                $rowError = null;
                if ($type === 'devices') {
                    $item = self::validateDeviceRow($row, $colMap, $rowNum, $sheetName, $rowError);
                    if ($item) $devices[] = $item;
                    elseif ($rowError) $errors[] = $rowError;
                } elseif ($type === 'abbreviations') {
                    $item = self::validateAbbrRow($row, $colMap, $rowNum, $sheetName, $rowError);
                    if ($item) $abbrs[] = $item;
                    elseif ($rowError) $errors[] = $rowError;
                }
                $rowNum++;
            }
        }
        return ['devices' => $devices, 'abbreviations' => $abbrs, 'errors' => $errors];
    }

    private static function detectSheetType(string $sheetName, array $colMap): string
    {
        $sn = strtolower($sheetName);
        if (str_contains($sn, 'petunjuk') || str_contains($sn, 'panduan') || str_contains($sn, 'help') || str_contains($sn, 'guide') || str_contains($sn, 'info') || str_contains($sn, 'readme')) {
            return 'ignore';
        }
        if (str_contains($sn, 'singkat') || str_contains($sn, 'abbr')) return 'abbreviations';
        if (isset($colMap['short']) || isset($colMap['long_form'])) return 'abbreviations';
        if (isset($colMap['word']) || isset($colMap['clue']) || isset($colMap['category'])) return 'devices';
        if (str_contains($sn, 'perangkat') || str_contains($sn, 'device') || str_contains($sn, 'soal')) return 'devices';
        return 'devices';
    }

    private static function detectColumns(array $headerRow): array
    {
        $map = [];
        foreach ($headerRow as $idx => $cell) {
            $norm = strtolower(trim(preg_replace('/[^a-zA-Z0-9]/', '', (string) $cell)));
            if (in_array($norm, ['kata', 'jawaban', 'perangkat', 'nama', 'word', 'device'], true) && !isset($map['word'])) $map['word'] = $idx;
            elseif (in_array($norm, ['kategori', 'category', 'tipe', 'jenis'], true) && !isset($map['category'])) $map['category'] = $idx;
            elseif (in_array($norm, ['petunjuk', 'soal', 'clue', 'deskripsi', 'pertanyaan'], true) && !isset($map['clue'])) $map['clue'] = $idx;
            elseif (in_array($norm, ['gambar', 'image', 'foto', 'photo'], true) && !isset($map['image'])) $map['image'] = $idx;
            elseif (in_array($norm, ['kredit', 'credit', 'kreditgambar', 'imagecredit'], true) && !isset($map['image_credit'])) $map['image_credit'] = $idx;
            elseif (in_array($norm, ['sumber', 'source', 'sumbergambar', 'imagesource', 'link'], true) && !isset($map['image_source'])) $map['image_source'] = $idx;
            elseif (in_array($norm, ['singkatan', 'short', 'abbr', 'abbreviation'], true) && !isset($map['short'])) $map['short'] = $idx;
            elseif (in_array($norm, ['kepanjangan', 'longform', 'arti', 'artiistilah'], true) && !isset($map['long_form'])) $map['long_form'] = $idx;
            elseif (in_array($norm, ['aktif', 'isactive', 'status'], true) && !isset($map['is_active'])) $map['is_active'] = $idx;
        }
        // Fallback default kolom jika header tidak bernama
        if (!isset($map['word']) && !isset($map['short'])) {
            $map['word'] = 0; $map['category'] = 1; $map['clue'] = 2;
            $map['image'] = 3; $map['image_credit'] = 4; $map['image_source'] = 5; $map['is_active'] = 6;
        }
        return $map;
    }

    private static function normalizeCategory(string $raw): ?string
    {
        $raw = trim($raw);
        $low = strtolower($raw);
        $synonyms = [
            'input' => 'Input', 'masukan' => 'Input',
            'output' => 'Output', 'keluaran' => 'Output',
            'pemroses' => 'Pemroses', 'proses' => 'Pemroses', 'processor' => 'Pemroses', 'cpu' => 'Pemroses',
            'pendingin' => 'Pendingin', 'cooling' => 'Pendingin', 'cooler' => 'Pendingin',
            'daya' => 'Daya', 'power' => 'Daya', 'listrik' => 'Daya',
            'rangka' => 'Rangka', 'casing' => 'Rangka', 'case' => 'Rangka',
            'penyimpanan' => 'Penyimpanan', 'storage' => 'Penyimpanan', 'memori' => 'Penyimpanan',
            'jaringan' => 'Jaringan', 'network' => 'Jaringan',
            'port' => 'Port', 'konektor' => 'Port', 'interface' => 'Port',
        ];
        return $synonyms[$low] ?? (self::VALID_CATEGORIES[ucfirst($low)] ?? null);
    }

    private static function validateDeviceRow(array $row, array $colMap, int $rowNum, string $sheet, ?string &$error): ?array
    {
        $word = strtoupper(trim((string) ($row[$colMap['word'] ?? 0] ?? '')));
        if ($word === '') return null; // Baris kosong dilewati tanpa error
        if (mb_strlen($word) > 40) {
            $error = "[$sheet:B$rowNum] Kata '$word' terlalu panjang (maksimal 40 karakter).";
            return null;
        }

        $rawCat = (string) ($row[$colMap['category'] ?? 1] ?? '');
        $cat = self::normalizeCategory($rawCat);
        if (!$cat) {
            $allowed = implode(', ', array_keys(self::VALID_CATEGORIES));
            $error = "[$sheet:B$rowNum] Kategori '$rawCat' pada kata '$word' tidak valid. Pilih salah satu: $allowed.";
            return null;
        }

        $clue = trim((string) ($row[$colMap['clue'] ?? 2] ?? ''));
        if ($clue === '') {
            $error = "[$sheet:B$rowNum] Petunjuk/soal untuk '$word' tidak boleh kosong.";
            return null;
        }
        if (mb_strlen($clue) > 255) {
            $error = "[$sheet:B$rowNum] Petunjuk untuk '$word' terlalu panjang (maks 255 karakter).";
            return null;
        }

        $img = trim((string) ($row[$colMap['image'] ?? 3] ?? '')) ?: null;
        $credit = trim((string) ($row[$colMap['image_credit'] ?? 4] ?? '')) ?: null;
        $source = trim((string) ($row[$colMap['image_source'] ?? 5] ?? '')) ?: null;
        $activeRaw = trim((string) ($row[$colMap['is_active'] ?? 6] ?? '1'));
        $isActive = ($activeRaw === '0' || strtolower($activeRaw) === 'tidak' || strtolower($activeRaw) === 'false') ? 0 : 1;

        return [
            'word' => $word, 'category' => $cat, 'clue' => $clue,
            'image' => $img, 'image_credit' => $credit, 'image_source' => $source,
            'is_active' => $isActive,
        ];
    }

    private static function validateAbbrRow(array $row, array $colMap, int $rowNum, string $sheet, ?string &$error): ?array
    {
        $short = strtoupper(trim((string) ($row[$colMap['short'] ?? 0] ?? '')));
        if ($short === '') return null;
        if (mb_strlen($short) > 10) {
            $error = "[$sheet:B$rowNum] Singkatan '$short' terlalu panjang (maksimal 10 karakter).";
            return null;
        }

        $long = trim((string) ($row[$colMap['long_form'] ?? 1] ?? ''));
        if ($long === '') {
            $error = "[$sheet:B$rowNum] Kepanjangan untuk singkatan '$short' tidak boleh kosong.";
            return null;
        }
        if (mb_strlen($long) > 80) {
            $error = "[$sheet:B$rowNum] Kepanjangan untuk '$short' terlalu panjang (maksimal 80 karakter).";
            return null;
        }

        $activeRaw = trim((string) ($row[$colMap['is_active'] ?? 2] ?? '1'));
        $isActive = ($activeRaw === '0' || strtolower($activeRaw) === 'tidak' || strtolower($activeRaw) === 'false') ? 0 : 1;

        return ['short' => $short, 'long_form' => $long, 'is_active' => $isActive];
    }
}
