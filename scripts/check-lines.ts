// Memastikan tidak ada file kode yang lebih dari 250 baris.
// Jalankan: bun run check:lines
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const MAX = 250;
const ROOT = join(import.meta.dir, "..");
const FOLDERS = ["app", "bootstrap", "config", "database", "public", "resources", "routes", "scripts"];
const EXT = /\.(js|ts|css|php)$/;

function* files(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* files(path);
    else if (EXT.test(name)) yield path;
  }
}

const rows = FOLDERS.flatMap(f => [...files(join(ROOT, f))])
  .map(path => ({ path: relative(ROOT, path).replaceAll("\\", "/"), lines: readFileSync(path, "utf8").split("\n").length }))
  .sort((a, b) => b.lines - a.lines);
const over = rows.filter(r => r.lines > MAX);

console.log(`${rows.length} file diperiksa. Terbesar:`);
for (const r of rows.slice(0, 5)) console.log(`  ${String(r.lines).padStart(4)}  ${r.path}`);
if (over.length) {
  console.error(`\n${over.length} file lebih dari ${MAX} baris:`);
  for (const r of over) console.error(`  ${r.lines}  ${r.path}`);
  process.exit(1);
}
console.log(`\nSemua file maksimal ${MAX} baris.`);
