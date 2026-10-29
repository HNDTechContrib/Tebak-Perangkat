// Layar level: semua mode permainan, booster, dan waktu.

// ---------- play ----------
let G, tick;
function startLevel(i) {
  const L = makeLevel(i), M = MODES[L.type];
  G = { i, L, M, hints: 0, mistakes: 0, t: M.time, done: false, lost: false, busy: false, fifty: false };
  G.started = api("start", { level: i });   // server mencatat waktu mulai level
  G.started.catch(e => toast(e.message));
  if (M.tiles) setupTiles(L);
  else if (M.guess) setupGuess(L);
  else if (M.type) setupType(L);
  else G.opts = L.opts.map(text => ({ text, off: false, wrong: false, cut: false }));
  closeModal();
  $("home").hidden = true; $("play").hidden = false;
  $("lvTitle").textContent = `Level ${i + 1}`;
  $("badge").innerHTML = icon(L.c) + L.c;
  $("mode").textContent = M.name;
  $("clue").textContent = L.q;
  $("stmt").hidden = !L.stmt; $("stmt").textContent = L.stmt || "";
  $("peekBtn").hidden = !L.peek; $("peekBtn").disabled = false;
  $("pic").hidden = !L.pic; $("pic").innerHTML = L.pic || "";
  $("slots").className = "slots";
  setCoins(); renderPlay(); startTimer();
  window.scrollTo({ top: 0 });
  const pl = $("play"); clearTimeout(pl.leaveT); pl.classList.remove("leave");
  animate(pl, "enter");   // animasi masuk level
  // di HP jangan langsung fokus: keyboard akan menutupi gambar dan browser bisa memperbesar halaman
  if (M.type && matchMedia("(pointer: fine)").matches) setTimeout(() => $("typeIn").focus({ preventScroll: true }), 60);
}
function setupTiles(L) {
  const A = [...L.w.replace(/ /g, "")];
  const pre = L.pre || [];
  const open = A.length - pre.length;
  const vis = L.type === "acak" ? open : Math.min(16, Math.max(8, Math.ceil((open + 4) / 8) * 8));
  const pool = A.map(l => ({ l, real: true, used: false, gone: false, fixed: false }));
  const abc = "ABCDEFGHIJKLMNOPRSTUW";
  for (let k = open; k < vis; k++) pool.push({ l: abc[rnd(abc.length)], real: false, used: false, gone: false, fixed: false });
  const slots = A.map(() => ({ t: null, lk: false }));
  pre.forEach(i => { slots[i] = { t: i, lk: true }; pool[i].used = pool[i].fixed = true; });
  const idx = pool.map((_, k) => k).filter(k => !pool[k].fixed);
  let order = shuffle(idx);
  if (L.type === "acak") for (let n = 0; n < 6 && order.map(k => pool[k].l).join("") === A.join(""); n++) order = shuffle(idx);
  Object.assign(G, { A, pool, slots, order, removed: L.type === "acak", groups: L.w.split(" ").map(p => p.length) });
  $("slots").style.setProperty("--n", Math.max(...G.groups));
}

function setupGuess(L) {
  Object.assign(G, { A: [...L.w.replace(/ /g, "")], groups: L.w.split(" ").map(p => p.length), tried: new Set(), lives: 6, miss: 0 });
  $("slots").style.setProperty("--n", Math.max(...G.groups));
}
function renderGuess() {
  let k = 0;
  $("slots").innerHTML = G.groups.map(n => `<div class="grp">${Array.from({ length: n }, () => {
    const l = G.A[k++], on = G.tried.has(l);
    return `<span class="slot ${on ? "lk" : ""}" aria-label="${on ? l : "kosong"}">${on ? l : ""}</span>`;
  }).join("")}</div>`).join("");
  $("keys").innerHTML = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => {
    const used = G.tried.has(l), cls = used ? (G.A.includes(l) ? "hit" : "miss") : "";
    return `<button class="key ${cls}" type="button" data-l="${l}" ${used || G.done ? "disabled" : ""} aria-label="Huruf ${l}">${l}</button>`;
  }).join("");
  $("lives").innerHTML = `Sisa kesempatan ${Array.from({ length: 6 }, (_, j) => `<i class="${j < G.lives ? "" : "off"}"></i>`).join("")}`;
  const hidden = new Set(G.A.filter(c => !G.tried.has(c))).size;
  $("bReveal").disabled = G.done || hidden <= 1 || P.coins < COST_REVEAL;
}
function guess(l) {
  if (G.done || G.busy || G.tried.has(l)) return;
  G.tried.add(l);
  if (G.A.includes(l)) {
    if (G.A.every(c => G.tried.has(c))) { renderGuess(); return win(); }
    sfx("tap");
  } else {
    G.lives--; G.miss++; sfx("wrong");
    $("keys").classList.remove("shake"); void $("keys").offsetWidth; $("keys").classList.add("shake");
    if (G.lives <= 0) { G.done = G.lost = true; stopTimer(); renderGuess(); setTimeout(() => lose("lives"), 600); return; }
  }
  renderGuess();
}
$("keys").addEventListener("click", e => { const b = e.target.closest(".key"); if (b) guess(b.dataset.l); });

