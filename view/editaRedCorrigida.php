<?php
// Iniciar a sessão
session_start();

// Verificar se o status da sessão é 'docente'
if ($_SESSION['status'] === 'docente') {
    ?>
    <!DOCTYPE html>
    <html lang="pt-br">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Editar Redação</title>
        <link rel="stylesheet" href="style.css">

        <!-- CSS do Bootstrap -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <!-- CDN dos ícones do Bootstrap -->
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">

        <!-- Inclusão da biblioteca jsPDF para gerar PDFs -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>

        <script src="https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.943/build/pdf.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js"></script>
    </head>

    <body>

        <div class="barrinhaCorrecaoRedaquick" id="barrinhaCorrecaoRedaquick" style="display: flex;">
            <img src="../imagens/LogoRedaQuick_nova.png" alt="Logo RedaQuick" class="configIMGLogoTCCcorrecaoRedaquick">
        </div>

        <div class="competencias-container" id="competenciasContainer"" style=" display: flex;">
            <section class="competencia">
                <p class="titulo">Competência 1</p>
                <span><button id="diminuiNotaC1" class="icones-competencia"><i class="bi bi-dash" title="Diminuir"
                            onclick="diminuirNotaC1()"></i></button></span>
                <input type="text" value="" class="campo-pontuacao" id="competencia1" readonly>
                <span><button id="aumentaNotaC1" class="icones-competencia"><i class="bi bi-plus" title="Aumentar"
                            onclick="aumentarNotaC1()"></i></button></span>
            </section>
            <section class="competencia">
                <p class="titulo">Competência 2</p>
                <span><button id="diminuiNotaC2" class="icones-competencia"><i class="bi bi-dash" title="Diminuir"
                            onclick="diminuirNotaC2()"></i></button></span>
                <input type="text" value="" class="campo-pontuacao" id="competencia2" readonly>
                <span><button id="aumentaNotaC2" class="icones-competencia"><i class="bi bi-plus" title="Aumentar"
                            onclick="aumentarNotaC2()"></i></button></span>
            </section>
            <section class="competencia">
                <p class="titulo">Competência 3</p>
                <span><button id="diminuiNotaC3" class="icones-competencia"><i class="bi bi-dash" title="Diminuir"
                            onclick="diminuirNotaC3()"></i></button></span>
                <input type="text" value="" class="campo-pontuacao" id="competencia3" readonly>
                <span><button id="aumentaNotaC3" class="icones-competencia"><i class="bi bi-plus" title="Aumentar"
                            onclick="aumentarNotaC3()"></i></button></span>
            </section>
            <section class="competencia">
                <p class="titulo">Competência 4</p>
                <span><button id="diminuiNotaC4" class="icones-competencia"><i class="bi bi-dash" title="Diminuir"
                            onclick="diminuirNotaC4()"></i></button></span>
                <input type="text" value="" class="campo-pontuacao" id="competencia4" readonly>
                <span><button id="aumentaNotaC4" class="icones-competencia"><i class="bi bi-plus" title="Aumentar"
                            onclick="aumentarNotaC4()"></i></button></span>
            </section>
            <section class="competencia">
                <p class="titulo">Competência 5</p>
                <span><button id="diminuiNotaC5" class="icones-competencia"><i class="bi bi-dash" title="Diminuir"
                            onclick="diminuirNotaC5()"></i></button></span>
                <input type="text" value="" class="campo-pontuacao" id="competencia5" readonly>
                <span><button id="aumentaNotaC5" class="icones-competencia"><i class="bi bi-plus" title="Aumentar"
                            onclick="aumentarNotaC5()"></i></button></span>
            </section>
        </div>

        <div id="main-container">
            <div id="canvas-container" style="visibility: visible;">
                <canvas id="fabric-canvas"></canvas>
                <canvas id="RenderPDF"></canvas>
            </div>
            <div id="toolbar" style="display: flex;"><br><br><br>
                <span style="font-size: 25px"><i class="bi bi-pen" id="draw" title="Caneta"></i></span>
                <span style="font-size: 25px"><i class="bi bi-aspect-ratio" id="selecionarTexto" title="Selecionar Texto"
                        onclick="desenhaRetangulo()"></i></span>
                <span style="font-size: 25px"><i class="bi bi-ban" id="desativar" title="Desativar"></i></span>
                <button
                    style="background-color:red; border-radius: 20%; width: 1.8rem; height: 1.8rem; border: 1px solid white;"
                    id="buttonCorPrincipal" onclick="buttonCorPrincipalClick()"></button>
                <span style="font-size: 25px"><i class="bi bi-arrow-counterclockwise" id="back" title="Desfazer"></i></span>
                <span style="font-size: 25px"><i style="cursor: pointer;" class="bi bi-chat-right-text"
                        id="estanteComentariosBtn" onclick="OnOffestanteComentarios()" title="Comentários"></i></span>
                <span style="font-size: 25px"><i style="cursor: pointer;" class="bi bi-card-checklist"
                        id="comentariosCompetenciasBtn" onclick="OnOffcomentariosCompetencias()"
                        title="Comentários das Competências"></i></span>
            </div>

            <div>
                <section id="paleteCores">
                    <button
                        style="background-color: red; border-radius: 20%; width: 1.8rem; height: 1.8rem; border: 1px solid white;"
                        id="buttonCorRed" onclick="buttonCorRed()"></button>
                    <button
                        style="background-color: purple; border-radius: 20%; width: 1.8rem; height: 1.8rem; border: 1px solid white;"
                        id="buttonCorPurple" onclick="buttonCorPurple()"></button>
                    <button
                        style="background-color: brown; border-radius: 20%; width: 1.8rem; height: 1.8rem; border: 1px solid white;"
                        id="buttonCorBrown" onclick="buttonCorBrown()"></button>
                    <button
                        style="background-color: green; border-radius: 20%; width: 1.8rem; height: 1.8rem; border: 1px solid white;"
                        id="buttonCorGreen" onclick="buttonCorGreen()"></button>
                    <button
                        style="background-color: orange; border-radius: 20%; width: 1.8rem; height: 1.8rem; border: 1px solid white;"
                        id="buttonCorYellow" onclick="buttonCorOrange()"></button>
                    <button
                        style="background-color: black; border-radius: 20%; width: 1.8rem; height: 1.8rem; border: 1px solid white;"
                        id="buttonCorBlack" onclick="buttonCorBlack()"></button>
                </section>
            </div>

            <div class="elementosLateraisCanvas" id="elementosLateraisCanvas" style="display: flex;"><br><br><br>
                <span style="font-size: 25px"><i style="cursor: pointer; visibility: visible;" class="bi bi-zoom-in"
                        id="aumentarZoom" onclick="AumentarZoom()" title="Aumentar Zoom"></i></span>
                <span style="font-size: 25px"><i style="cursor: pointer; visibility: visible;" class="bi bi-zoom-out"
                        id="diminuirZoom" onclick="DiminuirZoom()" title="Diminuir Zoom"></i></span>
                <input style="cursor: not-allowed; visibility: visible;" type="text" value="100%" id="CampoTextoZoom"
                    readonly title="Zoom">
                <span style="font-size: 25px"><i style="cursor: pointer;" class="bi bi-box-arrow-in-down" id="salvarBtn"
                        onclick="salvarClick()" title="Download" style="visibility: visible;"></i></span>
                <span style="font-size: 25px"><i style="cursor: pointer;" class="bi bi-clipboard-data"
                        id="campoCompetenciasBtn" onclick="OnOffcampoCompetencias()" title="Competências"
                        style="visibility: visible;"></i></span>
                <span style="font-size: 25px"><i style="cursor: pointer;" class="bi bi-cloud-check" title="Salvar Correção"
                        id="salvarCorrecao" onclick="salvarCorrecao()" style="visibility: visible;"></i></span>

                <span style="font-size: 25px;"><a id="botaoVoltarCorrecao"><i class="bi bi-arrow-bar-left"
                            title="Voltar Menu" style="visibility: visible; cursor: pointer;"></i></a></span>
                <input type="file" id="uploadPDF" accept=".pdf">
            </div>
        </div>

        <div>
            <section id="estanteComent" style="display: none;">
                <span style="background-color: #bb0b0b;">
                    <p style="font-size: 30px; text-align: center; color: white;">Comentários da Redação</p>
                </span>

            </section>
        </div>

        <div>
            <section id="comentCompetencias" style="display: flex;">
                <span style="background-color: #bb0b0b;">
                    <p style="font-size: 30px; text-align: center; color: white;">Comentários Referente as Competências</p>
                </span>

            </section>
        </div>
    </body>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js"></script>
    <script src="../control/scriptEditaRedCorrigida.js"></script>

    </html>
    <?php
} else {
    echo ("Você não tem permissão para acessar essa página!!!");
}
?>