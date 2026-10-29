<?php
namespace App\Controllers;

use App\Core\DB;
use App\Models\CoinTransaction;
use App\Models\Player;
use App\Models\Theme;

// Tema latar: beli (kalau belum punya) dan pakai.
class ThemeController extends Controller
{
    // POST /api/theme
    public function choose(): array
    {
        $theme = Theme::find((string) $this->input('id', ''));
        if (!$theme) $this->fail('Tema tidak ditemukan.');
        $id = $this->userId();

        $bought = DB::transaction(function () use ($id, $theme) {
            $new = Theme::giveTo($id, $theme['id']);
            $price = (int) $theme['price'];
            if ($new && $price > 0) {
                if (!Player::addCoins($id, -$price)) $this->fail('Koin belum cukup untuk tema ini.');
                CoinTransaction::log($id, -$price, 'beli_tema', $theme['id']);
            }
            Player::update($id, ['active_theme' => $theme['id']]);
            return $new;
        });
        return ['state' => Player::state($id), 'bought' => $bought];
    }
}
