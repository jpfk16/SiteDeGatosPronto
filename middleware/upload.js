const multer = require("multer");

// Guarda o arquivo em memória (buffer) em vez de salvar em disco.
// Isso é necessário porque o Render (plano gratuito) apaga arquivos
// salvos localmente sempre que o servidor reinicia/dorme.
// O buffer é processado no controller e salvo direto no MongoDB.
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 8 * 1024 * 1024 // 8MB por foto enviada (antes de comprimir)
    }
});

module.exports = upload;
