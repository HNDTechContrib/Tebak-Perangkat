// Gambar soal Tebak gambar: foto (dengan kredit) atau gambar SVG bawaan.
/** @import { Word } from "../../types/game" */
import { $, $btn, esc } from "../../core/dom.js";
import { icon } from "../../core/icons.js";
import { state } from "../../core/state.js";
import { DRAW } from "./drawings.js";

/** SVG bawaan untuk perangkat ini, atau "" kalau tidak ada. @param {string} w */
export const svgPic = w => DRAW[w] ? `<svg viewBox="0 0 120 90" role="img" aria-label="Gambar perangkat yang harus ditebak">${DRAW[w]}</svg>` : "";

/** HTML gambar soal. Foto diutamakan; keterangan pembuat & lisensinya wajib tampil (CC BY / CC BY-SA). @param {Word} x */
export const picOf = x => x.img
  ? `<img src="${esc(x.img)}" alt="Foto perangkat yang harus ditebak">` +
    (x.credit ? `<small class="pcredit">${x.src ? `<a href="${esc(x.src)}" target="_blank" rel="noopener">${esc(x.credit)}</a>` : esc(x.credit)}</small>` : "")
  : svgPic(x.w);

/** Tampilkan gambar soal di kotak #pic; kalau foto gagal dimuat, ganti dengan gambar cadangan. @param {string} html */
export function showPicture(html) {
  const box = $("pic");
  box.hidden = !html; box.innerHTML = html;
  box.querySelector("img")?.addEventListener("error", picFail);
}

// Foto gagal dimuat: pakai gambar SVG bawaan, kalau tidak ada pakai ikon kategori + petunjuk
function picFail() {
  const g = state.game; if (!g) return;
  const svg = svgPic(g.L.w);
  $("pic").innerHTML = svg || `<span class="pcat">${icon(g.L.c)}</span>`;
  if (!svg && g.L.peek && !$btn("peekBtn").hidden) { $("clue").textContent = g.L.peek; $btn("peekBtn").hidden = true; }
}
