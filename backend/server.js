const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const db = require('./db');

const app = express();

/* =======================
   CONFIGURAÇÕES
======================= */
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

/* =======================
   ROTAS DE PÁGINAS
======================= */
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

/* =======================
   LOGIN
======================= */
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro no servidor' });
      }

      if (results.length === 0) {
        return res.status(401).json({ error: 'Usuário não encontrado' });
      }

      const user = results[0];
      const valido = await bcrypt.compare(password, user.password);

      if (!valido) {
        return res.status(401).json({ error: 'Senha incorreta' });
      }

      res.json({ success: true });
    }
  );
});

/* =======================
   LANÇAR DIA
======================= */
app.post('/lancar-dia', (req, res) => {
  const { valor } = req.body;

  if (!valor) {
    return res.status(400).json({ error: 'Valor inválido' });
  }

  db.query(
    'INSERT INTO lancamentos (data, valor) VALUES (CURDATE(), ?)',
    [valor],
    err => {
      if (err) {
        console.error('Erro ao salvar lançamento:', err);
        return res.status(500).json({ error: 'Erro ao salvar lançamento' });
      }

      res.json({ success: true });
    }
  );
});

/* =======================
   LUCRO DO DIA
======================= */
app.get('/lucro-dia', (req, res) => {
  db.query(
    'SELECT IFNULL(SUM(valor),0) AS total FROM lancamentos WHERE data = CURDATE()',
    (err, results) => {
      if (err) {
        console.error('Erro ao buscar lucro:', err);
        return res.status(500).json({ error: 'Erro ao buscar lucro' });
      }

      res.json({ total: results[0].total });
    }
  );
});

/* =======================
   BOLETOS PENDENTES
======================= */
app.get('/boletos-pendentes', (req, res) => {
  db.query(
    'SELECT COUNT(*) AS total FROM boletos WHERE pago = false',
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Erro ao buscar boletos' });
      }

      res.json({ total: results[0].total });
    }
  );
});

/* =======================
   START SERVER
======================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Sistema Franz rodando na porta ${PORT}`);
});
