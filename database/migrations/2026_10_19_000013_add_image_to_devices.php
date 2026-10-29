<?php
// Foto opsional untuk mode Tebak gambar, mis. 'images/perangkat/mouse.jpg' atau URL lengkap.
// Kalau kosong, game memakai gambar SVG bawaan (jika ada untuk perangkat itu).
return [
    'up'   => "ALTER TABLE devices ADD COLUMN image VARCHAR(255) NULL AFTER clue",
    'down' => "ALTER TABLE devices DROP COLUMN image",
];
