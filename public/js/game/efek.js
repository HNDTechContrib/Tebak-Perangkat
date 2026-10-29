// Efek suara dan confetti.

// ---------- sound (synthesized, no audio files) ----------
let AC;
function tone(freq, at, dur, type, vol) {
  const t = AC.currentTime + at, o = AC.createOscillator(), g = AC.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(AC.destination); o.start(t); o.stop(t + dur + 0.05);
}
function sfx(kind) {
  if (P && P.mute) return;
  try {
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    if (AC.state === "suspended") AC.resume();
    if (kind === "right") [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.32, "triangle", 0.25));
    else if (kind === "wrong") { tone(233, 0, 0.16, "square", 0.1); tone(175, 0.15, 0.32, "square", 0.1); }
    else if (kind === "time") [392, 330, 262].forEach((f, i) => tone(f, i * 0.16, 0.3, "sawtooth", 0.08));
    else if (kind === "coin") { tone(988, 0, 0.09, "square", 0.08); tone(1319, 0.09, 0.35, "square", 0.08); }
    else if (kind === "tap") tone(720, 0, 0.06, "sine", 0.08);
  } catch (e) {}
}
const SND_ON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
const SND_OFF = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';
function drawSnd() {
  document.querySelectorAll(".snd").forEach(b => { b.innerHTML = P && P.mute ? SND_OFF : SND_ON; b.setAttribute("aria-label", P && P.mute ? "Nyalakan suara" : "Matikan suara"); });
}
document.querySelectorAll(".snd").forEach(b => b.onclick = () => { if (!P) return; P.mute = !P.mute; drawSnd(); sfx("tap"); api("settings", { muted: P.mute }).catch(() => {}); });
drawSnd();

// ---------- confetti ----------
let fxRun = 0;
function confetti(from) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = $("fx"), x = c.getContext("2d"), dpr = devicePixelRatio || 1, id = ++fxRun;
  // ukuran diambil dari canvas itu sendiri (bukan innerWidth) supaya selalu sama dengan area yang dibersihkan
  const W = c.clientWidth || innerWidth, H = c.clientHeight || innerHeight;
  c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
  const wipe = () => { x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height); x.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const end = () => { if (id === fxRun) { c.width = c.height = 0; } };   // mengosongkan buffer = pasti bersih
  const r = from?.getBoundingClientRect?.();
  const ox = r ? r.left + r.width / 2 : W / 2, oy = r ? r.top + r.height / 2 : H * 0.35;
  const cols = ["#ffd23f", "#ff6b4a", "#3bbf6a", "#ffffff", "#19a7a0"];
  const ps = Array.from({ length: 120 }, () => ({ x: ox, y: oy, vx: (Math.random() - .5) * 14, vy: -Math.random() * 13 - 3,
    w: 6 + Math.random() * 6, h: 4 + Math.random() * 4, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: cols[rnd(cols.length)] }));
  let f = 0;
  setTimeout(end, 3000);   // cadangan: jika requestAnimationFrame tertahan (tab di latar belakang), tetap dibersihkan
  (function loop() {
    if (id !== fxRun) return;   // ada confetti baru, animasi lama berhenti
    wipe();
    ps.forEach(p => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); x.restore(); });
    if (++f < 110) requestAnimationFrame(loop); else end();
  })();
}

