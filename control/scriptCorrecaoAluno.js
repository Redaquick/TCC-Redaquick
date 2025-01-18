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

var contador = 1;
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

var controleVerificarCorrecaoCorrigida = false;
var alertaRedacaoCorrigida = document.getElementById('alertaRedacaoCorrigida');

var controleUndefinedQrCode = false;

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

function imutaObjeto() {
    objetosDesenhados.forEach(function (elemento) {
        elemento.selectable = false;   // Não pode ser selecionado  
        elemento.hasControls = false;  // Sem controles de redimensionamento/rotação
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


        if (resultadoEnvioPHP.comentario != null) {
            const comentarios = resultadoEnvioPHP.comentario.split('&');
            const cores = resultadoEnvioPHP.corTxt.split('&');

            for (let index = 0; index < comentarios.length; index++) {
                addTextAreaComentario(cores[index], comentarios[index]);
            }
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
    comentario.readOnly = true;

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