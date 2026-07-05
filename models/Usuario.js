const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const usuarioSchema = new mongoose.Schema({

    usuario: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    senha: {
        type: String,
        required: true
    },

    criadoEm: {
        type: Date,
        default: Date.now
    }

});

// Criptografa a senha antes de salvar
usuarioSchema.pre("save", async function (next) {

    if (!this.isModified("senha")) return next();

    this.senha = await bcrypt.hash(this.senha, 10);
    next();

});

// Compara senha digitada com a criptografada
usuarioSchema.methods.verificarSenha = async function (senhaDigitada) {
    return bcrypt.compare(senhaDigitada, this.senha);
};

module.exports = mongoose.model("Usuario", usuarioSchema);
