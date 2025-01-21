<?php
session_start();
// Verificar se o status da sessão é 'docente'
if ($_SESSION['status'] === 'docente') {

    ?>

    <!DOCTYPE html>
    <html lang="pt-br">

    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Informação Usuário</title>
        <link rel="stylesheet" href="style.css">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
    </head>

    <body>
        <div class="barrinha">
            <img src="../imagens/LogoRedaQuick_nova.png" alt="Logo RedaQuick" class="configIMGLogoTCC">
        </div>

        <div class="containerSection">
            <section>
                <p class="titulo"><?php
                if (isset($_SESSION['mensagemSucessoContaCadastrda'])) {
                    echo ($_SESSION['mensagemSucessoContaCadastrda']);
                    unset($_SESSION['mensagemSucessoContaCadastrda']);
                } else if (isset($_SESSION['mensagemErroContaCadastrada'])) {
                    echo ($_SESSION['mensagemErroContaCadastrada']);
                    unset($_SESSION['mensagemErroContaCadastrada']);
                } else {
                    echo ('Informações Usuário');
                }
                ?></p>
                <div class="alinhamentoCentro">
                    <form action="../control/alterar_ContaCadastradaProf.php" method="post">
                        <input class="configInputLogin" type="text" name="nome" id="nome"
                            value="<?php echo $_SESSION["nomeContaCadastrada"] ?>" required>
                        <br><br>
                        <input class="configInputLogin" type="email" name="email" id="email"
                            value="<?php echo $_SESSION["emailContaCadastrada"] ?>" required readonly>
                        <br><br>
                        <input class="configInputLogin" type="text" name="ra" id="ra"
                            value="<?php echo $_SESSION["raContaCadastrada"] ?>" required>

                        <div class="b">
                            <a href=<?php
                            if ($_SESSION["status"] === 'docente') {
                                echo ('contasCadastradas_prof.php');
                            }
                            ?>><input class="configBtnVoltar" type="button" value="Voltar"></a>
                            <input id="configBtnAlterar" type="submit" value="Alterar Dados">
                        </div>
                    </form>
                </div>
            </section>
        </div>
    </body>

    </html>

    <?php
} else {
    echo ("Você não tem permissão para acessar essa página!!!");
}
?>