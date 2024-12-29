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

var notaInicial = 200;

var notaC1 = 200;
var notaC2 = 200;
var notaC3 = 200;
var notaC4 = 200;
var notaC5 = 200;

var comentarioCompetencia1 = document.createElement('textarea');
var comentarioCompetencia2 = document.createElement('textarea');
var comentarioCompetencia3 = document.createElement('textarea');
var comentarioCompetencia4 = document.createElement('textarea');
var comentarioCompetencia5 = document.createElement('textarea');

var armazenaComentarios = [];

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

function addTextAreaCompetencia() {
    comentarioCompetencia1.style.borderColor = 'black';
    comentarioCompetencia1.style.borderWidth = '2px';
    comentarioCompetencia1.style.minHeight = '152px';
    comentarioCompetencia1.style.maxHeight = '152px';

    comentarioCompetencia1.value = "";

    sectionComentariosCompetencias.appendChild(comentarioCompetencia1);

    comentarioCompetencia2.style.borderColor = 'black';
    comentarioCompetencia2.style.borderWidth = '2px';
    comentarioCompetencia2.style.minHeight = '152px';
    comentarioCompetencia2.style.maxHeight = '152px';

    comentarioCompetencia2.value = "";

    sectionComentariosCompetencias.appendChild(comentarioCompetencia2);

    comentarioCompetencia3.style.borderColor = 'black';
    comentarioCompetencia3.style.borderWidth = '2px';
    comentarioCompetencia3.style.minHeight = '152px';
    comentarioCompetencia3.style.maxHeight = '152px';

    comentarioCompetencia3.value = "";

    sectionComentariosCompetencias.appendChild(comentarioCompetencia3);

    comentarioCompetencia4.style.borderColor = 'black';
    comentarioCompetencia4.style.borderWidth = '2px';
    comentarioCompetencia4.style.minHeight = '152px';
    comentarioCompetencia4.style.maxHeight = '152px';

    comentarioCompetencia4.value = "";

    sectionComentariosCompetencias.appendChild(comentarioCompetencia4);

    comentarioCompetencia5.style.borderColor = 'black';
    comentarioCompetencia5.style.borderWidth = '2px';
    comentarioCompetencia5.style.minHeight = '152px';
    comentarioCompetencia5.style.maxHeight = '152px';

    comentarioCompetencia5.value = "";

    sectionComentariosCompetencias.appendChild(comentarioCompetencia5);
}

function alteraComentC1(campoTexto, notaValor) {
    switch (notaValor) {
        case 200:
            campoTexto.value = "200 pts: Demonstra excelente domínio da modalidade escrita formal da língua portuguesa e de escolha de registro. Desvios gramaticais ou de convenções da escrita serão aceitos somente como excepcionalidade e quando não caracterizarem reincidência.";
            break;

        case 180:
            campoTexto.value = "180 pts: Demonstra um excelente/bom domínio da modalidade escrita formal da língua portuguesa e de escolha de registro, com poucos desvios gramaticais e de convenções de escrita.";
            break;

        case 160:
            campoTexto.value = "160 pts: Demonstra bom domínio da modalidade escrita formal da língua portuguesa e de escolha de registro, com poucos desvios gramaticais e de convenções de escrita.";
            break;

        case 140:
            campoTexto.value = "140 pts: Demonstra um bom/mediano domínio da modalidade escrita formal da língua portuguesa e de escolha de registro, com poucos desvios gramaticais e de convenções de escrita.";
            break;

        case 120:
            campoTexto.value = "120 pts: Demonstra domínio mediano da modalidade. escrita formal da língua portuguesa e de escolha de registro, com alguns desvios gramaticais e de convenções da escrita.";
            break;

        case 100:
            campoTexto.value = "100 pts: Demonstra domínio mediano/insuficiente da modalidade. escrita formal da língua portuguesa e de escolha de registro, com alguns desvios gramaticais e de convenções da escrita.";
            break;

        case 80:
            campoTexto.value = "80 pts: Demonstra domínio insuficiente da modalidade escrita formal da língua portuguesa, com muitos desvios gramaticais, de escolha de registro e de convenções da escrita.";
            break;

        case 60:
            campoTexto.value = "60 pts: Demonstra domínio insuficiente/precário da modalidade escrita formal da língua portuguesa, com muitos desvios gramaticais, de escolha de registro e de convenções da escrita.";
            break;

        case 40:
            campoTexto.value = "40 pts: Demonstra domínio precário da modalidade escrita formal da língua portuguesa de forma sistemática, com diversificados e frequentes desvios gramaticais, de escolha de registro e de convenções da escrita.";
            break;

        case 20:
            campoTexto.value = "20 pts: Demonstra domínio precário e desconhecimento da modalidade escrita formal da língua portuguesa de forma sistemática, com diversificados e frequentes desvios gramaticais, de escolha de registro e de convenções da escrita.";
            break;

        case 0:
            campoTexto.value = "0 pts: Demonstra desconhecimento da modalidade escrita formal da língua portuguesa.";
            break;
    }
}

