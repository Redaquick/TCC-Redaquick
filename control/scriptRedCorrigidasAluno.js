var divRedacoesCorrigidasAluno = document.getElementById('divRedacoesCorrigidasAluno');

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

        console.log(nomeTarefas + "\n" + nomeCursos + "\n" + trimestres + "\n" + anos + "\n" + id_redacoes);

        if (nomeTarefas && nomeCursos && trimestres && anos && id_redacoes) {

            for (let index = 0; index < nomeTarefas.length; index++) {
                criarRetangulos(nomeTarefas[index], nomeCursos[index], trimestres[index], anos[index], id_redacoes[index]);
            }

        }else{
            criarSectionMensagemErro();
        }

    } catch (error) {
        console.error('Erro:', error);
    }
}

function criarRetangulos(nomeTarefa, nomeCurso, trimestre, ano, id_redacao) {
    console.log('Passou criarRetangulos Aluno');
    const sectionRetangulo = document.createElement('section');

    const textoNomeTarefa = document.createElement('p');
    const textoCurso = document.createElement('p');
    const textoTrimestre = document.createElement('p');
    const textoAno = document.createElement('p');

    textoNomeTarefa.textContent = nomeTarefa;
    textoCurso.textContent = nomeCurso;
    textoTrimestre.textContent = trimestre + "° Trimestre";
    textoAno.textContent = ano;

    sectionRetangulo.appendChild(textoNomeTarefa);
    sectionRetangulo.appendChild(textoCurso);
    sectionRetangulo.appendChild(textoTrimestre);
    sectionRetangulo.appendChild(textoAno);

    sectionRetangulo.classList.add('sectionTarefasRedacoes');
    divRedacoesCorrigidasAluno.appendChild(sectionRetangulo);

    sectionRetangulo.style.zIndex = '1';

    sectionRetangulo.addEventListener('click', () => {
        console.log('idRedacao: ' + id_redacao)
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
