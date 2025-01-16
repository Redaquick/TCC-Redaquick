var fabricCanvas = new fabric.Canvas('fabric-canvas');
var canvas = document.getElementById("RenderPDF");
var context = canvas.getContext("2d");

var passarPagButton = document.getElementById("passarPag");
var voltarPagButton = document.getElementById("voltarPag");
var voltarParaMenu = document.getElementById("configBtnVoltarCorrigir");
var aumentarZoom = document.getElementById("aumentarZoom");
var diminuirZoom = document.getElementById("diminuirZoom");
var valorZoomTexto = document.getElementById("CampoTextoZoom");
var sectionCompetenciasContainer = document.getElementById("competenciasContainer");
var sectionEstanteComentarios = document.getElementById("estanteComent");
var sectionComentariosCompetencias = document.getElementById("comentCompetencias");
var drawPagButton = document.getElementById("draw");
var backPagButton = document.getElementById("back");
var desativarPagButton = document.getElementById("desativar");
var toolbar = document.getElementById("toolbar");
var elementosLateraisCanvas = document.getElementById("elementosLateraisCanvas");
var firstinputPDFupload = document.getElementById("firstUploadPDF");
var inputPDFupload = document.getElementById("uploadPDF");
var sectionCorrigirRedacao = document.getElementById("sectionCorrigirRedacao");
var topBar = document.getElementById("barrinha");
var topBarCorrecao = document.getElementById("barrinhaCorrecaoRedaquick");
var buttonCorPrincipal = document.getElementById('buttonCorPrincipal');
var paleteCores = document.getElementById('paleteCores');

var contadorPagina = 1;
var zoom = 1;
var tamanhoPagsDoc = 0;
var valorZoomPercentual = 0;

var valorNotaTextoC1 = document.getElementById("competencia1");
var valorNotaTextoC2 = document.getElementById("competencia2");
var valorNotaTextoC3 = document.getElementById("competencia3");
var valorNotaTextoC4 = document.getElementById("competencia4");
var valorNotaTextoC5 = document.getElementById("competencia5");

var notaInicial = 200;

var notaC1;
var notaC2;
var notaC3;
var notaC4;
var notaC5;

var comentarioCompetencia1 = document.createElement('textarea');
var comentarioCompetencia2 = document.createElement('textarea');
var comentarioCompetencia3 = document.createElement('textarea');
var comentarioCompetencia4 = document.createElement('textarea');
var comentarioCompetencia5 = document.createElement('textarea');

var botaoDiminuiC1 = document.getElementById("diminuiNotaC1");
var botaoAumentaC1 = document.getElementById("aumentaNotaC1");
var botaoDiminuiC2 = document.getElementById("diminuiNotaC2");
var botaoAumentaC2 = document.getElementById("aumentaNotaC2");
var botaoDiminuiC3 = document.getElementById("diminuiNotaC3");
var botaoAumentaC3 = document.getElementById("aumentaNotaC3");
var botaoDiminuiC4 = document.getElementById("diminuiNotaC4");
var botaoAumentaC4 = document.getElementById("aumentaNotaC4");
var botaoDiminuiC5 = document.getElementById("diminuiNotaC5");
var botaoAumentaC5 = document.getElementById("aumentaNotaC5");

var armazenaComentarios = [];

var arquivoRenderizado;

var controleModoDesenho = false;
var canvasStates = [];
var currentStateIndex = -1;

var heightImagem = 0;
var widthImagem = 0;

var objetosDesenhados = [];

var controleDesenhaRet = false;
var contadorCliqueRet = 0;
var xCoordenadaFirst = 0;
var yCoordenadaFirst = 0;
var xCoordenadaSecond = 0;
var yCoordenadaSecond = 0;

var controladorOnOffCompetencias = true;
var campoCompetencias = document.getElementById("campoCompetenciasBtn");

var controladorOnOffComentarios = false;
var campoComentarios = document.getElementById("estanteComentariosBtn");

var controladorOnOffcomentariosCompetencias = true;
var campoComentarios = document.getElementById("comentariosCompetenciasBtn");

var mouseDown = false;

var controleCliquePaleteCores = false;
var corLinha = "red";
var corRetangulo = 'rgba(255, 0, 0, 0.2)';

var controleSalvarCorrecao = false;

var imagemURL;
var ra;
var turma;
var trimestre;
var ano;
var id_atividade;
var id_instituicao;

configIniciais();

async function configIniciais() {
    await buscarJson();
    await buscarNotas();
    await buscarComentarios();
    await buscarComentariosPadrao();
}

// Função para salvar o estado atual do canvas
function saveCanvasState() {
    // Adiciona o estado atual do canvas à lista de estados
    canvasStates.push(fabricCanvas.toJSON());
}

// Evento para ativar o modo de desenho com pincel vermelho e largura 2
document.getElementById('draw').addEventListener('click', () => {
    controleModoDesenho = true;
    controleDesenhaRet = false;

    if (currentStateIndex == -1) {
        saveCanvasState();
        currentStateIndex++;
    }

    fabricCanvas.isDrawingMode = true;
    fabricCanvas.freeDrawingBrush.color = corLinha;
    fabricCanvas.freeDrawingBrush.width = 2;

    console.log(currentStateIndex);
    console.log(canvasStates);
});

// Evento para voltar para o momento anterior ao último desenho
document.getElementById('back').addEventListener('click', () => {
    fabricCanvas.isDrawingMode = false;
    controleModoDesenho = false;

    if (currentStateIndex > 0) {
        currentStateIndex--;
        // Restaura o estado anterior do canvas
        fabricCanvas.loadFromJSON(canvasStates[currentStateIndex], () => {
            fabricCanvas.renderAll();

            if (objetosDesenhados[objetosDesenhados.length - 1].type === 'rect') {
                var ultimoComentario = armazenaComentarios.pop();
                ultimoComentario.remove();
            }

            canvasStates.pop();

            console.log("Clicou em Voltar");
            console.log(canvasStates);
            console.log(currentStateIndex);

            objetosDesenhados = fabricCanvas.getObjects();
            imutaObjeto();
            console.log(objetosDesenhados);
        });

    } else {
        console.log("Nenhuma ação anterior para desfazer.");
    }
});

