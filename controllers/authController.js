const jwt = require("jsonwebtoken");
const Usuario = require("../models/Usuario");

exports.login = async (req, res) => {

    try {

        const { usuario, senha } = req.body;

        if (!usuario || !senha) {
            return res.status(400).json({ erro: "Usuário e senha são obrigatórios." });
        }

        const user = await Usuario.findOne({ usuario });

        if (!user) {
            return res.status(401).json({ erro: "Usuário ou senha inválidos." });
        }

        const senhaCorreta = await user.verificarSenha(senha);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: "Usuário ou senha inválidos." });
        }

        const token = jwt.sign(
            { id: user._id, usuario: user.usuario },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({ token, usuario: user.usuario });

    } catch (err) {

        res.status(500).json({ erro: "Erro ao fazer login." });

    }

};

exports.trocarSenha = async (req, res) => {

    try {

        const { senhaAtual, novaSenha } = req.body;

        if (!senhaAtual || !novaSenha) {
            return res.status(400).json({ erro: "Preencha todos os campos." });
        }

        if (novaSenha.length < 6) {
            return res.status(400).json({ erro: "A nova senha deve ter pelo menos 6 caracteres." });
        }

        const user = await Usuario.findById(req.usuario.id);

        const senhaCorreta = await user.verificarSenha(senhaAtual);

        if (!senhaCorreta) {
            return res.status(401).json({ erro: "Senha atual incorreta." });
        }

        user.senha = novaSenha;
        await user.save(); // o pre-save já criptografa automaticamente

        res.json({ mensagem: "Senha alterada com sucesso!" });

    } catch (err) {

        res.status(500).json({ erro: "Erro ao trocar senha." });

    }

};
