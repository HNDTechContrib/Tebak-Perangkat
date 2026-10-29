<?php
// Catatan koin terpisah untuk hadiah mengulang level
return [
    'up' => "ALTER TABLE coin_transactions MODIFY reason
        ENUM('awal','harian','menang_level','ulang_level','booster','beli_tema','admin') NOT NULL",
    'down' => [
        "UPDATE coin_transactions SET reason = 'menang_level' WHERE reason = 'ulang_level'",
        "ALTER TABLE coin_transactions MODIFY reason
            ENUM('awal','harian','menang_level','booster','beli_tema','admin') NOT NULL",
    ],
];
