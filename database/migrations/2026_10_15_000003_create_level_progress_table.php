<?php
// Bintang terbaik dan waktu tercepat per level
return [
    'up' => "CREATE TABLE level_progress (
        player_id    INT UNSIGNED      NOT NULL,
        level_index  SMALLINT UNSIGNED NOT NULL COMMENT '0 = Level 1',
        stars        TINYINT UNSIGNED  NOT NULL,
        best_seconds SMALLINT UNSIGNED NULL,
        completed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (player_id, level_index),
        CONSTRAINT chk_stars CHECK (stars BETWEEN 1 AND 3),
        CONSTRAINT fk_progress_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    'down' => "DROP TABLE IF EXISTS level_progress",
];
