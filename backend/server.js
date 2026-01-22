const bcrypt = require('bcrypt');
const db = require('./db');


const express = require('express');
const path = require('path');

const app = express();

const frontendPath = path.join(__dirname, '..', 'frontend');

// arquivos estáticos (css, html)
app.use(express.static(frontendPath));

// rota raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// porta dinâmica do Railway
const PORT = process.env.PORT || 3000;

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


app.listen(PORT, () => {
  console.log(`Sistema Franz rodando na porta ${PORT}`);
});
