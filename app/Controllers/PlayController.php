<?php
namespace App\Controllers;

use App\Core\DB;
use App\Models\CoinTransaction;
use App\Models\Device;
use App\Models\LevelProgress;
use App\Models\Player;

// Jalannya permainan: mulai level, booster, menang, hadiah harian.
// Semua perhitungan koin dan bintang dilakukan di sini, bukan di browser, supaya tidak bisa diakali.
class PlayController extends Controller
{
    // POST /api/start — catat level yang sedang dimainkan dan waktu mulainya
    public function start(): array
    {
        $level = (int) $this->input('level', -1);
        $open  = (int) Player::find($this->userId())['current_level'];
        if ($level < 0 || $level >= Device::levelCount() || $level > $open) $this->fail('Level ini belum terbuka.');
        $_SESSION['play'] = ['level' => $level, 't' => microtime(true), 'hints' => 0];
        return ['ok' => true];
    }

    // POST /api/spend — bayar booster
    public function spend(): array
    {
        $kind  = (string) $this->input('booster', '');
        $costs = config('game.boosters');
        if (!isset($costs[$kind])) $this->fail('Booster tidak dikenal.');
        if (empty($_SESSION['play'])) $this->fail('Mulai level dulu.');
        $id = $this->userId();

        DB::transaction(function () use ($id, $kind, $costs) {
            if (!Player::addCoins($id, -$costs[$kind])) $this->fail('Koin belum cukup. Ambil hadiah harian atau selesaikan level lain.');
            CoinTransaction::log($id, -$costs[$kind], 'booster', $kind);
        });
        $_SESSION['play']['hints']++;
        return ['state' => Player::state($id)];
    }

    // POST /api/win — level selesai: hitung bintang dan koin, simpan progres
    public function win(): array
    {
        $play  = $_SESSION['play'] ?? null;
        $level = (int) $this->input('level', -1);
        if (!$play || $play['level'] !== $level) $this->fail('Sesi level tidak ditemukan. Mulai ulang levelnya.');
        $seconds = microtime(true) - $play['t'];
        if ($seconds < 1) $this->fail('Jawaban terlalu cepat untuk dihitung.');
        unset($_SESSION['play']);

        // Bintang dari browser dibatasi: tiap booster yang dibayar di server mengurangi 1 bintang
        $stars = max(1, min(3, (int) $this->input('stars', 1), 3 - (int) $play['hints']));
        $id = $this->userId();

        [$reward, $replay] = DB::transaction(function () use ($id, $level, $stars, $seconds) {
            // Pertama kali menang: hadiah penuh. Mengulang: hadiah kecil + 5 per bintang baru.
            $before = LevelProgress::previousStars($id, $level);
            $replay = $before !== null;
            $reward = $replay ? config('game.replay_coins') + max(0, $stars - $before) * 5 : 10 + $stars * 5;

            LevelProgress::record($id, $level, $stars, (int) round($seconds));
            Player::addCoins($id, $reward);
            Player::unlockNext($id, $level);
            CoinTransaction::log($id, $reward, $replay ? 'ulang_level' : 'menang_level', 'level ' . ($level + 1));
            return [$reward, $replay];
        });
        return ['state' => Player::state($id), 'stars' => $stars, 'reward' => $reward, 'replay' => $replay];
    }

    // POST /api/daily — hadiah harian, sekali sehari
    public function daily(): array
    {
        $id = $this->userId();
        $amount = config('game.daily_coins');
        $today = date('Y-m-d');
        DB::transaction(function () use ($id, $amount, $today) {
            if (!Player::claimDaily($id, $today)) $this->fail('Hadiah hari ini sudah diambil.');
            Player::addCoins($id, $amount);
            CoinTransaction::log($id, $amount, 'harian', $today);
        });
        return ['state' => Player::state($id), 'amount' => $amount];
    }
}
