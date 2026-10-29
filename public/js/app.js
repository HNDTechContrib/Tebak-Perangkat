// Titik masuk game di browser. Satu-satunya script di halaman (<script type="module">);
// file lain dimuat lewat import. Data dari server ada di window.GAME (resources/views/game/scripts.php).
import { LOGO } from "./core/data.js";
import { state } from "./core/state.js";
import { initOffline } from "./services/offline.js";
import { initSound } from "./ui/effects/sound.js";
import { initAuth, showAuth } from "./features/auth/auth-form.js";
import { initProfile } from "./features/profile/profile-modal.js";
import { initHome, showHome } from "./features/home/home.js";
import { initMap } from "./features/home/level-map.js";
import { initDaily } from "./features/home/daily-reward.js";
import { initLeaderboard, loadBoard } from "./features/leaderboard/leaderboard.js";
import { applyTheme } from "./features/themes/apply-theme.js";
import { initThemes } from "./features/themes/theme-shop.js";
import { initPlay } from "./features/play/play.js";
import { initBoosters } from "./features/play/boosters.js";
import { initKeyboard } from "./features/play/keyboard.js";
import { initTiles } from "./features/play/modes/tiles.js";
import { initGuess } from "./features/play/modes/guess.js";
import { initType } from "./features/play/modes/type.js";
import { initChoices } from "./features/play/modes/choices.js";

// pasang semua tombol dan event
initAuth(); initProfile(); initHome(); initMap(); initDaily(); initLeaderboard(); initThemes();
initPlay(); initBoosters(); initKeyboard(); initTiles(); initGuess(); initType(); initChoices();
initSound(); applyTheme(); initOffline();

document.addEventListener("touchstart", () => {}, { passive: true });   // agar animasi tekan (:active) juga jalan di Safari iPhone
document.addEventListener("contextmenu", e => {                          // tekan lama tombol: tanpa menu browser
  if (e.target instanceof Element && e.target.closest("button")) e.preventDefault();
});
document.querySelectorAll("img.logo").forEach(img => { if (img instanceof HTMLImageElement) img.src = LOGO; });

if (state.player) { showHome(); loadBoard(); } else showAuth();
