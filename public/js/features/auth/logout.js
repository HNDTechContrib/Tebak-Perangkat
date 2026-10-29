// Konfirmasi keluar dari akun (dibuka dari profil).
import { api } from "../../services/api.js";
import { modal } from "../../ui/modal.js";
import { openProfile } from "../profile/profile-modal.js";

export function confirmLogout() {
  modal(`<h3>Keluar?</h3><p>Ingin keluar dari akun?</p>
    <div class="mbtns"><button class="btn" data-act="out" type="button">Keluar</button><button class="btn ghost" data-act="close" type="button">Batal</button></div>`, async a => {
    if (a === "close") return openProfile();
    try { await api("logout", {}); } catch (e) {}
    location.reload();
  });
}
