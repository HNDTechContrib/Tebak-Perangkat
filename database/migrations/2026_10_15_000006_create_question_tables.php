<?php
// Bank soal. Urutan level dibuat dari urutan id, jadi tambahkan soal baru di akhir saja.
return [
    'up' => [
        "CREATE TABLE devices (
            id        SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            word      VARCHAR(40)  NOT NULL UNIQUE COMMENT 'jawaban, huruf kapital',
            category  ENUM('Input','Output','Pemroses','Pendingin','Daya','Rangka','Penyimpanan','Jaringan','Port') NOT NULL,
            clue      VARCHAR(255) NOT NULL,
            is_active TINYINT(1)   NOT NULL DEFAULT 1
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
        "CREATE TABLE abbreviations (
            id        SMALLINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
            short     VARCHAR(10) NOT NULL UNIQUE,
            long_form VARCHAR(80) NOT NULL,
            is_active TINYINT(1)  NOT NULL DEFAULT 1
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    ],
    'down' => [
        "DROP TABLE IF EXISTS abbreviations",
        "DROP TABLE IF EXISTS devices",
    ],
];
