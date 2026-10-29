<?php
namespace App\Core;

// Siapa yang sedang login (mirip facade Auth di Laravel). Disimpan di sesi PHP.
class Auth
{
    // ID pemain yang login, atau null
    public static function id(): ?int
    {
        return isset($_SESSION['uid']) ? (int) $_SESSION['uid'] : null;
    }

    public static function check(): bool
    {
        return self::id() !== null;
    }

    // Login sebagai pemain ini. ID sesi diganti agar sesi lama tidak bisa dipakai orang lain.
    public static function login(int $id): void
    {
        session_regenerate_id(true);
        $_SESSION = ['uid' => $id];
    }

    public static function logout(): void
    {
        $_SESSION = [];
        session_destroy();
    }
}