function alteraComentC2(campoTexto, notaValor) {
    switch (notaValor) {
        case 200:
            campoTexto.value = "200 pts: Desenvolve o tema por meio de argumentação consistente, a partir de um repertório sociocultural produtivo e apresenta excelente domínio do texto dissertativo-argumentativo.";
            break;

        case 180:
            campoTexto.value = "180 pts: Desenvolve o tema por meio de argumentação consistente, a partir de um repertório sociocultural produtivo e apresenta excelente/bom domínio do texto dissertativo-argumentativo.";
            break;

        case 160:
            campoTexto.value = "160 pts: Desenvolve o tema por meio de argumentação consistente e apresenta bom domínio do texto argumentativo dissertativo, com proposição, argumentação e conclusão.";
            break;

        case 140:
            campoTexto.value = "140 pts: Desenvolve o tema por meio de argumentação consistente e apresenta bom/mediano domínio do texto argumentativo dissertativo, com proposição, argumentação e conclusão.";
            break;

        case 120:
            campoTexto.value = "120 pts: Desenvolve o tema por meio de argumentação previsível e apresenta domínio mediano do texto dissertativo-argumentativo, com proposição, argumentação e conclusão.";
            break;

        case 100:
            campoTexto.value = "100 pts: Desenvolve o tema por meio de argumentação previsível e apresenta domínio mediano/insuficiente do texto dissertativo-argumentativo, com proposição, argumentação e conclusão.";
            break;

        case 80:
            campoTexto.value = "80 pts: Desenvolve o tema recorrendo à cópia de trechos de textos motivadores ou apresenta domínio insuficiente do texto dissertativo-argumentativo, não atendendo à estrutura com proposição, argumentação e conclusão.";
            break;

        case 60:
            campoTexto.value = "60 pts: Desenvolve o tema recorrendo à cópia de trechos de textos motivadores ou apresenta domínio insuficiente/ do texto dissertativo-argumentativo, não atendendo à estrutura com proposição, argumentação e conclusão.";
            break;

        case 40:
            campoTexto.value = "40 pts: Apresenta o assunto, tangenciando o tema, ou demonstra domínio precário do texto dissertativo-argumentativo, com traços constantes de outros tipos textuais.";
            break;

        case 20:
            campoTexto.value = "20 pts: Apresenta o assunto, tangenciando o tema, ou demonstra domínio precário e fugindo do tema do texto dissertativo-argumentativo, com traços constantes de outros tipos textuais.";
            break;

        case 0:
            campoTexto.value = "0 pts: Fuga ao tema/não atendimento à estrutura dissertativo-argumentativa.";
            break;
    }
}

