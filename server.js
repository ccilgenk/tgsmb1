require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('./db'); // connection pool

const SECRET_KEY = process.env.SECRET_KEY || 'default_secret_key_change_this';
const PORT = process.env.PORT || 3000;

if (!process.env.SECRET_KEY) {
  console.warn('⚠️ WARNING: SECRET_KEY not set in .env. Using default. Change it in production!');
}

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Helper to handle server errors in a consistent way
function handleServerError(res, label, error) {
  // Log full error for debugging
  console.error(label, error);

  // In production don't leak details to clients
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({ error: 'Server error' });
  }

  // In development return message and stack to help debugging
  return res.status(500).json({ error: error.message, stack: error.stack });
}

function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // ambil token setelah 'Bearer'

  if (!token) {
    return res.status(401).json({ message: 'Token tidak ditemukan, akses ditolak!' });
  }

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) {
      console.error('🚫 Token verification error:', err);
      return res.status(403).json({ message: 'Token tidak valid!' });
    }
    console.log('✅ Token valid, user:', decoded);
    req.user = decoded; // simpan data user ke request
    next(); // lanjut ke route berikutnya
  });
}


app.post('/register', async (req, res) => {
  const { user_name, user_email, user_password } = req.body;

  if (!user_name || !user_email || !user_password) {
    return res.status(400).json({ message: 'Semua field wajib diisi!' });
  }

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE user_email = ?', [user_email]);
    
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar!' });
    }

    const hashedPassword = await bcrypt.hash(user_password, 10);

    const [result] = await db.query(
      'INSERT INTO users (user_name, user_email, user_password) VALUES (?, ?, ?)',
      [user_name, user_email, hashedPassword]
    );

    res.json({
      message: 'Registrasi berhasil!',
      id: result.insertId,
      user_name,
      user_email
    });
  } catch (error) {
    return handleServerError(res, 'Error register:', error);
  }
});

app.post('/login', async (req, res) => {
  const { user_email, user_password } = req.body;

  if (!user_email || !user_password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi!' });
  }

  try {
    const [users] = await db.query('SELECT * FROM users WHERE user_email = ?', [user_email]);

    if (users.length === 0) {
      return res.status(401).json({ message: 'Email tidak ditemukan!' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(user_password, user.user_password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Password salah!' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.user_email, name: user.user_name },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Login berhasil!',
      token,
      user: {
        id: user.id,
        user_name: user.user_name,
        user_email: user.user_email
      }
    });
  } catch (error) {
    return handleServerError(res, 'Error login:', error);
  }
});


// GET semua data
app.get('/posts', verifyToken, async (req, res) => {
  try {
    const [posts] = await db.query('SELECT * FROM json ORDER BY created_at DESC');
    res.json(posts);
  } catch (error) {
    return handleServerError(res, 'Error get posts:', error);
  }
});



// POST tambah data
app.post('/posts', verifyToken, async (req, res) => {
  const { postId, judul, deskripsi } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO json (postId, judul, deskripsi) VALUES (?, ?, ?)',
      [postId, judul, deskripsi]
    );

    res.json({
      id: result.insertId,
      postId,
      judul,
      deskripsi,
      message: 'Post berhasil dibuat!'
    });
  } catch (error) {
    return handleServerError(res, 'Error create post:', error);
  }
});

// ✅ GET satu data post berdasarkan ID
app.get('/posts/:id', verifyToken, async (req, res) => {
  try {
    const [posts] = await db.query('SELECT * FROM json WHERE id = ?', [req.params.id]);

    if (posts.length === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    res.json(posts[0]);
  } catch (error) {
    return handleServerError(res, 'Error get post:', error);
  }
});


// PUT edit data
app.put('/posts/:id', verifyToken, async (req, res) => {
  const { postId, judul, deskripsi } = req.body;

  try {
    const [result] = await db.query(
      'UPDATE json SET postId = ?, judul = ?, deskripsi = ? WHERE id = ?',
      [postId, judul, deskripsi, req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    res.json({
      message: 'Data berhasil diupdate',
      id: req.params.id,
      postId,
      judul,
      deskripsi
    });
  } catch (error) {
    return handleServerError(res, 'Error update post:', error);
  }
});


// DELETE data
app.delete('/posts/:id', verifyToken, async (req, res) => {
  try {
    const [result] = await db.query('DELETE FROM json WHERE id = ?', [req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Data tidak ditemukan' });
    }

    res.json({ message: 'Data berhasil dihapus', id: req.params.id });
  } catch (error) {
    return handleServerError(res, 'Error delete post:', error);
  }
});


app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});