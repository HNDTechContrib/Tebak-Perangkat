<?php
// Tema latar yang bisa dibeli dengan koin
return [
    'up' => "CREATE TABLE themes (
        id         VARCHAR(20)  PRIMARY KEY,
        name       VARCHAR(40)  NOT NULL,
        color      CHAR(7)      NOT NULL COMMENT 'warna latar (--sky)',
        color_deep CHAR(7)      NOT NULL COMMENT 'warna bayangan (--sky-deep)',
        icons      VARCHAR(160) NOT NULL COMMENT 'ikon pola latar, dipisah koma (lihat PAT di index.php)',
        price      INT UNSIGNED NOT NULL DEFAULT 0,
        sort_order TINYINT UNSIGNED NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    'down' => "DROP TABLE IF EXISTS themes",
];
