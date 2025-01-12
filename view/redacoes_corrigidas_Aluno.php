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
        <title>Redações Corrigidas Aluno</title>
        <link rel="stylesheet" href="style.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    </head>

    <body>
        <div class="barrinhaRedCorrigidas">
            <img src="../imagens/LogoRedaQuick_nova.png" alt="Logo RedaQuick" class="configIMGLogoTCC">
            <span style="font-size: 25px; margin-right: 5%;"><a href="menuAluno.php" id="botaoVoltarCorrecao"><i
                        class="bi bi-arrow-bar-left" title="Voltar Menu"></i></a></span>
        </div>

        <div id="divRedacoesCorrigidasAluno"></div>
    </body>

    <script src="../control/scriptRedCorrigidasAluno.js"></script>

    </html>
<?php
} else {
    echo ("Você não tem permissão para acessar essa página!!!");
}
?>