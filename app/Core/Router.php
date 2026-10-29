<?php
namespace App\Core;

use PDOException;
use Throwable;

// Mencocokkan alamat (URL) dengan controller yang menanganinya. Daftar rutenya ada di routes/web.php.
class Router
{
    private array $routes = [];

    public function get(string $path, array $action, array $middleware = []): void
    {
        $this->routes['GET'][$path] = [$action, $middleware];
    }

    public function post(string $path, array $action, array $middleware = []): void
    {
        $this->routes['POST'][$path] = [$action, $middleware];
    }

    // Jalankan controller yang cocok dengan request saat ini, lalu kirim hasilnya ke browser
    public function dispatch(string $method, string $path): void
    {
        try {
            $route = $this->routes[$method][$path] ?? null;
            if (!$route) throw new HttpException('Halaman tidak ditemukan.', 404);
            [[$class, $function], $middleware] = $route;

            // "Middleware": pemeriksaan sebelum controller dijalankan
            if ($method === 'POST' && ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') !== 'fetch') {
                throw new HttpException('Permintaan tidak valid.', 403);   // perlindungan CSRF sederhana
            }
            if (in_array('auth', $middleware, true) && !Auth::check()) {
                throw new HttpException('Silakan masuk dulu.', 401);
            }

            $result = (new $class())->$function();
            if (is_array($result)) self::json($result);
            else echo $result;   // string = halaman HTML dari view()
        } catch (HttpException $e) {
            self::json(['error' => $e->getMessage()], $e->status);
        } catch (PDOException $e) {
            error_log('[tebak-perangkat] ' . $e->getMessage());
            self::json(['error' => 'Terjadi kesalahan database.'], 500);
        } catch (Throwable $e) {
            error_log('[tebak-perangkat] ' . $e);
            self::json(['error' => 'Terjadi kesalahan di server.'], 500);
        }
    }

    public static function json(array $data, int $status = 200): void
    {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
        echo json_encode($data, JSON_UNESCAPED_UNICODE);
    }

    // Ubah URL request menjadi path rute, mis. "/Minigames%20Tebak/api/login" -> "/api/login".
    // Bekerja baik saat dibuka lewat folder proyek maupun lewat folder public/.
    public static function currentPath(): string
    {
        $path = rawurldecode(parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/');
        $public = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '/')), '/');   // .../public
        foreach ([$public, rtrim(dirname($public), '/')] as $base) {
            if ($base !== '' && strncmp($path, $base . '/', strlen($base) + 1) === 0) {
                $path = substr($path, strlen($base));
                break;
            }
        }
        if ($path === '/index.php') $path = '/';
        return '/' . trim($path, '/');
    }
}
