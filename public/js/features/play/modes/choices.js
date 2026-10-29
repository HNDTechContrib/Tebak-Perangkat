// Mode pilihan jawaban: Pilihan ganda, Benar atau salah, Cari kategori, dan Singkatan.
/** @import { PlayState } from "../../../types/game" */
import { COST } from "../../../core/data.js";
import { $, $btn, closest, esc } from "../../../core/dom.js";
import { game, player } from "../../../core/state.js";
import { shake } from "../../../ui/animate.js";
import { sfx } from "../../../ui/effects/sound.js";
import { lose, win } from "../result.js";
import { stopTimer } from "../timer.js";

/** @param {PlayState} g */
export function setupChoices(g) {
  g.opts = (g.L.opts || []).map(text => ({ text, off: false, wrong: false, cut: false }));
}

export function renderChoices() {
  const g = game(), two = g.opts.length === 2;
  $("choices").className = "choices" + (two ? " two" : "");
  $("choices").innerHTML = g.opts.map((o, k) => {
    const cls = ["opt", o.wrong ? "wrong" : "", o.cut ? "cut" : "", g.done && !g.lost && k === g.L.ans ? "right" : ""].join(" ");
    return `<button class="${cls}" type="button" data-k="${k}" ${o.off || g.done ? "disabled" : ""}>${two ? "" : `<span class="k">${"ABCD"[k]}</span>`}<span>${esc(o.text)}</span></button>`;
  }).join("");
  const live = g.opts.filter(o => !o.off).length;
  $btn("bFifty").disabled = g.done || g.fifty || live < 3 || player().coins < COST.fifty;
}

/** Pilih jawaban ke-k. Benar atau salah langsung kalah kalau salah; mode lain boleh mencoba lagi. @param {number} k */
export function choose(k) {
  const g = game(), o = g.opts[k];
  if (g.done || g.busy || !o || o.off) return;
  if (k === g.L.ans) { win(); return; }
  o.off = o.wrong = true; g.mistakes++; sfx("wrong");
  shake($("choices"));
  if (g.L.type === "benar") { g.done = g.lost = true; stopTimer(); renderChoices(); setTimeout(() => lose("wrong"), 600); return; }
  renderChoices();
}

export function initChoices() {
  $("choices").addEventListener("click", e => { const b = closest(e, ".opt"); if (b) choose(Number(b.dataset.k)); });
}
