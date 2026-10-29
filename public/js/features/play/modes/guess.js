// Mode Tebak kata: tebak huruf satu per satu, 6 kesempatan salah.
/** @import { PlayState } from "../../../types/game" */
import { COST } from "../../../core/data.js";
import { $, $btn, closest } from "../../../core/dom.js";
import { game, player } from "../../../core/state.js";
import { shake } from "../../../ui/animate.js";
import { sfx } from "../../../ui/effects/sound.js";
import { drawLives } from "../play.js";
import { lose, win } from "../result.js";
import { stopTimer } from "../timer.js";

/** @param {PlayState} g */
export function setupGuess(g) {
  Object.assign(g, { tried: new Set(), lives: 6, miss: 0 });
  $("slots").style.setProperty("--n", String(Math.max(...g.groups)));
}

export function renderGuess() {
  const g = game();
  let k = 0;
  $("slots").innerHTML = g.groups.map(n => `<div class="grp">${Array.from({ length: n }, () => {
    const l = g.A[k++] || "", on = g.tried.has(l);
    return `<span class="slot ${on ? "lk" : ""}" aria-label="${on ? l : "kosong"}">${on ? l : ""}</span>`;
  }).join("")}</div>`).join("");
  $("keys").innerHTML = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l => {
    const used = g.tried.has(l), cls = used ? (g.A.includes(l) ? "hit" : "miss") : "";
    return `<button class="key ${cls}" type="button" data-l="${l}" ${used || g.done ? "disabled" : ""} aria-label="Huruf ${l}">${l}</button>`;
  }).join("");
  drawLives(g.lives, 6);
  const hidden = new Set(g.A.filter(c => !g.tried.has(c))).size;
  $btn("bReveal").disabled = g.done || hidden <= 1 || player().coins < COST.reveal;
}

/** @param {string} l  huruf besar A-Z */
export function guess(l) {
  const g = game();
  if (g.done || g.busy || g.tried.has(l)) return;
  g.tried.add(l);
  if (g.A.includes(l)) {
    if (g.A.every(c => g.tried.has(c))) { renderGuess(); win(); return; }
    sfx("tap");
  } else {
    g.lives--; g.miss++; sfx("wrong");
    shake($("keys"));
    if (g.lives <= 0) { g.done = g.lost = true; stopTimer(); renderGuess(); setTimeout(() => lose("lives"), 600); return; }
  }
  renderGuess();
}

export function initGuess() {
  $("keys").addEventListener("click", e => { const b = closest(e, ".key"); if (b) guess(b.dataset.l || ""); });
}
