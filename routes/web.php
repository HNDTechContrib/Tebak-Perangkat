<?php
// Daftar alamat (rute) dan controller yang menanganinya.
// Format: $router->get|post('/alamat', [NamaController::class, 'fungsi'], ['middleware']);
// Middleware 'auth' = harus login dulu.

use App\Controllers\AuthController;
use App\Controllers\GameController;
use App\Controllers\LeaderboardController;
use App\Controllers\PlayController;
use App\Controllers\ProfileController;
use App\Controllers\ThemeController;

/** @var \App\Core\Router $router */

// Halaman game
$router->get('/', [GameController::class, 'index']);

// Akun
$router->post('/api/register', [AuthController::class, 'register']);
$router->post('/api/login',    [AuthController::class, 'login']);
$router->post('/api/logout',   [AuthController::class, 'logout']);

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
$router->post('/api/password', [ProfileController::class, 'password'], ['auth']);
$router->post('/api/settings', [ProfileController::class, 'settings'], ['auth']);
