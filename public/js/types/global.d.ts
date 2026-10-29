// Data yang ditulis PHP ke halaman (resources/views/game/scripts.php) sebagai window.GAME.
import type { AbbrRow, BankRow, Config, Player, Theme } from "./game";

declare global {
  interface Window {
    GAME: {
      bank: BankRow[];
      abbr: AbbrRow[];
      themes: Theme[];
      player: Player | null;
      cfg: Config;
    };
    webkitAudioContext?: typeof AudioContext;
  }
}

export {};
