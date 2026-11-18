<?php
namespace App\Core;

// Titik sambungan ke website utama: siapa user yang sedang login di sana.
// Hanya file ini yang perlu diubah saat minigame disambungkan ke website utama,
// mis. memeriksa token dari link website utama atau membaca sesi login bersama.
class MainSite
{
    // User website utama yang sedang membuka minigame, atau null kalau tidak diketahui.
    // id = ID user di website utama (disimpan di players.external_id), name = nama tampilan awal.
    /** @return array{id: string, name: string}|null */
    public static function user(): ?array
    {
        if (config('mainsite.mode') === 'dev' && config('app.env') === 'development') {
            return config('mainsite.dev_user');
        }

        // Sambungan asli ke website utama ditulis di sini.
        return null;
    }
}
