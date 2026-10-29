// Mode Susun huruf dan Huruf acak: ketuk kotak huruf di bawah untuk mengisi jawaban.
/** @import { PlayState, Tile } from "../../../types/game" */
import { COST } from "../../../core/data.js";
import { $, $btn, closest } from "../../../core/dom.js";
import { rnd, shuffle } from "../../../core/random.js";
import { game, player, state } from "../../../core/state.js";
import { sfx } from "../../../ui/effects/sound.js";
import { win } from "../result.js";

const ABC = "ABCDEFGHIJKLMNOPRSTUW";   // huruf pengecoh

/** Siapkan kotak huruf. Susun huruf diberi huruf pengecoh; huruf acak hanya huruf jawaban. @param {PlayState} g */
export function setupTiles(g) {
  const acak = g.L.type === "acak", pre = g.L.pre || [];
  const open = g.A.length - pre.length;
  const vis = acak ? open : Math.min(16, Math.max(8, Math.ceil((open + 4) / 8) * 8));
  /** @type {Tile[]} */
  const pool = g.A.map(l => ({ l, real: true, used: false, gone: false, fixed: false }));
  for (let k = open; k < vis; k++) pool.push({ l: ABC[rnd(ABC.length)] || "A", real: false, used: false, gone: false, fixed: false });
  const slots = g.A.map(() => ({ t: /** @type {number | null} */ (null), lk: false }));
  pre.forEach(i => { slots[i] = { t: i, lk: true }; const t = pool[i]; if (t) t.used = t.fixed = true; });
  const idx = pool.map((_, k) => k).filter(k => !pool[k]?.fixed);
  let order = shuffle(idx);
  // huruf acak: pastikan urutannya tidak kebetulan sudah benar
  if (acak) for (let n = 0; n < 6 && order.map(k => pool[k]?.l).join("") === g.A.join(""); n++) order = shuffle(idx);
  Object.assign(g, { pool, slots, order, removed: acak });
  $("slots").style.setProperty("--n", String(Math.max(...g.groups)));
}

/** Huruf pada kotak jawaban ke-i, atau "" kalau kosong. @param {PlayState} g @param {number} i */
const letterAt = (g, i) => { const t = g.slots[i]?.t; return t === null || t === undefined ? "" : g.pool[t]?.l || ""; };

export function renderTiles() {
  const g = game();
  let k = 0;
  $("slots").innerHTML = g.groups.map(n => `<div class="grp">${Array.from({ length: n }, () => {
    const i = k++, s = g.slots[i], l = letterAt(g, i);
    return `<button class="slot ${s?.lk ? "lk" : l ? "f" : ""}" type="button" data-s="${i}" aria-label="Kotak ${i + 1}${l ? ", " + l : ", kosong"}">${l}</button>`;
  }).join("")}</div>`).join("");
  $("pool").innerHTML = g.order.map(pi => {
    const t = g.pool[pi]; if (!t) return "";
    return `<button class="tile ${t.used ? "used" : ""} ${t.gone ? "gone" : ""}" type="button" data-p="${pi}" ${t.used || t.gone ? "disabled" : ""} aria-label="Huruf ${t.l}">${t.l}</button>`;
  }).join("");
  const open = g.slots.filter(s => !s.lk).length, coins = player().coins;
  $btn("bReveal").disabled = g.done || open <= 1 || coins < COST.reveal;
  $btn("bRemove").disabled = g.done || g.removed || coins < COST.remove;
  $btn("bShuffle").disabled = g.done;
}

/** Taruh huruf dari kotak bawah ke kotak jawaban kosong pertama. @param {number} pi */
export function place(pi) {
  const g = game(), t = g.pool[pi];
  if (g.done || g.busy || !t || t.used || t.gone) return;
  const s = g.slots.find(x => x.t === null); if (!s) return;
  s.t = pi; t.used = true;
  if (g.slots.some(x => x.t === null)) sfx("tap");
  renderTiles(); checkFull();
}

/** Kembalikan huruf dari kotak jawaban ke-si. @param {number} si */
export function unplace(si) {
  const g = game(), s = g.slots[si];
  if (g.done || g.busy || !s || s.lk || s.t === null) return;
  const t = g.pool[s.t]; if (t) t.used = false;
  s.t = null; renderTiles();
}

/** Kosongkan semua kotak jawaban yang tidak terkunci */
export function clearLoose() {
  const g = game();
  g.slots.forEach(s => { if (!s.lk && s.t !== null) { const t = g.pool[s.t]; if (t) t.used = false; s.t = null; } });
}

function checkFull() {
  const g = game();
  if (g.slots.some(s => s.t === null)) return;
  if (g.slots.map((_, i) => letterAt(g, i)).join("") === g.A.join("")) return win();
  g.busy = true; sfx("wrong");
  $("slots").classList.add("bad", "shake");
  setTimeout(() => { $("slots").classList.remove("bad", "shake"); clearLoose(); g.busy = false; renderTiles(); }, 650);
}

export function initTiles() {
  $("pool").addEventListener("click", e => { const b = closest(e, ".tile"); if (b) place(Number(b.dataset.p)); });
  $("slots").addEventListener("click", e => {
    const b = closest(e, ".slot");
    if (b && state.game?.M.tiles) unplace(Number(b.dataset.s));
  });
}