function alteraComentC3(campoTexto, notaValor) {
    switch (notaValor) {
        case 200:
            campoTexto.value = "200 pts: Apresenta informações, fatos e opiniões relacionados ao tema proposto, de forma consistente e organizada, configurando autoria, em defesa de um ponto de vista.";
            break;

        case 180:
            campoTexto.value = "180 pts: Apresenta informações, fatos e opiniões relacionados ao tema proposto, de forma consistente e organizada, porém levemente limitada, configurando autoria, em defesa de um ponto de vista.";
            break;

        case 160:
            campoTexto.value = "160 pts: Apresenta informações, fatos e opiniões bem relacionados ao tema, porém limitados aos argumentos dos textos motivadores e pouco organizados, em defesa de um ponto de vista.";
            break;

        case 140:
            campoTexto.value = "140 pts: Apresenta informações, fatos e opiniões bem/medianamente relacionados ao tema, porém limitados aos argumentos dos textos motivadores e pouco organizados, em defesa de um ponto de vista.";
            break;

        case 120:
            campoTexto.value = "120 pts: Apresenta informações, fatos e opiniões relacionados ao tema de forma mediana e pouco organizada, em defesa de um ponto de vista.";
            break;

        case 100:
            campoTexto.value = "100 pts: Apresenta informações, fatos e opiniões relacionados ao tema de forma mediana ou até desorganizada, em defesa de um ponto de vista.";
            break;

        case 80:
            campoTexto.value = "80 pts: Apresenta informações, fatos e opiniões relacionados ao tema, mas desorganizados ou contraditórios e limitados aos argumentos dos textos motivadores, em defesa de um ponto de vista.";
            break;

        case 60:
            campoTexto.value = "60 pts: Apresenta informações, fatos e opiniões poucos relacionados ao tema, mas desorganizados ou contraditórios e limitados aos argumentos dos textos motivadores de forma incoerente, em defesa de um ponto de vista.";
            break;

        case 40:
            campoTexto.value = "40 pts: Apresenta informações, fatos e opiniões pouco relacionados ao tema ou incoerentes e sem defesa de um ponto de vista.";
            break;

        case 20:
            campoTexto.value = "20 pts: Apresenta informações, fatos e opiniões insuficientes e pouco relacionados ao tema ou incoerentes e sem defesa de um ponto de vista.";
            break;

        case 0:
            campoTexto.value = "0 pts: Não apresenta informações, fatos e opiniões relacionados ao tema e não há uma defesa de um ponto de vista.";
            break;
    }
}

function alteraComentC4(campoTexto, notaValor) {
    switch (notaValor) {
        case 200:
            campoTexto.value = "200 pts: Articula bem as partes do texto e apresenta repertório diversificado de recursos coesivos.";
            break;

        case 180:
            campoTexto.value = "180 pts: Articula bem as partes do texto e apresenta repertório diversificado de recursos coesivos com pouquíssimas inadequações.";
            break;

        case 160:
            campoTexto.value = "160 pts: Articula as partes do texto, com poucas inadequações, e apresenta repertório diversificado de recursos coesivos.";
            break;

        case 140:
            campoTexto.value = "140 pts: Articula as partes do texto, com poucas inadequações, e de forma mediana apresenta repertório diversificado de recursos coesivos.";
            break;

        case 120:
            campoTexto.value = "120 pts: Articula as partes do texto, de forma mediana, com inadequações, e apresenta repertório pouco diversificado de recursos coesivos.";
            break;

        case 100:
            campoTexto.value = "100 pts: Articula as partes do texto, de forma mediana/insuficiente, com inadequações, e apresenta repertório pouco diversificado de recursos coesivos.";
            break;

        case 80:
            campoTexto.value = "80 pts: Articula as partes do texto, de forma insuficiente, com muitas inadequações e apresenta repertório limitado de recursos coesivos.";
            break;

        case 60:
            campoTexto.value = "60 pts: Articula as partes do texto, de forma insuficiente/precária, com muitas inadequações e apresenta repertório limitado de recursos coesivos.";
            break;

        case 40:
            campoTexto.value = "40 pts: Articula as partes do texto de forma precária.";
            break;

        case 20:
            campoTexto.value = "20 pts: Articula as partes do texto de forma precária beirando a ausência de articulações.";
            break;

        case 0:
            campoTexto.value = "0 pts: Não há a articulação de informações no corpo do texto.";
            break;
    }
}

