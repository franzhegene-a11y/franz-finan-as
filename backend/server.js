const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const app = express();

/* ===== MYSQL POOL ===== */
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE || 'railway',
  port: process.env.MYSQLPORT,
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0
});

/* ===== TESTE CONEXÃO ===== */
db.getConnection((err, conn) => {
  if (err) {
    console.error('❌ MYSQL NAO CONECTOU:', err);
  } else {
    console.log('✅ MYSQL CONECTADO');
    conn.release();
  }
});

/* ===== MIDDLEWARE ===== */
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

/* ===== ROTAS ===== */
app.get('/ping', (req, res) => {
  res.json({ ok: true });
});

app.post('/lancar-dia', (req, res) => {
  try {
    const valor = Number(req.body.valor);

    if (!valor || valor <= 0) {
      return res.status(400).json({ error: 'valor invalido' });
    }

    const sql = 'INSERT INTO lancamentos (`data`, valor) VALUES (CURDATE(), ?)';

    db.query(sql, [valor], (err) => {
      if (err) {
        console.error('❌ ERRO INSERT:', err);
        return res.status(500).json({ error: 'erro insert' });
      }

      res.json({ success: true });
    });

  } catch (e) {
    console.error('❌ ERRO GERAL:', e);
    res.status(500).json({ error: 'erro servidor' });
  }
});

app.get('/lucro-dia', (req, res) => {
  db.query(
    'SELECT IFNULL(SUM(valor),0) AS total FROM lancamentos WHERE `data` = CURDATE()',
    (err, rows) => {
      if (err) {
        console.error('❌ ERRO SELECT:', err);
        return res.status(500).json({ error: 'erro select' });
      }
      res.json({ total: rows[0].total });
    }
  );
});

/* ===== START ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 Franz Finance ONLINE na porta', PORT);
});
