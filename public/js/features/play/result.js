// Hasil level: menang (bintang, koin, simpan progres) atau kalah.
import { LOGO } from "../../core/data.js";
import { $, esc } from "../../core/dom.js";
import { STAR } from "../../core/icons.js";
import { game, player, state } from "../../core/state.js";
import { LEVELS } from "../../questions/levels.js";
import { api, applyState } from "../../services/api.js";
import { confetti } from "../../ui/effects/confetti.js";
import { sfx } from "../../ui/effects/sound.js";
import { modal } from "../../ui/modal.js";
import { toast } from "../../ui/toast.js";
import { showHome } from "../home/home.js";
import { loadBoard } from "../leaderboard/leaderboard.js";
import { renderPlay, startLevel } from "./play.js";
import { stopTimer } from "./timer.js";

/** Tombol di modal hasil: level berikutnya, coba lagi, atau ke peta level. @param {string} a */
function onResult(a) {
  const g = game();
  if (a === "next") startLevel(g.i + 1);
  else if (a === "retry") startLevel(g.i);
  else showHome();
}

export async function win() {
  const g = game();
  g.done = true; stopTimer(); sfx("right");
  if (g.M.tiles) $("slots").classList.add("win");
  renderPlay();
  const slow = g.t < g.M.time / 3;
  const mistakes = g.M.guess ? Math.floor(g.miss / 2) : g.mistakes;   // tebak kata: tiap 2 huruf salah = -1 bintang
  let stars = Math.max(1, 3 - g.hints - mistakes - (slow ? 1 : 0)), reward = 0, replay = false, saved = true;
  const wait = new Promise(r => setTimeout(r, 450));
  try {
    await g.started;
    const r = await api("win", { level: g.i, stars });
    applyState(r.state); stars = r.stars; reward = r.reward; replay = r.replay; loadBoard();
  } catch (e) { saved = false; toast(e instanceof Error ? e.message : String(e)); }
  await wait;
  if (state.game !== g || $("play").hidden) return;
  const canNext = saved && g.i + 1 < LEVELS.length && g.i + 1 <= player().level;
  const tip = stars === 3 ? `Selesai dalam ${Math.round(g.M.time - g.t)} detik tanpa bantuan.`
    : `Untuk 3 bintang: tanpa bantuan, ${g.M.guess ? "maksimal 1 huruf salah" : g.M.type ? "tanpa salah ketik" : "tanpa salah pilih"}, dan sisa waktu minimal ${Math.round(g.M.time / 3)} detik.`;
  confetti(); if (saved) sfx("coin");
  modal(`<div class="stars">${[0, 1, 2].map(k => STAR(k < stars)).join("")}</div>
    <h3>Jawaban benar</h3>
    <p class="ans">${esc(g.L.reveal || g.L.w)}</p>
    <p>${tip}</p>
    ${saved ? `<span class="reward"><span class="coin">●</span>+${reward} koin</span>${replay ? `<p>Mengulang level memberi koin lebih sedikit. Setiap bintang baru menambah 5 koin.</p>` : ""}` : `<p>Progres belum tersimpan. Coba main level ini lagi.</p>`}
    <div class="mbtns">${canNext ? `<button class="btn" data-act="next" type="button">Level berikutnya</button>` : ""}
    <button class="btn ghost" data-act="home" type="button">Ke peta level</button></div>
    <img class="mlogo" src="${LOGO}" alt="HND Computer">`, onResult, { sticky: true });
}

/** @param {"time" | "lives" | "type" | "wrong"} why */
export function lose(why) {
  const L = game().L;
  const head = { time: "Waktu habis", lives: "Kesempatan habis", type: "Kesempatan habis", wrong: "Jawaban kurang tepat" }[why];
  const msg = { time: "Kamu kehabisan waktu di level ini.", lives: "Sudah 6 huruf salah.", type: "Sudah 3 kali salah ketik.", wrong: "Pernyataan tadi kurang tepat." }[why];
  modal(`<h3>${head}</h3>
    <p>${msg}</p>
    <p class="ans">Jawaban: ${esc(L.reveal || L.w)}</p>
    <p>Kamu bisa mencoba lagi dengan soal yang berbeda.</p>
    <div class="mbtns"><button class="btn" data-act="retry" type="button">Coba lagi</button>
    <button class="btn ghost" data-act="home" type="button">Ke peta level</button></div>`, onResult, { sticky: true });
}
