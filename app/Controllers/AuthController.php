<?php
namespace App\Controllers;

use App\Core\Auth;
use App\Models\Player;
use PDOException;

// Daftar, masuk, dan keluar.
class AuthController extends Controller
{
    // POST /api/register
    public function register(): array
    {
        $username = trim((string) $this->input('username', ''));
        $password = (string) $this->input('password', '');
        if (!preg_match('/^[A-Za-z0-9_]{3,32}$/', $username)) $this->fail('Nama pengguna 3–32 karakter: huruf, angka, atau garis bawah.');
        if (strlen($password) < 6) $this->fail('Kata sandi minimal 6 karakter.');

        try {
            $id = Player::create($username, $password, $this->cleanText($this->input('nickname'), 16));
        } catch (PDOException $e) {
            if (($e->errorInfo[1] ?? 0) === 1062) $this->fail('Nama pengguna sudah dipakai.', 409);   // 1062 = data kembar
            throw $e;
        }
        Auth::login($id);
        return ['ok' => true];
    }

    // POST /api/login
    public function login(): array
    {
        $player = Player::findByUsername(trim((string) $this->input('username', '')));
        if (!$player || !password_verify((string) $this->input('password', ''), $player['password_hash'])) {
            $this->fail('Nama pengguna atau kata sandi salah.', 401);
        }
        Auth::login((int) $player['id']);
        return ['ok' => true];
    }

    // POST /api/logout
    public function logout(): array
    {
        Auth::logout();
        return ['ok' => true];
    }
}
