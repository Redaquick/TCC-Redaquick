<?php
if (!isset($_SESSION)) {//verifica se existe a session
    session_start();
}
?>
<!DOCTYPE html>
<html lang="pt-br">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastrar Usuário</title>
    <link rel="stylesheet" href="style.css">
    <script src="../control/scriptCadastrar_usuario.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
</head>

<body>
    <div class="barrinha">
        <img src="../imagens/LogoRedaQuick_nova.png" alt="Logo RedaQuick" class="configIMGLogoTCC">
    </div>

    <div class="containerSection">
        <section>
            <p class="titulo" id="textoTitulo"> <?php if(isset($_SESSION["erroTitulo"])){
                echo($_SESSION["erroTitulo"]);
                unset($_SESSION["erroTitulo"]);
            }else if(isset($_SESSION["mensagemCadastroRealizado"])){
                echo($_SESSION["mensagemCadastroRealizado"]);
                unset($_SESSION["mensagemCadastroRealizado"]);
            }else{
                echo('Cadastrar Aluno');                
            } ?></p>
            <div class="alinhamentoCentro">
            <form action="../control/cadastrar-usuario.php" method="post">
                    <input class="configInputLogin" type="text" name="nomeUsuario" id="nomeUsuario"
                        placeholder="Digite o nome do aluno" required>
                    <br>
                    <input class="configInputLogin" type="text" name="raUsuario" id="raUsuario"
                        placeholder="Digite o RA do aluno" required maxlength="20">
                    <br>
                    <input class="configInputLogin" type="email" name="email" id="email" placeholder="Digite o email"
                        required>
                    <br>
                    <input class="configInputPassword" type="password" name="password" id="password"
                        placeholder="Digite a senha" required minlength="5" maxlength="20"><span
                        style="margin-left: 2%;"><i style="cursor: pointer;" class="bi bi-eye"
                            id="togglePassword"></i></span>
                                      
                    <div class="b">
                        <a href="menu.php"><input class="configBtnVoltar" type="button" value="Voltar"></a>
                        <input id="configBtnAlterar" type="submit" value="Cadastrar">
                    </div>
                </form>
            </div>
        </section>
    </div>
</body>

</html>