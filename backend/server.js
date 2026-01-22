const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db');
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

/* LOGIN */
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro no servidor' });
      if (results.length === 0)
        return res.status(401).json({ error: 'Usuário não encontrado' });

      const user = results[0];
      const valid = await bcrypt.compare(password, user.password);

      if (!valid)
        return res.status(401).json({ error: 'Senha incorreta' });

      res.json({ success: true });
    }
  );
});

// Salvar lançamento do dia
app.post('/lancar-dia', (req, res) => {
  const { valor } = req.body;

  db.query(
    'INSERT INTO lancamentos (data, valor) VALUES (CURDATE(), ?)',
    [valor],
    err => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao salvar lançamento' });
      }
      res.json({ success: true });
    }
  );
});

// Buscar lucro do dia
app.get('/lucro-dia', (req, res) => {
  db.query(
    'SELECT SUM(valor) AS total FROM lancamentos WHERE data = CURDATE()',
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao buscar lucro' });
      }
      res.json({ total: results[0].total || 0 });
    }
  );
});

/* 🚨 PORTA CORRETA DO RAILWAY */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Sistema Franz rodando na porta ${PORT}`);
});
