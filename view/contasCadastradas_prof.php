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
        <title>Contas Cadastradas Professor</title>
        <link rel="stylesheet" href="style.css">

        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>

    </head>

    <body>
        <div class="barrinhaRedCorrigidas" style="padding: 0%;">
            <img src="../imagens/LogoRedaQuick_nova.png" alt="Logo RedaQuick" class="configIMGLogoTCC">
            <span style="font-size: 25px; margin-right: 5%;"><a href="menu.php" id="botaoVoltarCorrecao"><i
                        class="bi bi-arrow-bar-left" title="Voltar Menu"></i></a></span>
        </div>

        <div id="contasCadastradas" style="margin-top: 7%;">
            <table id="tableUsuariosCadastrados">
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>RA</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- As linhas serão inseridas aqui -->
                </tbody>
            </table>
        </div>
    </body>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="../control/scriptContasCadastradas_prof.js"></script>

    </html>
    <?php
} else {
    echo ("Você não tem permissão para acessar essa página!!!");
}
?>