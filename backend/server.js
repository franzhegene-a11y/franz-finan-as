const express = require('express');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Rota principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Porta dinâmica (Railway)
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Sistema Franz rodando na porta ${PORT}`);
});
