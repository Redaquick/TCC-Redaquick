<?php
// Iniciar a sessão
session_start();

// Verificar se o status da sessão é 'docente'
if ($_SESSION['status'] === 'aluno') {
?>
    <!DOCTYPE html>
    <html lang="pt-br">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Tela Aluno - Redação Corrigida</title>
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

        <div class="competencias-container" id="competenciasContainer" style="display: flex;">
            <section class="competencia">
                <p class="titulo">Competência 1</p>

                <input type="text" value="" class="campo-pontuacao" id="competencia1" readonly>

            </section>
            <section class="competencia">
                <p class="titulo">Competência 2</p>

                <input type="text" value="" class="campo-pontuacao" id="competencia2" readonly>

            </section>
            <section class="competencia">
                <p class="titulo">Competência 3</p>

                <input type="text" value="" class="campo-pontuacao" id="competencia3" readonly>

            </section>
            <section class="competencia">
                <p class="titulo">Competência 4</p>

                <input type="text" value="" class="campo-pontuacao" id="competencia4" readonly>

            </section>
            <section class="competencia">
                <p class="titulo">Competência 5</p>

                <input type="text" value="" class="campo-pontuacao" id="competencia5" readonly>

            </section>
        </div>

        <div id="main-container">
            <div id="canvas-container" style="visibility: visible;">
                <canvas id="fabric-canvas"></canvas>
                <canvas id="RenderPDF"></canvas>
            </div>
            <div id="toolbar" style="display: flex"><br><br><br>
                <span style="font-size: 25px"><i style="cursor: pointer;" class="bi bi-chat-right-text"
                        id="estanteComentariosBtn" onclick="OnOffestanteComentarios()" title="Comentários"></i></span>
                <span style="font-size: 25px"><i style="cursor: pointer;" class="bi bi-card-checklist"
                        id="comentariosCompetenciasBtn" onclick="OnOffcomentariosCompetencias()"
                        title="Comentários das Competências"></i></span>
                <span style="font-size: 25px"><i style="cursor: pointer;" class="bi bi-box-arrow-in-down" id="salvarBtn"
                        onclick="salvarClick()" title="Download"></i></span>
            </div>

            <div class="elementosLateraisCanvas" id="elementosLateraisCanvas" style="display: flex;"><br><br><br>
            <span style="font-size: 25px"><i style="cursor: pointer; visibility: visible;" class="bi bi-zoom-in"
                        id="aumentarZoom" onclick="AumentarZoom()" title="Aumentar Zoom"></i></span>
                <span style="font-size: 25px"><i style="cursor: pointer; visibility: visible;" class="bi bi-zoom-out"
                        id="diminuirZoom" onclick="DiminuirZoom()" title="Diminuir Zoom"></i></span>
                <input style="cursor: not-allowed; visibility: visible;" type="text" value="100%" id="CampoTextoZoom"
                    readonly title="Zoom">
                <span style="font-size: 25px"><i style="cursor: pointer;" class="bi bi-clipboard-data"
                        id="campoCompetenciasBtn" onclick="OnOffcampoCompetencias()" title="Competências"></i></span>

                <span style="font-size: 25px;"><a href="menuAluno.php" id="botaoVoltarCorrecao"><i
                            class="bi bi-arrow-bar-left" title="Voltar Menu" style="visibility: visible;"></i></a></span>
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
    <script src="../control/scriptCorrecaoAluno.js"></script>

    </html>
<?php
} else {
    echo ("Você não tem permissão para acessar essa página!!!");
}
?>