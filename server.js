require("dotenv").config();

const path = require("path");
const express = require("express");
const cors = require("cors");

const conectarBanco = require("./config/database");

const app = express();

conectarBanco();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Arquivos enviados (fotos dos gatos)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Site (HTML, CSS, JS, imagens fixas)
app.use(express.static(path.join(__dirname, "public")));

// API
app.use("/gatos", require("./routes/gatos"));
app.use("/contato", require("./routes/contato"));
app.use("/auth", require("./routes/auth"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor iniciado na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
});
