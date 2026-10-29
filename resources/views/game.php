<?php /* Halaman game. Variabel $game dikirim oleh GameController@index. */ ?>
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
<title>Tebak Perangkat</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@600;700;800&display=swap">
<?php // Urutan file CSS penting: aturan di file belakang menimpa file depan ?>
<?php foreach (['dasar', 'home', 'play', 'modal', 'peringkat-tema', 'akun', 'animasi'] as $f): ?>
<link rel="stylesheet" href="<?= asset("css/game/$f.css") ?>">
<?php endforeach; ?>
</head>
<body>
<div class="app">
  <!-- MASUK / DAFTAR -->
  <section id="auth" class="stack" hidden>
    <div class="hero"><div class="brand"><img class="logo" alt="HND Computer" width="132" height="78"></div><h1>Tebak<br>Perangkat</h1><span class="by">oleh HND Computer</span><p>Masuk untuk menyimpan progres dan ikut papan peringkat.</p></div>
    <div class="card">
      <div class="tabs" role="tablist"><button type="button" role="tab" data-tab="login">Masuk</button><button type="button" role="tab" data-tab="register">Daftar</button></div>
      <form class="aform" id="authForm" novalidate>
        <label>Nama pengguna<input name="username" autocomplete="username" maxlength="32" required></label>
        <label>Kata sandi<input name="password" type="password" autocomplete="current-password" required></label>
        <label id="nickRow" hidden>Nama tampilan <small>(opsional, tampil di papan peringkat)</small><input name="nickname" maxlength="16"></label>
        <p class="aerr" id="authErr" role="alert"></p>
        <button class="btn green" id="authBtn" type="submit">Masuk</button>
      </form>
    </div>
  </section>

  <!-- HOME -->
  <section id="home" class="stack" hidden>
    <div class="bar"><span class="tools"><button class="iconbtn snd" type="button"></button><button class="iconbtn" id="themeBtn" type="button" aria-label="Tema latar"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 0 0 0 18c1.4 0 2-1 2-2 0-1.4-1.2-1.6-1.2-2.8 0-1 .8-1.7 1.8-1.7H17a4 4 0 0 0 4-4C21 6.4 17 3 12 3z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor"/><circle cx="10" cy="7" r="1.2" fill="currentColor"/><circle cx="15" cy="7" r="1.2" fill="currentColor"/></svg></button><button class="iconbtn profbtn" id="profileBtn" type="button" aria-label="Profil saya"></button></span><span class="pill"><span class="coin">●</span><span class="cv">0</span></span></div>
    <div class="hero"><div class="brand"><img class="logo" alt="HND Computer" width="132" height="78"></div><span class="hello" id="hello"></span><h1>Tebak<br>Perangkat</h1><span class="by">oleh HND Computer</span><p>Tebak nama perangkat komputer dari petunjuknya.</p></div>
    <div class="card">
      <div class="daily">
        <svg class="chest" viewBox="0 0 52 52" aria-hidden="true"><rect x="6" y="20" width="40" height="26" rx="5" fill="#c9762b"/><path d="M6 24a20 12 0 0 1 40 0v2H6z" fill="#e08b3a"/><rect x="6" y="26" width="40" height="5" fill="#8e4f17"/><rect x="22" y="24" width="8" height="11" rx="2" fill="#ffd23f" stroke="#dba300" stroke-width="2"/></svg>
        <div><b>Hadiah harian</b><small id="dailyTxt">Hadiah hari ini: 50 koin.</small></div>
        <button class="btn green" id="dailyBtn" type="button">Ambil</button>
      </div>
    </div>
    <div class="card">
      <div class="lbhead"><h2><svg viewBox="0 0 26 26" aria-hidden="true"><path d="M7 3h12v6a6 6 0 0 1-12 0z" fill="#ffd23f" stroke="#dba300" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 5H3.5v1.5A3.5 3.5 0 0 0 7 10M19 5h3.5v1.5A3.5 3.5 0 0 1 19 10" fill="none" stroke="#dba300" stroke-width="1.8"/><path d="M13 15v4M9 23h8l-1-4h-6z" fill="#ffd23f" stroke="#dba300" stroke-width="1.8" stroke-linejoin="round"/></svg>Papan peringkat</h2><button class="link" id="lbAll" type="button">Lihat semua</button></div>
      <ol class="lb" id="lbTop"></ol>
      <p class="lbnote" id="lbNote">Memuat peringkat…</p>
    </div>
    <div class="card">
      <div class="sect"><h2>Peta level</h2><span id="starTotal">0 bintang</span></div>
      <div class="modes" id="modes"></div>
      <div class="map" id="map"></div>
    </div>
  </section>

  <!-- PLAY -->
  <section id="play" class="stack" hidden>
    <div class="bar">
      <button class="iconbtn" id="back" type="button" aria-label="Kembali ke peta level"><svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4 6.5 10l6 6" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></button>
      <span class="lvtitle" id="lvTitle">Level 1</span>
      <span style="display:flex;gap:8px;align-items:center"><button class="iconbtn snd" type="button"></button><span class="pill"><span class="coin">●</span><span class="cv">0</span></span></span>
    </div>
    <div class="timer" role="progressbar" aria-label="Sisa waktu" id="timerWrap"><i id="timer"></i></div>
    <div class="card clue">
      <div class="tags"><span class="badge" id="badge"></span><span class="mode" id="mode"></span></div>
      <div class="pic" id="pic" hidden></div>
      <p id="clue"></p>
      <p class="stmt" id="stmt" hidden></p>
      <button class="peek" id="peekBtn" type="button" hidden><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>Lihat petunjuk <small>(−1 bintang)</small></button>
    </div>
    <div class="slots" id="slots" aria-live="polite"></div>
    <div class="pool" id="pool"></div>
    <div class="lives" id="lives" hidden></div>
    <div class="keys" id="keys" hidden></div>
    <form class="typer" id="typeForm" hidden autocomplete="off"><input id="typeIn" type="text" autocapitalize="characters" autocorrect="off" spellcheck="false" aria-label="Ketik nama perangkat" placeholder="Nama perangkat"><button class="btn green" id="typeBtn" type="submit">Jawab</button></form>
    <div class="choices" id="choices"></div>
    <div class="boost" id="boost">
      <button class="bst" id="bReveal" type="button"><b>Buka huruf</b><small><span class="coin">●</span>30</small></button>
      <button class="bst" id="bRemove" type="button"><b>Hapus pengecoh</b><small><span class="coin">●</span>20</small></button>
      <button class="bst" id="bShuffle" type="button"><b>Acak huruf</b><small>Gratis</small></button>
      <button class="bst" id="bFifty" type="button"><b>Buang 2 jawaban salah</b><small><span class="coin">●</span>30</small></button>
    </div>
  </section>
</div>
<canvas id="fx" aria-hidden="true"></canvas>

<script>
// Data dari database (soal, tema, data pemain) untuk file-file di public/js/game/
window.GAME = <?= js($game) ?>;
</script>
<?php // Urutan file JS penting: file belakang memakai isi file depan, main.js harus paling akhir ?>
<?php foreach (['core', 'gambar', 'soal', 'pemain', 'tema', 'peringkat', 'akun', 'home', 'play', 'hasil', 'efek', 'jaringan', 'main'] as $f): ?>
<script src="<?= asset("js/game/$f.js") ?>"></script>
<?php endforeach; ?>

</body>
</html>
