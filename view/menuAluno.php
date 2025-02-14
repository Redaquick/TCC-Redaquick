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
        <title>Menu</title>
        <link rel="stylesheet" type="text/css" href="style.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    </head>

    <body>
        <div class="barrinha">
            <img src="../imagens/LogoRedaQuick_nova.png" alt="Logo RedaQuick" class="configIMGLogoTCC">
        </div>

        <div class="settings-container">
            <span style="font-size: 35px"><i class="bi bi-list" id="settingsIcon"></i></span>
            <div class="settings-menu" id="settingsMenu">
                <a id="configPerfil" href="perfil.php">Perfil</a>
                <a id="configLogout" href="../index.php">Logout</a>
            </div>
        </div>

        <div class="containerSection">
            <section>
                <p class="titulo">Menu</p>
                <div class="alinhamentoCentro">
                    <a href="redacoes_corrigidas_Aluno.php"><input class="configBtn" type="button" name="acessoCorrecoes"
                            id="acessoCorrecoes" value="Histórico de Correções"></a>
                </div>
            </section>
        </div>
    </body>
    <script src="../control/scriptMenu.js"></script>

    </html>
<?php
} else {
    echo ("Você não tem permissão para acessar essa página!!!");
}
?>