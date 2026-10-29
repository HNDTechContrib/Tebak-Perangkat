<?php
namespace App\Controllers;

use App\Core\Auth;
use App\Models\Leaderboard;

// Papan peringkat (bisa dilihat tanpa login).
class LeaderboardController extends Controller
{
    // GET /api/leaderboard
    public function index(): array
    {
        $me = Auth::id();
        $row = fn(array $r) => [
            'name'   => $r['display_name'],
            'icon'   => $r['avatar_icon'],
            'color'  => $r['avatar_color'],
            'stars'  => (int) $r['total_stars'],
            'levels' => (int) $r['levels_done'],
            'me'     => $me !== null && (int) $r['player_id'] === $me,
        ];
        $mine = $me ? Leaderboard::rankOf($me) : null;

        return [
            'rows'  => array_map($row, Leaderboard::top(50)),
            'me'    => $mine ? $row($mine) + ['rank' => $mine['rank']] : null,
            'total' => Leaderboard::totalPlayers(),
        ];
    }
}
