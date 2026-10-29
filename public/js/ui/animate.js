// Memutar ulang animasi CSS yang dipasang lewat class.

/** @type {WeakMap<Element, Record<string, ReturnType<typeof setTimeout>>>} */
const timers = new WeakMap();

/**
 * Lepas class, paksa reflow, pasang lagi, lalu lepas setelah selesai agar animasi lain tetap jalan.
 * @param {HTMLElement} el
 * @param {string} cls
 * @param {number} [ms]
 */
export function animate(el, cls, ms = 800) {
  el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls);
  const t = timers.get(el) || {};
  clearTimeout(t[cls]);
  t[cls] = setTimeout(() => el.classList.remove(cls), ms);
  timers.set(el, t);
}

/** Getar sekali (jawaban salah). Class tetap terpasang seperti sebelumnya. @param {HTMLElement} el */
export function shake(el) {
  el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake");
}
