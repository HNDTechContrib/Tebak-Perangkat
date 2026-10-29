<?php
// Menyiapkan aplikasi: dipanggil pertama kali oleh public/index.php dan artisan.

require __DIR__ . '/../app/Core/helpers.php';

// Autoload: class App\Models\Player otomatis dimuat dari app/Models/Player.php (tanpa Composer)
spl_autoload_register(function (string $class) {
    if (strncmp($class, 'App\\', 4) !== 0) return;
    $file = base_path('app/' . str_replace('\\', '/', substr($class, 4)) . '.php');
    if (is_file($file)) require $file;
});

date_default_timezone_set(config('app.timezone'));

// Pesan error PHP hanya tampil di mode development
ini_set('display_errors', config('app.env') === 'development' ? '1' : '0');

// Sesi login (hanya untuk request dari browser, bukan dari terminal)
if (PHP_SAPI !== 'cli') {
    $lifetime = 86400 * config('app.session_days');
    ini_set('session.gc_maxlifetime', (string) $lifetime);
    session_name('tebak_sess');
    session_set_cookie_params([
        'lifetime' => $lifetime,
        'path'     => '/',
        'secure'   => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}
