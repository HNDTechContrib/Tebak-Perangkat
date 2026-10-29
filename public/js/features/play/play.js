// Layar level: memulai level dan menampilkan bagian yang sesuai dengan jenis permainannya.
/** @import { Level, Mode, PlayState } from "../../types/game" */
import { MODES } from "../../core/data.js";
import { $, $btn, $input } from "../../core/dom.js";
import { icon } from "../../core/icons.js";
import { state } from "../../core/state.js";
import { makeLevel } from "../../questions/make-level.js";
import { showPicture } from "../../questions/pictures/picture.js";
import { api } from "../../services/api.js";
import { animate } from "../../ui/animate.js";
import { setCoins } from "../../ui/coins.js";
import { closeModal } from "../../ui/modal.js";
import { toast } from "../../ui/toast.js";
import { cancelLeave, showHome } from "../home/home.js";
import { renderChoices, setupChoices } from "./modes/choices.js";
import { renderGuess, setupGuess } from "./modes/guess.js";
import { renderTiles, setupTiles } from "./modes/tiles.js";
import { renderType, setupType } from "./modes/type.js";
import { startTimer } from "./timer.js";

/** Keadaan awal level; bagian khusus mode diisi oleh setup... di folder modes/. @param {number} i @param {Level} L @param {Mode} M @returns {PlayState} */
const freshState = (i, L, M) => ({
  i, L, M, hints: 0, mistakes: 0, t: M.time, done: false, lost: false, busy: false, paying: false, started: Promise.resolve(),
  A: [...L.w.replace(/ /g, "")], groups: L.w.split(" ").map(p => p.length),
  opts: [], fifty: false, pool: [], slots: [], order: [], removed: false, tried: new Set(), miss: 0, shown: new Set(), lives: 0,
});

/** @param {number} i  nomor level (mulai dari 0) */
export function startLevel(i) {
  const L = makeLevel(i), M = MODES[L.type], g = state.game = freshState(i, L, M);
  g.started = api("start", { level: i });   // server mencatat waktu mulai level
  g.started.catch(e => toast(e instanceof Error ? e.message : String(e)));
  if (M.tiles) setupTiles(g); else if (M.guess) setupGuess(g); else if (M.type) setupType(g); else setupChoices(g);
  closeModal();
  $("home").hidden = true; $("play").hidden = false;
  $("lvTitle").textContent = `Level ${i + 1}`;
  $("badge").innerHTML = icon(L.c) + L.c;
  $("mode").textContent = M.name;
  $("clue").textContent = L.q;
  $("stmt").hidden = !L.stmt; $("stmt").textContent = L.stmt || "";
  $btn("peekBtn").hidden = !L.peek; $btn("peekBtn").disabled = false;
  showPicture(L.pic || "");
  $("slots").className = "slots";
  setCoins(); renderPlay(); startTimer();
  window.scrollTo({ top: 0 });
  cancelLeave();
  animate($("play"), "enter");   // animasi masuk level
  // di HP jangan langsung fokus: keyboard akan menutupi gambar dan browser bisa memperbesar halaman
  if (M.type && matchMedia("(pointer: fine)").matches) setTimeout(() => $input("typeIn").focus({ preventScroll: true }), 60);
}

/** Tampilkan bagian layar yang dipakai mode ini, lalu gambar ulang isinya */
export function renderPlay() {
  const g = state.game; if (!g) return;
  const tiles = !!g.M.tiles, gs = !!g.M.guess, ty = !!g.M.type, letters = tiles || gs || ty;
  $("slots").hidden = !letters;
  $("pool").hidden = !tiles;
  $("keys").hidden = !gs;
  $("lives").hidden = !(gs || ty);
  $("typeForm").hidden = !ty;
  $("choices").hidden = letters;
  $btn("bReveal").hidden = !letters;
  $btn("bShuffle").hidden = !tiles;
  $btn("bRemove").hidden = !tiles || g.L.type === "acak";   // huruf acak tidak punya huruf pengecoh
  $btn("bFifty").hidden = letters || g.opts.length < 4;
  $("boost").hidden = !letters && g.opts.length < 4;
  if (tiles) renderTiles(); else if (gs) renderGuess(); else if (ty) renderType(); else renderChoices();
}

/** Baris "Sisa kesempatan" (tebak kata & tebak gambar). @param {number} lives @param {number} max */
export function drawLives(lives, max) {
  $("lives").innerHTML = `Sisa kesempatan ${Array.from({ length: max }, (_, j) => `<i class="${j < lives ? "" : "off"}"></i>`).join("")}`;
}

export function initPlay() {
  $("back").addEventListener("click", showHome);
}
