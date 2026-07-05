// Script para criar o primeiro usuário admin
// Execute com: node criar-admin.js

require("dotenv").config();
const mongoose = require("mongoose");
const Usuario = require("./models/Usuario");

const USUARIO = "admin";       // Troque pelo usuário que quiser
const SENHA   = "senha123";    // Troque pela senha que quiser

async function criarAdmin() {

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB conectado!");

    const existe = await Usuario.findOne({ usuario: USUARIO });

    if (existe) {
        console.log(`Usuário "${USUARIO}" já existe no banco.`);
        process.exit(0);
    }

    const novo = new Usuario({ usuario: USUARIO, senha: SENHA });
    await novo.save();

    console.log(`✅ Admin criado com sucesso!`);
    console.log(`   Usuário: ${USUARIO}`);
    console.log(`   Senha:   ${SENHA}`);
    console.log(`\nAgora você já pode fazer login em /admin-login.html`);

    process.exit(0);

}

criarAdmin().catch(err => {
    console.error("Erro:", err);
    process.exit(1);
});
