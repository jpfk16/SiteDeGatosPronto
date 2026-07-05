const mongoose = require("mongoose");

async function conectarBanco() {

    try{

        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB conectado!");

    }

    catch(err){

        console.log(err);

    }

}

module.exports = conectarBanco;