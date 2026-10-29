<?php
namespace App\Models;

use App\Core\DB;

// Tabel abbreviations: singkatan dan kepanjangannya.
class Abbreviation
{
    // Baris berbentuk [singkatan, kepanjangan] untuk JavaScript (ABBR)
    public static function allForGame(): array
    {
        return DB::query("SELECT short, long_form FROM abbreviations WHERE is_active = 1 ORDER BY id")->fetchAll(\PDO::FETCH_NUM);
    }
}
