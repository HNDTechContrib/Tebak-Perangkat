// Papan peringkat.

// ---------- papan peringkat (view leaderboard di database, lewat api.php) ----------
const LB = { rows: [], me: null, total: 0, ready: false, err: "" };
async function loadBoard() {
  try { Object.assign(LB, await api("leaderboard"), { ready: true, err: "" }); }
  catch (e) { LB.err = e.message; }
  renderLB();
}
setInterval(() => { if (P && !$("home").hidden && !document.hidden) loadBoard(); }, 30000);
const svgIcon = k => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PAT[k] || PAT.Pemroses}</svg>`;
const avatar = (icon, color, cls = "", id = "") => `<span class="av ${cls}" ${id ? `id="${id}"` : ""} style="background:${CFG.avatar_colors.includes(color) ? color : CFG.avatar_colors[0]}">${svgIcon(icon)}</span>`;
function rowHTML(r, rank) {
  const name = String(r.name || "Pemain");
  return `<li class="lbrow ${r.me ? "me" : ""}"><span class="rk ${rank <= 3 ? "r" + rank : ""}">${rank}</span>${avatar(r.icon, r.color)}
    <span class="nm"><b>${esc(name)}${r.me ? '<span class="you">kamu</span>' : ""}</b><small>${Number(r.levels) || 0} level selesai</small></span>
    <span class="sc"><i>★</i>${Number(r.stars) || 0}</span></li>`;
}
function renderLB() {
  const msg = LB.err ? "Peringkat sedang tidak bisa dimuat. Coba lagi nanti."
    : !LB.ready ? "Memuat peringkat…"
    : !LB.rows.length ? "Belum ada pemain di papan peringkat."
    : LB.me ? `Peringkatmu #${LB.me.rank} dari ${LB.total} pemain.`
    : "Selesaikan satu level agar namamu muncul di sini.";
  const extra = shown => LB.me && LB.me.rank > shown ? rowHTML({ ...LB.me, me: true }, LB.me.rank) : "";
  $("lbTop").innerHTML = LB.rows.slice(0, 5).map((r, i) => rowHTML(r, i + 1)).join("") + extra(5);
  $("lbNote").textContent = msg;
  if ($("lbFull")) { $("lbFull").innerHTML = LB.rows.map((r, i) => rowHTML(r, i + 1)).join("") + extra(LB.rows.length); $("lbSub").textContent = msg; }
}
function openBoard() {
  modal(`<h3>Papan peringkat</h3><p id="lbSub"></p><div class="lbscroll"><ol class="lb" id="lbFull"></ol></div>
    <div class="mbtns"><button class="btn ghost" data-act="close" type="button">Tutup</button>
    <button class="linkbtn" style="color:var(--sky-deep)" data-act="profile" type="button">Ubah nama dan avatar di profil</button></div>`, a => {
    if (a === "close") return closeModal();
    if (a === "profile") openProfile();
  }, true);
  renderLB(); loadBoard();
}
$("lbAll").onclick = openBoard;

