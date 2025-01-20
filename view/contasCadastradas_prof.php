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
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
            integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.min.js"></script>

    </head>

    <body>
        <div class="barrinhaRedCorrigidas" style="padding: 0%;">
            <img src="../imagens/LogoRedaQuick_nova.png" alt="Logo RedaQuick" class="configIMGLogoTCC">
            <span style="font-size: 25px; margin-right: 5%;"><a href="menu.php" id="botaoVoltarCorrecao"><i
                        class="bi bi-arrow-bar-left" title="Voltar Menu"></i></a></span>
        </div>

        <div id="contasCadastradas" style="margin-top: 10%;" class="container">
            <table id="tableUsuariosCadastrados" class="table table-bordered table-hover table-striped text-center"
                style="visibility: hidden;">
                <thead>
                    <tr>
                        <th style="background-color: red; color: white;">Nome</th>
                        <th style="background-color: red; color: white;">RA</th>
                        <th style="background-color: red; color: white;">Email</th>
                        <th style="background-color: red; color: white;">Editar</th>
                        <th style="background-color: red; color: white;">Excluir</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- As linhas serão inseridas aqui -->
                </tbody>
            </table>
        </div>

        <div id="mensagemErro" style="display: flex; justify-content: center; align-items: center;"></div>
    </body>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js"></script>
    <script src="../control/scriptContasCadastradas_prof.js"></script>

    </html>
    <?php
} else {
    echo ("Você não tem permissão para acessar essa página!!!");
}
?>