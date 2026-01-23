const express = require('express');
const path = require('path');
const db = require('./db');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

/* ===== TESTE VIDA ===== */
app.get('/ping', (req, res) => {
  res.json({ ok: true });
});

/* ===== LUCRO DO DIA ===== */
app.get('/lucro-dia', (req, res) => {
  db.query(
    'SELECT IFNULL(SUM(valor),0) AS total FROM lancamentos WHERE data = CURDATE()',
    (err, rows) => {
      if (err) {
        console.error('ERRO lucro-dia:', err);
        return res.status(500).json({ error: 'erro banco' });
      }
      res.json({ total: rows[0].total });
    }
  );
});

/* ===== LANÇAR DIA ===== */
app.post('/lancar-dia', (req, res) => {
  const valor = Number(req.body.valor);

  if (!valor || valor <= 0) {
    return res.status(400).json({ error: 'valor invalido' });
  }

  db.query(
  'INSERT INTO lancamentos (`data`, valor) VALUES (CURDATE(), ?)',
  [valor],
  (err, result) => {
    if (err) {
      console.error('ERRO INSERT MYSQL:', err);
      return res.status(500).json({ error: 'erro insert' });
    }
    res.json({ success: true });
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('🚀 Franz Finance rodando na porta', PORT);
});
