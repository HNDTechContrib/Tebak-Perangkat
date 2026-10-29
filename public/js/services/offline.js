// Layar "Koneksi terputus": muncul saat jaringan hilang, hilang lagi begitu server bisa dihubungi.
import { state } from "../core/state.js";
import { toast } from "../ui/toast.js";

/** @type {HTMLDivElement | undefined} */
let screen;
/** @type {ReturnType<typeof setTimeout> | undefined} */
let timer;
/** @type {(() => void)[]} */
let waiting = [];
let tries = 0;

/** Selesai seketika kalau tersambung, atau menunggu sampai tersambung lagi */
export const waitOnline = () => state.offline ? new Promise(r => { waiting.push(() => r(undefined)); }) : Promise.resolve();

/** @param {boolean} on */
export function setOffline(on) {
  if (state.offline === on) return;
  state.offline = on; clearTimeout(timer);
  if (screen) screen.hidden = !on;
  if (on) { if (document.activeElement instanceof HTMLElement) document.activeElement.blur(); timer = setTimeout(checkNet, 500); }
  else { waiting.splice(0).forEach(r => r()); toast("Koneksi tersambung kembali."); }
}

// Cek langsung ke server tiap 0,5 detik. Tidak menunggu navigator.onLine, karena di Android
// status itu sering baru berubah beberapa detik setelah jaringan sebenarnya sudah tersambung.
async function checkNet() {
  if (!state.offline) return;
  clearTimeout(timer);
  const id = ++tries;   // pengecekan lama yang masih menggantung diabaikan
  const ac = new AbortController(), stop = setTimeout(() => ac.abort(), 1500);   // jangan menunggu lebih dari 1,5 detik
  try {
    const res = await fetch(`css/base/tokens.css?ping=${Date.now()}`, { method: "HEAD", cache: "no-store", signal: ac.signal });
    if (res.ok) return setOffline(false);
  } catch (e) {}
  finally { clearTimeout(stop); }
  if (id === tries && state.offline) timer = setTimeout(checkNet, 500);
}

export function initOffline() {
  screen = document.createElement("div");
  screen.className = "net"; screen.hidden = !state.offline; screen.setAttribute("role", "alert");
  screen.innerHTML = `<div class="netbox"><div class="spin" aria-hidden="true"></div><h3>Koneksi terputus</h3>
  <p>Menunggu jaringan tersambung kembali…</p><small>Waktu level berhenti sementara. Progresmu aman.</small></div>`;
  document.body.appendChild(screen);
  addEventListener("offline", () => setOffline(true));
  addEventListener("online", checkNet);
  if (!navigator.onLine) setOffline(true);
}
