const express = require('express');
const pool = require('./db');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// ساخت جدول‌ها در صورت نبود
async function initDB() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS comments (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      task TEXT NOT NULL,
      done BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      email TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);
  console.log('جدول‌ها آماده‌اند');
}
initDB();

// ---------- نظرات ----------
app.get('/api/comments', async (req, res) => {
  const result = await pool.query('SELECT * FROM comments ORDER BY id DESC');
  res.json(result.rows);
});

app.post('/api/comments', async (req, res) => {
  const { name, message } = req.body;
  const result = await pool.query(
    'INSERT INTO comments (name, message) VALUES ($1, $2) RETURNING *',
    [name, message]
  );
  res.json(result.rows[0]);
});

// ---------- کارها (To-do) ----------
app.get('/api/todos', async (req, res) => {
  const result = await pool.query('SELECT * FROM todos ORDER BY id DESC');
  res.json(result.rows);
});

app.post('/api/todos', async (req, res) => {
  const { task } = req.body;
  const result = await pool.query(
    'INSERT INTO todos (task) VALUES ($1) RETURNING *',
    [task]
  );
  res.json(result.rows[0]);
});

app.put('/api/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { done } = req.body;
  const result = await pool.query(
    'UPDATE todos SET done = $1 WHERE id = $2 RETURNING *',
    [done, id]
  );
  res.json(result.rows[0]);
});

// ---------- کاربران ----------
app.get('/api/users', async (req, res) => {
  const result = await pool.query('SELECT * FROM users ORDER BY id DESC');
  res.json(result.rows);
});

app.post('/api/users', async (req, res) => {
  const { username, email } = req.body;
  const result = await pool.query(
    'INSERT INTO users (username, email) VALUES ($1, $2) RETURNING *',
    [username, email]
  );
  res.json(result.rows[0]);
});

app.listen(PORT, () => {
  console.log(`سرور روی http://localhost:${PORT} در حال اجراست`);
});
