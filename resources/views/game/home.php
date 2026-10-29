<?php /* Halaman utama: hadiah harian, papan peringkat, peta level. Diatur oleh public/js/features/home/. */ ?>
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