// ---------- tebak gambar: ketik nama perangkat ----------
const norm = v => String(v).toUpperCase().replace(/[^A-Z0-9]/g, "");
function setupType(L) {
  Object.assign(G, { A: [...L.w.replace(/ /g, "")], groups: L.w.split(" ").map(p => p.length), shown: new Set(), lives: 3 });
  $("slots").style.setProperty("--n", Math.max(...G.groups));
  $("typeIn").value = ""; $("typeIn").maxLength = L.w.length + 6;
}
function renderType() {
  const typed = [...norm($("typeIn").value)];
  let k = 0;
  $("slots").innerHTML = G.groups.map(n => `<div class="grp">${Array.from({ length: n }, () => {
    const i = k++, on = G.shown.has(i), l = on ? G.A[i] : typed[i] || "";
    return `<span class="slot ${on ? "lk" : l ? "t" : ""}" aria-hidden="true">${l}</span>`;
  }).join("")}</div>`).join("");
  $("lives").innerHTML = `Sisa kesempatan ${Array.from({ length: 3 }, (_, j) => `<i class="${j < G.lives ? "" : "off"}"></i>`).join("")}`;
  $("typeIn").disabled = $("typeBtn").disabled = G.done;
  $("bReveal").disabled = G.done || G.A.length - G.shown.size <= 1 || P.coins < COST_REVEAL;
}
function submitType() {
  if (G.done || G.busy) return;
  const v = norm($("typeIn").value);
  if (!v) return;
  if (v === G.A.join("")) { renderType(); return win(); }
  if (v.length !== G.A.length) { sfx("tap"); return toast(`Jawabannya ${G.A.length} huruf, kamu mengetik ${v.length}.`); }   // beda panjang: tidak dihitung salah
  G.mistakes++; G.lives--; sfx("wrong");
  $("slots").classList.remove("shake"); void $("slots").offsetWidth; $("slots").classList.add("shake");
  if (G.lives <= 0) { G.done = G.lost = true; stopTimer(); renderType(); setTimeout(() => lose("type"), 600); return; }
  renderType(); $("typeIn").select(); toast(`Belum tepat. Sisa ${G.lives} kesempatan.`);
}
$("typeForm").addEventListener("submit", e => { e.preventDefault(); submitType(); });
$("typeIn").addEventListener("input", () => { if (G && G.M.type && !G.done) renderType(); });

