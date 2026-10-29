// Halaman utama dan perpindahan dari layar level kembali ke halaman utama.
import { MODES } from "../../core/data.js";
import { $, reducedMotion } from "../../core/dom.js";
import { animate } from "../../ui/animate.js";
import { setCoins } from "../../ui/coins.js";
import { closeModal } from "../../ui/modal.js";
import { stopTimer } from "../play/timer.js";
import { drawProfileBtn } from "../profile/avatar.js";
import { drawDaily } from "./daily-reward.js";
import { drawMap } from "./level-map.js";

/** @type {ReturnType<typeof setTimeout> | undefined} */
let leaveTimer;

export function showHello() { $("hello").textContent = "Halo Smart User!"; }

export function showHome() {
  stopTimer(); closeModal();
  const pl = $("play");
  if (pl.classList.contains("leave")) return;   // sedang keluar dari level
  if (!pl.hidden && !reducedMotion()) {          // keluar level: layar level turun & memudar dulu
    pl.classList.remove("enter"); pl.classList.add("leave");
    leaveTimer = setTimeout(() => { pl.classList.remove("leave"); drawHome(true); }, 220);
    return;
  }
  drawHome(false);
}

/** Dipanggil saat level dimulai, supaya animasi keluar yang belum selesai dibatalkan */
export function cancelLeave() {
  clearTimeout(leaveTimer); $("play").classList.remove("leave");
}

/** @param {boolean} fromLevel */
function drawHome(fromLevel) {
  $("play").hidden = true; $("home").hidden = false;
  if (fromLevel) animate($("home"), "enter");
  setCoins(); showHello(); drawProfileBtn(); drawDaily(); drawMap();
  window.scrollTo({ top: 0 });
}

export function initHome() {
  $("modes").innerHTML = Object.values(MODES).map(m => `<span>${m.name}</span>`).join("");
}
