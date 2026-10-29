// Pembuatan soal: jawaban pengecoh dan pengacakan level.

// ---------- jawaban pengecoh yang mirip ----------
// Kata pengganti untuk kepanjangan singkatan: bunyinya mirip, tapi bukan istilah yang benar
const NEAR = {
  Central: ["Centre", "Centric", "Centralized"], Processing: ["Processor", "Process", "Processed"], Unit: ["Units", "Union", "Unity"],
  Graphics: ["Graphic", "Graphical"], Random: ["Randomized", "Rapid"], Access: ["Accessed", "Accessible"], Memory: ["Memories", "Module"],
  Read: ["Ready", "Reader"], Only: ["Online", "Once"], Solid: ["Solidity", "Solar"], State: ["Static", "Stated"], Drive: ["Driver", "Drives"],
  Hard: ["Hardware", "Heavy"], Disk: ["Disc", "Desk"], Universal: ["Unified", "Universe"], Serial: ["Series", "Signal"], Bus: ["Base", "Bridge"],
  Local: ["Logical", "Location"], Area: ["Access", "Array"], Network: ["Networking", "Net"], Wide: ["World", "Wireless"],
  Power: ["Powered", "Port"], Supply: ["Support", "Supplier"], Uninterruptible: ["Uninterrupted", "Interruptible"],
  Liquid: ["Liquified", "Light"], Crystal: ["Crystalline", "Crystals"], Display: ["Displayed", "Device"], Light: ["Lite", "Lighting"],
  Emitting: ["Emission", "Emitted"], Diode: ["Device", "Diodes"], High: ["Higher", "Hyper"], Definition: ["Defined", "Density"],
  Multimedia: ["Multi Media", "Multiple"], Interface: ["Interfacing", "Integration"], Video: ["Visual", "Vector"], Array: ["Adapter", "Area"],
  Basic: ["Base", "Binary"], Input: ["Inner", "Internal"], Output: ["Outer", "Operating"], System: ["Systems", "Service"],
  Card: ["Chip", "Cable"], Attached: ["Attachment", "Associated"], Storage: ["Store", "Storing"], Digital: ["Digit", "Data"],
  Versatile: ["Video", "Virtual"], Disc: ["Disk", "Disco"], Closed: ["Close", "Clear"], Circuit: ["Circle", "Circus"],
  Television: ["Telecast", "Telecom"], Dots: ["Dot", "Data"], Per: ["Pre", "Pro"], Inch: ["Inches", "Index"], Frames: ["Frame", "Fragment"],
  Second: ["Seconds", "Secure"], Revolutions: ["Rotations", "Revolution"], Minute: ["Minutes", "Monitor"], Advanced: ["Advance", "Adaptive"],
  Technology: ["Technical", "Technique"], Attachment: ["Attached", "Attach"],
};
function nearExpansions(f, n) {   // "Central Processing Unit" -> "Central Processor Unit", "Centre Processing Units", ...
  const words = f.split(" "), seen = new Set([f.toLowerCase()]), out = [];
  const alt = w => NEAR[w] ? NEAR[w][rnd(NEAR[w].length)] : /s$/.test(w) ? w.slice(0, -1) : w + "s";
  for (let tries = 0; out.length < n && tries < 80; tries++) {
    const a = words.slice();
    shuffle([...a.keys()]).slice(0, Math.random() < 0.75 ? 1 : 2).forEach(i => a[i] = alt(a[i]));
    const v = a.join(" ");
    if (!seen.has(v.toLowerCase())) { seen.add(v.toLowerCase()); out.push(v); }
  }
  return out;
}
const LOOK = { A: "EO", B: "DP", C: "GK", D: "BP", E: "FA", F: "EP", G: "CQ", H: "NK", I: "LJ", L: "IT", M: "NW", N: "MH", O: "QD", P: "BR", R: "PB", S: "ZC", T: "FL", U: "VO", V: "UW", W: "VM" };
function nearAbbr(a, n) {   // "CPU" -> "CUP", "GPU" bukan (itu singkatan asli), "CPV", ...
  const real = new Set(ABBR.map(p => p[0])), out = new Set();
  for (let tries = 0; out.size < n && tries < 80; tries++) {
    const c = [...a], i = rnd(c.length), op = rnd(3);
    if (op === 0 && c.length > 1) { const j = i === c.length - 1 ? i - 1 : i + 1; [c[i], c[j]] = [c[j], c[i]]; }   // tukar urutan huruf
    else if (op === 1 && LOOK[c[i]]) c[i] = LOOK[c[i]][rnd(LOOK[c[i]].length)];                                 // ganti huruf yang mirip
    else if (op === 2) c.splice(i + 1, 0, "ABCDEMPST"[rnd(9)]);                                                  // sisipkan 1 huruf
    else continue;
    const v = c.join("");
    if (v !== a && !real.has(v)) out.add(v);
  }
  return [...out];
}
function misspell(w) {   // "MOTHERBOARD" -> "MOTHERBORD", "MOTEHRBOARD", ...
  const real = new Set(WORDS.map(y => y.w)), V = "AIUEO";
  for (let n = 0; n < 40; n++) {
    const a = [...w], i = 1 + rnd(a.length - 1), op = rnd(4);
    if (a[i] === " ") continue;
    if (op === 0 && a[i - 1] !== " " && a[i] !== a[i - 1]) [a[i - 1], a[i]] = [a[i], a[i - 1]];
    else if (op === 1 && a.length > 4) a.splice(i, 1);
    else if (op === 2) a.splice(i, 0, a[i]);
    else if (op === 3 && V.includes(a[i])) a[i] = V.replace(a[i], "")[rnd(4)];
    else continue;
    const v = a.join("").replace(/\s+/g, " ").trim();
    if (v !== w && !real.has(v)) return v;
  }
  return null;
}

