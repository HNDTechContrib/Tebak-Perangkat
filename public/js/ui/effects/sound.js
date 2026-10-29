// Efek suara (dibuat langsung dengan Web Audio, tanpa file audio) dan tombol suara.
import { state } from "../../core/state.js";
import { api } from "../../services/api.js";

/** @typedef {"right" | "wrong" | "time" | "coin" | "tap"} Sfx */

/** @type {AudioContext | undefined} */
let AC;

/**
 * @param {AudioContext} ac
 * @param {number} freq @param {number} at @param {number} dur
 * @param {OscillatorType} type @param {number} vol
 */
function tone(ac, freq, at, dur, type, vol) {
  const t = ac.currentTime + at, o = ac.createOscillator(), g = ac.createGain();
  o.type = type; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.012); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.05);
}

/** @param {Sfx} kind */
export function sfx(kind) {
  if (state.player?.mute) return;
  try {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    const ac = AC = AC || new Ctx();
    if (ac.state === "suspended") ac.resume();
    if (kind === "right") [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(ac, f, i * 0.09, 0.32, "triangle", 0.25));
    else if (kind === "wrong") { tone(ac, 233, 0, 0.16, "square", 0.1); tone(ac, 175, 0.15, 0.32, "square", 0.1); }
    else if (kind === "time") [392, 330, 262].forEach((f, i) => tone(ac, f, i * 0.16, 0.3, "sawtooth", 0.08));
    else if (kind === "coin") { tone(ac, 988, 0, 0.09, "square", 0.08); tone(ac, 1319, 0.09, 0.35, "square", 0.08); }
    else if (kind === "tap") tone(ac, 720, 0, 0.06, "sine", 0.08);
  } catch (e) {}
}

const SND_ON = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12"/></svg>';
const SND_OFF = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 9v6h4l5 4V5L8 9z"/><path d="M17 9l5 6M22 9l-5 6"/></svg>';

function drawSnd() {
  const muted = !!state.player?.mute;
  document.querySelectorAll(".snd").forEach(b => {
    b.innerHTML = muted ? SND_OFF : SND_ON;
    b.setAttribute("aria-label", muted ? "Nyalakan suara" : "Matikan suara");
  });
}

/** Pasang tombol suara di halaman utama dan layar level */
export function initSound() {
  document.querySelectorAll(".snd").forEach(b => b.addEventListener("click", () => {
    const p = state.player; if (!p) return;
    p.mute = !p.mute; drawSnd(); sfx("tap");
    api("settings", { muted: p.mute }).catch(() => {});
  }));
  drawSnd();
}
