<?php
namespace App\Models;

use App\Core\DB;

// Tabel level_progress: bintang terbaik dan waktu tercepat tiap pemain di tiap level.
class LevelProgress
{
    // ['0' => 3, '1' => 2, ...] (nomor level => bintang)
    public static function starsOf(int $playerId): array
    {
        $stars = [];
        foreach (DB::select("SELECT level_index, stars FROM level_progress WHERE player_id = ?", [$playerId]) as $r) {
            $stars[(string) $r['level_index']] = (int) $r['stars'];
        }
        return $stars;
    }

    // Bintang terbaik sebelumnya di level ini, atau null kalau belum pernah menang. Baris dikunci sampai transaksi selesai.
    public static function previousStars(int $playerId, int $level): ?int
    {
        $v = DB::value("SELECT stars FROM level_progress WHERE player_id = ? AND level_index = ? FOR UPDATE", [$playerId, $level]);
        return $v === false ? null : (int) $v;
    }

    // Simpan hasil: bintang dan waktu hanya diganti kalau lebih baik
    public static function record(int $playerId, int $level, int $stars, int $seconds): void
    {
        DB::statement("INSERT INTO level_progress (player_id, level_index, stars, best_seconds) VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE stars = GREATEST(stars, VALUES(stars)),
                                    best_seconds = LEAST(COALESCE(best_seconds, VALUES(best_seconds)), VALUES(best_seconds))",
            [$playerId, $level, $stars, min(65535, $seconds)]);
    }
}
