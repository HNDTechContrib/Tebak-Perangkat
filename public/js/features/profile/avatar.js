// Avatar bulat pemain (ikon + warna) di papan peringkat, profil, dan tombol profil.
import { CFG } from "../../core/data.js";
import { $ } from "../../core/dom.js";
import { svgIcon } from "../../core/icons.js";
import { player } from "../../core/state.js";

/**
 * @param {string} icon @param {string} color
 * @param {string} [cls]  mis. "xl" untuk avatar besar di profil
 * @param {string} [id]
 */
export const avatar = (icon, color, cls = "", id = "") =>
  `<span class="av ${cls}" ${id ? `id="${id}"` : ""} style="background:${CFG.avatar_colors.includes(color) ? color : CFG.avatar_colors[0]}">${svgIcon(icon)}</span>`;

/** Avatar di tombol profil (kanan atas halaman utama) */
export function drawProfileBtn() {
  const p = player();
  $("profileBtn").innerHTML = avatar(p.avatar, p.color);
}
