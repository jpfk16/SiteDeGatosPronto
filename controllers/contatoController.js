const Contato = require("../models/Contato");

exports.listar = async (req, res) => {

    const contatos = await Contato.find().sort({ criadoEm: -1 });

    res.json(contatos);

}

exports.criar = async (req, res) => {

    try {

        const contato = new Contato({
            nome: req.body.nome,
            telefone: req.body.telefone,
            email: req.body.email,
            cpf: req.body.cpf,
            estado: req.body.estado,
            cidade: req.body.cidade,
            mensagem: req.body.mensagem
        });

        await contato.save();

        res.status(201).json({ mensagem: "Contato enviado com sucesso!" });

    } catch (err) {

        res.status(400).json({ erro: "Não foi possível enviar o contato. Verifique os campos." });

    }

}
