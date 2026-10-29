<?php
// Fungsi bantu global, mirip helper di Laravel: env(), config(), view(), base_path(), asset(), e(), js().

// Baca nilai dari file .env. Variabel environment asli dari server diutamakan.
function env(string $key, $default = null)
{
    static $vars = null;
    if ($vars === null) {
        $vars = [];
        $file = base_path('.env');
        if (is_file($file)) {
            foreach (file($file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) as $line) {
                $line = trim($line);
                if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) continue;
                [$k, $v] = array_map('trim', explode('=', $line, 2));
                if (strlen($v) >= 2 && ($v[0] === '"' || $v[0] === "'") && substr($v, -1) === $v[0]) $v = substr($v, 1, -1);
                $vars[$k] = $v;
            }
        }
    }
    $real = getenv($key);
    if ($real !== false) return $real;
    return $vars[$key] ?? $default;
}

// Baca pengaturan dari folder config/ dengan "titik": config('game.daily_coins') -> config/game.php ['daily_coins']
function config(string $key, $default = null)
{
    static $loaded = [];
    $parts = explode('.', $key);
    $file = array_shift($parts);
    if (!array_key_exists($file, $loaded)) {
        $path = base_path("config/$file.php");
        $loaded[$file] = is_file($path) ? require $path : [];
    }
    $value = $loaded[$file];
    foreach ($parts as $p) {
        if (!is_array($value) || !array_key_exists($p, $value)) return $default;
        $value = $value[$p];
    }
    return $value;
}

// Path dari folder utama proyek: base_path('config/app.php')
function base_path(string $path = ''): string
{
    return dirname(__DIR__, 2) . ($path === '' ? '' : '/' . ltrim($path, '/'));
}

// Tampilkan file di resources/views. view('game', ['judul' => 'x']) -> variabel $judul tersedia di view
function view(string $name, array $data = []): string
{
    extract($data);
    ob_start();
    require base_path('resources/views/' . str_replace('.', '/', $name) . '.php');
    return ob_get_clean();
}

// Alamat file di folder public/ ditambah ?v=waktu-ubah agar browser selalu memuat versi terbaru
function asset(string $path): string
{
    $file = base_path('public/' . $path);
    return $path . (is_file($file) ? '?v=' . filemtime($file) : '');
}

// Import map untuk semua file JavaScript di public/$dir: setiap file mendapat ?v=waktu-ubah,
// sehingga file yang dimuat lewat import juga selalu versi terbaru (bukan dari cache browser)
function module_map(string $dir = 'js'): string
{
    $imports = [];
    $files = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(base_path("public/$dir"), FilesystemIterator::SKIP_DOTS));
    foreach ($files as $file) {
        if ($file->getExtension() !== 'js') continue;
        $path = $dir . '/' . str_replace('\\', '/', substr($file->getPathname(), strlen(base_path("public/$dir")) + 1));
        $imports["./$path"] = "./$path?v=" . $file->getMTime();
    }
    ksort($imports);
    return json_encode(['imports' => $imports], JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT | JSON_HEX_TAG);
}

// Amankan teks sebelum ditampilkan di HTML (sama dengan {{ }} di Blade)
function e($value): string
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

// JSON yang aman ditaruh di dalam <script>
function js($value): string
{
    return json_encode($value, JSON_UNESCAPED_UNICODE | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
}