function alteraComentC5(campoTexto, notaValor) {
    switch (notaValor) {
        case 200:
            campoTexto.value = "200 pts: Elabora com excelência proposta de intervenção, detalhada, relacionada ao tema e articulada à discussão desenvolvida no texto.";
            break;

        case 180:
            campoTexto.value = "180 pts: Elabora muito bem proposta de intervenção, detalhada, relacionada ao tema e articulada à discussão desenvolvida no texto.";
            break;

        case 160:
            campoTexto.value = "160 pts: Elabora bem proposta de intervenção relacionada ao tema e articulada à discussão desenvolvida no texto.";
            break;

        case 140:
            campoTexto.value = "140 pts: Elabora bem/medianamente proposta de intervenção relacionada ao tema e articulada à discussão desenvolvida no texto.";
            break;

        case 120:
            campoTexto.value = "120 pts: Elabora, de forma mediana, proposta de intervenção relacionada ao tema e articulada com a discussão desenvolvida no texto.";
            break;

        case 100:
            campoTexto.value = "100 pts: Elabora, de forma mediana/insuficiente, proposta de intervenção relacionada ao tema e articulada com a discussão desenvolvida no texto.";
            break;

        case 80:
            campoTexto.value = "80 pts: Elabora, de forma insuficiente, proposta de intervenção relacionada ao tema, ou não articulada com a discussão desenvolvida no texto.";
            break;

        case 60:
            campoTexto.value = "60 pts: Elabora, de forma insuficiente/precária, proposta de intervenção relacionada ao tema, ou não articulada com a discussão desenvolvida no texto.";
            break;

        case 40:
            campoTexto.value = "40 pts: Apresente proposta de intervenção vaga, precária ou relacionada apenas ao assunto.";
            break;

        case 20:
            campoTexto.value = "20 pts: Apresente proposta de intervenção vaga, precária ou relacionada apenas ao assunto ou até fugindo do assunto.";
            break;

        case 0:
            campoTexto.value = "0 pts: Não apresenta proposta de intervenção ou apresenta proposta não relacionada ao tema ou ao assunto.";
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

    var link = document.createElement('a');
    link.href = urlImagem;
    link.download = 'redacaoCorrigida.png';
    link.click();

    var conteudo = "Comentários referente às Competências:\n\n" +
        comentarioCompetencia1.value + "\n\n" +
        comentarioCompetencia2.value + "\n\n" +
        comentarioCompetencia3.value + "\n\n" +
        comentarioCompetencia4.value + "\n\n" +
        comentarioCompetencia5.value + "\n\n\n" +
        "Comentários Personalizados:\n\n";

    for (let index = 0; index < armazenaComentarios.length; index++) {
        const comentario = armazenaComentarios[index];
        const estilo = getComputedStyle(comentario);
        const corRgb = estilo.borderColor;
        const corLinha = rgbToName(corRgb);
        conteudo = conteudo + "Comentário " + (index + 1) + ": " + comentario.value + "(" + corLinha + ")" + "\n\n";
    }

    // Cria um blob com o conteúdo do texto
    var blob = new Blob([conteudo], { type: 'text/plain' });

    // Cria uma URL para o blob
    var urlComentarios = URL.createObjectURL(blob);

    // Cria um elemento <a> para o download
    var linkComentarios = document.createElement('a');
    linkComentarios.href = urlComentarios;
    linkComentarios.download = 'arquivoComentarios.txt';

    linkComentarios.click();

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
        addTextAreaCompetencia();

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
