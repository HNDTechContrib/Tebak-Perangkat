// Keadaan yang dipakai bersama banyak file: data pemain, level yang sedang dimainkan, dan status koneksi.
// Disimpan dalam satu objek karena nilai yang di-import tidak bisa diganti langsung dari file lain.
/** @import { Player, PlayState } from "../types/game" */

export const state = {
  /** @type {Player | null} */ player: window.GAME.player,
  /** @type {PlayState | null} */ game: null,
  offline: false,
};

/** Data pemain yang sudah masuk. Hanya dipanggil dari layar yang butuh login. */
export function player() {
  if (!state.player) throw new Error("Pemain belum masuk.");
  return state.player;
}

/** Level yang sedang dimainkan. Hanya dipanggil dari layar level. */
export function game() {
  if (!state.game) throw new Error("Belum ada level yang dimainkan.");
  return state.game;
}
