// Jumlah koin di pojok kanan atas (halaman utama dan layar level).
import { state } from "../core/state.js";

export function setCoins() {
  document.querySelectorAll(".cv").forEach(el => { el.textContent = String(state.player ? state.player.coins : 0); });
}
