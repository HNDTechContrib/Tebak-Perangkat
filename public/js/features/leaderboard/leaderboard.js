// Papan peringkat: 5 teratas di halaman utama dan daftar lengkap di modal.
import { $, esc } from "../../core/dom.js";
import { state } from "../../core/state.js";
import { api } from "../../services/api.js";
import { closeModal, modal } from "../../ui/modal.js";
import { avatar } from "../profile/avatar.js";
import { openProfile } from "../profile/profile-modal.js";

/** @typedef {{ name?: string, icon: string, color: string, levels: number, stars: number, rank?: number, me?: boolean }} Row */

/** @type {{ rows: Row[], me: (Row & { rank: number }) | null, total: number, ready: boolean, err: string }} */
const LB = { rows: [], me: null, total: 0, ready: false, err: "" };

export async function loadBoard() {
  try { Object.assign(LB, await api("leaderboard"), { ready: true, err: "" }); }
  catch (e) { LB.err = e instanceof Error ? e.message : String(e); }
  renderLB();
}

/** @param {Row} r @param {number} rank */
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
  /** Baris pemain sendiri di bawah, kalau peringkatnya di luar yang ditampilkan. @param {number} shown */
  const extra = shown => LB.me && LB.me.rank > shown ? rowHTML({ ...LB.me, me: true }, LB.me.rank) : "";
  $("lbTop").innerHTML = LB.rows.slice(0, 5).map((r, i) => rowHTML(r, i + 1)).join("") + extra(5);
  $("lbNote").textContent = msg;
  const full = document.getElementById("lbFull"), sub = document.getElementById("lbSub");
  if (full && sub) { full.innerHTML = LB.rows.map((r, i) => rowHTML(r, i + 1)).join("") + extra(LB.rows.length); sub.textContent = msg; }
}

function openBoard() {
  modal(`<h3>Papan peringkat</h3><p id="lbSub"></p><div class="lbscroll"><ol class="lb" id="lbFull"></ol></div>
    <div class="mbtns"><button class="btn ghost" data-act="close" type="button">Tutup</button>
    <button class="linkbtn" style="color:var(--sky-deep)" data-act="profile" type="button">Ubah nama dan avatar di profil</button></div>`, a => {
    if (a === "close") return closeModal();
    if (a === "profile") openProfile();
  }, { wide: true });
  renderLB(); loadBoard();
}

export function initLeaderboard() {
  $("lbAll").addEventListener("click", openBoard);
  // perbarui tiap 30 detik selama halaman utama terlihat
  setInterval(() => { if (state.player && !$("home").hidden && !document.hidden) loadBoard(); }, 30000);
}
