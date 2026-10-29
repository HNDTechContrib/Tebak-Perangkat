<?php
namespace App\Controllers;

use App\Core\Auth;
use App\Core\HttpException;

// Induk semua controller: fungsi bantu yang sering dipakai.
abstract class Controller
{
    private ?array $input = null;

    // Ambil data yang dikirim JavaScript (JSON), mis. $this->input('username')
    protected function input(string $key, $default = null)
    {
        if ($this->input === null) $this->input = json_decode((string) file_get_contents('php://input'), true) ?: [];
        return $this->input[$key] ?? $default;
    }

    protected function has(string $key): bool
    {
        $this->input('_');   // pastikan data sudah dibaca
        return array_key_exists($key, $this->input);
    }

    // Batalkan request dengan pesan error untuk pemain
    protected function fail(string $message, int $status = 400): never
    {
        throw new HttpException($message, $status);
    }

    // ID pemain yang login (rute dengan middleware 'auth' dijamin sudah login)
    protected function userId(): int
    {
        return (int) Auth::id();
    }

    // Rapikan teks bebas: spasi berlebih dibuang, dipotong ke panjang maksimum. Kosong -> null.
    protected function cleanText($value, int $max): ?string
    {
        $s = trim(preg_replace('/\s+/u', ' ', (string) $value));
        $s = function_exists('mb_substr') ? mb_substr($s, 0, $max) : substr($s, 0, $max);
        return $s === '' ? null : $s;
    }
}
