<?php
// Catatan setiap koin masuk/keluar
return [
    'up' => "CREATE TABLE coin_transactions (
        id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        player_id  INT UNSIGNED NOT NULL,
        amount     INT          NOT NULL COMMENT 'positif = dapat, negatif = belanja',
        reason     ENUM('awal','harian','menang_level','booster','beli_tema','admin') NOT NULL,
        ref        VARCHAR(40)  NULL COMMENT 'nomor level, id tema, atau nama booster',
        created_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        KEY idx_ct_player (player_id, created_at),
        CONSTRAINT fk_ct_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    'down' => "DROP TABLE IF EXISTS coin_transactions",
];
