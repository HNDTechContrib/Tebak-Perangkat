// Peta level di halaman utama: bagian (Pemula, Pelajar, ...), bintang, dan level terkunci.
import { PER_SECTION, SECTIONS } from "../../core/data.js";
import { $, closest } from "../../core/dom.js";
import { LOCK } from "../../core/icons.js";
import { player } from "../../core/state.js";
import { LEVELS } from "../../questions/levels.js";
import { startLevel } from "../play/play.js";

/** @param {number} i */
function levelButton(i) {
  const p = player(), locked = i > p.level, st = p.stars[i] || 0;
  const cls = ["lv", st ? "done" : "", i === p.level && !st ? "current" : ""].join(" ");
  const row = [0, 1, 2].map(k => `<span class="${k < st ? "on" : ""}">★</span>`).join("");
  return `<button class="${cls}" type="button" data-i="${i}" ${locked ? "disabled" : ""} aria-label="Level ${i + 1}${locked ? ", terkunci" : `, ${st} bintang`}">${locked ? LOCK : `${i + 1}<span class="st">${row}</span>`}</button>`;
}

export function drawMap() {
  const p = player();
  const total = Object.values(p.stars).reduce((a, b) => a + b, 0);
  $("starTotal").textContent = `${total}/${LEVELS.length * 3} bintang`;
  let html = "";
  for (let s = 0; s * PER_SECTION < LEVELS.length; s++) {
    const a = s * PER_SECTION, b = Math.min(LEVELS.length, a + PER_SECTION);
    let got = 0, buttons = "";
    for (let i = a; i < b; i++) { got += p.stars[i] || 0; buttons += levelButton(i); }
    html += `<div class="sec"><h3>${SECTIONS[s] || "Bagian " + (s + 1)}<small>Level ${a + 1}–${b} · ${got}/${(b - a) * 3} ★</small></h3><div class="grid">${buttons}</div></div>`;
  }
  $("map").innerHTML = html;
}

export function initMap() {
  $("map").addEventListener("click", e => {
    const b = closest(e, ".lv");
    if (b instanceof HTMLButtonElement && !b.disabled) startLevel(Number(b.dataset.i));
  });
}
