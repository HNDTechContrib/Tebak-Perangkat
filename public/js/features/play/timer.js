// Waktu level: bar di atas layar level, berhenti saat jeda (booster dibayar) atau koneksi terputus.
import { $ } from "../../core/dom.js";
import { state } from "../../core/state.js";
import { sfx } from "../../ui/effects/sound.js";
import { renderPlay } from "./play.js";
import { lose } from "./result.js";

/** @type {ReturnType<typeof setInterval> | undefined} */
let tick;

export function startTimer() {
  stopTimer(); drawTimer();
  tick = setInterval(() => {
    const g = state.game;
    if (!g || g.done || g.busy || state.offline) return;   // waktu berhenti selama koneksi terputus
    g.t = Math.max(0, g.t - 0.25); drawTimer();
    if (g.t <= 0) { g.done = g.lost = true; stopTimer(); renderPlay(); sfx("time"); lose("time"); }
  }, 250);
}

export function stopTimer() { clearInterval(tick); }

function drawTimer() {
  const g = state.game; if (!g) return;
  $("timer").style.width = (g.t / g.M.time) * 100 + "%";
  $("timer").classList.toggle("low", g.t <= g.M.time * 0.25);
  $("timerWrap").setAttribute("aria-valuenow", String(Math.ceil(g.t)));
  $("timerWrap").setAttribute("aria-valuetext", `${Math.ceil(g.t)} detik`);
}
