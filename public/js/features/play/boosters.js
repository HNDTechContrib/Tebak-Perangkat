// Booster berbayar (buka huruf, hapus pengecoh, buang 2 jawaban), acak huruf, dan lihat petunjuk.
/** @import { Booster } from "../../types/game" */
import { COST } from "../../core/data.js";
import { $, $btn } from "../../core/dom.js";
import { rnd, shuffle } from "../../core/random.js";
import { game, player, state } from "../../core/state.js";
import { api, applyState } from "../../services/api.js";
import { sfx } from "../../ui/effects/sound.js";
import { toast } from "../../ui/toast.js";
import { renderChoices } from "./modes/choices.js";
import { renderGuess } from "./modes/guess.js";
import { clearLoose, renderTiles } from "./modes/tiles.js";
import { renderType } from "./modes/type.js";

/** Bayar booster ke server. Hasil true kalau berhasil dan level masih berjalan. @param {Booster} kind */
async function pay(kind) {
  const g = game();
  if (player().coins < COST[kind]) { toast("Koin belum cukup. Ambil hadiah harian atau selesaikan level lain."); return false; }
  if (g.paying) return false;
  g.paying = g.busy = true;
  try { await g.started; applyState((await api("spend", { booster: kind })).state); g.hints++; return state.game === g && !g.done; }
  catch (e) { toast(e instanceof Error ? e.message : String(e)); return false; }
  finally { g.paying = g.busy = false; }
}

// Buka huruf: tebak kata membuka satu huruf di semua posisinya, tebak gambar satu posisi, susun huruf satu kotak
async function reveal() {
  const g = game(); if (g.done) return;
  if (g.M.guess) {
    const hidden = [...new Set(g.A.filter(c => !g.tried.has(c)))];
    if (hidden.length <= 1 || !(await pay("reveal"))) return;
    g.tried.add(/** @type {string} */ (hidden[rnd(hidden.length)]));
    return renderGuess();
  }
  if (g.M.type) {
    const hidden = g.A.map((_, i) => i).filter(i => !g.shown.has(i));
    if (hidden.length <= 1 || !(await pay("reveal"))) return;
    g.shown.add(/** @type {number} */ (hidden[rnd(hidden.length)]));
    return renderType();
  }
  if (g.slots.filter(s => !s.lk).length <= 1 || !(await pay("reveal"))) return;
  clearLoose();
  const open = g.slots.map((s, i) => s.lk ? -1 : i).filter(i => i >= 0);
  const si = /** @type {number} */ (open[rnd(open.length)]);
  const cand = g.pool.map((_, i) => i).filter(i => { const t = g.pool[i]; return !!t && !t.used && !t.gone && t.l === g.A[si]; });
  const pi = cand.find(i => g.pool[i]?.real) ?? cand[0];
  if (pi === undefined) return;
  g.slots[si] = { t: pi, lk: true }; /** @type {import("../../types/game").Tile} */ (g.pool[pi]).used = true;
  renderTiles();
}

// Hapus pengecoh: sembunyikan semua huruf yang tidak dipakai jawaban
async function removeDecoys() {
  const g = game();
  if (g.done || g.removed || !(await pay("remove"))) return;
  /** @type {Record<string, number>} */
  const need = {};
  g.A.forEach(l => { need[l] = (need[l] || 0) + 1; });
  g.slots.forEach(s => { const l = s.lk && s.t !== null ? g.pool[s.t]?.l : undefined; if (l) need[l] = (need[l] || 0) - 1; });
  clearLoose();
  g.pool.forEach(t => { if (t.used) return; if ((need[t.l] || 0) > 0) need[t.l] = (need[t.l] || 0) - 1; else t.gone = true; });
  g.removed = true; renderTiles();
}

// Buang 2 jawaban salah (pilihan ganda)
async function fifty() {
  const g = game(), L = g.L;
  if (g.done || g.fifty || g.opts.filter((o, k) => k !== L.ans && !o.off).length < 2 || !(await pay("fifty"))) return;
  const wrong = g.opts.map((o, k) => k).filter(k => k !== L.ans && !g.opts[k]?.off);
  shuffle(wrong).slice(0, 2).forEach(k => { const o = g.opts[k]; if (o) o.off = o.cut = true; });
  g.fifty = true; renderChoices();
}

export function initBoosters() {
  $btn("bReveal").addEventListener("click", reveal);
  $btn("bRemove").addEventListener("click", removeDecoys);
  $btn("bShuffle").addEventListener("click", () => { const g = game(); if (!g.done) { g.order = shuffle(g.order); renderTiles(); } });
  $btn("bFifty").addEventListener("click", fifty);
  // tebak gambar: buka petunjuk gratis, tapi dihitung sebagai bantuan (−1 bintang)
  $btn("peekBtn").addEventListener("click", () => {
    const g = game();
    if (g.done || !g.L.peek || $btn("peekBtn").hidden) return;
    g.hints++; $("clue").textContent = g.L.peek; $btn("peekBtn").hidden = true; sfx("tap");
  });
}