document.getElementById('desativar').addEventListener('click', () => {
    fabricCanvas.isDrawingMode = false;
    controleModoDesenho = false;
    controleDesenhaRet = false;
});

// Evento para parar o DrawingMode
fabricCanvas.on('mouse:up', function (event) {

    var pointer = fabricCanvas.getPointer(event.e);

    if (controleModoDesenho == true) {
        console.log("Soltou o clique");
        // Salva o estado do canvas antes de desenhar
        saveCanvasState();
        currentStateIndex++;
        objetosDesenhados = fabricCanvas.getObjects();
        console.log(objetosDesenhados);

        imutaObjeto();

        console.log(currentStateIndex);
        console.log(canvasStates);


    } else if (controleDesenhaRet == true && contadorCliqueRet < 2) {
        console.log("Clicou - modoDraw OFF");
        contadorCliqueRet++;

        if (contadorCliqueRet == 1) {
            xCoordenadaFirst = pointer.x;
            yCoordenadaFirst = pointer.y;
        }

        if (contadorCliqueRet == 2) {

            xCoordenadaSecond = pointer.x;
            yCoordenadaSecond = pointer.y;

            const ret = new fabric.Rect({
                left: xCoordenadaFirst,
                top: yCoordenadaFirst,
                fill: corRetangulo,
                width: xCoordenadaSecond - xCoordenadaFirst,
                height: yCoordenadaSecond - yCoordenadaFirst,
                stroke: corLinha,
                strokeWidth: 0.5
            });

            fabricCanvas.add(ret);

            currentStateIndex++;
            saveCanvasState();

            objetosDesenhados = fabricCanvas.getObjects();
            imutaObjeto();

            contadorCliqueRet = 0;

            console.log(canvasStates);

            addTextAreaComentario(corLinha, '');
        }
    }
});

function imutaObjeto() {
    objetosDesenhados.forEach(function (elemento) {
        elemento.selectable = false;   // Não pode ser selecionado  
        elemento.hasControls = false;  // Sem controles de redimensionamento/rotação
    });
}

async function salvarCorrecao() {

    let canvasJson = fabricCanvas.toJSON();
    console.log(canvasJson);

    let notaTotalEnem = notaC1 + notaC2 + notaC3 + notaC4 + notaC5;

    if (confirm('Esta redação já foi corrigida. Deseja substituir a correção salva por esta?')) {
        await updateRedacaoPHP(canvasJson);
        await updateComentariosoPHP();
        await updateNotasPHP(notaC1, notaC2, notaC3, notaC4, notaC5, notaTotalEnem);

        controleSalvarCorrecao = true;

        alert('Sua Correção foi salva!!!');
    }

}

async function updateRedacaoPHP(canvasJson) {
    const canvasJsonStringfy = JSON.stringify(canvasJson);

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP 
        const response = await fetch('https://feiratec.dev.br/redaquick/control/updateRedacaoEditaRed.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: canvasJsonStringfy
        });

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }

        const resultadoEnvioPHP = await response.json();
        console.log(resultadoEnvioPHP);

    } catch (error) {
        console.error('Erro:', error);
    }
};

