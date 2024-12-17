var divRedacoesCorrigidas = document.getElementById('divRedacoesCorrigidas');

var pacotes = [];
var idsPacoteAtual = [];

var nomes = [];
var nomeTarefas = [];
var nomeCursos = [];
var trimestres = [];
var anos = [];
var id_tarefas = [];

buscarRedacoesCorrigidasPHP();

async function buscarRedacoesCorrigidasPHP() {
    const dados = {
        mennsagem: 'teste'
    };

    try {
        const response = await fetch('https://feiratec.dev.br/redaquick/control/selecionarRedCorrigidasProf.php', {
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

        nomes = resultadoEnvioPHP.nomes;
        nomeTarefas = resultadoEnvioPHP.tarefas;
        nomeCursos = resultadoEnvioPHP.cursos;
        trimestres = resultadoEnvioPHP.trimestres;
        anos = resultadoEnvioPHP.anos;
        id_tarefas = resultadoEnvioPHP.id_tarefas;

        console.log(nomes + "\n" + nomeTarefas + "\n" + nomeCursos + "\n" + trimestres + "\n" + anos + "\n" + id_tarefas);

        if (nomes && nomeTarefas && nomeCursos && trimestres && anos && id_tarefas) {

            var nomesPacotes = [];
            var trimestresPacotes = [];
            var idTarefaAdicionado = [];
            var index = 0;

            if (id_tarefas.length > 1) {
                for (let i = index + 1; i < id_tarefas.length; i++) {
                    if (id_tarefas[index] == id_tarefas[i]) {
                        if (idTarefaAdicionado.includes(id_tarefas[index]) == false) {
                            nomesPacotes.push(nomeTarefas[index]);
                            idTarefaAdicionado.push(id_tarefas[index]);
                            idsPacoteAtual.push(index);

                            trimestresPacotes.push(trimestres[index]);
                        }
                    } else {
                        if (i > index + 1) {
                            if (idTarefaAdicionado.includes(id_tarefas[i]) == false) {
                                nomesPacotes.push(nomeTarefas[i]);
                                idTarefaAdicionado.push(id_tarefas[i]);
                                idsPacoteAtual.push(i);

                                trimestresPacotes.push(trimestres[i]);
                            }
                        } else {
                            nomesPacotes.push(nomeTarefas[index]);
                            idTarefaAdicionado.push(id_tarefas[index]);
                            idsPacoteAtual.push(index);

                            nomesPacotes.push(nomeTarefas[i]);
                            idTarefaAdicionado.push(id_tarefas[i]);
                            idsPacoteAtual.push(i);

                            trimestresPacotes.push(trimestres[index]);
                            trimestresPacotes.push(trimestres[i]);
                        }
                    }
                }
            } else {
                nomesPacotes.push(nomeTarefas[id_tarefas[index]]);
                trimestresPacotes.push(trimestres[index]);
            }

            console.log(nomesPacotes);
            console.log(idTarefaAdicionado);
            console.log(idsPacoteAtual);
            console.log(trimestresPacotes);

            for (let index = 0; index < nomesPacotes.length; index++) {
                criarPacotes(nomesPacotes[index], index, trimestresPacotes[index]);
            }
        } else {
            criarSectionMensagemErro();
        }

    } catch (error) {
        console.error('Erro:', error);
    }
}

function criarRetangulos(nomeAluno, curso, trimestre, ano) {
    console.log('Passou criarRetangulos');
    const sectionRetangulo = document.createElement('section');

    const textoNomeAluno = document.createElement('p');
    const textoCurso = document.createElement('p');
    const textoTrimestre = document.createElement('p');
    const textoAno = document.createElement('p');

    textoNomeAluno.textContent = nomeAluno;
    textoCurso.textContent = curso;
    textoTrimestre.textContent = trimestre + "° Trimestre";
    textoAno.textContent = ano;

    sectionRetangulo.appendChild(textoNomeAluno);
    sectionRetangulo.appendChild(textoCurso);
    sectionRetangulo.appendChild(textoTrimestre);
    sectionRetangulo.appendChild(textoAno);

    sectionRetangulo.classList.add('sectionTarefasRedacoes');

    divRedacoesCorrigidas.appendChild(sectionRetangulo);
}

function criarPacotes(nomeTarefa, index, trimestrePacote) {
    console.log('Passou criarPacotes');
    const sectionRetangulo = document.createElement('section');
    const textoNomeTarefa = document.createElement('p');
    const textoTrimestre = document.createElement('p');

    textoNomeTarefa.textContent = "Tarefa: " + nomeTarefa;
    textoTrimestre.textContent = trimestrePacote + "° Trimestre";

    sectionRetangulo.appendChild(textoNomeTarefa);
    sectionRetangulo.appendChild(textoTrimestre);

    sectionRetangulo.classList.add('sectionPacotes');

    divRedacoesCorrigidas.appendChild(sectionRetangulo);
    pacotes.push(sectionRetangulo);

    sectionRetangulo.addEventListener('click', () => {
        pacotes.forEach(element => {
            element.remove();
        });

        const valorIndiceAtualTarefa = idsPacoteAtual[index];
        const posicoesInformacoes = [];

        console.log("Valor Índice Tarefa Atual: " + valorIndiceAtualTarefa);
        console.log("Valor ID Tarefas: " + id_tarefas);

        id_tarefas.forEach((elemento, indice) => {
            if (elemento === id_tarefas[valorIndiceAtualTarefa]) {
                posicoesInformacoes.push(indice);
                console.log("Passou no foreach " + indice);
            }
        });
        console.log(posicoesInformacoes);

        console.log("Passou antes for");
        for (let i = 0; i < posicoesInformacoes.length; i++) {
            criarRetangulos(nomes[posicoesInformacoes[i]], nomeCursos[posicoesInformacoes[i]], trimestres[posicoesInformacoes[i]], anos[posicoesInformacoes[i]]);
            console.log("Passou no for");
        }
    });
}

function criarSectionMensagemErro() {
    const sectionRetangulo = document.createElement('section');
    const texto = document.createElement('p');

    texto.textContent = "Nenhuma Tarefa foi encontrada";

    sectionRetangulo.classList.add('sectionMensagemErroPacote');
    sectionRetangulo.appendChild(texto);
    divRedacoesCorrigidas.appendChild(sectionRetangulo);
}

