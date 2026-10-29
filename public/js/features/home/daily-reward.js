// Hadiah harian di halaman utama.
import { DAILY } from "../../core/data.js";
import { $, $btn } from "../../core/dom.js";
import { player } from "../../core/state.js";
import { api, applyState } from "../../services/api.js";
import { confetti } from "../../ui/effects/confetti.js";
import { sfx } from "../../ui/effects/sound.js";
import { toast } from "../../ui/toast.js";
import { showHome } from "./home.js";

export function drawDaily() {
  const claimed = player().dailyClaimed, btn = $btn("dailyBtn");
  btn.disabled = claimed;
  btn.textContent = claimed ? "Sudah" : "Ambil";
  $("dailyTxt").textContent = claimed ? "Kembali lagi besok untuk hadiah berikutnya." : `Hadiah hari ini: ${DAILY} koin.`;
}

export function initDaily() {
  const btn = $btn("dailyBtn");
  btn.addEventListener("click", async () => {
    if (player().dailyClaimed || btn.disabled) return;
    btn.disabled = true;
    try {
      const r = await api("daily", {});
      applyState(r.state); sfx("coin"); confetti(btn); toast(`+${r.amount} koin ditambahkan.`);
    } catch (err) { toast(err instanceof Error ? err.message : String(err)); }
    showHome();
  });
}