// ---------- level ----------
// Yang tetap per level hanya tingkat kesulitannya (panjang kata makin jauh makin panjang).
// Jenis permainan, perangkat yang ditebak, dan urutan jawaban diacak ulang setiap kali level dimainkan,
// jadi tidak ada pola yang bisa dihafal dari satu percobaan ke percobaan berikutnya.
const WORDS = BANK.map(([w, c, q, img, credit, src]) => ({ w, c, q, img, credit, src }));
const wlen = x => x.w.replace(/ /g, "").length;
const tierOf = x => wlen(x) <= 5 ? 0 : wlen(x) <= 9 ? 1 : 2;
const CLEAR_CATS = ["Input", "Output", "Penyimpanan", "Jaringan", "Port"];
const FITS = { gambar: x => !!(x.img || DRAW[x.w]), acak: x => wlen(x) >= 5, kategori: x => CLEAR_CATS.includes(x.c), tebak: x => wlen(x) >= 4 };
// Peluang tiap jenis permainan (singkatan muncul kira-kira 1 dari 6 percobaan)
const WEIGHTS = { susun: 3, gambar: 3, acak: 2, tebak: 3, pilgan: 3, benar: 2, kategori: 2, singkatan: 3 };

// Jumlah level harus sama dengan level_count() di app/bootstrap.php: 1 per perangkat + 1 tiap 4 perangkat
function buildPlan() {
  const tiers = WORDS.map(tierOf).sort((a, b) => a - b), out = [];
  let extra = Math.min(Math.floor(WORDS.length / 4), ABBR.length);
  tiers.forEach((tier, i) => { out.push({ tier }); if (i % 4 === 3 && extra-- > 0) out.push({ tier }); });
  return out;
}
const LEVELS = buildPlan();

