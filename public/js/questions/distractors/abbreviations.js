// Pengecoh untuk singkatan: huruf ditukar, diganti huruf yang mirip, atau ditambah satu huruf.
import { ABBR } from "../../core/data.js";
import { rnd } from "../../core/random.js";

/** Huruf yang bentuknya mirip @type {Record<string, string>} */
const LOOK = { A: "EO", B: "DP", C: "GK", D: "BP", E: "FA", F: "EP", G: "CQ", H: "NK", I: "LJ", L: "IT", M: "NW", N: "MH", O: "QD", P: "BR", R: "PB", S: "ZC", T: "FL", U: "VO", V: "UW", W: "VM" };

/**
 * "CPU" -> "CUP", "CPV", ... (tidak pernah singkatan asli lain seperti "GPU")
 * @param {string} a  singkatan yang benar
 * @param {number} n  jumlah pengecoh yang dicari
 */
export function nearAbbr(a, n) {
  const real = new Set(ABBR.map(p => p[0])), out = new Set();
  for (let tries = 0; out.size < n && tries < 80; tries++) {
    const c = [...a], i = rnd(c.length), op = rnd(3), ch = c[i] || "", look = LOOK[ch];
    if (op === 0 && c.length > 1) { const j = i === c.length - 1 ? i - 1 : i + 1; [c[i], c[j]] = [c[j] || "", ch]; }   // tukar urutan huruf
    else if (op === 1 && look) c[i] = look[rnd(look.length)] || ch;                                                      // ganti huruf yang mirip
    else if (op === 2) c.splice(i + 1, 0, "ABCDEMPST"[rnd(9)] || "A");                                                   // sisipkan 1 huruf
    else continue;
    const v = c.join("");
    if (v !== a && !real.has(v)) out.add(v);
  }
  return [...out];
}
