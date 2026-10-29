// Confetti di atas seluruh layar (canvas #fx) saat menang, ambil hadiah, atau beli tema.
import { $, reducedMotion } from "../../core/dom.js";
import { rnd } from "../../core/random.js";

const COLORS = ["#ffd23f", "#ff6b4a", "#3bbf6a", "#ffffff", "#19a7a0"];
let run = 0;

/** @param {Element} [from]  confetti keluar dari tengah elemen ini; tanpa elemen dari tengah atas layar */
export function confetti(from) {
  if (reducedMotion()) return;
  const c = /** @type {HTMLCanvasElement} */ ($("fx")), x = c.getContext("2d");
  if (!x) return;
  const dpr = devicePixelRatio || 1, id = ++run;
  // ukuran diambil dari canvas itu sendiri (bukan innerWidth) supaya selalu sama dengan area yang dibersihkan
  const W = c.clientWidth || innerWidth, H = c.clientHeight || innerHeight;
  c.width = W * dpr; c.height = H * dpr; x.setTransform(dpr, 0, 0, dpr, 0, 0);
  const wipe = () => { x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, c.width, c.height); x.setTransform(dpr, 0, 0, dpr, 0, 0); };
  const end = () => { if (id === run) { c.width = c.height = 0; } };   // mengosongkan buffer = pasti bersih
  const r = from?.getBoundingClientRect();
  const ox = r ? r.left + r.width / 2 : W / 2, oy = r ? r.top + r.height / 2 : H * 0.35;
  const ps = Array.from({ length: 120 }, () => ({ x: ox, y: oy, vx: (Math.random() - .5) * 14, vy: -Math.random() * 13 - 3,
    w: 6 + Math.random() * 6, h: 4 + Math.random() * 4, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: COLORS[rnd(COLORS.length)] || "#fff" }));
  let f = 0;
  setTimeout(end, 3000);   // cadangan: jika requestAnimationFrame tertahan (tab di latar belakang), tetap dibersihkan
  (function loop() {
    if (id !== run) return;   // ada confetti baru, animasi lama berhenti
    wipe();
    ps.forEach(p => { p.vy += .35; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.r += p.vr;
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); x.restore(); });
    if (++f < 110) requestAnimationFrame(loop); else end();
  })();
}
