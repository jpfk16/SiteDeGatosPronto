const Gato = require("../models/Gato");
const sharp = require("sharp");

exports.listar = async (req, res) => {

    try {

        const gatos = await Gato.find();
        res.json(gatos);

    } catch (err) {

        res.status(500).json({ erro: "Erro ao buscar gatos." });

    }

}

exports.criar = async (req, res) => {

    try {

        if (!req.body.nome || !req.body.descricao) {
            return res.status(400).json({ erro: "Nome e descrição são obrigatórios." });
        }

        let imagemFinal = "gato-padrao.png";

        if (req.file) {

            // Redimensiona e comprime a foto antes de guardar no banco,
            // pra não estourar o limite de espaço do MongoDB gratuito.
            const bufferComprimido = await sharp(req.file.buffer)
                .resize({ width: 800, withoutEnlargement: true })
                .jpeg({ quality: 75 })
                .toBuffer();

            imagemFinal = `data:image/jpeg;base64,${bufferComprimido.toString("base64")}`;

        }

        const gato = new Gato({

            nome: req.body.nome,

            descricao: req.body.descricao,

            imagem: imagemFinal

        });

        await gato.save();

        res.status(201).json(gato);

    } catch (err) {

        console.error(err);
        res.status(400).json({ erro: "Erro ao cadastrar gato." });

    }

}

exports.excluir = async (req, res) => {

    try {

        const gato = await Gato.findByIdAndDelete(req.params.id);

        if (!gato) {
            return res.status(404).json({ mensagem: "Gato não encontrado." });
        }

        res.json({

            mensagem: "Excluído com sucesso"

        });

    } catch (err) {

        res.status(400).json({ erro: "Erro ao excluir gato." });

    }

}
