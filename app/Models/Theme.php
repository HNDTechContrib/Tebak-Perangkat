<?php
namespace App\Models;

use App\Core\DB;

// Tabel themes (daftar tema) dan player_themes (tema yang sudah dimiliki pemain).
class Theme
{
    // Semua tema dalam bentuk yang dipakai JavaScript
    public static function all(): array
    {
        $themes = DB::select("SELECT id, name, color AS sky, color_deep AS deep, price, icons FROM themes ORDER BY sort_order, id");
        foreach ($themes as &$t) {
            $t['price'] = (int) $t['price'];
            $t['icons'] = explode(',', $t['icons']);
        }
        return $themes;
    }

    public static function find(string $id): ?array
    {
        return DB::first("SELECT * FROM themes WHERE id = ?", [$id]);
    }

    // ID tema yang dimiliki pemain, mis. ['hnd', 'layar']
    public static function ownedBy(int $playerId): array
    {
        return DB::query("SELECT theme_id FROM player_themes WHERE player_id = ?", [$playerId])->fetchAll(\PDO::FETCH_COLUMN);
    }

    // Tambahkan tema ke milik pemain. true = baru dibeli, false = sudah punya.
    public static function giveTo(int $playerId, string $themeId): bool
    {
        return DB::statement("INSERT IGNORE INTO player_themes (player_id, theme_id) VALUES (?, ?)", [$playerId, $themeId]) > 0;
    }
}
