<?php
// Koneksi MySQL. Nilainya diambil dari file .env.
return [
    'host'     => env('DB_HOST', '127.0.0.1'),
    'port'     => env('DB_PORT', '3306'),
    'database' => env('DB_NAME', 'tebak_perangkat'),
    'username' => (string) env('DB_USER', 'root'),
    'password' => (string) env('DB_PASSWORD', ''),
    'charset'  => env('DB_CHARSET', 'utf8mb4'),

    // User khusus untuk "php artisan migrate" (butuh hak membuat tabel). Kosong = pakai username di atas.
    'migrate_username' => (string) env('DB_MIGRATE_USER', ''),
    'migrate_password' => (string) env('DB_MIGRATE_PASSWORD', ''),
];
