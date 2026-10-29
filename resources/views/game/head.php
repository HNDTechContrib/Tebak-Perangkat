<?php /* Isi <head>: meta, judul, font, dan semua file CSS dari public/css/. */ ?>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover, interactive-widget=resizes-content">
<title>Tebak Perangkat</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Baloo+2:wght@700;800&family=Nunito:wght@600;700;800&display=swap">
<?php
// Urutan file CSS penting: aturan di file belakang menimpa file depan
$styles = [
    'base/tokens', 'base/background', 'base/layout', 'base/buttons',
    'features/home',
    'features/play/clue', 'features/play/letters', 'features/play/choices', 'features/play/boosters', 'features/play/picture',
    'ui/modal', 'ui/toast', 'ui/offline', 'ui/confetti',
    'features/leaderboard', 'features/themes', 'features/profile', 'features/auth',
    'animations',
];
foreach ($styles as $f): ?>
<link rel="stylesheet" href="<?= asset("css/$f.css") ?>">
<?php endforeach; ?>
