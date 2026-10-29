// Halaman utama: peta level dan hadiah harian.

// ---------- home ----------
$("modes").innerHTML = Object.values(MODES).map(m => `<span>${m.name}</span>`).join("");
// replay class animasi: lepas, paksa reflow, pasang lagi, lalu lepas setelah selesai agar animasi lain tetap jalan
function animate(el, cls, ms = 800) {
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
  clearTimeout(el[cls + "T"]); el[cls + "T"] = setTimeout(() => el.classList.remove(cls), ms);
}
function showHome() {
  stopTimer(); closeModal();
  const pl = $("play");
  if (pl.classList.contains("leave")) return;   // sedang keluar dari level
  if (!pl.hidden && !matchMedia("(prefers-reduced-motion: reduce)").matches) {   // keluar level: layar level turun & memudar dulu
    pl.classList.remove("enter"); pl.classList.add("leave");
    pl.leaveT = setTimeout(() => { pl.classList.remove("leave"); drawHome(true); }, 220);
    return;
  }
  drawHome(false);
}
function drawHome(fromLevel) {
  $("play").hidden = true; $("home").hidden = false;
  if (fromLevel) animate($("home"), "enter");
  setCoins();
  showHello(); drawProfileBtn();
  const claimed = P.dailyClaimed;
  $("dailyBtn").disabled = claimed;
  $("dailyBtn").textContent = claimed ? "Sudah" : "Ambil";
  $("dailyTxt").textContent = claimed ? "Kembali lagi besok untuk hadiah berikutnya." : `Hadiah hari ini: ${DAILY} koin.`;
  const total = Object.values(P.stars).reduce((a, b) => a + b, 0);
  $("starTotal").textContent = `${total}/${LEVELS.length * 3} bintang`;
  let html = "";
  for (let s = 0; s * PER_SECTION < LEVELS.length; s++) {
    const a = s * PER_SECTION, b = Math.min(LEVELS.length, a + PER_SECTION);
    let got = 0; for (let i = a; i < b; i++) got += P.stars[i] || 0;
    html += `<div class="sec"><h3>${SECTIONS[s] || "Bagian " + (s + 1)}<small>Level ${a + 1}–${b} · ${got}/${(b - a) * 3} ★</small></h3><div class="grid">`;
    for (let i = a; i < b; i++) {
      const locked = i > P.level, st = P.stars[i] || 0;
      const cls = ["lv", st ? "done" : "", i === P.level && !st ? "current" : ""].join(" ");
      const row = [0, 1, 2].map(k => `<span class="${k < st ? "on" : ""}">★</span>`).join("");
      html += `<button class="${cls}" type="button" data-i="${i}" ${locked ? "disabled" : ""} aria-label="Level ${i + 1}${locked ? ", terkunci" : `, ${st} bintang`}">${locked ? LOCK : `${i + 1}<span class="st">${row}</span>`}</button>`;
    }
    html += `</div></div>`;
  }
  $("map").innerHTML = html;
  window.scrollTo({ top: 0 });
}
$("map").addEventListener("click", e => { const b = e.target.closest(".lv"); if (b && !b.disabled) startLevel(+b.dataset.i); });
$("dailyBtn").onclick = async e => {
  const b = e.currentTarget;
  if (P.dailyClaimed || b.disabled) return;
  b.disabled = true;
  try { const r = await api("daily", {}); applyState(r.state); sfx("coin"); confetti(b); toast(`+${r.amount} koin ditambahkan.`); }
  catch (err) { toast(err.message); }
  showHome();
};

