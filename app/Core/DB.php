<?php
namespace App\Core;

use PDO;
use PDOStatement;
use Throwable;

// Koneksi database (mirip facade DB di Laravel).
// Contoh: DB::select("SELECT * FROM players WHERE id = ?", [$id])
class DB
{
    private static ?PDO $pdo = null;

    // Buat koneksi baru. $withDatabase = false dipakai artisan untuk membuat database-nya.
    public static function connect(string $user, string $password, bool $withDatabase = true): PDO
    {
        $c = config('database');
        $dsn = "mysql:host={$c['host']};port={$c['port']};charset={$c['charset']}" . ($withDatabase ? ";dbname={$c['database']}" : '');
        return new PDO($dsn, $user, $password, [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ]);
    }

    // Koneksi yang dipakai website (dibuat sekali, dipakai ulang)
    public static function pdo(): PDO
    {
        if (self::$pdo === null) self::$pdo = self::connect(config('database.username'), config('database.password'));
        return self::$pdo;
    }

    // Jalankan query apa saja dengan parameter "?"
    public static function query(string $sql, array $params = []): PDOStatement
    {
        $st = self::pdo()->prepare($sql);
        $st->execute($params);
        return $st;
    }

    // Banyak baris
    public static function select(string $sql, array $params = []): array
    {
        return self::query($sql, $params)->fetchAll();
    }

    // Satu baris (null kalau tidak ada)
    public static function first(string $sql, array $params = []): ?array
    {
        return self::query($sql, $params)->fetch() ?: null;
    }

    // Satu nilai, mis. hasil COUNT(*)
    public static function value(string $sql, array $params = [])
    {
        return self::query($sql, $params)->fetchColumn();
    }

    // INSERT/UPDATE/DELETE: mengembalikan jumlah baris yang berubah
    public static function statement(string $sql, array $params = []): int
    {
        return self::query($sql, $params)->rowCount();
    }

    public static function lastInsertId(): int
    {
        return (int) self::pdo()->lastInsertId();
    }

    // Jalankan beberapa query sekaligus: kalau ada yang gagal, semuanya dibatalkan
    public static function transaction(callable $callback)
    {
        $pdo = self::pdo();
        $pdo->beginTransaction();
        try {
            $result = $callback();
            $pdo->commit();
            return $result;
        } catch (Throwable $e) {
            if ($pdo->inTransaction()) $pdo->rollBack();
            throw $e;
        }
    }
}
