-- Schema untuk database dbmobileapp
-- Jalankan script ini di MySQL untuk membuat tabel yang diperlukan

USE dbmobileapp;

-- Tabel users (untuk login/register)
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel json (untuk post/blog)
CREATE TABLE IF NOT EXISTS json (
  id INT AUTO_INCREMENT PRIMARY KEY,
  postId VARCHAR(255),
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index untuk performa query
CREATE INDEX idx_user_email ON users(user_email);
CREATE INDEX idx_postId ON json(postId);
