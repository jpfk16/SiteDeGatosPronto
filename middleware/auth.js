const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ erro: "Acesso negado. Faça login." });
    }

    try {

        const dados = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = dados;
        next();

    } catch (err) {

        return res.status(403).json({ erro: "Token inválido ou expirado." });

    }

};
