<?php
// Papan peringkat ikut menampilkan avatar pemain dan jumlah level bintang 3
return [
    'up' => "CREATE OR REPLACE VIEW leaderboard AS
        SELECT
            p.id                                    AS player_id,
            COALESCE(p.nickname, p.username)        AS display_name,
            p.active_theme,
            p.avatar_icon,
            p.avatar_color,
            COALESCE(SUM(lp.stars), 0)              AS total_stars,
            COUNT(lp.level_index)                   AS levels_done,
            COALESCE(SUM(lp.stars = 3), 0)          AS perfect_levels,
            MAX(lp.completed_at)                    AS last_played
        FROM players p
        LEFT JOIN level_progress lp ON lp.player_id = p.id
        GROUP BY p.id, p.nickname, p.username, p.active_theme, p.avatar_icon, p.avatar_color",
    // kembali ke bentuk view dari migrasi 000007
    'down' => "CREATE OR REPLACE VIEW leaderboard AS
        SELECT
            p.id                             AS player_id,
            COALESCE(p.nickname, p.username) AS display_name,
            p.active_theme,
            COALESCE(SUM(lp.stars), 0)       AS total_stars,
            COUNT(lp.level_index)            AS levels_done,
            MAX(lp.completed_at)             AS last_played
        FROM players p
        LEFT JOIN level_progress lp ON lp.player_id = p.id
        GROUP BY p.id, p.nickname, p.username, p.active_theme",
];
