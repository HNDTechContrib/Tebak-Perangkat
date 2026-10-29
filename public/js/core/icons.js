// Ikon SVG: ikon kategori perangkat, ikon pola tema/avatar, bintang, gembok, centang.

/** Ikon kategori perangkat (nama kategori = kolom devices.category) @type {Record<string, string>} */
export const ICON = {
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

/** Ikon untuk pola latar tema dan avatar (nama ikon = config/game.php avatar_icons) @type {Record<string, string>} */
export const PAT = {
  ...ICON,
  mouse: '<rect x="6" y="3" width="12" height="18" rx="6"/><path d="M12 7v3"/>',
  cursor: '<path d="M5 3l14 7-6 2-2 6z"/>',
  code: '<path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16"/>',
  circuit: '<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><circle cx="19" cy="5" r="2"/><path d="M7 5h5l5 5v7M19 7v1"/>',
  gamepad: '<path d="M6 8h12a4 4 0 0 1 4 4v2a3 3 0 0 1-5.4 1.8L15 14H9l-1.6 1.8A3 3 0 0 1 2 14v-2a4 4 0 0 1 4-4z"/><path d="M7 11v3M5.5 12.5h3M16 11.5h.01M18 13h.01"/>',
  headphone: '<path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="6" rx="1.5"/><rect x="17" y="14" width="4" height="6" rx="1.5"/>',
  star: '<path d="M12 4l2.2 4.6 5 .7-3.6 3.5.9 5L12 15.4l-4.5 2.4.9-5L4.8 9.3l5-.7z"/>',
  wrench: '<path d="M15 4a5 5 0 0 0-4.6 6.9L4 17.3V20h2.7l6.4-6.4A5 5 0 0 0 20 9l-3 1-2-2 1-3z"/>',
  server: '<rect x="4" y="3" width="16" height="7" rx="1.5"/><rect x="4" y="14" width="16" height="7" rx="1.5"/><path d="M8 6.5h.01M8 17.5h.01M12 6.5h4M12 17.5h4"/>',
};

/** SVG garis 24×24 dari isi path. @param {string | undefined} body */
const svg24 = body => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;

/** Ikon kategori perangkat. @param {string} category */
export const icon = category => svg24(ICON[category]);
/** Ikon avatar / pola; ikon yang tidak dikenal diganti ikon prosesor. @param {string} name */
export const svgIcon = name => svg24(PAT[name] || PAT.Pemroses);

/** Bintang hasil level, kuning kalau didapat. @param {boolean} on */
export const STAR = on => `<svg viewBox="0 0 24 24" class="${on ? "on" : ""}" aria-hidden="true"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" fill="${on ? "#ffd23f" : "#e3ecec"}" stroke="${on ? "#dba300" : "#c8d6d5"}" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
export const LOCK = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';
export const CHECK = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
