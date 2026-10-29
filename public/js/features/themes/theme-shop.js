// Toko tema: daftar tema, pakai tema yang dimiliki, beli tema terkunci.
/** @import { Theme } from "../../types/game" */
import { THEMES } from "../../core/data.js";
import { $ } from "../../core/dom.js";
import { CHECK, LOCK } from "../../core/icons.js";
import { player } from "../../core/state.js";
import { confetti } from "../../ui/effects/confetti.js";
import { sfx } from "../../ui/effects/sound.js";
import { closeModal, modal } from "../../ui/modal.js";
import { toast } from "../../ui/toast.js";
import { chooseTheme, themeOf } from "./apply-theme.js";
import { swatch } from "./pattern.js";

/** @param {Theme} t */
function card(t) {
  const p = player(), own = p.themes.includes(t.id), on = p.theme === t.id;
  const status = on ? `<small class="use">Sedang dipakai</small>` : own ? `<small>Ketuk untuk pakai</small>` : `<small><span class="coin">●</span>${t.price} koin</small>`;
  const label = `${t.name}, ${on ? "sedang dipakai" : own ? "sudah dimiliki" : `terkunci, ${t.price} koin`}`;
  return `<button class="th ${on ? "on" : ""} ${!own && p.coins < t.price ? "poor" : ""}" type="button" data-act="theme" data-id="${t.id}" aria-label="${label}">
      <span class="sw" style="${swatch(t)}">${on ? `<span class="ck">${CHECK}</span>` : own ? "" : `<span class="lk">${LOCK}</span>`}</span>
      <span class="lbl"><b>${t.name}</b>${status}</span></button>`;
}

function openThemes() {
  modal(`<h3>Tema latar</h3><p>Tema terkunci bisa dibuka dengan koin dari level dan hadiah harian.</p>
    <div class="themes">${THEMES.map(card).join("")}</div>
    <div class="mbtns"><button class="btn ghost" data-act="close" type="button">Tutup</button></div>`, async (a, el) => {
    if (a === "close") return closeModal();
    const p = player(), t = themeOf(el.dataset.id || "");
    if (p.themes.includes(t.id)) { if (p.theme !== t.id && await chooseTheme(t.id)) sfx("tap"); return openThemes(); }
    if (p.coins < t.price) { sfx("wrong"); return toast(`Butuh ${t.price - p.coins} koin lagi untuk membuka ${t.name}.`); }
    confirmBuy(t);
  }, { wide: true });
}

/** @param {Theme} t */
function confirmBuy(t) {
  modal(`<div class="bigsw" style="${swatch(t)}"></div><h3>${t.name}</h3><p>Buka tema ini dengan</p>
    <span class="reward"><span class="coin">●</span>${t.price} koin</span>
    <div class="mbtns"><button class="btn green" data-act="buy" type="button">Buka dan pakai</button>
    <button class="btn ghost" data-act="back" type="button">Kembali</button></div>`, async (a, el) => {
    if (a === "back") return openThemes();
    if (a !== "buy" || !(el instanceof HTMLButtonElement) || el.disabled) return;
    el.disabled = true;
    if (!(await chooseTheme(t.id))) { el.disabled = false; return; }
    sfx("coin"); confetti(); toast(`Tema ${t.name} sudah bisa dipakai.`); openThemes();
  });
}

export function initThemes() {
  $("themeBtn").addEventListener("click", openThemes);
}
