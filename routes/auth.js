const express = require("express");
const router = express.Router();
const controller = require("../controllers/authController");
const auth = require("../middleware/auth");

// Login público
router.post("/login", controller.login);

// Trocar senha — só logado
router.post("/trocar-senha", auth, controller.trocarSenha);

module.exports = router;
