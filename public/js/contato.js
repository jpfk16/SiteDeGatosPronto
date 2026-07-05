const formContato = document.getElementById("form-contato");
const mensagemStatus = document.getElementById("mensagem-status-contato");

if (formContato) {

    formContato.addEventListener("submit", async (evento) => {

        evento.preventDefault();

        mensagemStatus.textContent = "Enviando...";
        mensagemStatus.style.color = "black";

        try {

            const dados = new FormData(formContato);
            const objeto = Object.fromEntries(dados.entries());

            const resposta = await fetch("/contato", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(objeto)
            });

            if (!resposta.ok) {
                const erro = await resposta.json();
                throw new Error(erro.erro || "Erro ao enviar.");
            }

            mensagemStatus.textContent = "Mensagem enviada com sucesso! Em breve entraremos em contato.";
            mensagemStatus.style.color = "green";

            formContato.reset();

        } catch (erro) {

            mensagemStatus.textContent = erro.message;
            mensagemStatus.style.color = "red";

        }

    });

}
