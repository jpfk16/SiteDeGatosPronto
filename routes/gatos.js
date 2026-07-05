const express = require("express");
const router = express.Router();
const controller = require("../controllers/gatoController");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

// Listar gatos — público
router.get("/", controller.listar);

// Cadastrar e excluir — somente admin autenticado
router.post("/", auth, upload.single("imagem"), controller.criar);
router.delete("/:id", auth, controller.excluir);

module.exports = router;
