<?php
namespace App\Services;

use RuntimeException;
use SimpleXMLElement;
use ZipArchive;

// Membaca file spreadsheet (.xlsx dan .csv) menjadi array baris per sheet tanpa dependensi luar.
class ExcelReader
{
    /**
     * Membaca semua sheet dari file .xlsx atau .csv.
     * Mengembalikan: ['NamaSheet' => [[kolom1, kolom2, ...], ...]]
     */
    public static function readSheets(string $filePath): array
    {
        if (!is_file($filePath)) throw new RuntimeException("File tidak ditemukan: $filePath");
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));

        if ($ext === 'csv' || $ext === 'txt') {
            return ['Sheet1' => self::readCsv($filePath)];
        }
        if ($ext === 'xlsx') {
            return self::readXlsx($filePath);
        }
        throw new RuntimeException("Format file tidak didukung: .$ext (gunakan .xlsx atau .csv)");
    }

    // Membaca file CSV dengan auto-detect pemisah (, ; \t)
    public static function readCsv(string $filePath): array
    {
        $handle = fopen($filePath, 'rb');
        if (!$handle) throw new RuntimeException("Gagal membuka file CSV: $filePath");

        $firstLine = fgets($handle);
        rewind($handle);
        $delimiter = ',';
        if ($firstLine !== false) {
            $counts = [
                ','  => substr_count($firstLine, ','),
                ';'  => substr_count($firstLine, ';'),
                "\t" => substr_count($firstLine, "\t"),
            ];
            arsort($counts);
            $delimiter = array_key_first($counts) ?: ',';
        }

        $rows = [];
        while (($row = fgetcsv($handle, 0, $delimiter)) !== false) {
            $allEmpty = true;
            foreach ($row as &$cell) {
                $cell = trim((string) $cell);
                if ($cell !== '') $allEmpty = false;
            }
            if (!$allEmpty) $rows[] = $row;
        }
        fclose($handle);
        return $rows;
    }

    // Membaca workbook .xlsx dengan ZipArchive atau SimpleZip (murni PHP)
    public static function readXlsx(string $filePath): array
    {
        $source = null;
        $zip = null;

        if (class_exists('ZipArchive')) {
            $zip = new ZipArchive();
            if ($zip->open($filePath) === true) $source = $zip;
        }

        if (!$source) {
            $bin = file_get_contents($filePath);
            if ($bin === false) throw new RuntimeException("Gagal membaca file: $filePath");
            $source = SimpleZip::extract($bin);
            if (empty($source)) throw new RuntimeException('Gagal membuka file .xlsx (file rusak atau tidak terbaca).');
        }

        $shared = self::loadSharedStrings($source);
        $sheetFiles = self::loadSheetMapping($source);
        $result = [];

        foreach ($sheetFiles as $name => $xmlPath) {
            $sheetXml = self::getFile($source, $xmlPath);
            if ($sheetXml === null) continue;
            $rows = self::parseSheetXml($sheetXml, $shared);
            if (!empty($rows)) $result[$name] = $rows;
        }

        if ($zip) $zip->close();
        if (empty($result)) throw new RuntimeException('File Excel tidak memiliki data sheet yang valid.');
        return $result;
    }

    private static function getFile($source, string $path): ?string
    {
        if (is_array($source)) return $source[$path] ?? null;
        $c = $source->getFromName($path);
        return $c === false ? null : $c;
    }

    private static function loadSharedStrings($source): array
    {
        $xml = self::getFile($source, 'xl/sharedStrings.xml');
        if ($xml === null) return [];
        $sx = @simplexml_load_string($xml);
        if (!$sx) return [];

        $strings = [];
        foreach ($sx->si as $si) {
            if (isset($si->t)) {
                $strings[] = (string) $si->t;
            } else {
                $text = '';
                foreach ($si->r as $r) $text .= (string) $r->t;
                $strings[] = $text;
            }
        }
        return $strings;
    }

    private static function loadSheetMapping($source): array
    {
        $wbXml = self::getFile($source, 'xl/workbook.xml');
        $relsXml = self::getFile($source, 'xl/_rels/workbook.xml.rels');
        if ($wbXml === null) return ['Sheet1' => 'xl/worksheets/sheet1.xml'];

        $rels = [];
        if ($relsXml !== null && ($sxRels = @simplexml_load_string($relsXml))) {
            foreach ($sxRels->Relationship as $rel) {
                $rels[(string) $rel['Id']] = (string) $rel['Target'];
            }
        }

        $sxWb = @simplexml_load_string($wbXml);
        if (!$sxWb || !isset($sxWb->sheets->sheet)) return ['Sheet1' => 'xl/worksheets/sheet1.xml'];

        $map = [];
        $idx = 1;
        foreach ($sxWb->sheets->sheet as $s) {
            $name = (string) $s['name'];
            $rId = (string) $s->attributes('http://schemas.openxmlformats.org/officeDocument/2006/relationships')['id'];
            $target = $rels[$rId] ?? "worksheets/sheet{$idx}.xml";
            $path = str_starts_with($target, 'xl/') ? $target : 'xl/' . ltrim($target, '/');
            $map[$name] = $path;
            $idx++;
        }
        return $map;
    }

    private static function parseSheetXml(string $xml, array $shared): array
    {
        $sx = @simplexml_load_string($xml);
        if (!$sx || !isset($sx->sheetData->row)) return [];

        $rows = [];
        foreach ($sx->sheetData->row as $r) {
            $cols = [];
            foreach ($r->c as $c) {
                $ref = (string) $c['r'];
                $colIdx = self::colIndex($ref);
                $type = (string) $c['t'];
                $val = '';

                if ($type === 's') {
                    $val = $shared[(int) $c->v] ?? '';
                } elseif ($type === 'inlineStr') {
                    $val = (string) ($c->is->t ?? '');
                } else {
                    $val = (string) ($c->v ?? '');
                }
                $cols[$colIdx] = trim($val);
            }

            if (empty($cols)) continue;
            $maxCol = max(array_keys($cols));
            $denseRow = [];
            $allEmpty = true;
            for ($i = 0; $i <= $maxCol; $i++) {
                $cell = $cols[$i] ?? '';
                $denseRow[$i] = $cell;
                if ($cell !== '') $allEmpty = false;
            }
            if (!$allEmpty) $rows[] = $denseRow;
        }
        return $rows;
    }

    // Mengubah 'A1' atau 'BC12' menjadi nomor kolom 0-based ('A' -> 0, 'B' -> 1, 'AA' -> 26)
    public static function colIndex(string $cellRef): int
    {
        $letters = preg_replace('/[0-9]/', '', strtoupper($cellRef));
        $len = strlen($letters);
        $col = 0;
        for ($i = 0; $i < $len; $i++) {
            $col = $col * 26 + (ord($letters[$i]) - 64);
        }
        return max(0, $col - 1);
    }
}
