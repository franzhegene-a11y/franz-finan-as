const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect(err => {
  if (err) {
    console.error('Erro ao conectar no banco:', err);
    return;
  }
  console.log('Banco conectado');
});

/* ==========================
   INSERIR LANÇAMENTO DO DIA
========================== */
app.post('/lancar-dia', (req, res) => {
  const { valor } = req.body;

  if (!valor || isNaN(valor)) {
    return res.status(400).json({ erro: 'Valor inválido' });
  }

  const sql = `
    INSERT INTO lancamentos (data, valor)
    VALUES (CURDATE(), ?)
  `;

  db.query(sql, [Number(valor)], (err) => {
    if (err) {
      console.error('Erro insert:', err);
      return res.status(500).json({ erro: 'Erro ao inserir no banco' });
    }

    res.json({ sucesso: true });
  });
});

/* ==========================
   BUSCAR LUCRO DO DIA
========================== */
app.get('/lucro-dia', (req, res) => {
  const sql = `
    SELECT SUM(valor) AS total
    FROM lancamentos
    WHERE data = CURDATE()
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Erro select:', err);
      return res.status(500).json({ erro: 'Erro ao buscar lucro' });
    }

    res.json({ total: rows[0].total || 0 });
  });
});

/* ==========================
   ROTAS HTML
========================== */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor rodando');
});
