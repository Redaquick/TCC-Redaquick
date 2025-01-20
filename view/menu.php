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
                <a id="configCadastrar" href="cadastro_usuario.php">Cadastrar Alunos</a>
                <a id="configContasCadastradas" href="contasCadastradas_prof.php">Contas Cadastradas</a>
                <a id="configLogout" href="../index.php">Logout</a>                
            </div>
        </div>

        <div class="containerSection">
            <section>
                <p class="titulo">Menu</p>
                <div class="alinhamentoCentro">
                    <a href="gerarPDF.php"><input class="configBtn" type="button" name="gerar" id="gerar"
                            value="Gerar Folha de Redações"></a>
                    <br><br>
                    <a href="CorrigirRedacaoPDF.php"><input class="configBtn" type="button" name="corrigirRedacao"
                            id="corrigirRedacao" value="Corrigir Redação"></a>
                    <br><br>
                    <a href="redacoes_corrigidas_professor.php"><input class="configBtn" type="button" name="redacoesCorrigidas"
                            id="redacoesCorrigidas" value="Redações Corrigidas"></a>
                </div>
            </section>
        </div>
    </body>
    <script src="../control/scriptMenu.js"></script>

    </html>
<?php
} else {
    echo("Você não tem permissão para acessar essa página!!!");
}
?>