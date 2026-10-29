// Main dengan keyboard fisik: huruf untuk menyusun/menebak, 1-4 atau A-D untuk pilihan, Backspace untuk hapus.
import { $ } from "../../core/dom.js";
import { state } from "../../core/state.js";
import { modalOpen } from "../../ui/modal.js";
import { choose } from "./modes/choices.js";
import { guess } from "./modes/guess.js";
import { place, unplace } from "./modes/tiles.js";

/** @param {KeyboardEvent} e */
function onKey(e) {
  const g = state.game;
  if (state.offline || $("play").hidden || $("play").classList.contains("leave") || !g || g.done || e.ctrlKey || e.metaKey || e.altKey || modalOpen()) return;
  if (g.M.type) return;   // tebak gambar diketik langsung di kotak isian
  if (g.M.guess) { if (/^[a-z]$/i.test(e.key)) guess(e.key.toUpperCase()); return; }
  if (!g.M.tiles) {
    if (e.key.length !== 1) return;
    let k = "1234".indexOf(e.key); if (k < 0) k = "abcd".indexOf(e.key.toLowerCase());
    if (k >= 0 && k < g.opts.length) choose(k);
    return;
  }
  if (/^[a-z]$/i.test(e.key)) {
    const L = e.key.toUpperCase();
    const pi = g.order.find(i => { const t = g.pool[i]; return !!t && !t.used && !t.gone && t.l === L; });
    if (pi !== undefined) place(pi);
  } else if (e.key === "Backspace") {
    for (let i = g.slots.length - 1; i >= 0; i--) { const s = g.slots[i]; if (s && !s.lk && s.t !== null) { unplace(i); break; } }
  }
}

export function initKeyboard() {
  document.addEventListener("keydown", onKey);
}
