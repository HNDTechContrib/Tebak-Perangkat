<?php
// Data awal 6 tema
return [
    'up' => "INSERT INTO themes (id, name, color, color_deep, icons, price, sort_order) VALUES
        ('hnd',     'Bengkel HND',   '#19a7a0', '#0d7a75', 'Pemroses,mouse,Input,Daya,Output',          0, 1),
        ('layar',   'Biru Layar',    '#3b82d6', '#2459a6', 'Output,cursor,Jaringan,code,mouse',       150, 2),
        ('sirkuit', 'Hijau Sirkuit', '#2f9e5e', '#1e7042', 'circuit,Pemroses,Daya,circuit,Port',      300, 3),
        ('gamer',   'Ungu Gamer',    '#7c5cd6', '#5639ad', 'gamepad,headphone,star,mouse,Input',      500, 4),
        ('solder',  'Oranye Solder', '#ee8a3a', '#bf611b', 'wrench,Rangka,Daya,Pendingin,Port',       800, 5),
        ('server',  'Malam Server',  '#2c3a5a', '#1a243b', 'server,star,Jaringan,Penyimpanan,star',  1200, 6)",
    'down' => "DELETE FROM themes WHERE id IN ('hnd','layar','sirkuit','gamer','solder','server')",
];
