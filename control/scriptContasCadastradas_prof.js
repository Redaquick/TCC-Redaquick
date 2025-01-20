var tableUsuariosCadastrados = document.getElementById("tableUsuariosCadastrados");

var nomes = [];
var ras = [];
var emails = [];

buscarDadosTabela();

async function buscarDadosTabela() {
    const dados = {
        mensagem: "Enviado"
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP
        const response = await fetch('https://feiratec.dev.br/redaquick/control/buscarDadosTabelaProf.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }

        const resultadoEnvioPHP = await response.json();
        console.log(resultadoEnvioPHP);

        if (resultadoEnvioPHP != null) {
            nomes = resultadoEnvioPHP.nomes;
            ras = resultadoEnvioPHP.ras;
            emails = resultadoEnvioPHP.emails;

            nomes.forEach((nome, index) => {
                adicionarLinha(nome, ras[index], emails[index]);
            });
        }

    } catch (error) {
        console.error('Erro:', error);
    }
}

function adicionarLinha(nomeAluno, raAluno, emailAluno) {

    const tbody = tableUsuariosCadastrados.getElementsByTagName("tbody")[0];

    const novaLinha = tbody.insertRow();

    const nome = novaLinha.insertCell(0);
    const ra = novaLinha.insertCell(1);
    const email = novaLinha.insertCell(2);

    nome.textContent = nomeAluno;
    ra.textContent = raAluno;
    email.textContent = emailAluno;
}