function renderPlay() {
  const tiles = !!G.M.tiles, gs = !!G.M.guess, ty = !!G.M.type, letters = tiles || gs || ty;
  $("slots").hidden = !letters;
  $("pool").hidden = !tiles;
  $("keys").hidden = !gs;
  $("lives").hidden = !(gs || ty);
  $("typeForm").hidden = !ty;
  $("choices").hidden = letters;
  $("bReveal").hidden = !letters;
  $("bShuffle").hidden = !tiles;
  $("bRemove").hidden = !tiles || G.L.type === "acak";   // huruf acak tidak punya huruf pengecoh
  $("bFifty").hidden = letters || G.opts.length < 4;
  $("boost").hidden = !letters && G.opts.length < 4;
  if (tiles) renderTiles(); else if (gs) renderGuess(); else if (ty) renderType(); else renderChoices();
}
function renderTiles() {
  let k = 0;
  $("slots").innerHTML = G.groups.map(n => `<div class="grp">${Array.from({ length: n }, () => {
    const s = G.slots[k], i = k++;
    const l = s.t === null ? "" : G.pool[s.t].l;
    return `<button class="slot ${s.lk ? "lk" : s.t !== null ? "f" : ""}" type="button" data-s="${i}" aria-label="Kotak ${i + 1}${l ? ", " + l : ", kosong"}">${l}</button>`;
  }).join("")}</div>`).join("");
  $("pool").innerHTML = G.order.map(pi => {
    const t = G.pool[pi];
    return `<button class="tile ${t.used ? "used" : ""} ${t.gone ? "gone" : ""}" type="button" data-p="${pi}" ${t.used || t.gone ? "disabled" : ""} aria-label="Huruf ${t.l}">${t.l}</button>`;
  }).join("");
  const open = G.slots.filter(s => !s.lk).length;
  $("bReveal").disabled = G.done || open <= 1 || P.coins < COST_REVEAL;
  $("bRemove").disabled = G.done || G.removed || P.coins < COST_REMOVE;
  $("bShuffle").disabled = G.done;
}
function renderChoices() {
  const two = G.opts.length === 2;
  $("choices").className = "choices" + (two ? " two" : "");
  $("choices").innerHTML = G.opts.map((o, k) => {
    const cls = ["opt", o.wrong ? "wrong" : "", o.cut ? "cut" : "", G.done && !G.lost && k === G.L.ans ? "right" : ""].join(" ");
    return `<button class="${cls}" type="button" data-k="${k}" ${o.off || G.done ? "disabled" : ""}>${two ? "" : `<span class="k">${"ABCD"[k]}</span>`}<span>${esc(o.text)}</span></button>`;
  }).join("");
  const live = G.opts.filter(o => !o.off).length;
  $("bFifty").disabled = G.done || G.fifty || live < 3 || P.coins < COST_FIFTY;
}

$("pool").addEventListener("click", e => { const b = e.target.closest(".tile"); if (b) place(+b.dataset.p); });
$("slots").addEventListener("click", e => { const b = e.target.closest(".slot"); if (b) unplace(+b.dataset.s); });
$("choices").addEventListener("click", e => { const b = e.target.closest(".opt"); if (b) choose(+b.dataset.k); });

function place(pi) {
  if (G.done || G.busy) return;
  const t = G.pool[pi]; if (t.used || t.gone) return;
  const s = G.slots.findIndex(x => x.t === null); if (s < 0) return;
  G.slots[s].t = pi; t.used = true;
  if (G.slots.some(x => x.t === null)) sfx("tap");
  renderTiles(); checkFull();
}
function unplace(si) {
  if (G.done || G.busy) return;
  const s = G.slots[si]; if (s.lk || s.t === null) return;
  G.pool[s.t].used = false; s.t = null; renderTiles();
}
function clearLoose() { G.slots.forEach(s => { if (!s.lk && s.t !== null) { G.pool[s.t].used = false; s.t = null; } }); }
function checkFull() {
  if (G.slots.some(s => s.t === null)) return;
  if (G.slots.map(s => G.pool[s.t].l).join("") === G.A.join("")) return win();
  G.busy = true; sfx("wrong");
  $("slots").classList.add("bad", "shake");
  setTimeout(() => { $("slots").classList.remove("bad", "shake"); clearLoose(); G.busy = false; renderTiles(); }, 650);
}
function choose(k) {
  if (G.done || G.busy) return;
  const o = G.opts[k]; if (o.off) return;
  if (k === G.L.ans) return win();
  o.off = o.wrong = true; G.mistakes++; sfx("wrong");
  $("choices").classList.remove("shake"); void $("choices").offsetWidth; $("choices").classList.add("shake");
  if (G.L.type === "benar") { G.done = G.lost = true; stopTimer(); renderChoices(); setTimeout(() => lose("wrong"), 600); return; }
  renderChoices();
}

