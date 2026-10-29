// Pengecoh untuk kepanjangan singkatan: kata yang bunyinya mirip, tapi bukan istilah yang benar.
import { rnd, shuffle } from "../../core/random.js";

/** @type {Record<string, string[]>} */
const NEAR = {
  Central: ["Centre", "Centric", "Centralized"], Processing: ["Processor", "Process", "Processed"], Unit: ["Units", "Union", "Unity"],
  Graphics: ["Graphic", "Graphical"], Random: ["Randomized", "Rapid"], Access: ["Accessed", "Accessible"], Memory: ["Memories", "Module"],
  Read: ["Ready", "Reader"], Only: ["Online", "Once"], Solid: ["Solidity", "Solar"], State: ["Static", "Stated"], Drive: ["Driver", "Drives"],
  Hard: ["Hardware", "Heavy"], Disk: ["Disc", "Desk"], Universal: ["Unified", "Universe"], Serial: ["Series", "Signal"], Bus: ["Base", "Bridge"],
  Local: ["Logical", "Location"], Area: ["Access", "Array"], Network: ["Networking", "Net"], Wide: ["World", "Wireless"],
  Power: ["Powered", "Port"], Supply: ["Support", "Supplier"], Uninterruptible: ["Uninterrupted", "Interruptible"],
  Liquid: ["Liquified", "Light"], Crystal: ["Crystalline", "Crystals"], Display: ["Displayed", "Device"], Light: ["Lite", "Lighting"],
  Emitting: ["Emission", "Emitted"], Diode: ["Device", "Diodes"], High: ["Higher", "Hyper"], Definition: ["Defined", "Density"],
  Multimedia: ["Multi Media", "Multiple"], Interface: ["Interfacing", "Integration"], Video: ["Visual", "Vector"], Array: ["Adapter", "Area"],
  Basic: ["Base", "Binary"], Input: ["Inner", "Internal"], Output: ["Outer", "Operating"], System: ["Systems", "Service"],
  Card: ["Chip", "Cable"], Attached: ["Attachment", "Associated"], Storage: ["Store", "Storing"], Digital: ["Digit", "Data"],
  Versatile: ["Video", "Virtual"], Disc: ["Disk", "Disco"], Closed: ["Close", "Clear"], Circuit: ["Circle", "Circus"],
  Television: ["Telecast", "Telecom"], Dots: ["Dot", "Data"], Per: ["Pre", "Pro"], Inch: ["Inches", "Index"], Frames: ["Frame", "Fragment"],
  Second: ["Seconds", "Secure"], Revolutions: ["Rotations", "Revolution"], Minute: ["Minutes", "Monitor"], Advanced: ["Advance", "Adaptive"],
  Technology: ["Technical", "Technique"], Attachment: ["Attached", "Attach"],
};

/** Ganti satu kata dengan kata mirip, atau tambah/hapus akhiran "s". @param {string} w */
const alt = w => { const n = NEAR[w]; return n ? n[rnd(n.length)] || w : /s$/.test(w) ? w.slice(0, -1) : w + "s"; };

/**
 * "Central Processing Unit" -> "Central Processor Unit", "Centre Processing Units", ...
 * @param {string} f  kepanjangan yang benar
 * @param {number} n  jumlah pengecoh yang dicari
 */
export function nearExpansions(f, n) {
  const words = f.split(" "), seen = new Set([f.toLowerCase()]), out = [];
  for (let tries = 0; out.length < n && tries < 80; tries++) {
    const a = words.slice();
    shuffle([...a.keys()]).slice(0, Math.random() < 0.75 ? 1 : 2).forEach(i => { a[i] = alt(a[i] || ""); });
    const v = a.join(" ");
    if (!seen.has(v.toLowerCase())) { seen.add(v.toLowerCase()); out.push(v); }
  }
  return out;
}
