<?php
// Pengaturan umum aplikasi. Dibaca dengan config('app.timezone'), dst.
return [
    'name'     => 'Tebak Perangkat',
    'env'      => env('APP_ENV', 'production'),          // development atau production
    'timezone' => env('APP_TIMEZONE', 'Asia/Jakarta'),
    'session_days' => (int) env('SESSION_LIFETIME_DAYS', 30),   // lama login tersimpan
];
