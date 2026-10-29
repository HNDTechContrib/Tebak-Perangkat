<?php
// Akun pemain: koin, level terbuka, tema aktif, hadiah harian (dulu di localStorage)
return [
    'up' => "CREATE TABLE players (
        id            INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        username      VARCHAR(32)  NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        nickname      VARCHAR(16)  NULL COMMENT 'nama tampilan di papan peringkat',
        coins         INT UNSIGNED NOT NULL DEFAULT 100,
        current_level SMALLINT UNSIGNED NOT NULL DEFAULT 0 COMMENT 'indeks level terbuka tertinggi, 0 = Level 1',
        active_theme  VARCHAR(20)  NOT NULL DEFAULT 'hnd',
        last_daily    DATE         NULL COMMENT 'tanggal terakhir ambil hadiah harian',
        sound_muted   TINYINT(1)   NOT NULL DEFAULT 0,
        created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_player_theme FOREIGN KEY (active_theme) REFERENCES themes(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    'down' => "DROP TABLE IF EXISTS players",
];
