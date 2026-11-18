<?php
namespace App\Services;

use App\Core\DB;

// Menghasilkan template Excel (.xlsx) siap pakai dan mengekspor soal aktif ke spreadsheet.
class TemplateGenerator
{
    /**
     * Menghasilkan file template Excel kosong/contoh untuk bank soal.
     */
    public static function createTemplate(string $outputPath): void
    {
        $sheets = [
            'Perangkat' => [
                ['Kata / Jawaban', 'Kategori', 'Petunjuk Soal', 'Path Gambar (Opsional)', 'Kredit Gambar (Opsional)', 'Sumber Gambar (Opsional)', 'Aktif (1/0)'],
                ['KEYBOARD', 'Input', 'Papan berisi tombol huruf dan angka untuk mengetik.', 'images/perangkat/keyboard.jpg', 'Foto: Vugluskr, Public domain', 'https://commons.wikimedia.org/wiki/File:Cherry-keyboard-big-Enter.jpg', '1'],
                ['MOUSE', 'Input', 'Alat penunjuk yang digeser di meja untuk menggerakkan kursor.', 'images/perangkat/mouse.jpg', 'Foto: Darkone, CC BY-SA 2.5', 'https://commons.wikimedia.org/wiki/File:3-Tasten-Maus_Microsoft.jpg', '1'],
                ['PROSESOR', 'Pemroses', 'Otak komputer yang menjalankan instruksi program (CPU).', '', '', '', '1'],
                ['MONITOR', 'Output', 'Layar yang menampilkan hasil pemrosesan visual komputer.', 'images/perangkat/monitor.jpg', '', '', '1'],
                ['HEATSINK', 'Pendingin', 'Logam bersirip yang menyerap panas dari komponen komputer.', 'images/perangkat/heatsink.jpg', '', '', '1'],
                ['POWER SUPPLY', 'Daya', 'Penyuplai daya listrik utama untuk seluruh komponen PC.', '', '', '', '1'],
                ['CASING', 'Rangka', 'Kotak pelindung tempat meletakkan seluruh komponen PC.', 'images/perangkat/casing.jpg', '', '', '1'],
                ['SSD', 'Penyimpanan', 'Media penyimpanan data cepat berbasis chip memori kilat.', '', '', '', '1'],
                ['ROUTER', 'Jaringan', 'Perangkat pengatur lalu lintas data dan pembagi jaringan.', '', '', '', '1'],
                ['HDMI', 'Port', 'Port antarmuka audio dan video digital kualitas tinggi.', 'images/perangkat/hdmi.jpg', '', '', '1'],
            ],
            'Singkatan' => [
                ['Singkatan', 'Kepanjangan', 'Aktif (1/0)'],
                ['CPU', 'Central Processing Unit', '1'],
                ['GPU', 'Graphics Processing Unit', '1'],
                ['RAM', 'Random Access Memory', '1'],
                ['ROM', 'Read Only Memory', '1'],
                ['SSD', 'Solid State Drive', '1'],
                ['HDD', 'Hard Disk Drive', '1'],
                ['USB', 'Universal Serial Bus', '1'],
                ['LAN', 'Local Area Network', '1'],
            ],
            'Petunjuk Kategori' => [
                ['Kategori yang Tersedia', 'Keterangan'],
                ['Input', 'Perangkat masukan: Keyboard, Mouse, Scanner, Webcam, Mikrofon, Stylus, dll.'],
                ['Output', 'Perangkat keluaran: Monitor, Printer, Speaker, Proyektor, Headphone, dll.'],
                ['Pemroses', 'Perangkat pengolah data: Prosesor, Motherboard, RAM, Kartu Grafis, Chipset, dll.'],
                ['Pendingin', 'Sistem pendingin: Heatsink, Kipas, Thermal Paste, Water Cooling, Cooling Pad, dll.'],
                ['Daya', 'Catu daya dan listrik: Power Supply, UPS, Stabilizer, Baterai, Adaptor, dll.'],
                ['Rangka', 'Struktur fisik: Casing, Baut, Rak Server, Engsel laptop, dll.'],
                ['Penyimpanan', 'Media penyimpanan: Harddisk, SSD, Flashdisk, Kartu Memori, Micro SD, NAS, dll.'],
                ['Jaringan', 'Komunikasi & internet: Router, Modem, Switch, Kabel LAN, Access Point, dll.'],
                ['Port', 'Konektor antarmuka: HDMI, USB, DisplayPort, Audio Jack, Kabel SATA, dll.'],
            ],
        ];

        ExcelWriter::createXlsx($outputPath, $sheets);
    }

    /**
     * Mengekspor seluruh soal dan singkatan yang ada di database saat ini ke file Excel.
     */
    public static function exportCurrentQuestions(string $outputPath): void
    {
        $devices = DB::select("SELECT word, category, clue, image, image_credit, image_source, is_active FROM devices ORDER BY id ASC");
        $abbrs = DB::select("SELECT short, long_form, is_active FROM abbreviations ORDER BY id ASC");

        $devRows = [
            ['Kata / Jawaban', 'Kategori', 'Petunjuk Soal', 'Path Gambar (Opsional)', 'Kredit Gambar (Opsional)', 'Sumber Gambar (Opsional)', 'Aktif (1/0)'],
        ];
        foreach ($devices as $d) {
            $devRows[] = [
                $d['word'], $d['category'], $d['clue'],
                $d['image'] ?? '', $d['image_credit'] ?? '', $d['image_source'] ?? '',
                (string) $d['is_active'],
            ];
        }

        $abbrRows = [
            ['Singkatan', 'Kepanjangan', 'Aktif (1/0)'],
        ];
        foreach ($abbrs as $a) {
            $abbrRows[] = [$a['short'], $a['long_form'], (string) $a['is_active']];
        }

        $sheets = [
            'Perangkat' => $devRows,
            'Singkatan' => $abbrRows,
        ];

        ExcelWriter::createXlsx($outputPath, $sheets);
    }
}
