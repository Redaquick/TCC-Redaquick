<?php
session_start();
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redefinição de Senha</title>
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
            if (isset($_SESSION["dadosImcompativeisCamposEsqueceuSenha"])) {
                echo ($_SESSION["dadosImcompativeisCamposEsqueceuSenha"]);
                unset($_SESSION["dadosImcompativeisCamposEsqueceuSenha"]);
            } else {
                echo ('Redefinição de Senha');
            }
            ?></p>
            <div class="alinhamentoCentro">
                <form action="../control/esqueceuTrocarSenha.php" method="post">
                    <input class="configInputLogin" type="password" name="passwordEsqueceu" id="password"
                        placeholder="Digite sua nova senha" required minlength="5" maxlength="20"><span
                        style="margin-left: 2%;"><i style="cursor: pointer;" class="bi bi-eye"
                            id="togglePassword"></i></span>
                    <br><br><br>
                    <input class="configInputLogin" type="password" name="passwordEsqueceuDois" id="password2"
                        placeholder="Confirme sua nova senha" required minlength="5" maxlength="20"><span
                        style="margin-left: 2%;"><i style="cursor: pointer;" class="bi bi-eye"
                            id="togglePassword2"></i></span>
                    <br>

                    <div class="button-container">
                        <a href="../index.php"><input class="configBtnVoltar" type="button" value="Voltar"></a>
                        <input id="configBtnAlterar" type="submit" value="Alterar">
                    </div>
                </form>
            </div>
        </section>
    </div>
</body>

<script src="../control/scriptEsqueceu_senha.js"></script>

</html>