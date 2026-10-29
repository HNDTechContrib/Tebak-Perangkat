<?php
// Aturan game. Dibaca dengan config('game.daily_coins'), dst. Ubah angkanya di sini.
return [
    'start_coins'  => (int) env('START_COINS', 100),   // koin saat daftar
    'daily_coins'  => (int) env('DAILY_COINS', 50),    // hadiah harian
    'replay_coins' => 3,                               // hadiah dasar saat mengulang level yang sudah selesai

    // Harga booster
    'boosters' => ['reveal' => 30, 'remove' => 20, 'fifty' => 30],

    // Pilihan avatar di profil (nama ikon = kunci PAT di public/js/core/icons.js)
    'avatar_icons'  => ['Pemroses', 'Input', 'Output', 'mouse', 'gamepad', 'headphone', 'server', 'Jaringan', 'Daya', 'Penyimpanan', 'star', 'code'],
    'avatar_colors' => ['#19a7a0', '#3b82d6', '#2f9e5e', '#7c5cd6', '#ee8a3a', '#ff6b4a', '#e0457b', '#2c3a5a'],
];
