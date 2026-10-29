// Fungsi bantu kecil untuk mengambil elemen halaman dan menyusun HTML dengan aman.

/** Elemen dengan id tertentu (selalu ada di resources/views/game). @param {string} id */
export const $ = id => /** @type {HTMLElement} */ (document.getElementById(id));
/** @param {string} id */
export const $btn = id => /** @type {HTMLButtonElement} */ ($(id));
/** @param {string} id */
export const $input = id => /** @type {HTMLInputElement} */ ($(id));

/**
 * Elemen terdekat dari target event yang cocok dengan selector, mis. tombol yang diketuk.
 * @param {Event} e
 * @param {string} selector
 * @returns {HTMLElement | null}
 */
export function closest(e, selector) {
  return e.target instanceof Element ? /** @type {HTMLElement | null} */ (e.target.closest(selector)) : null;
}

/** Amankan teks sebelum dimasukkan ke HTML. @param {unknown} s */
export const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[/** @type {"&"} */ (c)]);

/** Pengaturan "kurangi gerakan" di perangkat pemain sedang aktif */
export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
