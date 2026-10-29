<?php
namespace App\Models;

use App\Core\DB;

// Tabel players: akun, koin, level terbuka, tema, profil.
class Player
{
    public static function find(int $id): ?array
    {
        return DB::first("SELECT * FROM players WHERE id = ?", [$id]);
    }

    public static function findByUsername(string $username): ?array
    {
        return DB::first("SELECT * FROM players WHERE username = ?", [$username]);
    }

    // Buat akun baru, lengkap dengan tema awal dan catatan koin awal. Mengembalikan ID-nya.
    public static function create(string $username, string $password, ?string $nickname): int
    {
        return DB::transaction(function () use ($username, $password, $nickname) {
            $coins = config('game.start_coins');
            DB::statement("INSERT INTO players (username, password_hash, nickname, coins) VALUES (?, ?, ?, ?)",
                [$username, password_hash($password, PASSWORD_DEFAULT), $nickname, $coins]);
            $id = DB::lastInsertId();
            DB::statement("INSERT INTO player_themes (player_id, theme_id) VALUES (?, 'hnd')", [$id]);
            CoinTransaction::log($id, $coins, 'awal');
            return $id;
        });
    }

    // Data pemain dalam bentuk yang dipakai JavaScript (state.player di public/js/core/state.js, tipe Player di public/js/types/game.d.ts)
    public static function state(int $id): ?array
    {
        $p = self::find($id);
        if (!$p) return null;
        return [
            'username'     => $p['username'],
            'nick'         => (string) ($p['nickname'] ?? ''),
            'bio'          => (string) ($p['bio'] ?? ''),
            'avatar'       => $p['avatar_icon'],
            'color'        => $p['avatar_color'],
            'joined'       => substr((string) $p['created_at'], 0, 10),
            'coins'        => (int) $p['coins'],
            'level'        => (int) $p['current_level'],
            'stars'        => (object) LevelProgress::starsOf($id),
            'dailyClaimed' => $p['last_daily'] === date('Y-m-d'),
            'themes'       => Theme::ownedBy($id),
            'theme'        => $p['active_theme'],
            'mute'         => (bool) $p['sound_muted'],
        ];
    }

    // Tambah koin (jumlah negatif = kurangi). Gagal (false) kalau koinnya tidak cukup.
    public static function addCoins(int $id, int $amount): bool
    {
        if ($amount >= 0) return DB::statement("UPDATE players SET coins = coins + ? WHERE id = ?", [$amount, $id]) > 0;
        return DB::statement("UPDATE players SET coins = coins - ? WHERE id = ? AND coins >= ?", [-$amount, $id, -$amount]) > 0;
    }

    // Tandai hadiah harian sudah diambil. Gagal (false) kalau hari ini sudah diambil.
    public static function claimDaily(int $id, string $today): bool
    {
        return DB::statement("UPDATE players SET last_daily = ? WHERE id = ? AND (last_daily IS NULL OR last_daily <> ?)", [$today, $id, $today]) > 0;
    }

    // Buka level berikutnya kalau level ini adalah level terjauh yang terbuka
    public static function unlockNext(int $id, int $level): void
    {
        DB::statement("UPDATE players SET current_level = current_level + 1 WHERE id = ? AND current_level = ? AND current_level < ?",
            [$id, $level, Device::levelCount() - 1]);
    }

    // Ubah kolom-kolom profil, mis. update($id, ['nickname' => 'Budi', 'bio' => null])
    public static function update(int $id, array $fields): void
    {
        $allowed = ['nickname', 'bio', 'avatar_icon', 'avatar_color', 'active_theme', 'sound_muted', 'password_hash'];
        $fields = array_intersect_key($fields, array_flip($allowed));
        if (!$fields) return;
        $set = implode(', ', array_map(fn($k) => "$k = ?", array_keys($fields)));
        DB::statement("UPDATE players SET $set WHERE id = ?", [...array_values($fields), $id]);
    }
}
