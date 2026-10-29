// Mode Tebak gambar: lihat gambar perangkat lalu ketik namanya, 3 kesempatan salah.
/** @import { PlayState } from "../../../types/game" */
import { COST } from "../../../core/data.js";
import { $, $btn, $input } from "../../../core/dom.js";
import { game, player, state } from "../../../core/state.js";
import { shake } from "../../../ui/animate.js";
import { sfx } from "../../../ui/effects/sound.js";
import { toast } from "../../../ui/toast.js";
import { drawLives } from "../play.js";
import { lose, win } from "../result.js";
import { stopTimer } from "../timer.js";

/** Huruf besar tanpa spasi/tanda baca, supaya "card reader" = "CARDREADER". @param {string} v */
const norm = v => String(v).toUpperCase().replace(/[^A-Z0-9]/g, "");

/** @param {PlayState} g */
export function setupType(g) {
  Object.assign(g, { shown: new Set(), lives: 3 });
  $("slots").style.setProperty("--n", String(Math.max(...g.groups)));
  const input = $input("typeIn");
  input.value = ""; input.maxLength = g.L.w.length + 6;
}

export function renderType() {
  const g = game(), typed = [...norm($input("typeIn").value)];
  let k = 0;
  $("slots").innerHTML = g.groups.map(n => `<div class="grp">${Array.from({ length: n }, () => {
    const i = k++, on = g.shown.has(i), l = on ? g.A[i] : typed[i] || "";
    return `<span class="slot ${on ? "lk" : l ? "t" : ""}" aria-hidden="true">${l}</span>`;
  }).join("")}</div>`).join("");
  drawLives(g.lives, 3);
  $input("typeIn").disabled = $btn("typeBtn").disabled = g.done;
  $btn("bReveal").disabled = g.done || g.A.length - g.shown.size <= 1 || player().coins < COST.reveal;
}

function submitType() {
  const g = game();
  if (g.done || g.busy) return;
  const v = norm($input("typeIn").value);
  if (!v) return;
  if (v === g.A.join("")) { renderType(); win(); return; }
  if (v.length !== g.A.length) { sfx("tap"); return toast(`Jawabannya ${g.A.length} huruf, kamu mengetik ${v.length}.`); }   // beda panjang: tidak dihitung salah
  g.mistakes++; g.lives--; sfx("wrong");
  shake($("slots"));
  if (g.lives <= 0) { g.done = g.lost = true; stopTimer(); renderType(); setTimeout(() => lose("type"), 600); return; }
  renderType(); $input("typeIn").select(); toast(`Belum tepat. Sisa ${g.lives} kesempatan.`);
}

export function initType() {
  $("typeForm").addEventListener("submit", e => { e.preventDefault(); submitType(); });
  $input("typeIn").addEventListener("input", () => { const g = state.game; if (g && g.M.type && !g.done) renderType(); });
}
