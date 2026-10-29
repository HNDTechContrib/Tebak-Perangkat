// Menyusun satu soal untuk level i: jenis permainan, perangkat, pilihan jawaban, dan teks petunjuk.
/** @import { Level, ModeKey, Word } from "../types/game" */
import { ABBR } from "../core/data.js";
import { shuffle } from "../core/random.js";
import { nearAbbr } from "./distractors/abbreviations.js";
import { nearExpansions } from "./distractors/expansions.js";
import { misspell } from "./distractors/spelling.js";
import { LEVELS, WORDS, fitFor, tierOf } from "./levels.js";
import { fresh, pickMode } from "./picker.js";
import { picOf } from "./pictures/picture.js";

/** Perangkat lain (diacak) yang memenuhi syarat. @param {Word} x @param {(y: Word) => boolean} pred */
const others = (x, pred) => shuffle(WORDS.filter(y => y !== x && pred(y)));

/**
 * Soal pilihan: list[0] adalah jawaban benar, urutan tampil diacak.
 * @param {ModeKey} t @param {{ w: string, c: string }} x @param {string} q @param {string[]} list @param {Partial<Level>} [extra]
 * @returns {Level}
 */
function withAnswer(t, x, q, list, extra = {}) {
  const opts = shuffle(list);
  return { type: t, w: x.w, c: x.c, q, opts, ans: opts.indexOf(/** @type {string} */ (list[0])), ...extra };
}

/** Pengecoh mirip jawaban; kalau kurang dari 3, ditambah dari daftar lain. @param {string[]} list @param {string[]} pool */
const fill = (list, pool) => list.concat(shuffle(pool.filter(v => !list.includes(v))).slice(0, 3 - list.length));

/** @returns {Level} */
function abbreviation() {
  const [a, f] = fresh(ABBR, p => p[0]), x = { w: a, c: "Singkatan" };
  const rest = ABBR.filter(p => p[0] !== a);
  return Math.random() < 0.6
    ? withAnswer("singkatan", x, `Apa kepanjangan dari ${a}?`, [f, ...fill(nearExpansions(f, 3), rest.map(p => p[1]))], { reveal: `${a} = ${f}` })
    : withAnswer("singkatan", x, `${f} biasa disingkat menjadi…`, [a, ...fill(nearAbbr(a, 3), rest.map(p => p[0]))], { reveal: `${a} = ${f}` });
}

/** @param {number} i @returns {Level} */
export function makeLevel(i) {
  const t = pickMode(i);
  if (t === "singkatan") return abbreviation();
  const fit = fitFor(t);
  let pool = WORDS.filter(x => fit(x) && tierOf(x) === LEVELS[i]?.tier);
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
    const shown = truth ? x.w : (others(x, y => y.c === x.c)[0] || others(x, () => true)[0] || x).w;
    return { type: t, w: x.w, c: x.c, q: x.q, stmt: `Ini adalah ${shown}.`, opts: ["Benar", "Salah"], ans: truth ? 0 : 1,
             reveal: truth ? `Benar, ini ${x.w}` : `Salah, ini ${x.w}, bukan ${shown}` };
  }
  /** @type {Level} */
  const L = { type: t, w: x.w, c: x.c, q: x.q };
  const n = x.w.split(" ").length, kata = n > 1 ? ` Jawabannya ${n} kata.` : "";
  if (t === "acak") L.q = x.q + " Susun semua huruf di bawah menjadi nama perangkatnya." + kata;
  if (t === "susun") L.q = x.q + kata;
  if (t === "tebak") L.q = x.q + kata + " Tebak hurufnya satu per satu, salah 6 kali maka gagal.";
  return L;
}
