# Tebak Perangkat — PHP + MySQL dengan struktur folder ala Laravel

Ini **bukan** Laravel. Ini PHP biasa tanpa Composer, tetapi folder dan cara kerjanya meniru Laravel,
supaya mudah dipelajari dan nanti mudah pindah ke Laravel sungguhan.

Butuh PHP 8.1+ (dengan PDO MySQL) dan MySQL 8 / MariaDB 10.5+, misalnya dari Laragon atau XAMPP.

## Struktur folder

```
app/
  Controllers/        menerima request, memeriksa input, memanggil model, mengembalikan hasil
    Controller.php      induk semua controller (input(), fail(), userId())
    GameController.php  halaman game
    AuthController.php  daftar, masuk, keluar
    PlayController.php  mulai level, booster, menang, hadiah harian
    ThemeController.php beli dan pakai tema
    ProfileController.php  profil, kata sandi, pengaturan
    LeaderboardController.php  papan peringkat
  Models/             semua query database, satu file per tabel
    Player.php, LevelProgress.php, Theme.php, Device.php, Abbreviation.php,
    CoinTransaction.php, Leaderboard.php
  Core/               "mesin" kecil aplikasi (di Laravel bagian ini ada di folder vendor/)
    Router.php          mencocokkan URL dengan controller
    DB.php              koneksi dan query database
    Auth.php            siapa yang sedang login
    HttpException.php   membatalkan request dengan pesan error
    helpers.php         env(), config(), view(), asset(), module_map(), e(), js()
bootstrap/app.php     menyiapkan aplikasi: autoload class, zona waktu, sesi login
config/               pengaturan: app.php, database.php, game.php (harga booster, koin, avatar)
database/migrations/  perubahan struktur database, dijalankan berurutan sesuai nama
public/               satu-satunya folder yang boleh dibuka dari browser
  index.php           pintu masuk semua request
  css/                tampilan: base/, ui/, features/ (play/ per bagian layar level), animations.css
                      file CSS baru didaftarkan di resources/views/game/head.php (urutannya penting)
  js/                 logika game (ES modules, tiap file maksimal 250 baris)
    app.js              titik masuk: memasang semua fitur lalu memulai
    core/               data dari server, state bersama, ikon, fungsi bantu DOM & acak
    types/              tipe data untuk pemeriksaan tsc (tidak dimuat browser)
    services/           api() ke server, layar koneksi terputus
    ui/                 modal, toast, animasi, koin, effects/ (suara, confetti)
    questions/          pembuatan soal: levels, picker, make-level, distractors/, pictures/
    features/           satu folder per layar: auth, profile, home, leaderboard, themes, play (+ modes/)
  images/
resources/views/      tampilan HTML: game.php + bagian-bagiannya di game/ (head, auth, home, play, scripts),
                      errors/database.php
scripts/              check-lines.ts (pemeriksa batas 250 baris)
package.json          perintah pemeriksaan kode (butuh Bun), lihat "Pemeriksaan kode" di bawah
routes/web.php        daftar alamat dan controller-nya
artisan               perintah terminal: php artisan migrate, dst.
.env                  password dan pengaturan server (jangan dibagikan)
```

## Alur sebuah request

Contoh: pemain menekan **Ambil** di hadiah harian.

1. `public/js/features/home/daily-reward.js` mengirim `POST api/daily`.
2. `.htaccess` meneruskan semua alamat ke `public/index.php`.
3. `public/index.php` memuat `bootstrap/app.php`, lalu daftar rute di `routes/web.php`.
4. `App\Core\Router` mencari rute `POST /api/daily`, lalu memeriksa middleware `auth` (harus login).
5. `PlayController::daily()` dijalankan. Controller ini memakai model `Player` dan `CoinTransaction`
   di dalam `DB::transaction()`, jadi kalau satu langkah gagal, semuanya dibatalkan.
6. Controller mengembalikan array, lalu Router mengirimnya sebagai JSON.
7. `daily-reward.js` menerima JSON-nya dan memperbarui jumlah koin di layar.

Halaman utama (`GET /`) berjalan sama, hanya saja `GameController::index()` mengembalikan
`view('game', ...)`, yaitu HTML dari `resources/views/game.php`.

## Kalau mau menambah fitur

1. Tambah rute di `routes/web.php`, mis. `$router->get('/api/riwayat', [ProfileController::class, 'history'], ['auth']);`
2. Tambah fungsi `history()` di controller-nya.
3. Taruh query SQL-nya di model, mis. `CoinTransaction::historyOf($id)`.
4. Kalau butuh tabel atau kolom baru: `php artisan make:migration nama_perubahan`, isi, lalu `php artisan migrate`.
5. Panggil dari file fitur yang sesuai di `public/js/features/` dengan `api("riwayat")` (import dari `services/api.js`).

