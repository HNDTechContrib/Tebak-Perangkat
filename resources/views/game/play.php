<?php /* Layar level: kartu soal, area jawaban sesuai mode, booster. Diatur oleh public/js/features/play/. */ ?>
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
