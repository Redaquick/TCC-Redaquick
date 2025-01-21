var tableUsuariosCadastrados = document.getElementById("tableUsuariosCadastrados");
var mensagemErroDiv = document.getElementById("mensagemErro");

var nomes = [];
var ras = [];
var emails = [];

var contadorId = 1;

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

        if (resultadoEnvioPHP.nomes) {
            tableUsuariosCadastrados.style.visibility = 'visible';

            nomes = resultadoEnvioPHP.nomes;
            ras = resultadoEnvioPHP.ras;
            emails = resultadoEnvioPHP.emails;

            nomes.forEach((nome, index) => {
                adicionarLinha(nome, ras[index], emails[index]);
            });

        } else {
            criarSectionMensagemErro();
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

    const editar = novaLinha.insertCell(3);
    const remover = novaLinha.insertCell(4);

    // Adiciona os ícones do Bootstrap
    editar.innerHTML = '<button id="edita' + contadorId + '" class="btn btn-warning btn-sm"><i class="bi bi-pencil"></i></button>';
    remover.innerHTML = '<button id="lixeira' + contadorId + '"class="btn btn-danger btn-sm"><i class="bi bi-trash"></i></button>';

    document.getElementById('edita' + contadorId).addEventListener('click', function () {
        salvarSessionContaCadastrada(emailAluno, raAluno, nomeAluno);
        window.location = "editaContaCadastrada_prof.php";
    });

    document.getElementById('lixeira' + contadorId).addEventListener('click', function () {
        excluirDados(emailAluno);
    });

    contadorId++;

    nome.textContent = nomeAluno;
    ra.textContent = raAluno;
    email.textContent = emailAluno;
}

function criarSectionMensagemErro() {
    const sectionRetangulo = document.createElement('section');
    const texto = document.createElement('p');

    texto.textContent = "Nenhuma Conta foi Encontrada";

    sectionRetangulo.classList.add('sectionMensagemErroPacote');
    sectionRetangulo.appendChild(texto);
    mensagemErroDiv.appendChild(sectionRetangulo);
}

async function excluirDados(email) {
    const dados = {
        emailUsuario: email
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP 
        const response = await fetch('https://feiratec.dev.br/redaquick/control/excluirInfoTabela.php', {
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

        if (resultadoEnvioPHP === "DeleteApagarInfoREALIZADO") {
            alert("Conta Apagada Com Sucesso");

            window.location.reload();
        }
    } catch (error) {
        console.error('Erro:', error);
    }
}

async function salvarSessionContaCadastrada(email, ra, nome) {
    const dados = {
        emailContaCadastrada: email,
        raContaCadastrada: ra,
        nomeContaCadastrada: nome
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP 
        const response = await fetch('https://feiratec.dev.br/redaquick/control/salvarSessionContaCadastrada.php', {
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

    } catch (error) {
        console.error('Erro:', error);
    }
}
