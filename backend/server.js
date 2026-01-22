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

/* 🚨 PORTA CORRETA DO RAILWAY */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Sistema Franz rodando na porta ${PORT}`);
});
