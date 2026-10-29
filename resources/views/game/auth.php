<?php /* Halaman masuk / daftar (resources/views/game.php). Diatur oleh public/js/features/auth/. */ ?>
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
