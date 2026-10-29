<?php
namespace App\Models;

use App\Core\DB;

// View leaderboard di database: total bintang dan level per pemain (dibuat oleh migrasi 000007 dan 000011).
class Leaderboard
{
    // Urutan peringkat: bintang terbanyak, lalu level terbanyak, lalu yang lebih dulu mencapainya
    const ORDER = "ORDER BY total_stars DESC, levels_done DESC, last_played ASC";

    public static function top(int $limit = 50): array
    {
        return DB::select("SELECT * FROM leaderboard WHERE levels_done > 0 " . self::ORDER . " LIMIT " . (int) $limit);
    }

    public static function totalPlayers(): int
    {
        return (int) DB::value("SELECT COUNT(*) FROM leaderboard WHERE levels_done > 0");
    }

    // Baris peringkat seorang pemain + kolom 'rank', atau null kalau belum menyelesaikan level apa pun
    public static function rankOf(int $playerId): ?array
    {
        $mine = DB::first("SELECT * FROM leaderboard WHERE player_id = ? AND levels_done > 0", [$playerId]);
        if (!$mine) return null;
        $ahead = (int) DB::value("SELECT COUNT(*) FROM leaderboard WHERE levels_done > 0 AND (total_stars > ?
            OR (total_stars = ? AND (levels_done > ? OR (levels_done = ? AND last_played < ?))))",
            [$mine['total_stars'], $mine['total_stars'], $mine['levels_done'], $mine['levels_done'], $mine['last_played']]);
        return $mine + ['rank' => $ahead + 1];
    }
}
