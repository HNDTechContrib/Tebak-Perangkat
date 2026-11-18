// Confetti di atas seluruh layar (canvas #fx) saat menang, ambil hadiah, atau beli tema.
// Kertas warna-warni yang bergerak seperti kertas sungguhan: berputar, berbalik, bergoyang,
// melambat oleh hambatan udara, melayang turun, lalu memudar.
import { $, reducedMotion } from "../../core/dom.js";
import { rnd } from "../../core/random.js";

const COLORS = ["#ffd23f", "#ff6b4a", "#3bbf6a", "#ffffff", "#3b82d6", "#e0457b", "#7c5cd6", "#19a7a0"];
const LIFE = 3600;       // lama animasi (ms)
const FADE = 900;        // memudar di akhir (ms)
const GRAVITY = 0.22;    // per frame 60 fps
const DRAG = 0.98;       // hambatan udara per frame
const MAX_FALL = 2.6;    // kecepatan jatuh maksimum, supaya melayang
let run = 0;

/**
 * @typedef {{ x: number, y: number, vx: number, vy: number, size: number, shape: number, color: string,
 *   spin: number, vspin: number, flip: number, vflip: number, sway: number, vsway: number }} Piece
 */

/** @param {number} a @param {number} b */
const rand = (a, b) => a + Math.random() * (b - a);

/** Satu kertas ditembakkan dari (x, y) ke arah angle (radian; -π/2 = lurus ke atas). @returns {Piece} */
function piece(/** @type {number} */ x, /** @type {number} */ y, /** @type {number} */ angle, /** @type {number} */ speed) {
  return {
    x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
    size: rand(7, 12), shape: rnd(3), color: COLORS[rnd(COLORS.length)] || "#fff",
    spin: rand(0, 6.3), vspin: rand(-0.12, 0.12), flip: rand(0, 6.3), vflip: rand(0.08, 0.22), sway: rand(0, 6.3), vsway: rand(0.03, 0.08),
  };
}

/** Isi bentuk kertas di titik (0, 0). @param {CanvasRenderingContext2D} x @param {Piece} p */
function fillShape(x, p) {
  const s = p.size;
  if (p.shape === 0) x.fillRect(-s / 2, -s * 0.32, s, s * 0.64);                                  // kertas persegi
  else if (p.shape === 1) { x.beginPath(); x.arc(0, 0, s * 0.38, 0, Math.PI * 2); x.fill(); }      // bulatan
  else x.fillRect(-s * 0.9, -s * 0.13, s * 1.8, s * 0.26);                                         // pita tipis
}

/** @param {CanvasRenderingContext2D} x @param {Piece} p @param {number} alpha */
function draw(x, p, alpha) {
  const turn = Math.cos(p.flip);   // kertas berbalik: tampak menipis lalu melebar lagi
  x.save();
  x.translate(p.x, p.y); x.rotate(p.spin); x.scale(1, turn);
  x.globalAlpha = alpha; x.fillStyle = p.color; fillShape(x, p);
  if (turn < 0) { x.globalAlpha = alpha * 0.18; x.fillStyle = "#000"; fillShape(x, p); }   // sisi belakang lebih gelap
  x.restore();
}

/**
 * Tanpa elemen: dua "meriam" dari sudut bawah layar menembak ke tengah atas.
 * Dengan elemen (mis. tombol hadiah harian): confetti menyembur dari tengah elemen itu.
 * @param {Element} [from]
 */
export function confetti(from) {
  if (reducedMotion()) return;
  const c = /** @type {HTMLCanvasElement} */ ($("fx")), ctx = c.getContext("2d");
  if (!ctx) return;
  const x = ctx;
  const dpr = devicePixelRatio || 1, id = ++run;
  // ukuran diambil dari canvas itu sendiri (bukan innerWidth) supaya selalu sama dengan area yang dibersihkan
  const W = c.clientWidth || innerWidth, H = c.clientHeight || innerHeight;
  c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
  const wipe = () => { x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height); x.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const end = () => { if (id === run) { c.width = c.height = 0; } };   // mengosongkan buffer = pasti bersih

  /** @type {Piece[]} */
  const ps = [];
  const r = from?.getBoundingClientRect();
  if (r) {
    const ox = r.left + r.width / 2, oy = r.top + r.height / 2;
    for (let i = 0; i < 90; i++) ps.push(piece(ox, oy, rand(0, Math.PI * 2), rand(4, 12)));
  } else {
    const k = Math.sqrt(H / 780);   // layar tinggi = tembakan lebih kuat
    // sudut & kecepatan disetel lewat simulasi: puncak 6–44% dari atas layar, tersebar selebar layar
    for (let i = 0; i < 80; i++) ps.push(piece(rand(-10, 10), H + 10, rand(-1.45, -1.18), rand(23, 29) * k));        // kiri bawah
    for (let i = 0; i < 80; i++) ps.push(piece(W + rand(-10, 10), H + 10, rand(-1.96, -1.69), rand(23, 29) * k));    // kanan bawah
  }

  setTimeout(end, LIFE + 1500);   // cadangan: jika requestAnimationFrame tertahan (tab di latar belakang), tetap dibersihkan
  const t0 = performance.now();
  let last = t0;
  /** @param {number} now */
  function loop(now) {
    if (id !== run) return;   // ada confetti baru, animasi lama berhenti
    const dt = Math.min((now - last) / 16.67, 3), age = now - t0;   // gerak sama cepat di layar 60 Hz maupun 120 Hz
    last = now;
    const alpha = age > LIFE - FADE ? Math.max(0, (LIFE - age) / FADE) : 1, drag = Math.pow(DRAG, dt);
    wipe();
    for (const p of ps) {
      p.vx *= drag; p.vy = Math.min(p.vy * drag + GRAVITY * dt, MAX_FALL);
      p.sway += p.vsway * dt;
      p.x += (p.vx + Math.sin(p.sway) * 1.3) * dt; p.y += p.vy * dt;
      p.spin += p.vspin * dt; p.flip += p.vflip * dt;
      draw(x, p, alpha);
    }
    if (age < LIFE) requestAnimationFrame(loop); else end();
  }
  requestAnimationFrame(loop);
}
