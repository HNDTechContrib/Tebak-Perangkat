// Memasang tema yang dipilih pemain ke halaman (warna + pola latar) dan menyimpan pilihan ke server.
import { THEMES } from "../../core/data.js";
import { state } from "../../core/state.js";
import { api, applyState } from "../../services/api.js";
import { toast } from "../../ui/toast.js";
import { loadBoard } from "../leaderboard/leaderboard.js";
import { pattern } from "./pattern.js";

/** Tema dengan id ini, atau tema pertama kalau tidak ada. @param {string} id */
export const themeOf = id => THEMES.find(t => t.id === id) || /** @type {import("../../types/game").Theme} */ (THEMES[0]);

export function applyTheme() {
  const p = state.player, t = themeOf(p && p.themes.includes(p.theme) ? p.theme : "hnd"), r = document.documentElement.style;
  const pat = pattern(t.icons);
  if (r.getPropertyValue("--pat") === pat) return;
  r.setProperty("--sky", t.sky); r.setProperty("--sky-deep", t.deep); r.setProperty("--pat", pat);
  const b = document.body; b.classList.remove("swap"); void b.offsetWidth; b.classList.add("swap");   // pola baru memudar masuk
}

/** Beli (kalau belum punya) dan pakai tema. Hasil null kalau gagal. @param {string} id */
export async function chooseTheme(id) {
  try { const r = await api("theme", { id }); applyState(r.state); applyTheme(); loadBoard(); return r; }
  catch (e) { toast(e instanceof Error ? e.message : String(e)); return null; }
}
