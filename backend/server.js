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
app.listen(PORT, () => {
  console.log(`Sistema Franz rodando na porta ${PORT}`);
});
