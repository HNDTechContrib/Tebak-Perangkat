<?php
// Papan peringkat dihitung otomatis dari level_progress
return [
    'up' => "CREATE OR REPLACE VIEW leaderboard AS
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
    'down' => "DROP VIEW IF EXISTS leaderboard",
];
