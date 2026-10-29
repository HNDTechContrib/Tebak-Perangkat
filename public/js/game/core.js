// Dasar: data dari server (window.GAME), aturan mode, dan fungsi bantu kecil.

const LOGO = "images/logo-hnd-computer.webp";
// Soal, singkatan, dan tema diambil dari database (tabel devices, abbreviations, themes)
const BANK = window.GAME.bank;
const ABBR = window.GAME.abbr;
const ICON = {
  Input: '<rect x="3" y="7" width="18" height="11" rx="2"/><path d="M7 11h.01M10 11h.01M13 11h.01M16 11h.01M8 14.5h8"/>',
  Output: '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M9 20h6M12 16v4"/>',
  Pemroses: '<rect x="7" y="7" width="10" height="10" rx="1.5"/><path d="M10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  Pendingin: '<circle cx="12" cy="12" r="9"/><path d="M12 12c0-4 3-5 4-3s-1 3-4 3zm0 0c-4 0-5-3-3-4s3 1 3 4zm0 0c0 4-3 5-4 3s1-3 4-3zm0 0c4 0 5 3 3 4s-3-1-3-4z"/>',
  Daya: '<path d="M13 2 5 14h6l-1 8 8-12h-6z"/>',
  Rangka: '<rect x="6" y="2" width="12" height="20" rx="2"/><path d="M9 6h6M9 9h6M12 17h.01"/>',
  Penyimpanan: '<ellipse cx="12" cy="6" rx="8" ry="3"/><path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  Port: '<path d="M9 2v5M15 2v5"/><path d="M6 7h12v4a6 6 0 0 1-12 0z"/><path d="M12 17v5"/>',
  Jaringan: '<path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0"/><circle cx="12" cy="19.5" r="1"/>',
  Singkatan: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M6.5 15l2-6 2 6M7.2 13h2.6M13.5 9h4M13.5 12h4M13.5 15h4"/>',
};
const MODES = {
  susun:     { name: "Susun huruf",      time: 90, tiles: true },
  gambar:    { name: "Tebak gambar",     time: 60, type: true },
  acak:      { name: "Huruf acak",       time: 75, tiles: true },
  pilgan:    { name: "Pilihan ganda",    time: 30 },
  benar:     { name: "Benar atau salah", time: 20 },
  kategori:  { name: "Cari kategori",    time: 30 },
  singkatan: { name: "Singkatan",        time: 30 },
  tebak:     { name: "Tebak kata",       time: 90, guess: true },
};
const SECTIONS = ["Pemula", "Pelajar", "Perakit PC", "Teknisi", "Ahli", "Master HND"];
const PER_SECTION = 18;
const CFG = window.GAME.cfg;
const COST_REVEAL = CFG.boosters.reveal, COST_REMOVE = CFG.boosters.remove, COST_FIFTY = CFG.boosters.fifty, DAILY = CFG.daily_coins;

const $ = id => document.getElementById(id);
const rnd = n => Math.floor(Math.random() * n);
const shuffle = (a, r = Math.random) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const icon = c => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICON[c]}</svg>`;
const STAR = on => `<svg viewBox="0 0 24 24" class="${on ? "on" : ""}" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="${on ? "#ffd23f" : "#e3ecec"}" stroke="${on ? "#dba300" : "#c8d6d5"}" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
const LOCK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

