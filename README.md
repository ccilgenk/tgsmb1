# API Server Setup - Mobile App

Dokumentasi setup API backend untuk aplikasi mobile (Ionic + Vue).

## Prerequisites
- Node.js v14+
- MySQL Server (sudah berjalan)
- Database `dbmobileapp` dan tabel-tabel sudah dibuat

## Setup Langkah-Langkah

### 1. Install Dependencies
```bash
cd d:\mcd2\api
npm install
```

Packages yang diinstall:
- `express` - web framework
- `mysql2/promise` - MySQL client async
- `bcrypt` - password hashing
- `jsonwebtoken` - JWT auth
- `cors` - cross-origin support
- `body-parser` - parse JSON requests
- `dotenv` - environment variables

### 2. Setup Database
Pastikan tabel sudah dibuat. Jalankan SQL dari `schema.sql`:
```bash
mysql -u root -p dbmobileapp < schema.sql
```

Atau manual import di phpMyAdmin.

### 3. Setup Environment Variables
Copy `.env.example` ke `.env`:
```bash
cp .env.example .env
```

Edit file `.env`:
```
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=dbmobileapp
PORT=3000
SECRET_KEY=your_random_secret_key_here
```

**Generate SECRET_KEY yang aman** (min 32 chars):
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copas hasil ke `.env` di bagian `SECRET_KEY`.

### 4. Jalankan Server
```bash
npm start
# atau
node server.js
```

Output sukses:
```
✅ Database pool connected successfully!
🚀 Server running at http://localhost:3000
```

## API Endpoints

### Authentication
- **POST** `/register`
  - Body: `{ user_name, user_email, user_password }`
  - Returns: User data + success message

- **POST** `/login`
  - Body: `{ user_email, user_password }`
  - Returns: `{ token, user, message }`
  - Token dipakai untuk akses endpoint `/posts`

### Posts (Protected - butuh token di header)
Header: `Authorization: Bearer <token>`

- **GET** `/posts` - Ambil semua posts
- **POST** `/posts` - Buat post baru
  - Body: `{ postId, judul, deskripsi }`
- **GET** `/posts/:id` - Ambil satu post
- **PUT** `/posts/:id` - Update post
  - Body: `{ postId, judul, deskripsi }`
- **DELETE** `/posts/:id` - Hapus post

## Database Schema

### Tabel `users`
```
id (INT, PK)
user_name (VARCHAR 255)
user_email (VARCHAR 255, UNIQUE)
user_password (VARCHAR 255, hashed)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

### Tabel `json`
```
id (INT, PK)
postId (VARCHAR 255)
judul (VARCHAR 255)
deskripsi (TEXT)
created_at (TIMESTAMP)
updated_at (TIMESTAMP)
```

## Troubleshooting

### Error: "Cannot find module 'dotenv'"
```bash
npm install dotenv
```

### Error: "Database pool connection failed"
- Periksa MySQL berjalan dan database `dbmobileapp` ada
- Cek kredensial di `.env` (DB_HOST, DB_USER, DB_PASS)

### Error: "EADDRINUSE: address already in use :::3000"
Port 3000 sudah dipakai. Ubah `PORT` di `.env` atau kill process di port 3000.

## Frontend Integration
Contoh request dari Vue/Ionic:
```javascript
// Login
const res = await axios.post('http://localhost:3000/login', {
  user_email: 'user@example.com',
  user_password: 'password123'
});
const token = res.data.token;

// Get posts dengan token
const posts = await axios.get('http://localhost:3000/posts', {
  headers: { Authorization: `Bearer ${token}` }
});
```

## Production Checklist
- [ ] Ubah SECRET_KEY ke nilai random yang kuat di `.env`
- [ ] Jangan commit `.env` ke repository (sudah di `.gitignore`)
- [ ] Gunakan HTTPS di production
- [ ] Setup rate limiting untuk endpoints auth
- [ ] Backup database secara berkala
- [ ] Monitor logs server
