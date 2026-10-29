// Layar koneksi terputus.

// ---------- layar koneksi terputus ----------
let OFFLINE = false, netT, netWait = [];
const net = document.createElement("div");
net.className = "net"; net.hidden = true; net.setAttribute("role", "alert");
net.innerHTML = `<div class="netbox"><div class="spin" aria-hidden="true"></div><h3>Koneksi terputus</h3>
  <p>Menunggu jaringan tersambung kembali…</p><small>Waktu level berhenti sementara. Progresmu aman.</small></div>`;
document.body.appendChild(net);
const waitOnline = () => OFFLINE ? new Promise(r => netWait.push(r)) : Promise.resolve();
function setOffline(on) {
  if (OFFLINE === on) return;
  OFFLINE = on; net.hidden = !on; clearTimeout(netT);
  if (on) { document.activeElement?.blur?.(); netT = setTimeout(checkNet, 500); }
  else { netWait.splice(0).forEach(r => r()); toast("Koneksi tersambung kembali."); }
}
let netTry = 0;
// Cek langsung ke server tiap 0,5 detik. Tidak menunggu navigator.onLine, karena di Android
// status itu sering baru berubah beberapa detik setelah jaringan sebenarnya sudah tersambung.
async function checkNet() {
  if (!OFFLINE) return;
  clearTimeout(netT);
  const id = ++netTry;   // pengecekan lama yang masih menggantung diabaikan
  const ac = new AbortController(), stop = setTimeout(() => ac.abort(), 1500);   // jangan menunggu lebih dari 1,5 detik
  try { if ((await fetch(`css/game/dasar.css?ping=${Date.now()}`, { method: "HEAD", cache: "no-store", signal: ac.signal })).ok) return setOffline(false); }
  catch (e) {}
  finally { clearTimeout(stop); }
  if (id === netTry && OFFLINE) netT = setTimeout(checkNet, 500);
}
addEventListener("offline", () => setOffline(true));
addEventListener("online", checkNet);
if (!navigator.onLine) setOffline(true);
