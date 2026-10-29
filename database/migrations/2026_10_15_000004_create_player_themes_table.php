<?php
// Tema yang sudah dimiliki (dibeli) tiap pemain
return [
    'up' => "CREATE TABLE player_themes (
        player_id   INT UNSIGNED NOT NULL,
        theme_id    VARCHAR(20)  NOT NULL,
        unlocked_at TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (player_id, theme_id),
        CONSTRAINT fk_pt_player FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
        CONSTRAINT fk_pt_theme  FOREIGN KEY (theme_id)  REFERENCES themes(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",
    'down' => "DROP TABLE IF EXISTS player_themes",
];
