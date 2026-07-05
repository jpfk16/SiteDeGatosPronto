// ── VERIFICAÇÃO DE LOGIN ──────────────────────────────────────────────
const token = localStorage.getItem("admin_token");

if (!token) {
    window.location.href = "admin-login.html";
}

// Mostra nome do usuário logado
document.getElementById("nome-admin").textContent =
    localStorage.getItem("admin_usuario") || "admin";

// ── ELEMENTOS ────────────────────────────────────────────────────────
const formGato           = document.getElementById("form-gato");
const listaGatos         = document.getElementById("lista-gatos");
const mensagemStatus     = document.getElementById("mensagem-status");
const overlay            = document.getElementById("modal-overlay");
const modalImg           = document.getElementById("modal-img");
const modalNome          = document.getElementById("modal-nome");
const modalDesc          = document.getElementById("modal-descricao");
const btnFechar          = document.getElementById("modal-fechar");
const modalSenhaOverlay  = document.getElementById("modal-senha-overlay");
const btnAbrirTrocarSenha= document.getElementById("btn-abrir-trocar-senha");
const fecharModalSenha   = document.getElementById("fechar-modal-senha");
const btnTrocarSenha     = document.getElementById("btn-trocar-senha");
const msgTrocarSenha     = document.getElementById("msg-trocar-senha");

// ── LOGOUT ───────────────────────────────────────────────────────────
document.getElementById("btn-logout").addEventListener("click", () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_usuario");
    window.location.href = "admin-login.html";
});

// ── MODAL GATO ───────────────────────────────────────────────────────
function abrirModal(imagem, nome, descricao) {
    modalImg.src              = imagem;
    modalNome.textContent     = nome;
    modalDesc.textContent     = descricao;
    overlay.classList.add("ativo");
    document.body.style.overflow = "hidden";
}

function fecharModal() {
    overlay.classList.remove("ativo");
    document.body.style.overflow = "";
}

btnFechar.addEventListener("click", fecharModal);
overlay.addEventListener("click", (e) => { if (e.target === overlay) fecharModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") { fecharModal(); fecharSenhaModal(); } });

// ── MODAL TROCAR SENHA ───────────────────────────────────────────────
function fecharSenhaModal() {
    modalSenhaOverlay.classList.remove("ativo");
    document.body.style.overflow = "";
    document.getElementById("senha-atual").value = "";
    document.getElementById("nova-senha").value = "";
    document.getElementById("confirmar-senha").value = "";
    msgTrocarSenha.textContent = "";
}

btnAbrirTrocarSenha.addEventListener("click", () => {
    modalSenhaOverlay.classList.add("ativo");
    document.body.style.overflow = "hidden";
});

fecharModalSenha.addEventListener("click", fecharSenhaModal);
modalSenhaOverlay.addEventListener("click", (e) => {
    if (e.target === modalSenhaOverlay) fecharSenhaModal();
});

btnTrocarSenha.addEventListener("click", async () => {

    const senhaAtual     = document.getElementById("senha-atual").value;
    const novaSenha      = document.getElementById("nova-senha").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    msgTrocarSenha.style.color = "black";
    msgTrocarSenha.textContent = "";

    if (!senhaAtual || !novaSenha || !confirmarSenha) {
        msgTrocarSenha.style.color = "red";
        msgTrocarSenha.textContent = "Preencha todos os campos.";
        return;
    }

    if (novaSenha !== confirmarSenha) {
        msgTrocarSenha.style.color = "red";
        msgTrocarSenha.textContent = "As senhas não coincidem.";
        return;
    }

    if (novaSenha.length < 6) {
        msgTrocarSenha.style.color = "red";
        msgTrocarSenha.textContent = "A nova senha deve ter pelo menos 6 caracteres.";
        return;
    }

    try {

        msgTrocarSenha.textContent = "Salvando...";

        const resposta = await fetch("/auth/trocar-senha", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ senhaAtual, novaSenha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) throw new Error(dados.erro);

        msgTrocarSenha.style.color = "green";
        msgTrocarSenha.textContent = "Senha alterada com sucesso!";

        setTimeout(fecharSenhaModal, 1500);

    } catch (err) {

        msgTrocarSenha.style.color = "red";
        msgTrocarSenha.textContent = err.message || "Erro ao trocar senha.";

    }

});

// ── LISTA DE GATOS ───────────────────────────────────────────────────
async function carregarLista() {

    try {

        const resposta = await fetch("/gatos");
        const gatos    = await resposta.json();

        if (gatos.length === 0) {
            listaGatos.innerHTML = "<p>Nenhum gato cadastrado ainda.</p>";
            return;
        }

        listaGatos.innerHTML = gatos.map(gato => {

            let img;
            if (gato.imagem === "gato-padrao.png") {
                img = `/img/${gato.imagem}`;
            } else if (gato.imagem.startsWith("data:")) {
                img = gato.imagem;
            } else {
                img = `/uploads/${gato.imagem}`;
            }

            const nomeEsc = gato.nome.replace(/"/g, "&quot;");
            const descEsc = gato.descricao.replace(/"/g, "&quot;");

            return `
                <div class="card-admin"
                     data-imagem="${img}"
                     data-nome="${nomeEsc}"
                     data-descricao="${descEsc}">
                    <img src="${img}" alt="${nomeEsc}">
                    <h3>${gato.nome}</h3>
                    <p>${gato.descricao}</p>
                    <button class="btn-excluir" data-id="${gato._id}">Excluir</button>
                </div>
            `;

        }).join("");

    } catch (erro) {
        listaGatos.innerHTML = "<p>Erro ao carregar gatos.</p>";
        console.error(erro);
    }

}

// ── CLIQUE NO CARD ───────────────────────────────────────────────────
listaGatos.addEventListener("click", async (e) => {

    if (e.target.classList.contains("btn-excluir")) {

        const id = e.target.dataset.id;
        if (!confirm("Tem certeza que deseja excluir este gato?")) return;

        try {

            const r = await fetch(`/gatos/${id}`, {
                method: "DELETE",
                headers: { "Authorization": `Bearer ${token}` }
            });

            if (!r.ok) {
                const err = await r.json();
                if (r.status === 401 || r.status === 403) {
                    alert("Sessão expirada. Faça login novamente.");
                    window.location.href = "admin-login.html";
                    return;
                }
                throw new Error(err.erro);
            }

            carregarLista();

        } catch (err) {
            alert(err.message || "Erro ao excluir.");
        }

        return;

    }

    const card = e.target.closest(".card-admin");
    if (card) {
        abrirModal(card.dataset.imagem, card.dataset.nome, card.dataset.descricao);
    }

});

// ── CADASTRO ─────────────────────────────────────────────────────────
formGato.addEventListener("submit", async (e) => {

    e.preventDefault();
    mensagemStatus.textContent = "Enviando...";
    mensagemStatus.style.color = "black";

    try {

        const r = await fetch("/gatos", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: new FormData(formGato)
        });

        if (!r.ok) {
            const err = await r.json();
            if (r.status === 401 || r.status === 403) {
                alert("Sessão expirada. Faça login novamente.");
                window.location.href = "admin-login.html";
                return;
            }
            throw new Error(err.erro || "Erro");
        }

        mensagemStatus.textContent = "Gato cadastrado com sucesso!";
        mensagemStatus.style.color = "green";
        formGato.reset();
        carregarLista();

    } catch (err) {
        mensagemStatus.textContent = err.message;
        mensagemStatus.style.color = "red";
    }

});

document.addEventListener("DOMContentLoaded", carregarLista);
