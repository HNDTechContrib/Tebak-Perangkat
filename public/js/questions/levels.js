// Daftar soal dan rencana level.
// Yang tetap per level hanya tingkat kesulitannya (panjang kata makin jauh makin panjang).
// Jenis permainan, perangkat yang ditebak, dan urutan jawaban diacak ulang setiap kali level dimainkan,
// jadi tidak ada pola yang bisa dihafal dari satu percobaan ke percobaan berikutnya.
/** @import { ModeKey, Word } from "../types/game" */
import { ABBR, BANK } from "../core/data.js";
import { DRAW } from "./pictures/drawings.js";

/** @type {Word[]} */
export const WORDS = BANK.map(([w, c, q, img, credit, src]) => ({ w, c, q, img, credit, src }));

/** Jumlah huruf tanpa spasi. @param {Word} x */
const wlen = x => x.w.replace(/ /g, "").length;
/** Tingkat kesulitan: 0 = pendek (≤5 huruf), 1 = sedang (≤9), 2 = panjang. @param {Word} x */
export const tierOf = x => wlen(x) <= 5 ? 0 : wlen(x) <= 9 ? 1 : 2;

const CLEAR_CATS = ["Input", "Output", "Penyimpanan", "Jaringan", "Port"];
/** Syarat soal untuk mode tertentu; mode yang tidak ada di sini menerima semua soal. @type {Partial<Record<ModeKey, (x: Word) => boolean>>} */
const FITS = { gambar: x => !!(x.img || DRAW[x.w]), acak: x => wlen(x) >= 5, kategori: x => CLEAR_CATS.includes(x.c), tebak: x => wlen(x) >= 4 };
/** @param {ModeKey} t */
export const fitFor = t => FITS[t] || (() => true);

// Peluang tiap jenis permainan (singkatan muncul kira-kira 1 dari 6 percobaan)
/** @type {Record<ModeKey, number>} */
export const WEIGHTS = { susun: 3, gambar: 3, acak: 2, tebak: 3, pilgan: 3, benar: 2, kategori: 2, singkatan: 3 };

// Jumlah level harus sama dengan Device::levelCount() di PHP: 1 per perangkat + 1 tiap 4 perangkat
function buildPlan() {
  const tiers = WORDS.map(tierOf).sort((a, b) => a - b), out = [];
  let extra = Math.min(Math.floor(WORDS.length / 4), ABBR.length);
  for (const [i, tier] of tiers.entries()) { out.push({ tier }); if (i % 4 === 3 && extra-- > 0) out.push({ tier }); }
  return out;
}
export const LEVELS = buildPlan();