## Cara memasang

1. Salin folder ini ke folder web server (mis. `C:\laragon\www\`).
2. Salin `.env.example` menjadi `.env`, lalu isi data MySQL.
3. Jalankan dari folder proyek:
   ```
   php artisan migrate
   ```
   Perintah ini membuat database, semua tabel, tema, soal, singkatan, dan data foto.
4. Buka `http://localhost/<nama-folder>/`, daftar akun, lalu main.

Di server production, arahkan **document root** ke folder `public/`. Kalau hosting tidak mengizinkan,
`.htaccess` di folder utama akan meneruskan semua alamat ke `public/` (butuh Apache dengan mod_rewrite).

## Perintah artisan

| Perintah | Fungsi |
|---|---|
| `php artisan migrate` | jalankan migrasi yang belum dijalankan |
| `php artisan migrate:status` | lihat daftar migrasi dan statusnya |
| `php artisan migrate:rollback` | batalkan kelompok migrasi terakhir |
| `php artisan make:migration tambah_kolom_avatar` | buat file migrasi baru dari template |
| `php artisan migrate:fresh --force` | hapus semua tabel lalu migrasi ulang (**semua data hilang**) |

Riwayat migrasi disimpan di tabel `migrations`. Jangan ubah file migrasi yang sudah dijalankan di server;
buat file baru dengan `make:migration` untuk setiap perubahan.

## Cara kerja level

- Yang tetap per level hanya tingkat kesulitannya: makin jauh levelnya, makin panjang nama perangkatnya.
- Setiap kali level dimainkan atau diulang, semuanya diacak: **jenis permainan**, perangkat yang ditebak,
  urutan pilihan jawaban, huruf yang terbuka, dan benar/salahnya pernyataan.
- Jenis permainan tidak pernah sama dengan percobaan sebelumnya di level yang sama, dan 25 perangkat
  terakhir yang keluar tidak langsung muncul lagi (diingat per browser).
- Peluang tiap jenis permainan diatur di `WEIGHTS` pada `public/js/questions/levels.js`. **Huruf acak** baru muncul setelah bagian Pemula.
- Mode **Tebak kata**: pemain menebak huruf satu per satu dengan 6 kesempatan salah.
- Mode **Tebak gambar**: pemain melihat foto perangkat lalu mengetik namanya (3 kesempatan salah).
  78 perangkat punya foto asli dari Wikimedia Commons di `public/images/perangkat/` (sumber dan lisensi:
  `public/images/perangkat/CREDITS.md`). Nama pembuat dan lisensi tampil di bawah foto karena diwajibkan lisensi CC BY/BY-SA,
  jadi jangan dihapus. Kalau foto gagal dimuat, game memakai gambar SVG bawaan.
  Untuk mengganti foto, ubah kolom `image`, `image_credit`, dan `image_source` di tabel `devices` lewat migrasi baru.
- Pilihan jawaban dibuat mirip jawaban asli: kepanjangan singkatan diganti satu-dua katanya
  (mis. *Central Process Unit*), singkatan ditukar hurufnya (*CUP*), dan pilihan ganda berisi satu nama yang salah eja.
- Mode **Huruf acak**: petunjuknya tersembunyi. Pemain bisa membukanya kapan saja dengan konsekuensi −1 bintang.

## Profil pemain

Tombol avatar di kanan atas membuka profil: statistik (bintang, level, peringkat, level sempurna),
ubah nama tampilan, bio, ikon dan warna avatar, ganti kata sandi, dan keluar dari akun.

## Menambah soal

Tambahkan baris baru di tabel `devices` atau `abbreviations` (lewat phpMyAdmin atau migrasi baru).
Soal baru langsung ikut diacak ke level dengan panjang kata yang sesuai.
Menambah atau menonaktifkan perangkat mengubah **jumlah** level (1 level per perangkat), jadi sebaiknya
dilakukan lewat migrasi agar tercatat.

## Pemeriksaan kode

Butuh [Bun](https://bun.sh). Sekali saja: `bun install`. Setelah mengubah kode JavaScript, jalankan:

```
bun tsc --noEmit        # pemeriksaan tipe (JavaScript + JSDoc), harus 0 error
bun run check:lines     # semua file .js .ts .css .php maksimal 250 baris
bun run check           # keduanya sekaligus
```

Tipe data game ada di `public/js/types/game.d.ts`. Fungsi baru diberi komentar JSDoc
(`/** @param {number} i */`) supaya ikut diperiksa.
