const mongoose = require("mongoose");

const contatoSchema = new mongoose.Schema({

    nome: {
        type: String,
        required: true
    },

    telefone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    cpf: {
        type: String,
        required: true
    },

    estado: {
        type: String,
        required: true
    },

    cidade: {
        type: String,
        required: true
    },

    mensagem: {
        type: String,
        required: true
    },

    criadoEm: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Contato", contatoSchema);
