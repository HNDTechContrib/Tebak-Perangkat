// Halaman masuk / daftar.
import { $, $btn } from "../../core/dom.js";
import { api } from "../../services/api.js";

/** @type {"login" | "register"} */
let mode = "login";
const form = () => /** @type {HTMLFormElement} */ ($("authForm"));
/** @param {string} name */
const field = name => /** @type {HTMLInputElement} */ (form().elements.namedItem(name));

/** @param {"login" | "register"} m */
function setMode(m) {
  mode = m;
  document.querySelectorAll("[data-tab]").forEach(b => {
    const on = b instanceof HTMLElement && b.dataset.tab === m;
    b.classList.toggle("on", on); b.setAttribute("aria-selected", String(on));
  });
  $("nickRow").hidden = m !== "register";
  $btn("authBtn").textContent = m === "login" ? "Masuk" : "Daftar";
  field("password").setAttribute("autocomplete", m === "login" ? "current-password" : "new-password");
  $("authErr").textContent = "";
}

export function showAuth() {
  $("home").hidden = $("play").hidden = true; $("auth").hidden = false;
  setMode("login");
}

export function initAuth() {
  document.querySelectorAll("[data-tab]").forEach(b => b.addEventListener("click", () => {
    setMode(b instanceof HTMLElement && b.dataset.tab === "register" ? "register" : "login");
  }));
  form().addEventListener("submit", async e => {
    e.preventDefault();
    const btn = $btn("authBtn");
    btn.disabled = true; $("authErr").textContent = "";
    try {
      await api(mode, { username: field("username").value.trim(), password: field("password").value, nickname: field("nickname").value });
      location.reload();
    } catch (err) { $("authErr").textContent = err instanceof Error ? err.message : String(err); btn.disabled = false; }
  });
}
