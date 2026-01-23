const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
app.use(express.json());

// ===== CONEXÃO MYSQL =====
const db = mysql.createPool({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

// ===== FRONTEND =====
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ===== LANÇAR DIA =====
app.post('/lancar-dia', (req, res) => {
  const { valor } = req.body;

  if (typeof valor !== 'number') {
    return res.status(400).json({ erro: 'Valor inválido' });
  }

  const sql = `
    INSERT INTO lancamentos (data, valor)
    VALUES (CURDATE(), ?)
  `;

  db.query(sql, [valor], (err) => {
    if (err) {
      console.error('ERRO MYSQL:', err);
      return res.status(500).json({ erro: 'Erro ao salvar no banco' });
    }

    res.json({ ok: true });
  });
});

// ===== LUCRO DO DIA =====
app.get('/lucro-dia', (req, res) => {
  const sql = `
    SELECT IFNULL(SUM(valor), 0) AS total
    FROM lancamentos
    WHERE data = CURDATE()
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: 'Erro ao buscar lucro' });
    }

    res.json({ total: Number(results[0].total) });
  });
});

// ===== START =====
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log('Sistema Franz rodando na porta', PORT);
});
