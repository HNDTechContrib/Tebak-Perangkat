-- Membuat user MySQL khusus aplikasi (jalankan sebagai root, sekali saja).
-- Ganti password agar sama dengan DB_PASSWORD di file .env.
CREATE USER IF NOT EXISTS 'tebakperangkat'@'localhost' IDENTIFIED BY 'GANTI_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE ON db_tebakperangkat.* TO 'tebakperangkat'@'localhost';
FLUSH PRIVILEGES;
