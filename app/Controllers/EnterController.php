<?php
namespace App\Controllers;

use App\Core\Auth;
use App\Core\MainSite;
use App\Models\Player;

// Masuk ke minigame dari website utama (dipanggil oleh layar loading).
class EnterController extends Controller
{
    // POST /api/enter — kenali user website utama, siapkan data minigame-nya, lalu buka sesi minigame
    public function enter(): array
    {
        $user = MainSite::user();
        if (!$user) $this->fail('Masuk lewat website utama untuk bermain.', 401);

        $id = Player::findOrCreateExternal($user['id'], $this->cleanText($user['name'], 16));
        if (Auth::id() !== $id) Auth::login($id);   // ganti sesi kalau sebelumnya orang lain
        return ['state' => Player::state($id)];
    }
}
