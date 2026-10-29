// Komunikasi dengan server PHP (routes/web.php, alamat api/...).
/** @import { Player } from "../types/game" */
import { state } from "../core/state.js";
import { setCoins } from "../ui/coins.js";
import { setOffline, waitOnline } from "./offline.js";

/**
 * Panggil api/<action>. Tanpa body = GET, dengan body = POST JSON.
 * Kalau jaringan putus, layar koneksi terputus muncul dan permintaan dikirim ulang setelah tersambung.
 * @param {string} action
 * @param {object} [body]
 * @returns {Promise<any>}
 */
export async function api(action, body) {
  /** @type {RequestInit} */
  const opt = body === undefined ? { headers: { "X-Requested-With": "fetch" } }
    : { method: "POST", headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" }, body: JSON.stringify(body) };
  /** @type {Response} */
  let res;
  for (;;) {
    try { res = await fetch(`api/${action}`, opt); break; }
    catch (e) { setOffline(true); await waitOnline(); }
  }
  let data;
  try { data = await res.json(); }
  catch (e) { throw new Error("Tidak bisa terhubung ke server. Coba lagi."); }
  if (res.status === 401 && state.player) location.reload();
  if (!res.ok || data.error) throw new Error(data.error || "Terjadi kesalahan.");
  return data;
}

/** Perbarui data pemain dari jawaban server, lalu jumlah koin di layar. @param {Partial<Player>} [s] */
export function applyState(s) {
  if (s && state.player) Object.assign(state.player, s);
  setCoins();
}
