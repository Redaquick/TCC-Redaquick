var divRedacoesCorrigidas = document.getElementById('divRedacoesCorrigidas');
var relatiorioBtn = document.getElementById('configBtnGerarRelatorio');

var pacotes = [];
var idsPacoteAtual = [];

var nomes = [];
var nomeTarefas = [];
var nomeCursos = [];
var trimestres = [];
var anos = [];
var id_tarefas = [];
var id_alunos = [];
var id_redacoes = [];

var id_redacoes_atuais = [];
var nomesAtuais = [];
var cursosAtuais = [];
var nomeTarefaAtual;

var posicoesInformacoes = [];

var RAs = [];
var notasEnem = [];
var notasDecimal = [];

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
        id_alunos = resultadoEnvioPHP.id_alunos;
        id_redacoes = resultadoEnvioPHP.id_redacoes;

        console.log(nomes + "\n" + nomeTarefas + "\n" + nomeCursos + "\n" + trimestres + "\n" + anos + "\n" + id_tarefas + "\n" + id_alunos + "\n" + id_redacoes);

        if (nomes && nomeTarefas && nomeCursos && trimestres && anos && id_tarefas && id_alunos && id_redacoes) {

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

function criarRetangulos(nomeAluno, curso, trimestre, ano, indice_redacao) {
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

    const id_redacao_atual = id_redacoes[posicoesInformacoes[indice_redacao]];

    sectionRetangulo.addEventListener('click', () => {
        console.log("id_redacao_atual: " + id_redacao_atual);
        SalvarIdRedacaoSelecionada(id_redacao_atual);
    });
}

function criarPacotes(nomeTarefa, index, trimestrePacote) {
    var nomeTarefaAtual = nomeTarefa;
    console.log('Passou criarPacotes');
    const sectionRetangulo = document.createElement('section');
    const textoNomeTarefa = document.createElement('p');
    const textoTrimestre = document.createElement('p');

    textoNomeTarefa.textContent = "Tarefa: " + nomeTarefaAtual;
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

        id_redacoes_atuais = [];
        nomesAtuais = [];
        cursosAtuais = [];

        for (let i = 0; i < posicoesInformacoes.length; i++) {
            criarRetangulos(nomes[posicoesInformacoes[i]], nomeCursos[posicoesInformacoes[i]], trimestres[posicoesInformacoes[i]], anos[posicoesInformacoes[i]], i);

            id_redacoes_atuais.push(id_redacoes[posicoesInformacoes[i]]);
            nomesAtuais.push(nomes[posicoesInformacoes[i]]);
            cursosAtuais.push(nomeCursos[posicoesInformacoes[i]]);

            nomeTarefaAtual = nomeTarefas[posicoesInformacoes[i]];

            relatiorioBtn.style.display = 'block';

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

        if (resultadoEnvioPHP) {
            window.location = "../view/editaRedCorrigida.html";
        }

    } catch (error) {
        console.error('Erro:', error);
    }
}

async function gerarRelatorio() {
    const dados = {
        nomes: nomesAtuais,
        ids: id_redacoes_atuais
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP
        const response = await fetch('https://feiratec.dev.br/redaquick/control/buscarNotasCorrigidas.php', {
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

        RAs = resultadoEnvioPHP.RAs;
        notasEnem = resultadoEnvioPHP.notasEnem;
        notasDecimal = resultadoEnvioPHP.notasDecimal;

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Configura o título do relatório
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold'); // Define a fonte como negrito
        doc.text('Relatório com Notas', 80, 10);

        // Configura os cabeçalhos da tabela com espaçamento ajustado
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal'); // Volta para a fonte padrão
        doc.text('Nome', 47, 20);
        doc.text('RA', 107, 20);
        doc.text('Curso', 129, 20);
        doc.text('Nota (ENEM)', 150, 20);
        doc.text('Nota (Decimal)', 180, 20);

        // Desenha as barras verticais para separar as colunas
        doc.setDrawColor(0); // Define a cor da linha (preto)
        doc.setLineWidth(0.3); // Define a largura da linha
        doc.line(100, 15, 100, 290); // Linha vertical para separar 'Nome' de 'RA'
        doc.line(120, 15, 120, 290); // Linha vertical para separar 'RA' de 'Curso'
        doc.line(147, 15, 147, 290); // Linha vertical para separar 'Curso' de 'Nota ENEM'
        doc.line(177, 15, 177, 290); // Linha vertical para separar 'Nota ENEM' de 'Nota Decimal'
        doc.line(0, 22, 210, 22);

        let y = 30; // Posição inicial no eixo Y
        for (let i = 0; i < nomesAtuais.length; i++) {
            // Quebra o nome em várias linhas, se necessário
            const nomeQuebrado = doc.splitTextToSize(nomesAtuais[i], 40); // 90 é a largura máxima permitida para o nome

            // Desenha o nome, que pode ter múltiplas linhas
            for (let j = 0; j < nomeQuebrado.length; j++) {
                doc.text(nomeQuebrado[j], 3, y + (j * 6)); // Ajusta o Y para cada linha do nome
            }

            // Desenha a linha separadora, ajustada com base no número de linhas do nome
            const linhaY = y + nomeQuebrado.length * 6; // Ajusta a linha de separação após o nome
            // Desenha as outras informações na mesma linha
            doc.text(`${RAs[i]}`, 104, linhaY);
            doc.text(`${cursosAtuais[i]}`, 124, linhaY);
            doc.text(`${notasEnem[i]}`, 158, linhaY);
            doc.text(`${notasDecimal[i]}`, 188, linhaY);


            doc.line(0, linhaY+2, 210, linhaY+2);

            // Ajusta o valor de Y para a próxima linha
            y += nomeQuebrado.length * 6; // Aumenta Y conforme o número de linhas do nome
        }

        // Gerar o PDF como um Blob e oferecer o download
        const pdfBlob = doc.output('blob');
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = `Relatório Notas.pdf`;
        link.click();

    } catch (error) {
        console.error('Erro:', error);
    }
}
