/**
 * Setup database tables if they don't exist
 * Run this once: node setup-db.js
 */
require('dotenv').config();
const mysql = require('mysql2/promise');





const sql = `
USE dbmobileapp;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS json (
  id INT AUTO_INCREMENT PRIMARY KEY,
  postId VARCHAR(255),
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX IF NOT EXISTS idx_user_email ON users(user_email);
CREATE INDEX IF NOT EXISTS idx_postId ON json(postId);
`;

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    // Note: no database specified yet, we'll create dbmobileapp
  });

  try {
    console.log('🔧 Setting up database...');
    
    // Create database if it doesn't exist
    await conn.query('CREATE DATABASE IF NOT EXISTS dbmobileapp');
    console.log('✅ Database created (or already exists)');

    // Execute schema
    const statements = sql.split(';').map(s => s.trim()).filter(s => s);
    for (const stmt of statements) {
      console.log(`  Executing: ${stmt.substring(0, 50)}...`);
      await conn.query(stmt);
    }

    console.log('✅ All tables created successfully!');
    console.log('🚀 You can now run: npm start');
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
})();
