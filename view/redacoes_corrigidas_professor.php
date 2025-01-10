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

        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>

    </head>

    <body>
        <div class="barrinhaRedCorrigidas" style="padding: 0%;">
            <img src="../imagens/LogoRedaQuick_nova.png" alt="Logo RedaQuick" class="configIMGLogoTCC">
            <p style="margin-right: 2%; display: none;" id="liberarAcessoText">Liberar Acesso aos Alunos</p>
            <span style="font-size: 2.5rem;margin-right:1%"><i style="cursor: pointer; display: none; padding: 0%; margin: 0%; gap: 0%;" class="bi bi-toggle2-off"
                    id="toggleBtn" onclick="onOFFliberar()" title="Liberar Redações no Sistema"></i></span>
            <p id="statusToggle" style="margin-right: 1%; display: none;">Off</p>
            <input id="configBtnGerarRelatorio" class="configBtn" value="Gerar Relatório de Notas" type="button"
                onclick="gerarRelatorio()" title="Gerar Notas Corrigidas Atuais" style="display: none;">
        </div>

        <div id="divRedacoesCorrigidas">

        </div>
    </body>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="../control/scriptRedCorrigidasProf.js"></script>

    </html>
<?php
} else {
    echo ("Você não tem permissão para acessar essa página!!!");
}
?>