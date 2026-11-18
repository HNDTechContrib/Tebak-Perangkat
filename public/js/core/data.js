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

const TIME = 45;   // waktu tiap level (detik), sama untuk semua mode

/** @type {Record<ModeKey, Mode>} */
export const MODES = {
  susun:     { name: "Susun huruf",      time: TIME, tiles: true },
  gambar:    { name: "Tebak gambar",     time: TIME, type: true },
  acak:      { name: "Huruf acak",       time: TIME, tiles: true },
  pilgan:    { name: "Pilihan ganda",    time: TIME },
  benar:     { name: "Benar atau salah", time: TIME },
  kategori:  { name: "Cari kategori",    time: TIME },
  singkatan: { name: "Singkatan",        time: TIME },
  tebak:     { name: "Tebak kata",       time: TIME, guess: true },
};

export const SECTIONS = ["Pemula", "Pelajar", "Perakit PC", "Teknisi", "Ahli", "Master HND"];
export const PER_SECTION = 18;   // jumlah level per bagian peta
