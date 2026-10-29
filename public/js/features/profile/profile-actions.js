// Aksi di modal profil: simpan profil, ganti kata sandi, dan muat statistik.
import { $, $input, esc } from "../../core/dom.js";
import { player } from "../../core/state.js";
import { api, applyState } from "../../services/api.js";
import { toast } from "../../ui/toast.js";
import { showHello } from "../home/home.js";
import { loadBoard } from "../leaderboard/leaderboard.js";
import { drawProfileBtn } from "./avatar.js";

/** @param {unknown} e */
const message = e => e instanceof Error ? e.message : String(e);

/** Nama dan bio di bagian atas modal profil */
export function drawHead() {
  const p = player();
  $("pName").textContent = p.nick || p.username; $("pBioView").textContent = p.bio;
}

/** @param {HTMLButtonElement} btn @param {{ icon: string, color: string }} sel */
export async function saveProfile(btn, sel) {
  btn.disabled = true; $("pErr").textContent = "";
  try {
    applyState((await api("profile", { nickname: $input("pNick").value, bio: $input("pBio").value, avatar_icon: sel.icon, avatar_color: sel.color })).state);
    drawHead(); showHello(); drawProfileBtn(); loadBoard(); toast("Profil disimpan.");
  } catch (e) { $("pErr").textContent = message(e); }
  btn.disabled = false;
}

/** @param {HTMLButtonElement} btn */
export async function changePassword(btn) {
  const cur = $input("pCur").value, nw = $input("pNew").value;
  $("pPassErr").textContent = nw.length < 6 ? "Kata sandi baru minimal 6 karakter."
    : nw !== $input("pNew2").value ? "Ulangan kata sandi baru tidak sama." : "";
  if ($("pPassErr").textContent) return;
  btn.disabled = true;
  try {
    await api("password", { current: cur, new: nw });
    ["pCur", "pNew", "pNew2"].forEach(id => { $input(id).value = ""; });
    toast("Kata sandi berhasil diganti.");
  } catch (e) { $("pPassErr").textContent = message(e); }
  btn.disabled = false;
}

/** Bintang, level, peringkat, dan level sempurna dari server */
export function loadStats() {
  api("profile").then(d => {
    const box = document.getElementById("pStats");
    if (!box) return;   // modal sudah ditutup
    box.innerHTML = [[d.stars, "Bintang"], [d.levels, "Level"], [d.rank ? "#" + d.rank : "–", "Peringkat"], [d.perfect, "Sempurna"]]
      .map(([v, l]) => `<div><b>${esc(v)}</b><small>${l}</small></div>`).join("");
  }).catch(() => {});
}
