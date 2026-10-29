<?php
namespace App\Controllers;

use App\Core\Auth;
use App\Models\Leaderboard;
use App\Models\Player;

// Profil pemain: statistik, ubah profil, ganti kata sandi, pengaturan suara.
class ProfileController extends Controller
{
    // GET /api/state — data pemain terbaru
    public function state(): array
    {
        return Player::state($this->userId()) ?? [];
    }

    // GET /api/profile — statistik untuk layar profil
    public function show(): array
    {
        $mine = Leaderboard::rankOf($this->userId());
        return [
            'stars'   => $mine ? (int) $mine['total_stars'] : 0,
            'levels'  => $mine ? (int) $mine['levels_done'] : 0,
            'perfect' => $mine ? (int) $mine['perfect_levels'] : 0,
            'rank'    => $mine ? $mine['rank'] : null,
        ];
    }

    // POST /api/profile — simpan nama tampilan, bio, dan avatar
    public function update(): array
    {
        $icon  = (string) $this->input('avatar_icon', '');
        $color = (string) $this->input('avatar_color', '');
        if (!in_array($icon, config('game.avatar_icons'), true)) $this->fail('Ikon avatar tidak tersedia.');
        if (!in_array($color, config('game.avatar_colors'), true)) $this->fail('Warna avatar tidak tersedia.');

        Player::update($this->userId(), [
            'nickname'     => $this->cleanText($this->input('nickname'), 16),
            'bio'          => $this->cleanText($this->input('bio'), 80),
            'avatar_icon'  => $icon,
            'avatar_color' => $color,
        ]);
        return ['state' => Player::state($this->userId())];
    }

    // POST /api/password
    public function password(): array
    {
        $current = (string) $this->input('current', '');
        $new     = (string) $this->input('new', '');
        $player  = Player::find($this->userId());

        if (!password_verify($current, $player['password_hash'])) $this->fail('Kata sandi sekarang salah.');
        if (strlen($new) < 6) $this->fail('Kata sandi baru minimal 6 karakter.');
        if (strlen($new) > 72) $this->fail('Kata sandi baru maksimal 72 karakter.');
        if ($new === $current) $this->fail('Kata sandi baru harus berbeda dari yang sekarang.');

        Player::update($this->userId(), ['password_hash' => password_hash($new, PASSWORD_DEFAULT)]);
        Auth::login($this->userId());   // ganti ID sesi setelah kata sandi berubah
        return ['ok' => true];
    }

    // POST /api/settings — nama tampilan dan suara
    public function settings(): array
    {
        $fields = [];
        if ($this->has('nickname')) $fields['nickname'] = $this->cleanText($this->input('nickname'), 16);
        if ($this->has('muted')) $fields['sound_muted'] = $this->input('muted') ? 1 : 0;
        Player::update($this->userId(), $fields);
        return ['state' => Player::state($this->userId())];
    }
}
