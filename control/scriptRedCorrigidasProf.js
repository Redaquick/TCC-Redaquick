var divRedacoesCorrigidas = document.getElementById('divRedacoesCorrigidas');

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

        let nomes = resultadoEnvioPHP.nomes;
        let nomeTarefas = resultadoEnvioPHP.tarefas;
        let nomeCursos = resultadoEnvioPHP.cursos;
        let trimestres = resultadoEnvioPHP.trimestres;
        let anos = resultadoEnvioPHP.anos;

        console.log(nomes + "\n" + nomeTarefas + "\n" + nomeCursos + "\n" + trimestres + "\n" + anos);

        for (let i = 0; i < nomes.length; i++) {
            criarRetangulos(nomes[i], nomeTarefas[i], nomeCursos[i], trimestres[i], anos[i]); 
        }

    } catch (error) {
        console.error('Erro:', error);
    }
}

function criarRetangulos(nomeAluno, nomeTarefa, curso, trimestre, ano) {
    console.log('Passou aqui');
    const sectionRetangulo = document.createElement('section');

    const textoNomeAluno = document.createElement('p');
    const textoNomeTarefa = document.createElement('p');
    const textoCurso = document.createElement('p');
    const textoTrimestre = document.createElement('p');
    const textoAno = document.createElement('p');

    textoNomeAluno.textContent = nomeAluno;
    textoNomeTarefa.textContent = nomeTarefa;
    textoCurso.textContent = curso;
    textoTrimestre.textContent = trimestre;
    textoAno.textContent = ano;

    sectionRetangulo.appendChild(textoNomeAluno);
    sectionRetangulo.appendChild(textoNomeTarefa);
    sectionRetangulo.appendChild(textoCurso);
    sectionRetangulo.appendChild(textoTrimestre);
    sectionRetangulo.appendChild(textoAno);

    divRedacoesCorrigidas.appendChild(sectionRetangulo);
}

