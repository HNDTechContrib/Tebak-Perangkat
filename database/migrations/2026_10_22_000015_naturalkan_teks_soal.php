<?php
// Teks petunjuk soal dibuat lebih natural: tanpa kata berlebihan seperti "super cepat", "otak komputer", "paling kecil".
// Format: [perangkat, teks lama, teks baru]. 'down' mengembalikan teks lama.
$clues = [
    ['PROSESOR',    'Otak komputer, dikenal juga sebagai CPU.',                            'Komponen yang menjalankan perintah program, dikenal juga sebagai CPU.'],
    ['CACHE',       'Memori super cepat yang ada di dalam prosesor.',                      'Memori kecil berkecepatan tinggi di dalam prosesor.'],
    ['SSD',         'Penyimpanan tanpa bagian bergerak, jauh lebih cepat dari harddisk.',  'Penyimpanan tanpa bagian bergerak, lebih cepat dari harddisk.'],
    ['NVME',        'Jenis SSD berbentuk stik yang sangat cepat lewat jalur PCIe.',        'Jenis SSD berbentuk stik yang terhubung lewat jalur PCIe.'],
    ['THUNDERBOLT', 'Port super cepat berbentuk USB-C untuk data, layar, dan daya.',       'Port berbentuk USB-C untuk transfer data, layar, dan daya.'],
    ['MICRO SD',    'Kartu memori paling kecil, biasa dipakai di ponsel.',                 'Kartu memori berukuran kecil yang biasa dipakai di ponsel.'],
    ['USB',         'Port serbaguna untuk flashdisk, mouse, dan banyak lagi.',             'Port umum untuk flashdisk, mouse, keyboard, dan perangkat lain.'],
    ['SUBWOOFER',   'Speaker khusus untuk suara bass yang dalam.',                         'Speaker khusus untuk suara bernada rendah (bass).'],
    ['CCTV',        'Kamera pengawas yang merekam keadaan toko selama 24 jam.',            'Kamera pengawas yang merekam keadaan suatu tempat.'],
];

return [
    'up' => function (PDO $db) use ($clues) {
        $st = $db->prepare("UPDATE devices SET clue = ? WHERE word = ?");
        foreach ($clues as [$word, $old, $new]) $st->execute([$new, $word]);
    },
    'down' => function (PDO $db) use ($clues) {
        $st = $db->prepare("UPDATE devices SET clue = ? WHERE word = ?");
        foreach ($clues as [$word, $old, $new]) $st->execute([$old, $word]);
    },
];
