<?php
// Daftar alamat (rute) dan controller yang menanganinya.
// Format: $router->get|post('/alamat', [NamaController::class, 'fungsi'], ['middleware']);
// Middleware 'auth' = harus login dulu.

use App\Controllers\EnterController;
use App\Controllers\GameController;
use App\Controllers\ImportController;
use App\Controllers\LeaderboardController;
use App\Controllers\PlayController;
use App\Controllers\ProfileController;
use App\Controllers\ThemeController;

/** @var \App\Core\Router $router */

// Halaman game
$router->get('/', [GameController::class, 'index']);

// Kelola & Impor Soal Excel
$router->get('/import',                 [ImportController::class, 'index']);
$router->get('/import/template',        [ImportController::class, 'template']);
$router->get('/import/import/template', [ImportController::class, 'template']);
$router->get('/import/export',          [ImportController::class, 'export']);
$router->get('/import/import/export',   [ImportController::class, 'export']);
$router->post('/api/import',            [ImportController::class, 'upload']);
$router->post('/import/api/import',     [ImportController::class, 'upload']);

// Masuk dari website utama (login ada di website utama, lihat app/Core/MainSite.php)
$router->post('/api/enter', [EnterController::class, 'enter']);

// Papan peringkat (boleh tanpa login)
$router->get('/api/leaderboard', [LeaderboardController::class, 'index']);

// Bermain
$router->post('/api/start', [PlayController::class, 'start'], ['auth']);
$router->post('/api/spend', [PlayController::class, 'spend'], ['auth']);
$router->post('/api/win',   [PlayController::class, 'win'],   ['auth']);
$router->post('/api/daily', [PlayController::class, 'daily'], ['auth']);

// Tema
$router->post('/api/theme', [ThemeController::class, 'choose'], ['auth']);

// Profil
$router->get('/api/state',     [ProfileController::class, 'state'],    ['auth']);
$router->get('/api/profile',   [ProfileController::class, 'show'],     ['auth']);
$router->post('/api/profile',  [ProfileController::class, 'update'],   ['auth']);
$router->post('/api/settings', [ProfileController::class, 'settings'], ['auth']);
