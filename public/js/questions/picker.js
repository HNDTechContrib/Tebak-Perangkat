// Memilih jenis permainan dan soal secara acak, dengan ingatan pendek per browser
// agar soal dan jenis permainan yang baru keluar tidak langsung muncul lagi.
/** @import { ModeKey } from "../types/game" */
import { ABBR, PER_SECTION } from "../core/data.js";
import { rnd } from "../core/random.js";
import { LEVELS, WEIGHTS, WORDS, fitFor, tierOf } from "./levels.js";

/** @type {{ words: string[], modes: Record<string, ModeKey> }} */
const MEM = (() => {
  /** @type {any} */
  let m = {};
  try { m = JSON.parse(localStorage.getItem("tp-recent") || "{}") || {}; } catch (e) {}
  return { words: Array.isArray(m.words) ? m.words : [], modes: m.modes && typeof m.modes === "object" ? m.modes : {} };
})();
const remember = () => { try { localStorage.setItem("tp-recent", JSON.stringify(MEM)); } catch (e) {} };

/**
 * Ambil satu yang belum keluar baru-baru ini (kalau semua sudah, ambil acak).
 * @template T
 * @param {readonly T[]} pool
 * @param {(x: T) => string} key
 * @returns {T}
 */
export function fresh(pool, key) {
  const f = pool.filter(x => !MEM.words.includes(key(x)));
  const from = f.length ? f : pool, x = /** @type {T} */ (from[rnd(from.length)]);
  MEM.words.push(key(x)); if (MEM.words.length > 25) MEM.words.shift();
  return x;
}

/** Jenis permainan untuk level i. @param {number} i @returns {ModeKey} */
export function pickMode(i) {
  const tier = LEVELS[i]?.tier, last = MEM.modes[i];
  const ok = /** @type {ModeKey[]} */ (Object.keys(WEIGHTS)).filter(t => {
    if (t === last) return false;                                // jangan sama dengan percobaan sebelumnya di level ini
    if (t === "acak" && i < PER_SECTION) return false;            // huruf acak baru muncul setelah bagian Pemula
    if (t === "singkatan") return ABBR.length >= 4;
    const fit = fitFor(t);
    return WORDS.filter(x => fit(x) && tierOf(x) === tier).length >= 3;
  });
  let r = Math.random() * ok.reduce((s, t) => s + WEIGHTS[t], 0);
  const t = ok.find(t => (r -= WEIGHTS[t]) < 0) || "susun";
  MEM.modes[i] = t; remember();
  return t;
}
