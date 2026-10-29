<?php
namespace App\Models;

use App\Core\DB;

// Tabel devices: bank soal perangkat (kata, kategori, petunjuk, foto).
class Device
{
    // Baris berbentuk [kata, kategori, petunjuk, foto, kredit foto, sumber foto] untuk JavaScript (BANK)
    public static function allForGame(): array
    {
        return DB::query("SELECT word, category, clue, image, image_credit, image_source FROM devices WHERE is_active = 1 ORDER BY id")
            ->fetchAll(\PDO::FETCH_NUM);
    }

    // Jumlah level: 1 per perangkat + 1 level tambahan tiap 4 perangkat (dibatasi jumlah singkatan).
    // Harus sama dengan buildPlan() di public/js/questions/levels.js.
    public static function levelCount(): int
    {
        static $n = null;
        if ($n === null) {
            $d = (int) DB::value("SELECT COUNT(*) FROM devices WHERE is_active = 1");
            $a = (int) DB::value("SELECT COUNT(*) FROM abbreviations WHERE is_active = 1");
            $n = $d + min(intdiv($d, 4), $a);
        }
        return $n;
    }
}
