const mongoose = require("mongoose");

const gatoSchema = new mongoose.Schema({

    nome:{
        type:String,
        required:true
    },

    descricao:{
        type:String,
        required:true
    },

    imagem:{
        type:String,
        required:true
    }

});

module.exports = mongoose.model("Gato",gatoSchema);