<?php
// Iniciar a sessão
session_start();

// Verificar se o status da sessão é 'docente'
if ($_SESSION['status'] === 'docente') {
?>

    <!DOCTYPE html>
    <html lang="pt-BR">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Gerador de QR Codes e PDF</title>

        <!-- Inclusão da biblioteca XLSX para leitura de arquivos Excel-->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
        <!-- Inclusão da biblioteca QRCode para gerar QR codes -->
        <script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>
        <!-- Inclusão da biblioteca jsPDF para gerar PDFs -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>

        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
        <link rel="stylesheet" href="style.css">
    </head>

    <body>
        <div class="barrinha">
            <img src="../imagens/LogoRedaQuick_nova.png" alt="Logo RedaQuick" class="configIMGLogoTCC">
        </div>

        <div class="containerSection">
            <section>
                <p id="tituloGerar">Gerar Folhas de Redação</p>
                <div class="alinhamentoCentro">
                    <label class="paragrafo">Informe o trimestre que será realizado a avaliação:<br></label>
                    <select name="trimestre" id="trimestre">
                        <option value="1">1° Trimestre</option>
                        <option value="2">2° Trimestre</option>
                        <option value="3">3° Trimestre</option>
                    </select>
                    <br><br>
                    <label class="paragrafo">
                        <input type="radio" name="atividade" value="Atividade Sala" checked>Atividade Sala
                    </label>

                    <label class="paragrafo">
                        <input type="radio" name="atividade" value="Avaliação Global">Avaliação Global
                    </label>
                    <br><br>
                    <!-- Campo para selecionar imagem -->
                    <label class="paragrafo">Importe o arquivo da redação (.jpg):</label>

                    <a style="text-decoration: none;" href="../imagens/folha_redacao_padrao.jpg">
                        <button class="configBtnExemplo">Exemplo</button>
                    </a>

                    <div class="tooltip">
                        <i class="bi bi-question-circle"></i>
                        <span class="tooltiptext">Caso não tenha o modelo da folha de redação, clique com o botão
                            direito na imagem do exemplo e salve-a.</span>
                    </div>

                    <input type="file" id="imagem-usuario" onchange="converterImagem();" accept=".jpg" />
                    <div id="apresentar-imagem"></div>
                    <br>

                    <!-- Campo para selecionar arquivo Excel -->
                    <label class="paragrafo">Importe o arquivo da planilha (.csv, .xlsx):</label>
                    <a style="text-decoration: none;" href="../imagens/exemplo_planilha.png">
                        <button class="configBtnExemplo">Exemplo</button>
                    </a>

                    <div class="tooltip">
                        <i class="bi bi-question-circle"></i>
                        <span class="tooltiptext">Mantenha a formatação das colunas "Nome" e "RA", pois elas serão
                            usadas para imprimir os QR Codes.</span>
                    </div>

                    <input type="file" id="fileInput" accept=".csv, .xlsx" />
                    <div id="qrCodes"></div>
                    <input class="configInputNomeAtividade" type="text" name="nomeAtividade" id="nomeAtividade"
                        placeholder="Digite o nome da Atividade" autocomplete="off" />

                    <div class="b">
                        <a href="menu.php"><input id="configBtnVoltarGerarPDF" type="button" value="Voltar"></a>
                        <input id="configBtnGerarPDF" type="button" onclick="gerarPDFs()" value="Gerar PDFs">
                    </div>
                </div>
            </section>
        </div>
    </body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="../control/scriptGerarPdf.js"></script>

    </html>
<?php
} else {
    echo ("Você não tem permissão para acessar essa página!!!");
}
?>