async function pay(kind) {
  const g = G, cost = CFG.boosters[kind];
  if (P.coins < cost) { toast("Koin belum cukup. Ambil hadiah harian atau selesaikan level lain."); return false; }
  if (g.paying) return false;
  g.paying = g.busy = true;
  try { await g.started; applyState((await api("spend", { booster: kind })).state); g.hints++; return G === g && !g.done; }
  catch (e) { toast(e.message); return false; }
  finally { g.paying = g.busy = false; }
}
$("bReveal").onclick = async () => {
  if (G.done) return;
  if (G.M.guess) {   // tebak kata: buka satu huruf (semua posisinya) tanpa mengurangi kesempatan
    const hidden = [...new Set(G.A.filter(c => !G.tried.has(c)))];
    if (hidden.length <= 1 || !(await pay("reveal"))) return;
    G.tried.add(hidden[rnd(hidden.length)]);
    return renderGuess();
  }
  if (G.M.type) {    // tebak gambar: buka huruf di satu posisi
    const hidden = G.A.map((_, i) => i).filter(i => !G.shown.has(i));
    if (hidden.length <= 1 || !(await pay("reveal"))) return;
    G.shown.add(hidden[rnd(hidden.length)]);
    return renderType();
  }
  if (G.slots.filter(s => !s.lk).length <= 1 || !(await pay("reveal"))) return;
  clearLoose();
  const open = G.slots.map((s, i) => s.lk ? -1 : i).filter(i => i >= 0);
  const si = open[rnd(open.length)];
  const cand = G.pool.map((_, i) => i).filter(i => !G.pool[i].used && !G.pool[i].gone && G.pool[i].l === G.A[si]);
  const pi = cand.find(i => G.pool[i].real) ?? cand[0];
  G.slots[si] = { t: pi, lk: true }; G.pool[pi].used = true;
  renderTiles();
};
$("bRemove").onclick = async () => {
  if (G.done || G.removed || !(await pay("remove"))) return;
  const need = {}; G.A.forEach(l => need[l] = (need[l] || 0) + 1);
  G.slots.forEach(s => { if (s.lk) need[G.pool[s.t].l]--; });
  clearLoose();
  G.pool.forEach(t => { if (t.used) return; if (need[t.l] > 0) need[t.l]--; else t.gone = true; });
  G.removed = true; renderTiles();
};
$("bShuffle").onclick = () => { if (!G.done) { G.order = shuffle(G.order); renderTiles(); } };
$("bFifty").onclick = async () => {
  if (G.done || G.fifty || G.opts.filter((o, k) => k !== G.L.ans && !o.off).length < 2 || !(await pay("fifty"))) return;
  const wrong = G.opts.map((o, k) => k).filter(k => k !== G.L.ans && !G.opts[k].off);
  shuffle(wrong).slice(0, 2).forEach(k => { G.opts[k].off = G.opts[k].cut = true; });
  G.fifty = true; renderChoices();
};
$("peekBtn").onclick = () => {   // tebak gambar: buka petunjuk gratis, tapi dihitung sebagai bantuan (−1 bintang)
  if (G.done || !G.L.peek || $("peekBtn").hidden) return;
  G.hints++; $("clue").textContent = G.L.peek; $("peekBtn").hidden = true; sfx("tap");
};
$("back").onclick = showHome;

document.addEventListener("keydown", e => {
  if (OFFLINE || $("play").hidden || $("play").classList.contains("leave") || !G || G.done || e.ctrlKey || e.metaKey || e.altKey || document.querySelector(".scrim:not(.out)")) return;
  if (G.M.type) return;   // tebak gambar diketik langsung di kotak isian
  if (G.M.guess) { if (/^[a-z]$/i.test(e.key)) guess(e.key.toUpperCase()); return; }
  if (!G.M.tiles) {
    if (e.key.length !== 1) return;
    let k = "1234".indexOf(e.key); if (k < 0) k = "abcd".indexOf(e.key.toLowerCase());
    if (k >= 0 && k < G.opts.length) choose(k);
    return;
  }
  if (/^[a-z]$/i.test(e.key)) {
    const L = e.key.toUpperCase();
    const pi = G.order.find(i => !G.pool[i].used && !G.pool[i].gone && G.pool[i].l === L);
    if (pi !== undefined) place(pi);
  } else if (e.key === "Backspace") {
    for (let i = G.slots.length - 1; i >= 0; i--) if (!G.slots[i].lk && G.slots[i].t !== null) { unplace(i); break; }
  }
});

// ---------- timer ----------
function startTimer() {
  stopTimer(); drawTimer();
  tick = setInterval(() => {
    if (G.done || G.busy || OFFLINE) return;   // waktu berhenti selama koneksi terputus
    G.t = Math.max(0, G.t - 0.25); drawTimer();
    if (G.t <= 0) { G.done = G.lost = true; stopTimer(); renderPlay(); sfx("time"); lose("time"); }
  }, 250);
}
function stopTimer() { clearInterval(tick); }
function drawTimer() {
  $("timer").style.width = (G.t / G.M.time) * 100 + "%";
  $("timer").classList.toggle("low", G.t <= G.M.time * 0.25);
  $("timerWrap").setAttribute("aria-valuenow", Math.ceil(G.t));
  $("timerWrap").setAttribute("aria-valuetext", `${Math.ceil(G.t)} detik`);
}

