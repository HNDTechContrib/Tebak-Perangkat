// Angka dan urutan acak.

/** Bilangan bulat acak 0 sampai n-1. @param {number} n */
export const rnd = n => Math.floor(Math.random() * n);

/**
 * Salinan array dengan urutan diacak (Fisher–Yates).
 * @template T
 * @param {readonly T[]} list
 * @returns {T[]}
 */
export function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [/** @type {T} */ (a[j]), /** @type {T} */ (a[i])];
  }
  return a;
}
