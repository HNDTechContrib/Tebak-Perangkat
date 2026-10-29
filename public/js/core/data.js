// Data dari server (window.GAME, diisi PHP) dan aturan tetap permainan.
/** @import { Mode, ModeKey } from "../types/game" */

export const GAME = window.GAME;
export const LOGO = "images/logo-hnd-computer.webp";

// Soal, singkatan, dan tema diambil dari database (tabel devices, abbreviations, themes)
export const BANK = GAME.bank;
export const ABBR = GAME.abbr;
export const THEMES = GAME.themes;
export const CFG = GAME.cfg;
export const COST = CFG.boosters;          // harga booster: reveal, remove, fifty
export const DAILY = CFG.daily_coins;      // koin hadiah harian

/** @type {Record<ModeKey, Mode>} */
export const MODES = {
  susun:     { name: "Susun huruf",      time: 90, tiles: true },
  gambar:    { name: "Tebak gambar",     time: 60, type: true },
  acak:      { name: "Huruf acak",       time: 75, tiles: true },
  pilgan:    { name: "Pilihan ganda",    time: 30 },
  benar:     { name: "Benar atau salah", time: 20 },
  kategori:  { name: "Cari kategori",    time: 30 },
  singkatan: { name: "Singkatan",        time: 30 },
  tebak:     { name: "Tebak kata",       time: 90, guess: true },
};

export const SECTIONS = ["Pemula", "Pelajar", "Perakit PC", "Teknisi", "Ahli", "Master HND"];
export const PER_SECTION = 18;   // jumlah level per bagian peta
