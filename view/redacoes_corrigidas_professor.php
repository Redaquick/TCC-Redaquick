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
        <title>Redações Corrigidas Professor</title>
        <link rel="stylesheet" href="style.css">

        <!-- Inclusão da biblioteca jsPDF para gerar PDFs -->
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>

    </head>

    <body>
        <div class="barrinhaRedCorrigidas">
            <img src="../imagens/LogoRedaQuick_nova.png" alt="Logo RedaQuick" class="configIMGLogoTCC">
            <input id="configBtnGerarRelatorio" class="configBtn" value="Gerar Relatório de Notas" type="button"
                onclick="gerarRelatorio()" title="Gerar Notas Corrigidas Atuais" style="display: none;">
        </div>

        <div id="divRedacoesCorrigidas">

        </div>
    </body>

    <script src="../control/scriptRedCorrigidasProf.js"></script>

    </html>
<?php
} else {
    echo ("Você não tem permissão para acessar essa página!!!");
}
?>