// Ingatan pendek (per browser) agar soal dan jenis permainan yang baru keluar tidak langsung muncul lagi
const MEM = (() => { try { return JSON.parse(localStorage.getItem("tp-recent")) || {}; } catch (e) { return {}; } })();
MEM.words = Array.isArray(MEM.words) ? MEM.words : []; MEM.modes = MEM.modes && typeof MEM.modes === "object" ? MEM.modes : {};
const remember = () => { try { localStorage.setItem("tp-recent", JSON.stringify(MEM)); } catch (e) {} };
function fresh(pool, key) {
  const f = pool.filter(x => !MEM.words.includes(key(x)));
  const from = f.length ? f : pool, x = from[rnd(from.length)];
  MEM.words.push(key(x)); if (MEM.words.length > 25) MEM.words.shift();
  return x;
}
function pickMode(i) {
  const tier = LEVELS[i].tier, last = MEM.modes[i];
  const ok = Object.keys(WEIGHTS).filter(t => {
    if (t === last) return false;                                // jangan sama dengan percobaan sebelumnya di level ini
    if (t === "acak" && i < PER_SECTION) return false;            // huruf acak baru muncul setelah bagian Pemula
    if (t === "singkatan") return ABBR.length >= 4;
    const fit = FITS[t] || (() => true);
    return WORDS.filter(x => fit(x) && tierOf(x) === tier).length >= 3;
  });
  let r = Math.random() * ok.reduce((s, t) => s + WEIGHTS[t], 0);
  const t = ok.find(t => (r -= WEIGHTS[t]) < 0) || "susun";
  MEM.modes[i] = t; remember();
  return t;
}
function makeLevel(i) {
  const others = (x, pred) => shuffle(WORDS.filter(y => y !== x && pred(y)));
  const withAnswer = (t, x, q, list, extra = {}) => { const opts = shuffle(list); return { type: t, w: x.w, c: x.c, q, opts, ans: opts.indexOf(list[0]), ...extra }; };
  const slot = LEVELS[i], t = pickMode(i);
  if (t === "singkatan") {
    const [a, f] = fresh(ABBR, p => p[0]), x = { w: a, c: "Singkatan" };
    // pengecoh dibuat mirip jawaban aslinya; kalau kurang dari 3, ditambah singkatan lain
    const fill = (list, pool) => list.concat(shuffle(pool.filter(v => !list.includes(v))).slice(0, 3 - list.length));
    const rest = ABBR.filter(p => p[0] !== a);
    return Math.random() < 0.6
      ? withAnswer(t, x, `Apa kepanjangan dari ${a}?`, [f, ...fill(nearExpansions(f, 3), rest.map(p => p[1]))], { reveal: `${a} = ${f}` })
      : withAnswer(t, x, `${f} biasa disingkat menjadi…`, [a, ...fill(nearAbbr(a, 3), rest.map(p => p[0]))], { reveal: `${a} = ${f}` });
  }
  const fit = FITS[t] || (() => true);
  let pool = WORDS.filter(x => fit(x) && tierOf(x) === slot.tier);
  if (pool.length < 3) pool = WORDS.filter(fit);
  const x = fresh(pool, y => y.w);
  if (t === "pilgan") {   // 1 pengecoh salah eja yang mirip + perangkat lain dari kategori yang sama
    const trick = misspell(x.w), need = trick ? 2 : 3;
    let d = others(x, y => y.c === x.c).slice(0, need);
    if (d.length < need) d = d.concat(others(x, y => y.c !== x.c).slice(0, need - d.length));
    return withAnswer(t, x, x.q, [x.w, ...(trick ? [trick] : []), ...d.map(y => y.w)], { reveal: x.w });
  }
  if (t === "gambar") return { type: t, w: x.w, c: x.c, q: "Perangkat apa yang ada di gambar? Ketik namanya.", pic: picOf(x), peek: x.q };
  if (t === "kategori") {
    const seen = new Set([x.c]), d = [];
    for (const y of others(x, () => true)) { if (!seen.has(y.c)) { seen.add(y.c); d.push(y.w); } if (d.length === 3) break; }
    return withAnswer(t, x, `Mana yang termasuk perangkat ${x.c.toLowerCase()}?`, [x.w, ...d], { reveal: `${x.w} (${x.c})` });
  }
  if (t === "benar") {
    const truth = Math.random() < 0.5;
    const shown = truth ? x.w : (others(x, y => y.c === x.c)[0] || others(x, () => true)[0]).w;
    return { type: t, w: x.w, c: x.c, q: x.q, stmt: `Ini adalah ${shown}.`, opts: ["Benar", "Salah"], ans: truth ? 0 : 1,
             reveal: truth ? `Benar, ini ${x.w}` : `Salah, ini ${x.w}, bukan ${shown}` };
  }
  const L = { type: t, w: x.w, c: x.c, q: x.q };
  const n = x.w.split(" ").length, kata = n > 1 ? ` Jawabannya ${n} kata.` : "";
  if (t === "acak") L.q = x.q + " Susun semua huruf di bawah menjadi nama perangkatnya." + kata;
  if (t === "susun") L.q = x.q + kata;
  if (t === "tebak") L.q = x.q + kata + " Tebak hurufnya satu per satu, salah 6 kali maka gagal.";
  return L;
}

