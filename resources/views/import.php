<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Import Soal Excel — Tebak Perangkat</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@600;700;800&display=swap">
  <style>
    :root {
      --bg: #12827c; --card: #ffffff; --ink: #2b2233; --muted: #6e6577; --line: #e2eeed;
      --primary: #19a7a0; --primary-edge: #0d7a75; --leaf: #2eb35e; --coral: #e04838;
      --font-d: "Baloo 2", sans-serif; --font-b: "Nunito", sans-serif;
    }
    * { box-sizing: border-box; }
    body { margin: 0; background: var(--bg); color: var(--ink); font-family: var(--font-b); font-weight: 700; padding: 20px 14px 40px; }
    .container { max-width: 820px; margin: 0 auto; }
    .card { background: var(--card); border-radius: 18px; padding: 20px; margin-bottom: 20px; box-shadow: 0 4px 18px rgba(0,0,0,.08); }
    h1, h2, h3 { font-family: var(--font-d); margin-top: 0; color: var(--ink); }
    h1 { font-size: 26px; margin-bottom: 6px; }
    .btn { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 10px 18px; border: none; border-radius: 12px; font-family: var(--font-b); font-size: 14px; font-weight: 800; cursor: pointer; text-decoration: none; transition: .15s; }
    .btn-pri { background: var(--primary); color: #fff; box-shadow: 0 4px 0 var(--primary-edge); }
    .btn-leaf { background: var(--leaf); color: #fff; box-shadow: 0 4px 0 #1b8541; }
    .btn-outline { background: #fff; color: var(--primary-edge); border: 2px solid var(--primary); }
    .btn:active { transform: translateY(2px); box-shadow: none !important; }
    .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 12px; margin-bottom: 16px; }
    .stat-box { background: #f4fbfb; border: 1.5px solid var(--line); border-radius: 12px; padding: 12px; text-align: center; }
    .stat-num { font-size: 24px; font-family: var(--font-d); color: var(--primary-edge); }
    .stat-lbl { font-size: 12px; color: var(--muted); }
    .dropzone { border: 2.5px dashed var(--primary); border-radius: 14px; padding: 24px 16px; text-align: center; background: #fbfefe; cursor: pointer; transition: .2s; }
    .dropzone.hover { background: #e6f7f6; border-color: var(--primary-edge); }
    .dropzone input { display: none; }
    .modes { display: flex; gap: 16px; margin: 16px 0; flex-wrap: wrap; }
    .radio-lbl { display: flex; align-items: flex-start; gap: 8px; font-size: 13px; cursor: pointer; }
    .badge-grid { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 10px; }
    .badge { background: #eaf6f5; color: var(--primary-edge); padding: 4px 10px; border-radius: 99px; font-size: 12px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; margin: 10px 0; }
    th, td { border: 1px solid var(--line); padding: 8px 10px; text-align: left; }
    th { background: #f7fcfa; }
    .alert { padding: 12px 16px; border-radius: 10px; margin-top: 14px; font-size: 13px; display: none; }
    .alert-ok { background: #e6f8ee; border: 1px solid #a3e4bc; color: #116834; }
    .alert-err { background: #fdeeee; border: 1px solid #f9b6b6; color: var(--coral); }
  </style>
</head>
<body>
<div class="container">
  <div style="margin-bottom:14px;display:flex;justify-content:space-between;align-items:center;">
    <a href="./" class="btn btn-outline" style="padding:6px 14px;font-size:13px;">← Kembali ke Game</a>
    <span style="color:#e0f5f4;font-size:13px;">Tebak Perangkat Admin</span>
  </div>

  <div class="card">
    <h1>Kelola & Impor Soal Excel</h1>
    <p style="color:var(--muted);margin-top:0;font-size:14px;">Tambah atau perbarui bank soal perangkat dan singkatan menggunakan file spreadsheet (.xlsx / .csv).</p>
    
    <div class="stats">
      <div class="stat-box"><div class="stat-num" id="sDev"><?= $deviceCount ?></div><div class="stat-lbl">Perangkat Aktif</div></div>
      <div class="stat-box"><div class="stat-num" id="sAbbr"><?= $abbrCount ?></div><div class="stat-lbl">Singkatan Aktif</div></div>
      <div class="stat-box"><div class="stat-num"><?= count($categories) ?></div><div class="stat-lbl">Kategori Terisi</div></div>
    </div>

    <div style="display:flex;gap:10px;flex-wrap:wrap;">
      <a href="import/template" class="btn btn-pri">📥 Download Template Excel (.xlsx)</a>
      <a href="import/export" class="btn btn-outline">📤 Ekspor Soal Saat Ini (.xlsx)</a>
    </div>
  </div>

  <div class="card">
    <h2>Unggah File Spreadsheet</h2>
    <form id="upForm">
      <div class="dropzone" id="dz">
        <input type="file" id="fInput" name="file" accept=".xlsx,.csv">
        <div style="font-size:32px;">📄</div>
        <div id="dzText" style="font-size:15px;margin-top:4px;">Klik atau tarik file <b>.xlsx</b> / <b>.csv</b> ke sini</div>
        <small style="color:var(--muted);">Mendukung multi-sheet (Perangkat & Singkatan)</small>
      </div>

      <div class="modes">
        <label class="radio-lbl">
          <input type="radio" name="mode" value="upsert" checked>
          <div><b>Tambah & Perbarui (Upsert)</b><br><span style="color:var(--muted);">Soal baru ditambahkan, soal dengan kata yang sama diperbarui, soal lain tetap aman.</span></div>
        </label>
        <label class="radio-lbl">
          <input type="radio" name="mode" value="replace">
          <div><b>Ganti Semua (Replace)</b><br><span style="color:var(--coral);">Mengosongkan bank soal saat ini dan mengganti dengan isi file.</span></div>
        </label>
      </div>

      <button type="submit" class="btn btn-leaf" id="subBtn" style="width:100%;font-size:16px;">🚀 Proses & Simpan ke Bank Soal</button>
      <div class="alert" id="resAlert"></div>
    </form>
  </div>

  <div class="card">
    <h3>Format Sheet & Kategori</h3>
    <p style="font-size:13px;color:var(--muted);">Template memiliki 2 sheet utama: <b>Perangkat</b> dan <b>Singkatan</b>.</p>
    <table>
      <thead><tr><th>Sheet</th><th>Kolom yang Diperlukan</th><th>Keterangan</th></tr></thead>
      <tbody>
        <tr><td><b>Perangkat</b></td><td>Kata / Jawaban, Kategori, Petunjuk Soal</td><td>Kolom opsional: Path Gambar, Kredit, Sumber, Aktif (1/0)</td></tr>
        <tr><td><b>Singkatan</b></td><td>Singkatan, Kepanjangan</td><td>Kolom opsional: Aktif (1/0)</td></tr>
      </tbody>
    </table>
    <div style="margin-top:12px;font-size:13px;"><b>9 Kategori Valid untuk Perangkat:</b></div>
    <div class="badge-grid">
      <?php foreach (['Input', 'Output', 'Pemroses', 'Pendingin', 'Daya', 'Rangka', 'Penyimpanan', 'Jaringan', 'Port'] as $c): ?>
        <span class="badge"><?= $c ?></span>
      <?php endforeach; ?>
    </div>
  </div>
</div>

<script>
  const dz = document.getElementById('dz'), fi = document.getElementById('fInput'), dzt = document.getElementById('dzText');
  const form = document.getElementById('upForm'), btn = document.getElementById('subBtn'), alertBox = document.getElementById('resAlert');
  dz.onclick = () => fi.click();
  fi.onchange = () => { if (fi.files[0]) dzt.innerHTML = `Terpilih: <b>${fi.files[0].name}</b> (${Math.round(fi.files[0].size/1024)} KB)`; };
  dz.ondragover = e => { e.preventDefault(); dz.classList.add('hover'); };
  dz.ondragleave = () => dz.classList.remove('hover');
  dz.ondrop = e => {
    e.preventDefault(); dz.classList.remove('hover');
    if (e.dataTransfer.files[0]) { fi.files = e.dataTransfer.files; dzt.innerHTML = `Terpilih: <b>${fi.files[0].name}</b>`; }
  };
  form.onsubmit = async e => {
    e.preventDefault();
    if (!fi.files[0]) { alert('Pilih file Excel terlebih dahulu.'); return; }
    btn.disabled = true; btn.innerText = 'Mengimpor...';
    alertBox.style.display = 'none';
    const fd = new FormData(form);
    try {
      const res = await fetch('api/import', { method: 'POST', headers: { 'X-Requested-With': 'fetch' }, body: fd });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Gagal mengimpor file.');
      const r = data.result;
      let html = `<b>Berhasil Mengimpor Soal!</b><br>` +
        `• Perangkat baru: ${r.devices_imported}, diperbarui: ${r.devices_updated}<br>` +
        `• Singkatan baru: ${r.abbr_imported}, diperbarui: ${r.abbr_updated}<br>` +
        `• Total perangkat aktif sekarang: ${r.total_devices}, total singkatan: ${r.total_abbr}`;
      if (r.errors && r.errors.length) {
        html += `<br><br><span style="color:#b23b3b"><b>Peringatan (${r.errors.length} baris dilewati):</b><br>${r.errors.slice(0, 5).join('<br>')}</span>`;
      }
      alertBox.className = 'alert alert-ok'; alertBox.innerHTML = html; alertBox.style.display = 'block';
      document.getElementById('sDev').innerText = r.total_devices;
      document.getElementById('sAbbr').innerText = r.total_abbr;
    } catch (err) {
      alertBox.className = 'alert alert-err'; alertBox.innerText = err.message; alertBox.style.display = 'block';
    } finally {
      btn.disabled = false; btn.innerText = '🚀 Proses & Simpan ke Bank Soal';
    }
  };
</script>
</body>
</html>
