const express = require("express");
const mysql = require("mysql2");
const path = require("path");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../frontend")));

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT
});

db.connect(err => {
  if (err) {
    console.error("Erro ao conectar no banco:", err);
  } else {
    console.log("Banco conectado");
  }
});

/* ===============================
   SALVAR / ATUALIZAR LUCRO DO DIA
================================ */
app.post("/lancar-dia", (req, res) => {
  const { valor } = req.body;

  if (!valor || isNaN(valor)) {
    return res.status(400).json({ error: "Valor inválido" });
  }

  const sql = `
    INSERT INTO lancamentos (data, valor)
    VALUES (CURDATE(), ?)
    ON DUPLICATE KEY UPDATE valor = ?
  `;

  db.query(sql, [valor, valor], (err) => {
    if (err) {
      console.error("Erro no banco:", err);
      return res.status(500).json({ error: "Erro ao salvar no banco" });
    }

    res.json({ success: true });
  });
});

/* ===============================
   BUSCAR LUCRO DO DIA
================================ */
app.get("/lucro-dia", (req, res) => {
  const sql = `
    SELECT IFNULL(SUM(valor), 0) AS total
    FROM lancamentos
    WHERE data = CURDATE()
  `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar lucro" });
    }

    res.json({ total: result[0].total });
  });
});

app.listen(8080, () => {
  console.log("Sistema Franz rodando na porta 8080");
});
