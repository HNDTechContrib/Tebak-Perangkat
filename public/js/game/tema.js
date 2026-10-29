// Tema latar: pola ikon, beli, dan pakai tema.

// ---------- background themes (icon pattern tiles, unlocked with coins) ----------
const PAT = {
  ...ICON,
  mouse: '<rect x="6" y="3" width="12" height="18" rx="6"/><path d="M12 7v3"/>',
  cursor: '<path d="M5 3l14 7-6 2-2 6z"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  circuit: '<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><circle cx="19" cy="5" r="2"/><path d="M7 5h5l5 5v7M19 7v1"/>',
  gamepad: '<path d="M6 8h12a4 4 0 0 1 4 4v2a3 3 0 0 1-5.4 1.8L15 14H9l-1.6 1.8A3 3 0 0 1 2 14v-2a4 4 0 0 1 4-4z"/><path d="M7 11v3M5.5 12.5h3M16 11.5h.01M18 13h.01"/>',
  headphone: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
  star: '<path d="M12 4l2.2 4.6 5 .7-3.6 3.5.9 5L12 15.4l-4.5 2.4.9-5L4.8 9.3l5-.7z"/>',
  wrench: '<path d="M15 4a5 5 0 0 0-4.6 6.9L4 17.3V20h2.7l6.4-6.4A5 5 0 0 0 20 9l-3 1-2-2 1-3z"/>',
  server: '<rect x="4" y="3" width="16" height="7" rx="1.5"/><rect x="4" y="14" width="16" height="7" rx="1.5"/><path d="M8 6.5h.01M8 17.5h.01M12 6.5h4M12 17.5h4"/>',
};
const THEMES = window.GAME.themes;
const themeOf = id => THEMES.find(t => t.id === id) || THEMES[0];
function pattern(icons) {
  const pos = [[10, 12, -14], [76, 8, 10], [44, 52, 6], [8, 86, 12], [82, 78, -8]];
  const g = pos.map(([x, y, r], k) => `<g transform="translate(${x} ${y}) rotate(${r} 12 12) scale(1.15)">${PAT[icons[k % icons.length]]}</g>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><g fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${g}</g></svg>`;
  return `url('data:image/svg+xml,${encodeURIComponent(svg)}')`;
}
const swatch = t => `background-color:${t.sky};background-image:${pattern(t.icons)}`;
function applyTheme() {
  const t = themeOf(P && P.themes.includes(P.theme) ? P.theme : "hnd"), r = document.documentElement.style;
  const pat = pattern(t.icons);
  if (r.getPropertyValue("--pat") === pat) return;
  r.setProperty("--sky", t.sky); r.setProperty("--sky-deep", t.deep); r.setProperty("--pat", pat);
  const b = document.body; b.classList.remove("swap"); void b.offsetWidth; b.classList.add("swap");   // pola baru memudar masuk
}
async function chooseTheme(id) {
  try { const r = await api("theme", { id }); applyState(r.state); applyTheme(); loadBoard(); return r; }
  catch (e) { toast(e.message); return null; }
}
const CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
function openThemes() {
  const cards = THEMES.map(t => {
    const own = P.themes.includes(t.id), on = P.theme === t.id;
    const status = on ? `<small class="use">Sedang dipakai</small>` : own ? `<small>Ketuk untuk pakai</small>` : `<small><span class="coin">●</span>${t.price} koin</small>`;
    const label = `${t.name}, ${on ? "sedang dipakai" : own ? "sudah dimiliki" : `terkunci, ${t.price} koin`}`;
    return `<button class="th ${on ? "on" : ""} ${!own && P.coins < t.price ? "poor" : ""}" type="button" data-act="theme" data-id="${t.id}" aria-label="${label}">
      <span class="sw" style="${swatch(t)}">${on ? `<span class="ck">${CHECK}</span>` : own ? "" : `<span class="lk">${LOCK}</span>`}</span>
      <span class="lbl"><b>${t.name}</b>${status}</span></button>`;
  }).join("");
  modal(`<h3>Tema latar</h3><p>Tema terkunci bisa dibuka dengan koin dari level dan hadiah harian.</p>
    <div class="themes">${cards}</div>
    <div class="mbtns"><button class="btn ghost" data-act="close" type="button">Tutup</button></div>`, async (a, el) => {
    if (a === "close") return closeModal();
    const t = themeOf(el.dataset.id);
    if (P.themes.includes(t.id)) { if (P.theme !== t.id && await chooseTheme(t.id)) sfx("tap"); return openThemes(); }
    if (P.coins < t.price) { sfx("wrong"); return toast(`Butuh ${t.price - P.coins} koin lagi untuk membuka ${t.name}.`); }
    confirmBuy(t);
  }, true);
}
function confirmBuy(t) {
  modal(`<div class="bigsw" style="${swatch(t)}"></div><h3>${t.name}</h3><p>Buka tema ini dengan</p>
    <span class="reward"><span class="coin">●</span>${t.price} koin</span>
    <div class="mbtns"><button class="btn green" data-act="buy" type="button">Buka dan pakai</button>
    <button class="btn ghost" data-act="back" type="button">Kembali</button></div>`, async (a, el) => {
    if (a === "back") return openThemes();
    if (a !== "buy" || el.disabled) return;
    el.disabled = true;
    if (!(await chooseTheme(t.id))) { el.disabled = false; return; }
    sfx("coin"); confetti(); toast(`Tema ${t.name} sudah bisa dipakai.`); openThemes();
  });
}
$("themeBtn").onclick = openThemes;
applyTheme();

