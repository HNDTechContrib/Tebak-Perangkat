// Layar loading saat masuk ke minigame dari website utama (pengganti halaman login minigame).
// Server mengenali user website utama lewat api/enter (app/Core/MainSite.php), lalu halaman utama dibuka.
import { $, $btn, reducedMotion } from "../../core/dom.js";
import { state } from "../../core/state.js";
import { api } from "../../services/api.js";
import { drawSnd } from "../../ui/effects/sound.js";
import { enterHome } from "../home/home.js";
import { loadBoard } from "../leaderboard/leaderboard.js";
import { applyTheme } from "../themes/apply-theme.js";

const MIN_SHOW = 800;   // milidetik; supaya layar loading tidak hanya berkedip

/** @param {number} ms */
const wait = ms => new Promise(r => setTimeout(r, ms));

/** Teks status di bawah bar; fail = berhenti dengan tombol "Coba lagi". @param {string} msg @param {boolean} [fail] */
function status(msg, fail = false) {
  $("enterMsg").textContent = msg;
  $("enterBar").classList.toggle("fail", fail);
  $btn("enterRetry").hidden = !fail;
}

export async function enterGame() {
  const started = Date.now(), bar = $("enterBar");
  $("enter").hidden = false; $("home").hidden = $("play").hidden = true;
  bar.classList.remove("done");
  status("Menyiapkan permainan…");
  try { state.player = (await api("enter", {})).state; }
  catch (e) { status(e instanceof Error ? e.message : String(e), true); return; }
  applyTheme(); drawSnd();   // tema dan suara milik pemain ini
  await wait(Math.max(0, MIN_SHOW - (Date.now() - started)));
  bar.classList.add("done"); status("Siap!");
  await wait(reducedMotion() ? 0 : 350);
  $("enter").hidden = true;
  enterHome(); loadBoard();
}

export function initEnter() {
  $btn("enterRetry").addEventListener("click", enterGame);
}
