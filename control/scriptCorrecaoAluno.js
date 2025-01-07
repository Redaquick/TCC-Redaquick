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
var valorNotaTextoC3 = document.getElementById("competencia3"); //USAR NO PDF
var valorNotaTextoC4 = document.getElementById("competencia4");
var valorNotaTextoC5 = document.getElementById("competencia5");

var notaInicial = 200;

var notaC1 = 200;
var notaC2 = 200;
var notaC3 = 200; //USAR NO PDF
var notaC4 = 200;
var notaC5 = 200;

var comentarioCompetencia1 = document.createElement('textarea');
var comentarioCompetencia2 = document.createElement('textarea');
var comentarioCompetencia3 = document.createElement('textarea'); //USAR NO PDF
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

var armazenaComentarios = []; //USAR NO PDF

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

var controladorOnOffComentarios = true;
var campoComentarios = document.getElementById("estanteComentariosBtn");

var controladorOnOffcomentariosCompetencias = false;
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

var controleVerificarCorrecaoCorrigida = false;
var alertaRedacaoCorrigida = document.getElementById('alertaRedacaoCorrigida');

var controleUndefinedQrCode = false;

// Função para salvar o estado atual do canvas
function saveCanvasState() {
    // Adiciona o estado atual do canvas à lista de estados
    canvasStates.push(fabricCanvas.toJSON());
}

function imutaObjeto() {
    objetosDesenhados.forEach(function (elemento) {
        elemento.selectable = false;   // Não pode ser selecionado  
        elemento.hasControls = false;  // Sem controles de redimensionamento/rotação
    });
}

async function renderizarPagina() {
    contadorCliqueRet = 0;

    controleDesenhaRet = false;
    controleModoDesenho = false;
    fabricCanvas.isDrawingMode = false;

    await pdfjsLib.getDocument(arquivoRenderizado).promise.then((doc) => {
        tamanhoPagsDoc = doc.numPages;
        console.log('Tamanho do pdf ' + tamanhoPagsDoc);

        doc.getPage(contadorPagina).then(page => {
            var viewport = page.getViewport(1);

            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderTask = page.render({
                canvasContext: context,
                viewport: viewport
            });

            renderTask.promise.then(async function () {
                imagemURL = canvas.toDataURL();

                fabric.Image.fromURL(imagemURL, function (imagem) {
                    fabricCanvas.setWidth(imagem.width);
                    fabricCanvas.setHeight(imagem.height);

                    heightImagem = imagem.height;
                    widthImagem = imagem.width;

                    fabricCanvas.setBackgroundImage(imagem, fabricCanvas.renderAll.bind(fabricCanvas));
                    fabricCanvas.renderAll();

                    lerQRCodeViaPHP(imagemURL);
                });
            });
        });
    });
}

async function lerQRCodeViaPHP(urlDaImagem) {
    const urlString = urlDaImagem;

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP 
        const response = await fetch('https://feiratec.dev.br/redaquick/control/leitura_qrcode.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: urlString
        });

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }

        const resultadoEnvioPHP = await response.json(); // Extrai e converte o corpo da resposta para JSON        

        ra = resultadoEnvioPHP.NumRA;
        turma = resultadoEnvioPHP.turma;
        trimestre = resultadoEnvioPHP.trimestre;
        ano = resultadoEnvioPHP.ano;
        id_atividade = resultadoEnvioPHP.id_atividade;
        id_instituicao = resultadoEnvioPHP.id_instituicao;

        console.log(ra + "\n" + turma + "\n" + trimestre + "\n" + ano + "\n" + id_atividade + "\n" + id_instituicao);

        if (ra && turma && trimestre && ano && id_atividade && id_instituicao) {
            controleUndefinedQrCode = true;
        } else {
            alert('Os dados do QrCode não foram identificados corretamente!!!');
        }

        if (controleUndefinedQrCode) {
            verificaRedacaoCorrigidaPHP();
        } else {
            controleVerificarCorrecaoCorrigida = false;
            alertaRedacaoCorrigida.style.display = "none";
        }

    } catch (error) {
        console.error('Erro:', error);
    }
}

async function verificaRedacaoCorrigidaPHP() {
    const dados = {
        estado: 'Enviado'
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP 
        const response = await fetch('https://feiratec.dev.br/redaquick/control/verifica_correcaoCorrigida.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }

        const resultadoEnvioPHP = await response.text();
        console.log(resultadoEnvioPHP);

        if (resultadoEnvioPHP === 'true') {
            controleVerificarCorrecaoCorrigida = true;
            alertaRedacaoCorrigida.style.display = "flex";
        } else {
            controleVerificarCorrecaoCorrigida = false;
            alertaRedacaoCorrigida.style.display = "none";
        }

    } catch (error) {
        console.error('Erro:', error);
    }
}

async function updateRedacaoPHP(canvasJson) {
    const canvasJsonStringfy = JSON.stringify(canvasJson);

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP 
        const response = await fetch('https://feiratec.dev.br/redaquick/control/updateRedacaoSalva.php', {
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
        corText: corTxt
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
        notaTotalEnem: notaTotal
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


    // Gerar o PDF como um Blob e oferecer o download
    const pdfBlob = doc.output('blob');
    const link = document.createElement('a');
    link.href = URL.createObjectURL(pdfBlob);
    link.download = 'Vista Pedagógica.pdf';
    link.click();
}

function resetarConfigComentarios() {
    comentarioCompetencia1.value = '200 pts: Demonstra excelente domínio da modalidade escrita formal da língua portuguesa e de escolha de registro. Desvios gramaticais ou de convenções da escrita serão aceitos somente como excepcionalidade e quando não caracterizarem reincidência.';
    comentarioCompetencia2.value = '200 pts: Desenvolve o tema por meio de argumentação consistente, a partir de um repertório sociocultural produtivo e apresenta excelente domínio do texto dissertativo-argumentativo.';
    comentarioCompetencia3.value = '200 pts: Apresenta informações, fatos e opiniões relacionados ao tema proposto, de forma consistente e organizada, configurando autoria, em defesa de um ponto de vista.';
    comentarioCompetencia4.value = '200 pts: Articula bem as partes do texto e apresenta repertório diversificado de recursos coesivos.';
    comentarioCompetencia5.value = '200 pts: Elabora muito bem proposta de intervenção, detalhada, relacionada ao tema e articulada à discussão desenvolvida no texto.';

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