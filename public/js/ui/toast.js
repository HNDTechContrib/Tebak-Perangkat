// Pesan singkat di bawah layar yang hilang sendiri.

/** @type {ReturnType<typeof setTimeout> | undefined} */
let timer;

/** @param {string} msg */
export function toast(msg) {
  document.querySelectorAll(".toast").forEach(n => n.remove());
  const t = document.createElement("div");
  t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
  document.body.appendChild(t);
  clearTimeout(timer); timer = setTimeout(() => t.remove(), 2400);
}
