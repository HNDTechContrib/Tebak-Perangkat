// Bentuk data game. Hanya dipakai untuk pemeriksaan tipe (bun tsc --noEmit), tidak dimuat browser.

export type ModeKey = "susun" | "gambar" | "acak" | "pilgan" | "benar" | "kategori" | "singkatan" | "tebak";

export interface Mode {
  name: string;
  time: number;      // detik
  tiles?: boolean;   // susun huruf dari kotak huruf
  type?: boolean;    // ketik jawaban (tebak gambar)
  guess?: boolean;   // tebak huruf satu per satu (tebak kata)
}

/** Baris tabel devices: kata, kategori, petunjuk, foto, kredit foto, sumber foto */
export type BankRow = [string, string, string, string | null, string | null, string | null];
/** Baris tabel abbreviations: singkatan, kepanjangan */
export type AbbrRow = [string, string];

export interface Word {
  w: string;
  c: string;
  q: string;
  img?: string | null;
  credit?: string | null;
  src?: string | null;
}

export interface Theme {
  id: string;
  name: string;
  sky: string;
  deep: string;
  icons: string[];
  price: number;
}

export interface Player {
  username: string;
  nick: string;
  bio: string;
  avatar: string;
  color: string;
  joined: string;
  coins: number;
  level: number;
  stars: Record<string, number>;
  dailyClaimed: boolean;
  themes: string[];
  theme: string;
  mute: boolean;
}

export type Booster = "reveal" | "remove" | "fifty";

export interface Config {
  daily_coins: number;
  boosters: Record<Booster, number>;
  avatar_icons: string[];
  avatar_colors: string[];
}

/** Satu soal yang sedang dimainkan (hasil makeLevel) */
export interface Level {
  type: ModeKey;
  w: string;
  c: string;
  q: string;
  opts?: string[];
  ans?: number;
  reveal?: string;
  stmt?: string;
  pic?: string;
  peek?: string;
  pre?: number[];
}

export interface Tile { l: string; real: boolean; used: boolean; gone: boolean; fixed: boolean; }
export interface Slot { t: number | null; lk: boolean; }
export interface Option { text: string; off: boolean; wrong: boolean; cut: boolean; }

/** Keadaan level yang sedang dimainkan */
export interface PlayState {
  i: number;
  L: Level;
  M: Mode;
  hints: number;
  mistakes: number;
  t: number;
  done: boolean;
  lost: boolean;
  busy: boolean;
  paying: boolean;
  started: Promise<unknown>;
  A: string[];            // huruf jawaban tanpa spasi
  groups: number[];       // panjang tiap kata jawaban
  // pilihan jawaban
  opts: Option[];
  fifty: boolean;
  // susun huruf / huruf acak
  pool: Tile[];
  slots: Slot[];
  order: number[];
  removed: boolean;
  // tebak kata
  tried: Set<string>;
  miss: number;
  // tebak gambar
  shown: Set<number>;
  // tebak kata & tebak gambar
  lives: number;
}
