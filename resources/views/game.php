<?php /* Halaman game. Variabel $game dikirim oleh GameController@index. Isinya dipecah di resources/views/game/. */ ?>
<!doctype html>
<html lang="id">
<head>
<?php require __DIR__ . '/game/head.php'; ?>
</head>
<body>
<div class="app">
<?php require __DIR__ . '/game/auth.php'; ?>

<?php require __DIR__ . '/game/home.php'; ?>

<?php require __DIR__ . '/game/play.php'; ?>
</div>
<canvas id="fx" aria-hidden="true"></canvas>

<?php require __DIR__ . '/game/scripts.php'; ?>
</body>
</html>
