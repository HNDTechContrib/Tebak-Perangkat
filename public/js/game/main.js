// Mulai: dimuat paling akhir, setelah semua file lain siap.


document.addEventListener("touchstart", () => {}, { passive: true });   // agar animasi tekan (:active) juga jalan di Safari iPhone
document.addEventListener("contextmenu", e => { if (e.target.closest("button")) e.preventDefault(); });   // tekan lama tombol: tanpa menu browser
document.querySelectorAll("img.logo").forEach(img => img.src = LOGO);
if (P) { showHome(); loadBoard(); } else showAuth();
