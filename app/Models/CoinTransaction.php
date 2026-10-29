<?php
namespace App\Models;

use App\Core\DB;

// Tabel coin_transactions: catatan setiap koin masuk dan keluar.
// reason: awal, harian, menang_level, ulang_level, booster, beli_tema, admin
class CoinTransaction
{
    public static function log(int $playerId, int $amount, string $reason, ?string $ref = null): void
    {
        DB::statement("INSERT INTO coin_transactions (player_id, amount, reason, ref) VALUES (?, ?, ?, ?)", [$playerId, $amount, $reason, $ref]);
    }
}
