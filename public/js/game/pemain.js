// Data pemain dan komunikasi dengan server (api).

// ---------- data pemain (dari database lewat PHP; perubahan dikirim ke api.php) ----------
let P = window.GAME.player;
async function api(action, body) {
  const opt = body === undefined ? { headers: { "X-Requested-With": "fetch" } }
    : { method: "POST", headers: { "Content-Type": "application/json", "X-Requested-With": "fetch" }, body: JSON.stringify(body) };
  let res, data;
  for (;;) {   // jaringan putus: tampilkan layar koneksi terputus, lalu kirim ulang setelah tersambung
    try { res = await fetch(`api/${action}`, opt); break; }
    catch (e) { setOffline(true); await waitOnline(); }
  }
  try { data = await res.json(); }
  catch (e) { throw new Error("Tidak bisa terhubung ke server. Coba lagi."); }
  if (res.status === 401 && P) location.reload();
  if (!res.ok || data.error) throw new Error(data.error || "Terjadi kesalahan.");
  return data;
}
function applyState(s) { if (s) Object.assign(P, s); setCoins(); }
function setCoins() { document.querySelectorAll(".cv").forEach(el => el.textContent = P ? P.coins : 0); }

