<?php /* Layar loading masuk ke minigame (login ada di website utama). Diatur oleh public/js/features/enter/. */ ?>
  <!-- LAYAR LOADING -->
  <section id="enter" class="loading-screen">
    <div class="hero"><div class="brand"><img class="logo" alt="HND Computer" width="132" height="78"></div><h1>Tebak<br>Perangkat</h1><span class="by">oleh HND Computer</span></div>
    <div class="loadbar" id="enterBar" role="progressbar" aria-label="Memuat minigame"><i></i></div>
    <p class="enter-msg" id="enterMsg" aria-live="polite">Menyiapkan permainan…</p>
    <button class="btn green" id="enterRetry" type="button" hidden>Coba lagi</button>
  </section>
