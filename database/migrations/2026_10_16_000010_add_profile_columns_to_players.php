<?php
// Profil pemain: ikon avatar, warna avatar, dan bio singkat
return [
    'up' => "ALTER TABLE players
        ADD COLUMN avatar_icon  VARCHAR(20) NOT NULL DEFAULT 'Pemroses' AFTER nickname,
        ADD COLUMN avatar_color CHAR(7)     NOT NULL DEFAULT '#19a7a0'  AFTER avatar_icon,
        ADD COLUMN bio          VARCHAR(80) NULL                        AFTER avatar_color",
    'down' => "ALTER TABLE players DROP COLUMN bio, DROP COLUMN avatar_color, DROP COLUMN avatar_icon",
];
