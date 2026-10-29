// Masuk, daftar, keluar, dan profil.

// ---------- masuk / daftar / keluar ----------
let authMode = "login";
function setAuthMode(m) {
  authMode = m;
  document.querySelectorAll("[data-tab]").forEach(b => { b.classList.toggle("on", b.dataset.tab === m); b.setAttribute("aria-selected", b.dataset.tab === m); });
  $("nickRow").hidden = m !== "register";
  $("authBtn").textContent = m === "login" ? "Masuk" : "Daftar";
  $("authForm").elements.password.setAttribute("autocomplete", m === "login" ? "current-password" : "new-password");
  $("authErr").textContent = "";
}
document.querySelectorAll("[data-tab]").forEach(b => b.onclick = () => setAuthMode(b.dataset.tab));
$("authForm").addEventListener("submit", async e => {
  e.preventDefault();
  const f = e.currentTarget.elements, btn = $("authBtn");
  btn.disabled = true; $("authErr").textContent = "";
  try { await api(authMode, { username: f.username.value.trim(), password: f.password.value, nickname: f.nickname.value }); location.reload(); }
  catch (err) { $("authErr").textContent = err.message; btn.disabled = false; }
});
function showAuth() { $("home").hidden = $("play").hidden = true; $("auth").hidden = false; setAuthMode("login"); }
function showHello() { $("hello").textContent = "Halo Smart User!"; }
function confirmLogout() {
  modal(`<h3>Keluar?</h3><p>Ingin keluar dari akun?</p>
    <div class="mbtns"><button class="btn" data-act="out" type="button">Keluar</button><button class="btn ghost" data-act="close" type="button">Batal</button></div>`, async a => {
    if (a === "close") return openProfile();
    try { await api("logout", {}); } catch (e) {}
    location.reload();
  });
}
const fmtDate = d => d ? new Date(d + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "";
function drawProfileBtn() { $("profileBtn").innerHTML = avatar(P.avatar, P.color); }
function openProfile(tab = "edit") {
  const sel = { icon: P.avatar, color: P.color };
  modal(`<div class="phead">${avatar(P.avatar, P.color, "xl", "pAv")}<div><h3 id="pName"></h3><p>@${esc(P.username)} · bergabung ${fmtDate(P.joined)}</p><p class="bio" id="pBioView"></p></div></div>
    <div class="pstats" id="pStats">${["Bintang", "Level", "Peringkat", "Sempurna"].map(l => `<div><b>–</b><small>${l}</small></div>`).join("")}</div>
    <div class="tabs" role="tablist"><button type="button" role="tab" data-act="tab" data-v="edit">Ubah profil</button><button type="button" role="tab" data-act="tab" data-v="pass">Kata sandi</button></div>
    <div class="aform" id="pEdit">
      <label>Nama tampilan<input id="pNick" maxlength="16" value="${esc(P.nick)}" placeholder="${esc(P.username)}"></label>
      <label>Bio singkat <small>(opsional)</small><input id="pBio" maxlength="80" value="${esc(P.bio)}" placeholder="Ceritakan sedikit tentang dirimu"></label>
      <span class="plbl">Ikon avatar</span>
      <div class="picks">${CFG.avatar_icons.map(k => `<button type="button" class="pick ${k === sel.icon ? "on" : ""}" data-act="icon" data-v="${k}" aria-label="Ikon ${k}">${svgIcon(k)}</button>`).join("")}</div>
      <span class="plbl">Warna avatar</span>
      <div class="picks colors">${CFG.avatar_colors.map(c => `<button type="button" class="pick dot ${c === sel.color ? "on" : ""}" data-act="color" data-v="${c}" style="background:${c}" aria-label="Warna ${c}"></button>`).join("")}</div>
      <p class="aerr" id="pErr" role="alert"></p>
      <button class="btn green" data-act="save" type="button">Simpan profil</button>
    </div>
    <div class="aform" id="pPass" hidden>
      <label>Kata sandi sekarang<input id="pCur" type="password" autocomplete="current-password"></label>
      <label>Kata sandi baru <small>(minimal 6 karakter)</small><input id="pNew" type="password" autocomplete="new-password"></label>
      <label>Ulangi kata sandi baru<input id="pNew2" type="password" autocomplete="new-password"></label>
      <p class="aerr" id="pPassErr" role="alert"></p>
      <button class="btn green" data-act="pass" type="button">Ganti kata sandi</button>
    </div>
    <div class="mbtns"><button class="btn ghost" data-act="close" type="button">Tutup</button>
    <button class="linkbtn" data-act="logout" type="button">Keluar dari akun</button></div>`, async (a, el) => {
    if (a === "close") return closeModal();
    if (a === "logout") return confirmLogout();
    if (a === "tab") return setTab(el.dataset.v);
    if (a === "icon" || a === "color") {
      sel[a] = el.dataset.v;
      el.parentElement.querySelectorAll(".pick").forEach(b => b.classList.toggle("on", b === el));
      $("pAv").outerHTML = avatar(sel.icon, sel.color, "xl", "pAv");
      return;
    }
    if (el.disabled) return;
    if (a === "save") {
      el.disabled = true; $("pErr").textContent = "";
      try {
        applyState((await api("profile", { nickname: $("pNick").value, bio: $("pBio").value, avatar_icon: sel.icon, avatar_color: sel.color })).state);
        drawHead(); showHello(); drawProfileBtn(); loadBoard(); toast("Profil disimpan.");
      } catch (e) { $("pErr").textContent = e.message; }
      el.disabled = false;
    }
    if (a === "pass") {
      const cur = $("pCur").value, nw = $("pNew").value;
      $("pPassErr").textContent = nw.length < 6 ? "Kata sandi baru minimal 6 karakter."
        : nw !== $("pNew2").value ? "Ulangan kata sandi baru tidak sama." : "";
      if ($("pPassErr").textContent) return;
      el.disabled = true;
      try { await api("password", { current: cur, new: nw }); ["pCur", "pNew", "pNew2"].forEach(id => $(id).value = ""); toast("Kata sandi berhasil diganti."); }
      catch (e) { $("pPassErr").textContent = e.message; }
      el.disabled = false;
    }
  }, true);
  function setTab(v) {
    document.querySelectorAll('[data-act="tab"]').forEach(b => { b.classList.toggle("on", b.dataset.v === v); b.setAttribute("aria-selected", b.dataset.v === v); });
    $("pEdit").hidden = v !== "edit"; $("pPass").hidden = v !== "pass";
  }
  function drawHead() { $("pName").textContent = P.nick || P.username; $("pBioView").textContent = P.bio; }
  setTab(tab); drawHead();
  api("profile").then(d => {
    if (!$("pStats")) return;
    $("pStats").innerHTML = [[d.stars, "Bintang"], [d.levels, "Level"], [d.rank ? "#" + d.rank : "–", "Peringkat"], [d.perfect, "Sempurna"]]
      .map(([v, l]) => `<div><b>${esc(v)}</b><small>${l}</small></div>`).join("");
  }).catch(() => {});
}
$("profileBtn").onclick = () => openProfile();

