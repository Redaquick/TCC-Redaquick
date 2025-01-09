var divRedacoesCorrigidasAluno = document.getElementById('divRedacoesCorrigidasAluno');
var nomes = [];

var id_redacoes_atuais = [];
var nomesAtuais = [];
var cursosAtuais = [];
var nomeTarefaAtual;
var nomeTarefaRelatorio;

var posicoesInformacoes = [];

var RAs = [];
var notasEnem = [];
var notasDecimal = [];
var notas_enem = [];

buscarRedacoesCorrigidasAlunoPHP();

async function buscarRedacoesCorrigidasAlunoPHP() {
    const dados = {
        mensagem: "enviada"
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP
        const response = await fetch('https://feiratec.dev.br/redaquick/control/selecionarRedCorrigidasAluno.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados) // Converte os dados para JSON e os envia no corpo da requisição
        });

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }

        const resultadoEnvioPHP = await response.json();

        nomeTarefas = resultadoEnvioPHP.tarefas;
        nomeCursos = resultadoEnvioPHP.cursos;
        trimestres = resultadoEnvioPHP.trimestres;
        anos = resultadoEnvioPHP.anos;
        id_redacoes = resultadoEnvioPHP.id_redacoes;
        notas_enem = resultadoEnvioPHP.notas_enem;

        console.log(nomeTarefas + "\n" + nomeCursos + "\n" + trimestres + "\n" + anos + "\n" + id_redacoes + "\n" + notas_enem);

        if (nomeTarefas && nomeCursos && trimestres && anos && id_redacoes && notas_enem) {

            for (let index = 0; index < nomeTarefas.length; index++) {
                criarRetangulos(nomeTarefas[index], nomeCursos[index], trimestres[index], anos[index], id_redacoes[index], notas_enem[index]);
            }

        }else{
            criarSectionMensagemErro();
        }

    } catch (error) {
        console.error('Erro:', error);
    }
}

function criarRetangulos(nomeTarefa, nomeCurso, trimestre, ano, id_redacao, nota) {
    console.log('Passou criarRetangulos Aluno');
    const sectionRetangulo = document.createElement('section');

    const textoNomeTarefa = document.createElement('p');
    const textoCurso = document.createElement('p');
    const textoTrimestre = document.createElement('p');
    const textoAno = document.createElement('p');
    const textoNota = document.createElement('p');

    textoNomeTarefa.textContent = nomeTarefa;
    textoCurso.textContent = nomeCurso;
    textoTrimestre.textContent = trimestre + "° Trimestre";
    textoAno.textContent = ano;
    textoNota.textContent =  "Nota: " + nota;

    sectionRetangulo.appendChild(textoNomeTarefa);
    sectionRetangulo.appendChild(textoCurso);
    sectionRetangulo.appendChild(textoTrimestre);
    sectionRetangulo.appendChild(textoAno);
    sectionRetangulo.appendChild(textoNota);

    sectionRetangulo.classList.add('sectionTarefasRedacoes');
    divRedacoesCorrigidasAluno.appendChild(sectionRetangulo);

    sectionRetangulo.style.zIndex = '1';

    sectionRetangulo.addEventListener('click', () => {
        console.log('idRedacao: ' + id_redacao)
        SalvarIdRedacaoSelecionada(id_redacao);
    });
}

function criarSectionMensagemErro() {
    const sectionRetangulo = document.createElement('section');
    const texto = document.createElement('p');

    texto.textContent = "Nenhuma Redação foi encontrada";

    sectionRetangulo.classList.add('sectionMensagemErroPacote');
    sectionRetangulo.appendChild(texto);
    divRedacoesCorrigidasAluno.appendChild(sectionRetangulo);
}

async function SalvarIdRedacaoSelecionada(id_redacao_atual) {
    const dados = {
        id_redacaoAtual: id_redacao_atual
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP
        const response = await fetch('https://feiratec.dev.br/redaquick/control/salvarIDredAtual.php', {
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

        if (resultadoEnvioPHP.resposta === 'idSalvoComSucesso') {
            window.location = "../view/CorrecaoAluno.html";
        }

    } catch (error) {
        console.error('Erro:', error);
    }
}