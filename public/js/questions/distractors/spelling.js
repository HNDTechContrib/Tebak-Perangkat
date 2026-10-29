// Pengecoh salah eja untuk Pilihan ganda: huruf ditukar, dihapus, digandakan, atau vokal diganti.
import { rnd } from "../../core/random.js";
import { WORDS } from "../levels.js";

/**
 * "MOTHERBOARD" -> "MOTHERBORD", "MOTEHRBOARD", ... atau null kalau tidak ketemu.
 * @param {string} w
 * @returns {string | null}
 */
export function misspell(w) {
  const real = new Set(WORDS.map(y => y.w)), V = "AIUEO";
  for (let n = 0; n < 40; n++) {
    const a = [...w], i = 1 + rnd(a.length - 1), op = rnd(4), ch = a[i] || "", prev = a[i - 1] || "";
    if (ch === " ") continue;
    if (op === 0 && prev !== " " && ch !== prev) [a[i - 1], a[i]] = [ch, prev];
    else if (op === 1 && a.length > 4) a.splice(i, 1);
    else if (op === 2) a.splice(i, 0, ch);
    else if (op === 3 && V.includes(ch)) a[i] = V.replace(ch, "")[rnd(4)] || ch;
    else continue;
    const v = a.join("").replace(/\s+/g, " ").trim();
    if (v !== w && !real.has(v)) return v;
  }
  return null;
}
