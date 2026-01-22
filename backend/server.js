const express = require('express');
const path = require('path');

const app = express();

// Caminho absoluto correto do frontend
const frontendPath = path.join(__dirname, '..', 'frontend');

// Servir arquivos estáticos
app.use(express.static(frontendPath));

// Rota raiz
app.get('/', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// Porta dinâmica Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Sistema Franz rodando na porta ${PORT}`);
});
