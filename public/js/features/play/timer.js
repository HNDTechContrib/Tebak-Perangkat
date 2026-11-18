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
  const left = g.t / g.M.time, secs = Math.ceil(g.t);   // sisa waktu 1..0 dan dalam detik
  $("timer").style.width = left * 100 + "%";
  $("timerNum").textContent = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;
  // warna: hijau di atas 50%, kuning 50–25%, merah 25% ke bawah (bar dan angka)
  for (const el of [$("timer"), $("timerNum")]) {
    el.classList.toggle("mid", left <= 0.5 && left > 0.25);
    el.classList.toggle("low", left <= 0.25);
  }
  $("timerWrap").setAttribute("aria-valuenow", String(Math.ceil(g.t)));
  $("timerWrap").setAttribute("aria-valuetext", `${Math.ceil(g.t)} detik`);
}
