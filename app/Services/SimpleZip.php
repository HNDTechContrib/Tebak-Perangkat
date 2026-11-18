<?php
namespace App\Services;

// Pembuat dan pembaca file ZIP murni PHP (berbasis gzdeflate/gzinflate) tanpa butuh ekstensi ZipArchive.
class SimpleZip
{
    /**
     * Membuat string binary file ZIP dari array file: ['path/file.xml' => 'isi teks/binary']
     */
    public static function create(array $files): string
    {
        $body = '';
        $cd = '';
        $offset = 0;
        $dosTime = pack('V', 0x58210000); // 2024-01-01

        foreach ($files as $name => $data) {
            $comp = gzdeflate($data);
            $crc = crc32($data);
            $cLen = strlen($comp);
            $uLen = strlen($data);
            $nLen = strlen($name);

            // Local file header (30 bytes + name + data)
            $lh = "PK\x03\x04\x14\x00\x00\x00\x08\x00" . $dosTime . pack('VVVvv', $crc, $cLen, $uLen, $nLen, 0) . $name . $comp;
            $body .= $lh;

            // Central directory header (46 bytes + name)
            $cd .= "PK\x01\x02\x14\x00\x14\x00\x00\x00\x08\x00" . $dosTime . pack('VVVvvvvvVV', $crc, $cLen, $uLen, $nLen, 0, 0, 0, 0, 0x20, $offset) . $name;
            $offset += strlen($lh);
        }

        // End of central directory record (22 bytes)
        $eocd = "PK\x05\x06\x00\x00\x00\x00" . pack('vvVVv', count($files), count($files), strlen($cd), strlen($body), 0);
        return $body . $cd . $eocd;
    }

    /**
     * Mengekstrak seluruh file dari string binary ZIP menjadi: ['path/file.xml' => 'isi']
     */
    public static function extract(string $zipData): array
    {
        $files = [];
        $len = strlen($zipData);
        $pos = 0;

        while ($pos + 30 <= $len) {
            $sig = substr($zipData, $pos, 4);
            if ($sig !== "PK\x03\x04") break;

            $meta = unpack('vversion/vflag/vmethod/vtime/vdate/Vcrc/VcSize/VuSize/vfnLen/vextraLen', substr($zipData, $pos + 4, 26));
            $pos += 30;

            $fn = substr($zipData, $pos, $meta['fnLen']);
            $pos += $meta['fnLen'] + $meta['extraLen'];

            $raw = substr($zipData, $pos, $meta['cSize']);
            $pos += $meta['cSize'];

            if ($meta['method'] === 8) {
                $content = @gzinflate($raw);
            } elseif ($meta['method'] === 0) {
                $content = $raw;
            } else {
                $content = false;
            }

            if ($content !== false) $files[$fn] = $content;
        }
        return $files;
    }
}
