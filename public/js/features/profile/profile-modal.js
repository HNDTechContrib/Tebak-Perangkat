// Modal profil: data pemain, ubah profil (nama, bio, avatar), ganti kata sandi, keluar.
import { CFG } from "../../core/data.js";
import { $, esc } from "../../core/dom.js";
import { svgIcon } from "../../core/icons.js";
import { player } from "../../core/state.js";
import { closeModal, modal } from "../../ui/modal.js";
import { confirmLogout } from "../auth/logout.js";
import { avatar } from "./avatar.js";
import { changePassword, drawHead, loadStats, saveProfile } from "./profile-actions.js";

/** @param {string} d  tanggal "YYYY-MM-DD" */
const fmtDate = d => d ? new Date(d + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "";

/** @param {{ icon: string, color: string }} sel */
function html(sel) {
  const p = player();
  return `<div class="phead">${avatar(p.avatar, p.color, "xl", "pAv")}<div><h3 id="pName"></h3><p>@${esc(p.username)} · bergabung ${fmtDate(p.joined)}</p><p class="bio" id="pBioView"></p></div></div>
    <div class="pstats" id="pStats">${["Bintang", "Level", "Peringkat", "Sempurna"].map(l => `<div><b>–</b><small>${l}</small></div>`).join("")}</div>
    <div class="tabs" role="tablist"><button type="button" role="tab" data-act="tab" data-v="edit">Ubah profil</button><button type="button" role="tab" data-act="tab" data-v="pass">Kata sandi</button></div>
    <div class="aform" id="pEdit">
      <label>Nama tampilan<input id="pNick" maxlength="16" value="${esc(p.nick)}" placeholder="${esc(p.username)}"></label>
      <label>Bio singkat <small>(opsional)</small><input id="pBio" maxlength="80" value="${esc(p.bio)}" placeholder="Ceritakan sedikit tentang dirimu"></label>
      <span class="plbl">Ikon avatar</span>
      <div class="picks">${CFG.avatar_icons.map(k => `<button type="button" class="pick ${k === sel.icon ? "on" : ""}" data-act="icon" data-v="${k}" aria-label="Ikon ${k}">${svgIcon(k)}</button>`).join("")}</div>
      <span class="plbl">Warna avatar</span>
      <div class="picks colors">${CFG.avatar_colors.map(c => `<button type="button" class="pick dot ${c === sel.color ? "on" : ""}" data-act="color" data-v="${c}" style="background:${c}" aria-label="Warna ${c}"></button>`).join("")}</div>
      <p class="aerr" id="pErr" role="alert"></p>
      <button class="btn green" data-act="save" type="button">Simpan profil</button>
    </div>
    <div class="aform" id="pPass" hidden>
      <label>Kata sandi sekarang<input id="pCur" type="password" autocomplete="current-password"></label>
      <label>Kata sandi baru <small>(minimal 6 karakter)</small><input id="pNew" type="password" autocomplete="new-password"></label>
      <label>Ulangi kata sandi baru<input id="pNew2" type="password" autocomplete="new-password"></label>
      <p class="aerr" id="pPassErr" role="alert"></p>
      <button class="btn green" data-act="pass" type="button">Ganti kata sandi</button>
    </div>
    <div class="mbtns"><button class="btn ghost" data-act="close" type="button">Tutup</button>
    <button class="linkbtn" data-act="logout" type="button">Keluar dari akun</button></div>`;
}

/** @param {string} v  "edit" atau "pass" */
function setTab(v) {
  document.querySelectorAll('[data-act="tab"]').forEach(b => {
    const on = b instanceof HTMLElement && b.dataset.v === v;
    b.classList.toggle("on", on); b.setAttribute("aria-selected", String(on));
  });
  $("pEdit").hidden = v !== "edit"; $("pPass").hidden = v !== "pass";
}

/** @param {"edit" | "pass"} [tab] */
export function openProfile(tab = "edit") {
  const p = player(), sel = { icon: p.avatar, color: p.color };
  modal(html(sel), async (a, el) => {
    if (a === "close") return closeModal();
    if (a === "logout") return confirmLogout();
    if (a === "tab") return setTab(el.dataset.v || "edit");
    if (a === "icon" || a === "color") {
      sel[a] = el.dataset.v || "";
      el.parentElement?.querySelectorAll(".pick").forEach(b => b.classList.toggle("on", b === el));
      $("pAv").outerHTML = avatar(sel.icon, sel.color, "xl", "pAv");
      return;
    }
    if (!(el instanceof HTMLButtonElement) || el.disabled) return;
    if (a === "save") await saveProfile(el, sel);
    if (a === "pass") await changePassword(el);
  }, { wide: true });
  setTab(tab); drawHead(); loadStats();
}

export function initProfile() {
  $("profileBtn").addEventListener("click", () => openProfile());
}
