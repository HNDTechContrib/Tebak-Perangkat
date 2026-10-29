<?php /* Data untuk JavaScript, import map berversi, dan titik masuk public/js/app.js. */ ?>
<script>
// Data dari database (soal, tema, data pemain) untuk public/js/ (dibaca di core/data.js dan core/state.js)
window.GAME = <?= js($game) ?>;
</script>
<script type="importmap"><?= module_map() ?></script>
<script type="module" src="<?= asset('js/app.js') ?>"></script>
