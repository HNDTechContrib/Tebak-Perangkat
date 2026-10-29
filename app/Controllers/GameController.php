<?php
namespace App\Controllers;

use App\Core\Auth;
use App\Models\Abbreviation;
use App\Models\Device;
use App\Models\Player;
use App\Models\Theme;
use Throwable;

// Halaman utama game.
class GameController extends Controller
{
    // GET /
    public function index(): string
    {
        try {
            $data = [
                'bank'   => Device::allForGame(),
                'abbr'   => Abbreviation::allForGame(),
                'themes' => Theme::all(),
                'player' => Auth::check() ? Player::state(Auth::id()) : null,
                'cfg'    => [
                    'daily_coins'   => config('game.daily_coins'),
                    'boosters'      => config('game.boosters'),
                    'avatar_icons'  => config('game.avatar_icons'),
                    'avatar_colors' => config('game.avatar_colors'),
                ],
            ];
            if (!$data['bank'] || !$data['themes']) throw new \RuntimeException('tabel devices/themes masih kosong');
        } catch (Throwable $e) {
            error_log('[tebak-perangkat] ' . $e->getMessage());
            http_response_code(503);
            return view('errors.database');
        }
        if (Auth::check() && !$data['player']) $_SESSION = [];   // akunnya sudah dihapus

        return view('game', ['game' => $data]);
    }
}
