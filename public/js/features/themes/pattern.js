// Pola ikon latar tema (gambar SVG berulang) dan contoh warnanya di toko tema.
/** @import { Theme } from "../../types/game" */
import { PAT } from "../../core/icons.js";

const POS = [[10, 12, -14], [76, 8, 10], [44, 52, 6], [8, 86, 12], [82, 78, -8]];

/** Nilai CSS background-image untuk pola dari daftar ikon tema. @param {string[]} icons */
export function pattern(icons) {
  const g = POS.map(([x, y, r], k) => `<g transform="translate(${x} ${y}) rotate(${r} 12 12) scale(1.15)">${PAT[icons[k % icons.length] || ""]}</g>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><g fill="none" stroke="#fff" stroke-opacity=".2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${g}</g></svg>`;
  return `url('data:image/svg+xml,${encodeURIComponent(svg)}')`;
}

/** Style inline kotak contoh tema. @param {Theme} t */
export const swatch = t => `background-color:${t.sky};background-image:${pattern(t.icons)}`;
