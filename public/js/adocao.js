async function carregarGatos() {

    const containers = document.querySelectorAll(".cards-container");
    if (containers.length === 0) return;

    try {

        const resposta = await fetch("/gatos");
        const gatos = await resposta.json();

        if (gatos.length === 0) {
            containers[0].innerHTML = "<p style='color:white'>Nenhum gato cadastrado ainda.</p>";
            return;
        }

        const meio = Math.ceil(gatos.length / containers.length);

        containers.forEach((container, indice) => {
            const parte = gatos.slice(indice * meio, indice * meio + meio);
            container.innerHTML = parte.map(gato => criarCardHTML(gato)).join("");
        });

        // Adiciona evento de clique em todos os cards
        document.querySelectorAll(".card").forEach(card => {
            card.addEventListener("click", () => {
                abrirModal(
                    card.dataset.imagem,
                    card.dataset.nome,
                    card.dataset.descricao
                );
            });
        });

    } catch (erro) {
        containers[0].innerHTML = "<p style='color:white'>Não foi possível carregar os gatos.</p>";
        console.error(erro);
    }

}

function criarCardHTML(gato) {

    let caminhoImagem;
    if (gato.imagem === "gato-padrao.png") {
        caminhoImagem = `/img/${gato.imagem}`;
    } else if (gato.imagem.startsWith("data:")) {
        // Foto nova, salva em base64 direto no MongoDB
        caminhoImagem = gato.imagem;
    } else {
        // Compatibilidade com gatos cadastrados antes da migração (arquivo em /uploads)
        caminhoImagem = `/uploads/${gato.imagem}`;
    }

    // Escapa aspas para não quebrar o data-attribute
    const nomeEsc = gato.nome.replace(/"/g, "&quot;");
    const descEsc = gato.descricao.replace(/"/g, "&quot;");

    return `
        <div class="card"
             data-imagem="${caminhoImagem}"
             data-nome="${nomeEsc}"
             data-descricao="${descEsc}">
            <img src="${caminhoImagem}" alt="${nomeEsc}"
                 style="width:100%; border-radius:8px; height:220px; object-fit:cover;">
            <h3 style="margin-top:10px">${gato.nome}</h3>
        </div>
    `;

}

// Modal
const overlay   = document.getElementById("modal-overlay");
const modalImg  = document.getElementById("modal-img");
const modalNome = document.getElementById("modal-nome");
const modalDesc = document.getElementById("modal-descricao");
const btnFechar = document.getElementById("modal-fechar");

function abrirModal(imagem, nome, descricao) {
    modalImg.src      = imagem;
    modalNome.textContent = nome;
    modalDesc.textContent = descricao;
    overlay.classList.add("ativo");
    document.body.style.overflow = "hidden";
}

function fecharModal() {
    overlay.classList.remove("ativo");
    document.body.style.overflow = "";
}

btnFechar.addEventListener("click", fecharModal);

overlay.addEventListener("click", (e) => {
    if (e.target === overlay) fecharModal();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharModal();
});

document.addEventListener("DOMContentLoaded", carregarGatos);
