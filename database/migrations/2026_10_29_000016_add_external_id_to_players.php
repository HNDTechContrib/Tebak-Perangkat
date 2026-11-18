<?php
// Pemain sekarang berasal dari website utama: external_id = ID user di website utama.
// Kata sandi tidak lagi dipakai minigame, jadi boleh kosong. Akun lama (yang punya kata sandi) dibiarkan.
return [
    'up' => "ALTER TABLE players
        ADD COLUMN external_id VARCHAR(64) NULL UNIQUE COMMENT 'ID user di website utama' AFTER id,
        MODIFY password_hash VARCHAR(255) NULL",
    // Pemain dari website utama tidak punya kata sandi; diisi teks kosong supaya kolomnya bisa wajib lagi
    'down' => function (PDO $db) {
        $db->exec("UPDATE players SET password_hash = '' WHERE password_hash IS NULL");
        $db->exec("ALTER TABLE players DROP COLUMN external_id, MODIFY password_hash VARCHAR(255) NOT NULL");
    },
];
