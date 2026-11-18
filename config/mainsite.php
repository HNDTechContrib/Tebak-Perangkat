<?php
// Sambungan ke website utama (yang punya halaman login). Dibaca oleh app/Core/MainSite.php.
return [
    // dev = mode uji: semua yang membuka minigame dianggap satu user uji (hanya jalan kalau APP_ENV=development)
    // off = belum tersambung: layar loading menampilkan "Masuk lewat website utama"
    'mode' => env('MAIN_SITE_MODE', 'off'),

    // User uji untuk mode dev
    'dev_user' => [
        'id'   => (string) env('DEV_USER_ID', 'dev-1'),
        'name' => (string) env('DEV_USER_NAME', 'Pemain Uji'),
    ],
];
