<?php
namespace App\Services;

use RuntimeException;
use ZipArchive;

// Menulis file spreadsheet .xlsx (OpenXML) multi-sheet tanpa dependensi luar.
class ExcelWriter
{
    /**
     * Membuat file .xlsx dari kumpulan sheet:
     * $sheets = ['NamaSheet' => [['kolom A1', 'kolom B1'], ['A2', 'B2']]]
     */
    public static function createXlsx(string $filePath, array $sheets): void
    {
        $dir = dirname($filePath);
        if (!is_dir($dir)) mkdir($dir, 0777, true);
        if (is_file($filePath)) @unlink($filePath);

        $sheetNames = array_keys($sheets);
        if (empty($sheetNames)) $sheetNames = ['Sheet1'];

        $files = [];

        // 1. [Content_Types].xml
        $contentTypes = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' . "\n" .
            '  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' . "\n" .
            '  <Default Extension="xml" ContentType="application/xml"/>' . "\n" .
            '  <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' . "\n";
        for ($i = 1; $i <= count($sheetNames); $i++) {
            $contentTypes .= "  <Override PartName=\"/xl/worksheets/sheet{$i}.xml\" ContentType=\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\"/>\n";
        }
        $contentTypes .= '</Types>';
        $files['[Content_Types].xml'] = $contentTypes;

        // 2. _rels/.rels
        $files['_rels/.rels'] = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' . "\n" .
            '  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' . "\n" .
            '</Relationships>';

        // 3. xl/_rels/workbook.xml.rels
        $wbRels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' . "\n";
        for ($i = 1; $i <= count($sheetNames); $i++) {
            $wbRels .= "  <Relationship Id=\"rId{$i}\" Type=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\" Target=\"worksheets/sheet{$i}.xml\"/>\n";
        }
        $wbRels .= '</Relationships>';
        $files['xl/_rels/workbook.xml.rels'] = $wbRels;

        // 4. xl/workbook.xml
        $wbXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' . "\n" .
            '  <sheets>' . "\n";
        $i = 1;
        foreach ($sheetNames as $name) {
            $safeName = htmlspecialchars($name, ENT_QUOTES | ENT_XML1, 'UTF-8');
            $wbXml .= "    <sheet name=\"{$safeName}\" sheetId=\"{$i}\" r:id=\"rId{$i}\"/>\n";
            $i++;
        }
        $wbXml .= "  </sheets>\n</workbook>";
        $files['xl/workbook.xml'] = $wbXml;

        // 5. xl/worksheets/sheetN.xml
        $idx = 1;
        foreach ($sheets as $rows) {
            $files["xl/worksheets/sheet{$idx}.xml"] = self::buildSheetXml($rows);
            $idx++;
        }

        // Tulis menggunakan ZipArchive jika tersedia, atau SimpleZip murni PHP
        if (class_exists('ZipArchive')) {
            $zip = new ZipArchive();
            if ($zip->open($filePath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === true) {
                foreach ($files as $name => $content) $zip->addFromString($name, $content);
                $zip->close();
                return;
            }
        }

        // Fallback murni PHP
        $bin = SimpleZip::create($files);
        if (file_put_contents($filePath, $bin) === false) {
            throw new RuntimeException("Gagal menyimpan file Excel ke: $filePath");
        }
    }

    private static function buildSheetXml(array $rows): string
    {
        $xml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' . "\n" .
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' . "\n" .
            '  <sheetData>' . "\n";

        $rowNum = 1;
        foreach ($rows as $row) {
            $xml .= "    <row r=\"{$rowNum}\">\n";
            $colNum = 0;
            foreach ($row as $cell) {
                $colLetter = self::colLetter($colNum);
                $ref = "{$colLetter}{$rowNum}";
                $text = htmlspecialchars((string) $cell, ENT_QUOTES | ENT_XML1, 'UTF-8');
                $xml .= "      <c r=\"{$ref}\" t=\"inlineStr\"><is><t>{$text}</t></is></c>\n";
                $colNum++;
            }
            $xml .= "    </row>\n";
            $rowNum++;
        }

        $xml .= "  </sheetData>\n</worksheet>";
        return $xml;
    }

    public static function colLetter(int $colIndex): string
    {
        $colIndex = max(0, $colIndex);
        $letter = '';
        while ($colIndex >= 0) {
            $letter = chr(($colIndex % 26) + 65) . $letter;
            $colIndex = intdiv($colIndex, 26) - 1;
        }
        return $letter;
    }
}
