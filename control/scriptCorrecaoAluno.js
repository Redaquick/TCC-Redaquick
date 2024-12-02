var fabricCanvas = new fabric.Canvas('fabric-canvas');
var canvas = document.getElementById("RenderPDF");
var context = canvas.getContext("2d");

var voltarParaMenu = document.getElementById("configBtnVoltarCorrigir");
var aumentarZoom = document.getElementById("aumentarZoom");
var diminuirZoom = document.getElementById("diminuirZoom");
var valorZoomTexto = document.getElementById("CampoTextoZoom");
var sectionCompetenciasContainer = document.getElementById("competenciasContainer");
var sectionEstanteComentarios = document.getElementById("estanteComent");
var sectionComentariosCompetencias = document.getElementById("comentCompetencias");
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

var arquivoRenderizado;

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

// Função para salvar o estado atual do canvas
function saveCanvasState() {
    // Adiciona o estado atual do canvas à lista de estados
    canvasStates.push(fabricCanvas.toJSON());
}


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

            addTextArea();
        }
    }
});

function imutaObjeto() {
    objetosDesenhados.forEach(function (elemento) {
        elemento.selectable = false;   // Não pode ser selecionado  
        elemento.hasControls = false;  // Sem controles de redimensionamento/rotação
    });
}

function renderizarPagina() {
    pdfjsLib.getDocument(arquivoRenderizado).promise.then((doc) => {
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

            renderTask.promise.then(function () {
                var imagemURL = canvas.toDataURL();

                fabric.Image.fromURL(imagemURL, function (imagem) {
                    fabricCanvas.setWidth(imagem.width);
                    fabricCanvas.setHeight(imagem.height);

                    heightImagem = imagem.height;
                    widthImagem = imagem.width;

                    fabricCanvas.setBackgroundImage(imagem, fabricCanvas.renderAll.bind(fabricCanvas));
                    fabricCanvas.renderAll();
                });
            });
        });
    });
}

function verificaRedacaoSalvaProxPag() {
    if (controleSalvarCorrecao == false) {
        if (confirm('Sua correção não foi salva. Tem certeza que deseja passar de página?')) {
            ProxPagina();
        }
    } else {
        controleSalvarCorrecao = false;
        ProxPagina();
    }
}

function verificaRedacaoSalvaPagAnterior() {
    if (controleSalvarCorrecao == false) {
        if (confirm('Sua correção não foi salva. Tem certeza que deseja passar de página?')) {
            PaginaAnterior();
        }
    } else {
        controleSalvarCorrecao = false;
        PaginaAnterior();
    }
}

function salvarCorrecao() {

    //Implementar Logica para Salvar Correcao de Redacao no Banco  

    controleSalvarCorrecao = true;
    alert('Sua Correção foi salva!!!');

}

function ProxPagina() {
    if (contadorPagina < tamanhoPagsDoc) {
        contadorPagina++;

        currentStateIndex = -1;
        canvasStates.splice(0, canvasStates.length);
        fabricCanvas.clear();

        zoom = 1;
        valorZoomPercentual = (zoom * 100);
        valorZoomTexto.value = valorZoomPercentual + '%';
        fabricCanvas.setZoom(1);

        renderizarPagina();

    } else {
        alert('Limite de Página Atingido!')
    }
}

function PaginaAnterior() {
    if (contadorPagina > 1) {
        contadorPagina--;

        currentStateIndex = -1;
        canvasStates.splice(0, canvasStates.length);
        fabricCanvas.clear();

        zoom = 1;
        valorZoomPercentual = (zoom * 100);
        valorZoomTexto.value = valorZoomPercentual + '%';
        fabricCanvas.setZoom(1);

        renderizarPagina();
    } else {
        alert('Limite de Página Atingido!')
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
}

function aumentarNotaC2() {
    aumentarNotaC(notaC2, valorNotaTextoC2);
}

function aumentarNotaC3() {
    aumentarNotaC(notaC3, valorNotaTextoC3);
}

function aumentarNotaC4() {
    aumentarNotaC(notaC4, valorNotaTextoC4);
}
function aumentarNotaC5() {
    aumentarNotaC(notaC5, valorNotaTextoC5);
}

function diminuirNotaC1() {
    diminuirNotaC(notaC1, valorNotaTextoC1);
}
function diminuirNotaC2() {
    diminuirNotaC(notaC2, valorNotaTextoC2);
}
function diminuirNotaC3() {
    diminuirNotaC(notaC3, valorNotaTextoC3);
}
function diminuirNotaC4() {
    diminuirNotaC(notaC4, valorNotaTextoC4);
}
function diminuirNotaC5() {
    diminuirNotaC(notaC5, valorNotaTextoC5);
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
    }
}

function OnOffcomentariosCompetencias() {
    if (controladorOnOffcomentariosCompetencias) {
        controladorOnOffcomentariosCompetencias = false;
        sectionComentariosCompetencias.style.display = "none";
    } else {
        controladorOnOffcomentariosCompetencias = true;
        sectionComentariosCompetencias.style.display = "flex";
    }
}

function salvarClick() {
    var urlImagem = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1.0
    });

    var link = document.createElement('a');
    link.href = urlImagem;
    link.download = 'redacaoCorrigida.png';
    link.click();
}

function addTextArea() {
    var comentario = document.createElement('textarea');
    comentario.style.borderColor = corLinha;
    comentario.style.borderWidth = '2px';
    comentario.style.minHeight = '105px';
    comentario.style.maxHeight = '105px';
    comentario.maxLength = 150;

    var section = document.getElementById('estanteComent');
    section.appendChild(comentario);

    armazenaComentarios.push(comentario);
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

function hiddenVisibleDisplay() {
    sectionCorrigirRedacao.style.display = "none";
    sectionCompetenciasContainer.style.display = "flex";
    sectionEstanteComentarios.style.display = "flex";
    sectionComentariosCompetencias.style.display = "none";
    firstinputPDFupload.style.display = "none";
    topBar.style.display = "none";
    toolbar.style.display = "flex";
    elementosLateraisCanvas.style.display = "flex";
    topBarCorrecao.style.display = "flex";
    voltarParaMenu.style.display = "none";
    aumentarZoom.style.visibility = "visible";
    diminuirZoom.style.visibility = "visible";
    valorZoomTexto.style.visibility = "visible";
    inputPDFupload.style.visibility = "none";
    document.getElementById('canvas-container').style.visibility = "visible";

    fabricCanvas.renderAll();
}

firstinputPDFupload.addEventListener('change', function (event) {
    const file = event.target.files[0];

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file); //Ler o arquivo como um ArrayBuffer

    fileReader.onload = function () {
        arquivoRenderizado = new Uint8Array(this.result);   //Converter o arquivo em Uint8

        hiddenVisibleDisplay();
        renderizarPagina();

        inputPDFupload.files = firstinputPDFupload.files;
        fabricCanvas.selection = false;
        fabricCanvas.selectable = false;
    };
});

inputPDFupload.addEventListener('change', function (event) {
    const file = event.target.files[0];

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file); //Ler o arquivo como um ArrayBuffer

    fileReader.onload = function () {
        arquivoRenderizado = new Uint8Array(this.result);   //Converter o arquivo em Uint8

        currentStateIndex = -1;
        canvasStates.splice(0, canvasStates.length);
        fabricCanvas.clear();

        zoom = 1;
        valorZoomPercentual = (zoom * 100);
        valorZoomTexto.value = valorZoomPercentual + '%';
        fabricCanvas.setZoom(1);

        renderizarPagina();
    };
});

//-------------------------------------------------------