async function updateComentariosoPHP() {
    let comentario = '';
    let comentarioP = comentarioCompetencia1.value + "&" + comentarioCompetencia2.value + "&" + comentarioCompetencia3.value + "&" +
        comentarioCompetencia4.value + "&" + comentarioCompetencia5.value;
    let corTxt = '';

    if (armazenaComentarios != null) {
        armazenaComentarios.forEach(function (e, index) {
            comentario += (index > 0 ? '&' : '') + e.value;
            corTxt += (index > 0 ? '&' : '') + e.style.borderColor;
        });
    }

    const dados = {
        comentarioGeral: comentario,
        comentarioPadrao: comentarioP,
        corText: corTxt,
        flagSession: 'false'
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP 
        const response = await fetch('https://feiratec.dev.br/redaquick/control/updateComentarios.php', {
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
};

async function updateNotasPHP(notaC1, notaC2, notaC3, notaC4, notaC5, notaTotal) {
    const dados = {
        c1: notaC1,
        c2: notaC2,
        c3: notaC3,
        c4: notaC4,
        c5: notaC5,
        notaTotalEnem: notaTotal,
        flagSession: 'false'
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP 
        const response = await fetch('https://feiratec.dev.br/redaquick/control/updateNotaRed.php', {
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
};

async function inserirRedacaoPHP(canvasJson) {
    const canvasJsonStringfy = JSON.stringify(canvasJson);

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP 
        const response = await fetch('https://feiratec.dev.br/redaquick/control/salvar_correcao_json.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: canvasJsonStringfy
        });

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }

        const resultadoEnvioPHP = await response.json(); // Extrai e converte o corpo da resposta para JSON
        console.log(resultadoEnvioPHP);

    } catch (error) {
        console.error('Erro:', error);
    }
};

async function inserirNotaPHP(notaC1, notaC2, notaC3, notaC4, notaC5, notaTotal) {
    const dados = {
        c1: notaC1,
        c2: notaC2,
        c3: notaC3,
        c4: notaC4,
        c5: notaC5,
        notaTotalEnem: notaTotal
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP 
        const response = await fetch('https://feiratec.dev.br/redaquick/control/inserirNota.php', {
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

async function inserirComentariosPHP() {
    let comentario = '';
    let comentarioP = comentarioCompetencia1.value + "&" + comentarioCompetencia2.value + "&" + comentarioCompetencia3.value + "&" +
        comentarioCompetencia4.value + "&" + comentarioCompetencia5.value;
    let corTxt = '';

    if (armazenaComentarios != null) {
        armazenaComentarios.forEach(function (e, index) {
            comentario += (index > 0 ? '&' : '') + e.value;
            corTxt += (index > 0 ? '&' : '') + e.style.borderColor;
        });
    }

    const dados = {
        comentarioGeral: comentario,
        comentarioPadrao: comentarioP,
        corText: corTxt
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP 
        const response = await fetch('https://feiratec.dev.br/redaquick/control/inserirComentarios.php', {
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

function AumentarZoom() {
    if (zoom < 2) {
        zoom = zoom + 0.25;
        valorZoomPercentual = (zoom * 100);
        valorZoomTexto.value = valorZoomPercentual + '%';
        fabricCanvas.setZoom(zoom);
        fabricCanvas.setWidth(fabricCanvas.width + (0.25 * widthImagem));
        fabricCanvas.setHeight(fabricCanvas.height + (0.25 * heightImagem));
        fabricCanvas.isDrawingMode = false;
    } else {
        alert('Limite de Zoom atingido!')
    }
}
function DiminuirZoom() {
    if (zoom > 1) {
        zoom = zoom - 0.25;
        valorZoomPercentual = (zoom * 100);
        valorZoomTexto.value = valorZoomPercentual + '%';
        fabricCanvas.setZoom(zoom);
        fabricCanvas.setWidth(fabricCanvas.width - (0.25 * widthImagem));
        fabricCanvas.setHeight(fabricCanvas.height - (0.25 * heightImagem));
        fabricCanvas.isDrawingMode = false;
    } else {
        alert('Limite de Zoom atingido!')
    }
}

function desenhaRetangulo() {
    controleDesenhaRet = true;
    controleModoDesenho = false;
    fabricCanvas.isDrawingMode = false;
    contadorCliqueRet = 0;

    if (currentStateIndex == -1) {
        saveCanvasState();
        currentStateIndex++;
    }
}

function addTextAreaCompetencia() {
    comentarioCompetencia1.style.borderColor = 'black';
    comentarioCompetencia1.style.borderWidth = '2px';
    comentarioCompetencia1.style.minHeight = '152px';
    comentarioCompetencia1.style.maxHeight = '152px';
    comentarioCompetencia1.setAttribute('readonly', true);

    comentarioCompetencia1.value = "200: Demonstra excelente domínio da modalidade escrita formal da língua portuguesa e de escolha de registro. Desvios gramaticais ou de convenções da escrita serão aceitos somente como excepcionalidade e quando não caracterizarem reincidência.";

    sectionComentariosCompetencias.appendChild(comentarioCompetencia1);

    comentarioCompetencia2.style.borderColor = 'black';
    comentarioCompetencia2.style.borderWidth = '2px';
    comentarioCompetencia2.style.minHeight = '152px';
    comentarioCompetencia2.style.maxHeight = '152px';
    comentarioCompetencia1.setAttribute('readonly', true);

    comentarioCompetencia2.value = "200: Desenvolve o tema por meio de argumentação consistente, a partir de um repertório sociocultural produtivo e apresenta excelente domínio do texto dissertativo-argumentativo.";

    sectionComentariosCompetencias.appendChild(comentarioCompetencia2);

    comentarioCompetencia3.style.borderColor = 'black';
    comentarioCompetencia3.style.borderWidth = '2px';
    comentarioCompetencia3.style.minHeight = '152px';
    comentarioCompetencia3.style.maxHeight = '152px';
    comentarioCompetencia1.setAttribute('readonly', true);

    comentarioCompetencia3.value = "200: Apresenta informações, fatos e opiniões relacionados ao tema proposto, de forma consistente e organizada, configurando autoria, em defesa de um ponto de vista.";

    sectionComentariosCompetencias.appendChild(comentarioCompetencia3);

    comentarioCompetencia4.style.borderColor = 'black';
    comentarioCompetencia4.style.borderWidth = '2px';
    comentarioCompetencia4.style.minHeight = '152px';
    comentarioCompetencia4.style.maxHeight = '152px';
    comentarioCompetencia1.setAttribute('readonly', true);

    comentarioCompetencia4.value = "200: Articula bem as partes do texto e apresenta repertório diversificado de recursos coesivos.";

    sectionComentariosCompetencias.appendChild(comentarioCompetencia4);

    comentarioCompetencia5.style.borderColor = 'black';
    comentarioCompetencia5.style.borderWidth = '2px';
    comentarioCompetencia5.style.minHeight = '152px';
    comentarioCompetencia5.style.maxHeight = '152px';
    comentarioCompetencia1.setAttribute('readonly', true);

    comentarioCompetencia5.value = "200: Elabora muito bem proposta de intervenção, detalhada, relacionada ao tema e articulada à discussão desenvolvida no texto.";

    sectionComentariosCompetencias.appendChild(comentarioCompetencia5);
}

function alteraComentC1(campoTexto, notaValor) {
    switch (notaValor) {
        case 200:
            campoTexto.value = "200: Demonstra excelente domínio da modalidade escrita formal da língua portuguesa e de escolha de registro. Desvios gramaticais ou de convenções da escrita serão aceitos somente como excepcionalidade e quando não caracterizarem reincidência.";
            break;

        case 180:
            campoTexto.value = "180: Demonstra um excelente/bom domínio da modalidade escrita formal da língua portuguesa e de escolha de registro, com poucos desvios gramaticais e de convenções de escrita.";
            break;

        case 160:
            campoTexto.value = "160: Demonstra bom domínio da modalidade escrita formal da língua portuguesa e de escolha de registro, com poucos desvios gramaticais e de convenções de escrita.";
            break;

        case 140:
            campoTexto.value = "140: Demonstra um bom/mediano domínio da modalidade escrita formal da língua portuguesa e de escolha de registro, com poucos desvios gramaticais e de convenções de escrita.";
            break;

        case 120:
            campoTexto.value = "120: Demonstra domínio mediano da modalidade. escrita formal da língua portuguesa e de escolha de registro, com alguns desvios gramaticais e de convenções da escrita.";
            break;

        case 100:
            campoTexto.value = "100: Demonstra domínio mediano/insuficiente da modalidade. escrita formal da língua portuguesa e de escolha de registro, com alguns desvios gramaticais e de convenções da escrita.";
            break;

        case 80:
            campoTexto.value = "80: Demonstra domínio insuficiente da modalidade escrita formal da língua portuguesa, com muitos desvios gramaticais, de escolha de registro e de convenções da escrita.";
            break;

        case 60:
            campoTexto.value = "60: Demonstra domínio insuficiente/precário da modalidade escrita formal da língua portuguesa, com muitos desvios gramaticais, de escolha de registro e de convenções da escrita.";
            break;

        case 40:
            campoTexto.value = "40: Demonstra domínio precário da modalidade escrita formal da língua portuguesa de forma sistemática, com diversificados e frequentes desvios gramaticais, de escolha de registro e de convenções da escrita.";
            break;

        case 20:
            campoTexto.value = "20: Demonstra domínio precário e desconhecimento da modalidade escrita formal da língua portuguesa de forma sistemática, com diversificados e frequentes desvios gramaticais, de escolha de registro e de convenções da escrita.";
            break;

        case 0:
            campoTexto.value = "0: Demonstra desconhecimento da modalidade escrita formal da língua portuguesa.";
            break;
    }
}

function alteraComentC2(campoTexto, notaValor) {
    switch (notaValor) {
        case 200:
            campoTexto.value = "200: Desenvolve o tema por meio de argumentação consistente, a partir de um repertório sociocultural produtivo e apresenta excelente domínio do texto dissertativo-argumentativo.";
            break;

        case 180:
            campoTexto.value = "180: Desenvolve o tema por meio de argumentação consistente, a partir de um repertório sociocultural produtivo e apresenta excelente/bom domínio do texto dissertativo-argumentativo.";
            break;

        case 160:
            campoTexto.value = "160: Desenvolve o tema por meio de argumentação consistente e apresenta bom domínio do texto argumentativo dissertativo, com proposição, argumentação e conclusão.";
            break;

        case 140:
            campoTexto.value = "140: Desenvolve o tema por meio de argumentação consistente e apresenta bom/mediano domínio do texto argumentativo dissertativo, com proposição, argumentação e conclusão.";
            break;

        case 120:
            campoTexto.value = "120: Desenvolve o tema por meio de argumentação previsível e apresenta domínio mediano do texto dissertativo-argumentativo, com proposição, argumentação e conclusão.";
            break;

        case 100:
            campoTexto.value = "100: Desenvolve o tema por meio de argumentação previsível e apresenta domínio mediano/insuficiente do texto dissertativo-argumentativo, com proposição, argumentação e conclusão.";
            break;

        case 80:
            campoTexto.value = "80: Desenvolve o tema recorrendo à cópia de trechos de textos motivadores ou apresenta domínio insuficiente do texto dissertativo-argumentativo, não atendendo à estrutura com proposição, argumentação e conclusão.";
            break;

        case 60:
            campoTexto.value = "60: Desenvolve o tema recorrendo à cópia de trechos de textos motivadores ou apresenta domínio insuficiente/ do texto dissertativo-argumentativo, não atendendo à estrutura com proposição, argumentação e conclusão.";
            break;

        case 40:
            campoTexto.value = "40: Apresenta o assunto, tangenciando o tema, ou demonstra domínio precário do texto dissertativo-argumentativo, com traços constantes de outros tipos textuais.";
            break;

        case 20:
            campoTexto.value = "20: Apresenta o assunto, tangenciando o tema, ou demonstra domínio precário e fugindo do tema do texto dissertativo-argumentativo, com traços constantes de outros tipos textuais.";
            break;

        case 0:
            campoTexto.value = "0: Fuga ao tema/não atendimento à estrutura dissertativo-argumentativa.";
            break;
    }
}

function alteraComentC3(campoTexto, notaValor) {
    switch (notaValor) {
        case 200:
            campoTexto.value = "200: Apresenta informações, fatos e opiniões relacionados ao tema proposto, de forma consistente e organizada, configurando autoria, em defesa de um ponto de vista.";
            break;

        case 180:
            campoTexto.value = "180: Apresenta informações, fatos e opiniões relacionados ao tema proposto, de forma consistente e organizada, porém levemente limitada, configurando autoria, em defesa de um ponto de vista.";
            break;

        case 160:
            campoTexto.value = "160: Apresenta informações, fatos e opiniões bem relacionados ao tema, porém limitados aos argumentos dos textos motivadores e pouco organizados, em defesa de um ponto de vista.";
            break;

        case 140:
            campoTexto.value = "140: Apresenta informações, fatos e opiniões bem/medianamente relacionados ao tema, porém limitados aos argumentos dos textos motivadores e pouco organizados, em defesa de um ponto de vista.";
            break;

        case 120:
            campoTexto.value = "120: Apresenta informações, fatos e opiniões relacionados ao tema de forma mediana e pouco organizada, em defesa de um ponto de vista.";
            break;

        case 100:
            campoTexto.value = "100: Apresenta informações, fatos e opiniões relacionados ao tema de forma mediana ou até desorganizada, em defesa de um ponto de vista.";
            break;

        case 80:
            campoTexto.value = "80: Apresenta informações, fatos e opiniões relacionados ao tema, mas desorganizados ou contraditórios e limitados aos argumentos dos textos motivadores, em defesa de um ponto de vista.";
            break;

        case 60:
            campoTexto.value = "60: Apresenta informações, fatos e opiniões poucos relacionados ao tema, mas desorganizados ou contraditórios e limitados aos argumentos dos textos motivadores de forma incoerente, em defesa de um ponto de vista.";
            break;

        case 40:
            campoTexto.value = "40: Apresenta informações, fatos e opiniões pouco relacionados ao tema ou incoerentes e sem defesa de um ponto de vista.";
            break;

        case 20:
            campoTexto.value = "20: Apresenta informações, fatos e opiniões insuficientes e pouco relacionados ao tema ou incoerentes e sem defesa de um ponto de vista.";
            break;

        case 0:
            campoTexto.value = "0: Não apresenta informações, fatos e opiniões relacionados ao tema e não há uma defesa de um ponto de vista.";
            break;
    }
}

function alteraComentC4(campoTexto, notaValor) {
    switch (notaValor) {
        case 200:
            campoTexto.value = "200: Articula bem as partes do texto e apresenta repertório diversificado de recursos coesivos.";
            break;

        case 180:
            campoTexto.value = "180: Articula bem as partes do texto e apresenta repertório diversificado de recursos coesivos com pouquíssimas inadequações.";
            break;

        case 160:
            campoTexto.value = "160: Articula as partes do texto, com poucas inadequações, e apresenta repertório diversificado de recursos coesivos.";
            break;

        case 140:
            campoTexto.value = "140: Articula as partes do texto, com poucas inadequações, e de forma mediana apresenta repertório diversificado de recursos coesivos.";
            break;

        case 120:
            campoTexto.value = "120: Articula as partes do texto, de forma mediana, com inadequações, e apresenta repertório pouco diversificado de recursos coesivos.";
            break;

        case 100:
            campoTexto.value = "100: Articula as partes do texto, de forma mediana/insuficiente, com inadequações, e apresenta repertório pouco diversificado de recursos coesivos.";
            break;

        case 80:
            campoTexto.value = "80: Articula as partes do texto, de forma insuficiente, com muitas inadequações e apresenta repertório limitado de recursos coesivos.";
            break;

        case 60:
            campoTexto.value = "60: Articula as partes do texto, de forma insuficiente/precária, com muitas inadequações e apresenta repertório limitado de recursos coesivos.";
            break;

        case 40:
            campoTexto.value = "40: Articula as partes do texto de forma precária.";
            break;

        case 20:
            campoTexto.value = "20: Articula as partes do texto de forma precária beirando a ausência de articulações.";
            break;

        case 0:
            campoTexto.value = "0: Não há a articulação de informações no corpo do texto.";
            break;
    }
}

function alteraComentC5(campoTexto, notaValor) {
    switch (notaValor) {
        case 200:
            campoTexto.value = "200: Elabora com excelência proposta de intervenção, detalhada, relacionada ao tema e articulada à discussão desenvolvida no texto.";
            break;

        case 180:
            campoTexto.value = "180: Elabora muito bem proposta de intervenção, detalhada, relacionada ao tema e articulada à discussão desenvolvida no texto.";
            break;

        case 160:
            campoTexto.value = "160: Elabora bem proposta de intervenção relacionada ao tema e articulada à discussão desenvolvida no texto.";
            break;

        case 140:
            campoTexto.value = "140: Elabora bem/medianamente proposta de intervenção relacionada ao tema e articulada à discussão desenvolvida no texto.";
            break;

        case 120:
            campoTexto.value = "120: Elabora, de forma mediana, proposta de intervenção relacionada ao tema e articulada com a discussão desenvolvida no texto.";
            break;

        case 100:
            campoTexto.value = "100: Elabora, de forma mediana/insuficiente, proposta de intervenção relacionada ao tema e articulada com a discussão desenvolvida no texto.";
            break;

        case 80:
            campoTexto.value = "80: Elabora, de forma insuficiente, proposta de intervenção relacionada ao tema, ou não articulada com a discussão desenvolvida no texto.";
            break;

        case 60:
            campoTexto.value = "60: Elabora, de forma insuficiente/precária, proposta de intervenção relacionada ao tema, ou não articulada com a discussão desenvolvida no texto.";
            break;

        case 40:
            campoTexto.value = "40: Apresente proposta de intervenção vaga, precária ou relacionada apenas ao assunto.";
            break;

        case 20:
            campoTexto.value = "20: Apresente proposta de intervenção vaga, precária ou relacionada apenas ao assunto ou até fugindo do assunto.";
            break;

        case 0:
            campoTexto.value = "0: Não apresenta proposta de intervenção ou apresenta proposta não relacionada ao tema ou ao assunto.";
            break;
    }
}

function aumentarNotaC(notaC, valorNotaTextoC) {
    notaC = parseInt(valorNotaTextoC.value);
    if (notaC < 200) {
        notaC = notaC + 20;
        valorNotaTextoC.value = notaC;
    } else {
        alert('Limite de 200 pontos atingido!')
    }
}
function diminuirNotaC(notaC, valorNotaTextoC) {
    notaC = parseInt(valorNotaTextoC.value);
    if (notaC > 0) {
        notaC = notaC - 20;
        valorNotaTextoC.value = notaC;
    } else {
        alert('Limite de 0 pontos atingido!')
    }
}

function aumentarNotaC1() {
    aumentarNotaC(notaC1, valorNotaTextoC1);
    notaC1 = parseInt(valorNotaTextoC1.value);
    alteraComentC1(comentarioCompetencia1, notaC1);
}
function aumentarNotaC2() {
    aumentarNotaC(notaC2, valorNotaTextoC2);
    notaC2 = parseInt(valorNotaTextoC2.value);
    alteraComentC2(comentarioCompetencia2, notaC2);
}
function aumentarNotaC3() {
    aumentarNotaC(notaC3, valorNotaTextoC3);
    notaC3 = parseInt(valorNotaTextoC3.value);
    alteraComentC3(comentarioCompetencia3, notaC3);
}
function aumentarNotaC4() {
    aumentarNotaC(notaC4, valorNotaTextoC4);
    notaC4 = parseInt(valorNotaTextoC4.value);
    alteraComentC4(comentarioCompetencia4, notaC4);
}
function aumentarNotaC5() {
    aumentarNotaC(notaC5, valorNotaTextoC5);
    notaC5 = parseInt(valorNotaTextoC5.value);
    alteraComentC5(comentarioCompetencia5, notaC5);
}
function diminuirNotaC1() {
    diminuirNotaC(notaC1, valorNotaTextoC1);
    notaC1 = parseInt(valorNotaTextoC1.value);
    alteraComentC1(comentarioCompetencia1, notaC1);
}
function diminuirNotaC2() {
    diminuirNotaC(notaC2, valorNotaTextoC2);
    notaC2 = parseInt(valorNotaTextoC2.value);
    alteraComentC2(comentarioCompetencia2, notaC2);
}
function diminuirNotaC3() {
    diminuirNotaC(notaC3, valorNotaTextoC3);
    notaC3 = parseInt(valorNotaTextoC3.value);
    alteraComentC3(comentarioCompetencia3, notaC3);
}
function diminuirNotaC4() {
    diminuirNotaC(notaC4, valorNotaTextoC4);
    notaC4 = parseInt(valorNotaTextoC4.value);
    alteraComentC4(comentarioCompetencia4, notaC4);
}
function diminuirNotaC5() {
    diminuirNotaC(notaC5, valorNotaTextoC5);
    notaC5 = parseInt(valorNotaTextoC5.value);
    alteraComentC5(comentarioCompetencia5, notaC5);
}

function OnOffcampoCompetencias() {
    if (controladorOnOffCompetencias) {
        controladorOnOffCompetencias = false;
        sectionCompetenciasContainer.style.display = "none";
    } else {
        controladorOnOffCompetencias = true;
        sectionCompetenciasContainer.style.display = "flex";
    }
}
function OnOffestanteComentarios() {
    if (controladorOnOffComentarios) {
        controladorOnOffComentarios = false;
        sectionEstanteComentarios.style.display = "none";
    } else {
        controladorOnOffComentarios = true;
        sectionEstanteComentarios.style.display = "flex";

        controladorOnOffcomentariosCompetencias = false;
        sectionComentariosCompetencias.style.display = "none";
    }
}
function OnOffcomentariosCompetencias() {
    if (controladorOnOffcomentariosCompetencias) {
        controladorOnOffcomentariosCompetencias = false;
        sectionComentariosCompetencias.style.display = "none";
    } else {
        controladorOnOffcomentariosCompetencias = true;
        sectionComentariosCompetencias.style.display = "flex";

        controladorOnOffComentarios = false;
        sectionEstanteComentarios.style.display = "none";
    }
}

function rgbToName(rgb) {
    const coresPredefinidas = {
        'rgb(255, 0, 0)': "Vermelho",
        'rgb(128, 0, 128)': "Roxo",
        'rgb(165, 42, 42)': "Marrom",
        'rgb(0, 255, 0)': "Verde",
        'rgb(255, 165, 0)': "Laranja",
        'rgb(0, 0, 0)': "Preto",
    };
    return coresPredefinidas[rgb] || "Verde";
}

function salvarClick() {
    var urlImagem = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1.0
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Adiciona a imagem na primeira página
    doc.addImage(urlImagem, 'PNG', 3, 0, 200, 280);  // Ajuste a posição e o tamanho conforme necessário
    doc.addPage();

    // Configura o título do relatório
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold'); // Define a fonte como negrito
    doc.text('Vista Pedagógica', 85, 10);

    // Configura os textos das competências, quebrando em linhas para caber no espaço
    var nomeQuebrado1 = doc.splitTextToSize(comentarioCompetencia1.value, 235);
    var nomeQuebrado2 = doc.splitTextToSize(comentarioCompetencia2.value, 235);
    var nomeQuebrado3 = doc.splitTextToSize(comentarioCompetencia3.value, 235);
    var nomeQuebrado4 = doc.splitTextToSize(comentarioCompetencia4.value, 235);
    var nomeQuebrado5 = doc.splitTextToSize(comentarioCompetencia5.value, 235);

    // Cabeçalhos da tabela com espaçamento ajustado
    doc.setFontSize(12);
    doc.text('Comentários Referentes às Competências:', 10, 20);

    let yComentario = 30;

    // Função para adicionar comentários de cada competência
    function adicionarComentarioCompetencia(titulo, comentarios) {
        doc.setFont('helvetica', 'bold'); // Define a fonte como negrito
        doc.text(titulo, 10, yComentario);
        yComentario += 5;

        for (let i = 0; i < comentarios.length; i++) {
            doc.setFont('helvetica', 'normal'); // Fonte padrão
            doc.text(comentarios[i], 10, yComentario);
            yComentario += 6;

            // Adiciona nova página se necessário
            if (yComentario > doc.internal.pageSize.height - 10) {
                doc.addPage();
                yComentario = 30;
            }
        }
    }

    // Adicionando os comentários das competências
    adicionarComentarioCompetencia('Competência 1:', nomeQuebrado1);
    adicionarComentarioCompetencia('Competência 2:', nomeQuebrado2);
    adicionarComentarioCompetencia('Competência 3:', nomeQuebrado3);
    adicionarComentarioCompetencia('Competência 4:', nomeQuebrado4);
    adicionarComentarioCompetencia('Competência 5:', nomeQuebrado5);

    // Linha separadora
    doc.setDrawColor(0); // Cor da linha (preto)
    doc.setLineWidth(0.3); // Largura da linha
    doc.line(10, yComentario, 200, yComentario);
    yComentario += 10;

    // Adicionando comentários personalizados
    doc.setFont('helvetica', 'bold');
    doc.text('Comentários Personalizados:', 10, yComentario);
    yComentario += 10;

    if (armazenaComentarios) {
        for (let i = 0; i < armazenaComentarios.length; i++) {
            const estilo = getComputedStyle(armazenaComentarios[i]);
            const corRgb = estilo.borderColor;
            const corLinha = rgbToName(corRgb);

            doc.setFont('helvetica', 'bold');
            doc.text('Comentário ' + (i + 1) + ' (' + corLinha + ') :', 10, yComentario);
            yComentario += 5;

            doc.setFont('helvetica', 'normal');
            const comentarioQuebrado = doc.splitTextToSize(armazenaComentarios[i].value, 180);
            for (let j = 0; j < comentarioQuebrado.length; j++) {
                doc.text(comentarioQuebrado[j], 10, yComentario);
                yComentario += 6;

                // Adiciona nova página se necessário
                if (yComentario > doc.internal.pageSize.height - 10) {
                    doc.addPage();
                    yComentario = 10;
                }
            }
            yComentario += 10; // Espaço entre os comentários
        }
    } else {
        doc.setFont('helvetica', 'normal');
        doc.text('Nenhum comentário personalizado disponível.', 10, yComentario);
    }

    console.log(armazenaComentarios);

    // Gerar o PDF como um Blob e oferecer o download
    const pdfBlob = doc.output('blob');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = 'Vista Pedagógica.pdf';
    link.click();
}

async function buscarJson() {
    const dados = {
        mensagem: "Enviado"
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP
        const response = await fetch('https://feiratec.dev.br/redaquick/control/buscarJsonAlterar.php', {
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

        if (resultadoEnvioPHP.backgroundImage) {
            // Obtém as dimensões da imagem de fundo no JSON
            const backgroundImage = resultadoEnvioPHP.backgroundImage;
            const imageWidth = backgroundImage.width;
            const imageHeight = backgroundImage.height;

            heightImagem = imageHeight;
            widthImagem = imageWidth;

            // Ajusta o tamanho do canvas com base nas dimensões da imagem de fundo
            fabricCanvas.setWidth(imageWidth);
            fabricCanvas.setHeight(imageHeight);
        }

        await fabricCanvas.loadFromJSON(resultadoEnvioPHP, () => {
            console.log("Canvas carregado com sucesso.");

            objetosDesenhados = fabricCanvas.getObjects();
            console.log(objetosDesenhados);
            imutaObjeto();

            fabricCanvas.selection = false;
            fabricCanvas.selectable = false;
        });

    } catch (error) {
        console.error('Erro:', error);
    }
}

async function buscarNotas() {
    const dados = {
        mensagem: "Enviado"
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP
        const response = await fetch('https://feiratec.dev.br/redaquick/control/buscarNotasCompAlterar.php', {
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

        notaC1 = resultadoEnvioPHP.nota_c1;
        notaC2 = resultadoEnvioPHP.nota_c2;
        notaC3 = resultadoEnvioPHP.nota_c3;
        notaC4 = resultadoEnvioPHP.nota_c4;
        notaC5 = resultadoEnvioPHP.nota_c5;

        console.log(notaC1 + " " + notaC2 + " " + notaC3 + " " + notaC4 + " " + notaC5);

        valorNotaTextoC1.value = notaC1;
        valorNotaTextoC2.value = notaC2;
        valorNotaTextoC3.value = notaC3;
        valorNotaTextoC4.value = notaC4;
        valorNotaTextoC5.value = notaC5;

    } catch (error) {
        console.error('Erro:', error);
    }
}

async function buscarComentarios() {
    const dados = {
        mensagem: "Enviado"
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP
        const response = await fetch('https://feiratec.dev.br/redaquick/control/buscarComentariosAlterar.php', {
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

        const comentarios = resultadoEnvioPHP.comentario.split('&');
        const cores = resultadoEnvioPHP.corTxt.split('&');

        for (let index = 0; index < comentarios.length; index++) {
            addTextAreaComentario(cores[index], comentarios[index]);
        }

    } catch (error) {
        console.error('Erro:', error);
    }
}

function addTextAreaComentario(cor, texto) {
    var comentario = document.createElement('textarea');
    comentario.style.borderColor = cor;
    comentario.style.borderWidth = '2px';
    comentario.style.minHeight = '105px';
    comentario.style.maxHeight = '105px';
    comentario.maxLength = 150;
    comentario.value = texto;

    sectionEstanteComentarios.appendChild(comentario);

    armazenaComentarios.push(comentario);
}

async function buscarComentariosPadrao() {
    const dados = {
        mensagem: "Enviado"
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP
        const response = await fetch('https://feiratec.dev.br/redaquick/control/buscarComentariosPadraoAlterar.php', {
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

        const comentariosPadrao = resultadoEnvioPHP.comentarioPadrao.split('&');

        configCampoCompPadrao(comentarioCompetencia1);
        configCampoCompPadrao(comentarioCompetencia2);
        configCampoCompPadrao(comentarioCompetencia3);
        configCampoCompPadrao(comentarioCompetencia4);
        configCampoCompPadrao(comentarioCompetencia5);

        comentarioCompetencia1.value = comentariosPadrao[0];
        comentarioCompetencia2.value = comentariosPadrao[1];
        comentarioCompetencia3.value = comentariosPadrao[2];
        comentarioCompetencia4.value = comentariosPadrao[3];
        comentarioCompetencia5.value = comentariosPadrao[4];

        sectionComentariosCompetencias.appendChild(comentarioCompetencia1);
        sectionComentariosCompetencias.appendChild(comentarioCompetencia2);
        sectionComentariosCompetencias.appendChild(comentarioCompetencia3);
        sectionComentariosCompetencias.appendChild(comentarioCompetencia4);
        sectionComentariosCompetencias.appendChild(comentarioCompetencia5);

    } catch (error) {
        console.error('Erro:', error);
    }
}

function configCampoCompPadrao(comentarioCompetencia) {
    comentarioCompetencia.style.borderColor = 'black';
    comentarioCompetencia.style.borderWidth = '2px';
    comentarioCompetencia.style.minHeight = '152px';
    comentarioCompetencia.style.maxHeight = '152px';
    comentarioCompetencia.setAttribute('readonly', true);
}

function buttonCorPrincipalClick() {
    if (controleCliquePaleteCores) {
        controleCliquePaleteCores = false;
        paleteCores.style.display = "none";
    } else {
        controleCliquePaleteCores = true;
        paleteCores.style.display = "flex";
    }
}
function buttonCorRed() {
    controleCliquePaleteCores = false;
    paleteCores.style.display = "none";
    buttonCorPrincipal.style.backgroundColor = "red";
    corLinha = "red";
    corRetangulo = 'rgba(255, 0, 0, 0.2)';
    fabricCanvas.freeDrawingBrush.color = corLinha;
}
function buttonCorPurple() {
    controleCliquePaleteCores = false;
    paleteCores.style.display = "none";
    buttonCorPrincipal.style.backgroundColor = "purple";
    corLinha = "purple";
    corRetangulo = 'rgba(128, 0, 128, 0.2)';

    fabricCanvas.freeDrawingBrush.color = corLinha;
}
function buttonCorBrown() {
    controleCliquePaleteCores = false;
    paleteCores.style.display = "none";
    buttonCorPrincipal.style.backgroundColor = "brown";
    corLinha = "brown";
    corRetangulo = 'rgba(165, 42, 42, 0.2)';
    fabricCanvas.freeDrawingBrush.color = corLinha;
}
function buttonCorGreen() {
    controleCliquePaleteCores = false;
    paleteCores.style.display = "none";
    buttonCorPrincipal.style.backgroundColor = "green";
    corLinha = "green";
    corRetangulo = 'rgba(0, 255, 0, 0.2)';
    fabricCanvas.freeDrawingBrush.color = corLinha;
}
function buttonCorOrange() {
    controleCliquePaleteCores = false;
    paleteCores.style.display = "none";
    buttonCorPrincipal.style.backgroundColor = " orange";
    corLinha = "orange";
    corRetangulo = 'rgba(255, 165, 0, 0.2)';
    fabricCanvas.freeDrawingBrush.color = corLinha;
}
function buttonCorBlack() {
    controleCliquePaleteCores = false;
    paleteCores.style.display = "none";
    buttonCorPrincipal.style.backgroundColor = "black";
    corLinha = "black";
    corRetangulo = 'rgba(0, 0, 0, 0.2)';
    fabricCanvas.freeDrawingBrush.color = corLinha;
}

function resetarConfigComentarios() {
    comentarioCompetencia1.value = '200: Demonstra excelente domínio da modalidade escrita formal da língua portuguesa e de escolha de registro. Desvios gramaticais ou de convenções da escrita serão aceitos somente como excepcionalidade e quando não caracterizarem reincidência.';
    comentarioCompetencia2.value = '200: Desenvolve o tema por meio de argumentação consistente, a partir de um repertório sociocultural produtivo e apresenta excelente domínio do texto dissertativo-argumentativo.';
    comentarioCompetencia3.value = '200: Apresenta informações, fatos e opiniões relacionados ao tema proposto, de forma consistente e organizada, configurando autoria, em defesa de um ponto de vista.';
    comentarioCompetencia4.value = '200: Articula bem as partes do texto e apresenta repertório diversificado de recursos coesivos.';
    comentarioCompetencia5.value = '200: Elabora muito bem proposta de intervenção, detalhada, relacionada ao tema e articulada à discussão desenvolvida no texto.';

    valorNotaTextoC1.value = notaInicial;
    valorNotaTextoC2.value = notaInicial;
    valorNotaTextoC3.value = notaInicial;
    valorNotaTextoC4.value = notaInicial;
    valorNotaTextoC5.value = notaInicial;

    armazenaComentarios.forEach(function (elemento) {
        elemento.remove();
    });

    armazenaComentarios.splice(0, armazenaComentarios.length);
}

document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();

        fabricCanvas.isDrawingMode = false;
        controleModoDesenho = false;

        if (currentStateIndex > 0) {
            currentStateIndex--;
            // Restaura o estado anterior do canvas
            fabricCanvas.loadFromJSON(canvasStates[currentStateIndex], () => {
                fabricCanvas.renderAll();

                if (objetosDesenhados[objetosDesenhados.length - 1].type === 'rect') {
                    var ultimoComentario = armazenaComentarios.pop();
                    ultimoComentario.remove();
                }

                canvasStates.pop();

                console.log("Clicou em Voltar");
                console.log(canvasStates);
                console.log(currentStateIndex);

                objetosDesenhados = fabricCanvas.getObjects();
                imutaObjeto();
                console.log(objetosDesenhados);
            });

        } else {
            console.log("Nenhuma ação anterior para desfazer.");
        }
    }
});

document.getElementById('botaoVoltarCorrecao').addEventListener('click', function () {
    if (controleSalvarCorrecao == false) {
        if (confirm('Sua correção não foi salva. Tem certeza que deseja voltar ao menu?')) {
            window.location.href = 'redacoes_corrigidas_professor.php';
        }
    } else {
        window.location.href = 'redacoes_corrigidas_professor.php';
    }
});