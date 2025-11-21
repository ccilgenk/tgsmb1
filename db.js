// db.js - MySQL Connection Pool (Promise-based)
require('dotenv').config();
const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'dbmobileapp',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test koneksi saat startup
pool.getConnection().then(conn => {
  console.log('✅ Database pool connected successfully!');
  conn.release();
}).catch(err => {
  // Log the full error object (stack + details) to help debugging
  console.error('❌ Database pool connection failed:');
  console.error(err);
  // Do not exit the process here so the server can start and
  // present more helpful runtime errors during development.
  // In production you may want to exit on DB connection failure.
});

module.exports = pool;
