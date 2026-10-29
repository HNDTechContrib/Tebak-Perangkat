<?php
// Pintu masuk semua request (front controller), sama seperti public/index.php di Laravel.
// Alur: bootstrap -> baca rute -> cari controller yang cocok -> kirim hasilnya ke browser.

require __DIR__ . '/../bootstrap/app.php';

$router = new App\Core\Router();
require base_path('routes/web.php');

$router->dispatch($_SERVER['REQUEST_METHOD'] ?? 'GET', App\Core\Router::currentPath());
