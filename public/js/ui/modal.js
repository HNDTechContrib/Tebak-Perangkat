// Jendela modal (hasil level, profil, tema, peringkat, konfirmasi).
import { reducedMotion } from "../core/dom.js";

/**
 * @callback ModalAction
 * @param {string} act  isi data-act tombol yang diketuk
 * @param {HTMLElement} el  tombol yang diketuk
 */

/**
 * Buka modal. Tombol dengan data-act="..." diteruskan ke onAct.
 * @param {string} html
 * @param {ModalAction} onAct
 * @param {{ wide?: boolean, sticky?: boolean }} [opts]  sticky: mengetuk area gelap tidak menutup modal
 */
export function modal(html, onAct, opts = {}) {
  closeModal(true);
  const s = document.createElement("div");
  s.className = "scrim";
  s.innerHTML = `<div class="modal${opts.wide ? " wide" : ""}" role="dialog" aria-modal="true">${html}</div>`;
  s.addEventListener("click", e => {
    const el = e.target instanceof Element ? /** @type {HTMLElement | null} */ (e.target.closest("[data-act]")) : null;
    if (el) onAct(el.dataset.act || "", el);
    else if (e.target === s && !opts.sticky) closeModal();
  });
  document.body.appendChild(s);
  s.querySelector("button")?.focus();
}

/** Tutup dengan animasi; now = langsung hapus (saat modal lain langsung dibuka). @param {boolean} [now] */
export function closeModal(now = false) {
  document.querySelectorAll(".scrim").forEach(n => {
    if (now || reducedMotion()) return n.remove();
    if (n.classList.contains("out")) return;
    n.classList.add("out");
    n.querySelectorAll("[id]").forEach(x => x.removeAttribute("id"));   // id lama tidak bentrok dengan layar berikutnya
    setTimeout(() => n.remove(), 200);
  });
}

/** Ada modal yang sedang terbuka (bukan yang sedang menutup) */
export const modalOpen = () => !!document.querySelector(".scrim:not(.out)");
