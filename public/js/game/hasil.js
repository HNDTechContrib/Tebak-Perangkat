// Hasil level (menang/kalah), modal, dan toast.

// ---------- results ----------
async function win() {
  const g = G;
  g.done = true; stopTimer(); sfx("right");
  if (g.M.tiles) $("slots").classList.add("win");
  renderPlay();
  const slow = g.t < g.M.time / 3;
  const mistakes = g.M.guess ? Math.floor(g.miss / 2) : g.mistakes;   // tebak kata: tiap 2 huruf salah = -1 bintang
  let stars = Math.max(1, 3 - g.hints - mistakes - (slow ? 1 : 0)), reward = 0, replay = false, saved = true;
  const wait = new Promise(r => setTimeout(r, 450));
  try {
    await g.started;
    const r = await api("win", { level: g.i, stars });
    applyState(r.state); stars = r.stars; reward = r.reward; replay = r.replay; loadBoard();
  } catch (e) { saved = false; toast(e.message); }
  await wait;
  if (G !== g || $("play").hidden) return;
  const canNext = saved && g.i + 1 < LEVELS.length && g.i + 1 <= P.level;
  const tip = stars === 3 ? `Selesai dalam ${Math.round(g.M.time - g.t)} detik tanpa bantuan.`
    : `Untuk 3 bintang: tanpa bantuan, ${g.M.guess ? "maksimal 1 huruf salah" : g.M.type ? "tanpa salah ketik" : "tanpa salah pilih"}, dan sisa waktu minimal ${Math.round(g.M.time / 3)} detik.`;
  confetti(); if (saved) sfx("coin");
  modal(`<div class="stars">${[0, 1, 2].map(k => STAR(k < stars)).join("")}</div>
    <h3>Jawaban benar</h3>
    <p class="ans">${esc(g.L.reveal || g.L.w)}</p>
    <p>${tip}</p>
    ${saved ? `<span class="reward"><span class="coin">●</span>+${reward} koin</span>${replay ? `<p>Mengulang level memberi koin lebih sedikit. Setiap bintang baru menambah 5 koin.</p>` : ""}` : `<p>Progres belum tersimpan. Coba main level ini lagi.</p>`}
    <div class="mbtns">${canNext ? `<button class="btn" data-act="next" type="button">Level berikutnya</button>` : ""}
    <button class="btn ghost" data-act="home" type="button">Ke peta level</button></div>
    <img class="mlogo" src="${LOGO}" alt="HND Computer">`);
}
function lose(why) {
  const head = { time: "Waktu habis", lives: "Kesempatan habis", type: "Kesempatan habis" }[why] || "Jawaban kurang tepat";
  const msg = { time: "Kamu kehabisan waktu di level ini.", lives: "Sudah 6 huruf salah.", type: "Sudah 3 kali salah ketik." }[why] || "Pernyataan tadi kurang tepat.";
  modal(`<h3>${head}</h3>
    <p>${msg}</p>
    <p class="ans">Jawaban: ${esc(G.L.reveal || G.L.w)}</p>
    <p>Kamu bisa mencoba lagi dengan soal yang berbeda.</p>
    <div class="mbtns"><button class="btn" data-act="retry" type="button">Coba lagi</button>
    <button class="btn ghost" data-act="home" type="button">Ke peta level</button></div>`);
}
function modal(html, onAct, wide) {
  closeModal(true);
  const s = document.createElement("div");
  s.className = "scrim";
  s.innerHTML = `<div class="modal${wide ? " wide" : ""}" role="dialog" aria-modal="true">${html}</div>`;
  s.addEventListener("click", e => {
    const el = e.target.closest("[data-act]");
    if (onAct) { if (el) onAct(el.dataset.act, el); else if (e.target === s) closeModal(); return; }
    const a = el?.dataset.act; if (!a) return;
    if (a === "next") startLevel(G.i + 1);
    else if (a === "retry") startLevel(G.i);
    else showHome();
  });
  document.body.appendChild(s);
  s.querySelector("button")?.focus();
}
function closeModal(now) {   // tutup dengan animasi; now = langsung hapus (saat modal lain langsung dibuka)
  document.querySelectorAll(".scrim").forEach(n => {
    if (now || matchMedia("(prefers-reduced-motion: reduce)").matches) return n.remove();
    if (n.classList.contains("out")) return;
    n.classList.add("out");
    n.querySelectorAll("[id]").forEach(x => x.removeAttribute("id"));   // id lama tidak bentrok dengan layar berikutnya
    setTimeout(() => n.remove(), 200);
  });
}
let toastT;
function toast(msg) {
  document.querySelectorAll(".toast").forEach(n => n.remove());
  const t = document.createElement("div"); t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
  document.body.appendChild(t); clearTimeout(toastT); toastT = setTimeout(() => t.remove(), 2400);
}

