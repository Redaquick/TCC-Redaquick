<?php
session_start();
?>

<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Perfil Usuário</title>
    <link rel="stylesheet" href="style.css">
    <script src="../control/scriptPerfil.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
</head>

<body>
    <div class="barrinha">
        <img src="../imagens/LogoRedaQuick_nova.png" alt="Logo RedaQuick" class="configIMGLogoTCC">
    </div>

    <div class="containerSection">
        <section>
            <p class="titulo"><?php
            if (isset($_SESSION['mensagemSucessoPerfil'])) {
                echo ($_SESSION['mensagemSucessoPerfil']);
                unset($_SESSION['mensagemSucessoPerfil']);
            } else if (isset($_SESSION['mensagemErroPerfil'])) {
                echo ($_SESSION['mensagemErroPerfil']);
                unset($_SESSION['mensagemErroPerfil']);
            } else {
                echo ('Perfil');
            }
            ?></p>
            <div class="alinhamentoCentro">
                <form action="../control/alterar_perfil.php" method="post">
                    <input class="configInputLogin" type="text" name="nomePerfil" id="nomePerfil"
                        value="<?php echo $_SESSION["nome"] ?>" required>
                    <br><br>
                    <input class="configInputLogin" type="email" name="emailPerfil" id="emailPerfil"
                        value="<?php echo $_SESSION["email"] ?>" required readonly>
                    <br><br>
                    <input class="configInputPassword" type="password" name="passwordPerfil" id="passwordPerfil"
                        value="<?php echo $_SESSION["senha"] ?>" required minlength="5" maxlength="20"><span
                        style="margin-left: 2%;"><i style="cursor: pointer;" class="bi bi-eye"
                            id="togglePassword"></i></span>

                    <div class="b">
                        <a href=<?php
                        if ($_SESSION["status"] === 'docente') {
                            echo ('menu.php');
                        } else {
                            echo ('menuAluno.php');
                        }
                        ?>><input class="configBtnVoltar" type="button"
                                value="Voltar"></a>
                        <input id="configBtnAlterar" type="submit" value="Alterar Dados">
                    </div>
                </form>
            </div>
        </section>
    </div>
</body>

</html>