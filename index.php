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
    <title>Tela de Login</title>
    <link rel="stylesheet" href="view/style.css">

    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons/font/bootstrap-icons.css" rel="stylesheet">
</head>

<body>
    <div class="barrinha">
        <img src="imagens/LogoRedaQuick_nova.png" alt="Logo RedaQuick" class="configIMGLogoTCC">
    </div>

    <div class="containerSection">
        <section>
            <p class="titulo">Fale Conosco</p>
            <p class="paragrafo">Contate-nos para adquirir nosso produto!
            </p>
            <div class="alinhamentoCentro">
                <!--Lembrar de mudar o email para o do redaquick-->
                <form action="https://api.staticforms.xyz/submit" method="post">
                    <input class="configInputLogin" type="text" name="name" id="nome" placeholder="Digite seu nome"
                        required autocomplete="off">
                    <br>
                    <input class="configInputLogin" type="email" name="email" id="emailFaleConosco"
                        placeholder="Digite seu e-mail" required autocomplete="off">
                    <br>
                    <input class="configInputLogin" type="text" name="phone" id="telefone" placeholder="(xx)xxxxx-xxxx"
                        required autocomplete="off">
                    <br>
                    <a href="index.php"><input class="configBtn" type="submit" value="Enviar"></a>
                    <input type="hidden" name="accessKey" value="e0392dd0-70e7-4c8a-99eb-eab6ceebaebf">
                    <a href="view/obrigado.html"><input type="hidden" name="redirectTo"
                            value="https://feiratec.dev.br/redaquick/view/obrigado.html"></a>
                </form>
            </div>
        </section>
        <section>
            <p class="titulo">Login</p>
            <p class="paragrafo"><?php 
            if(isset($_SESSION["loginIncorreto"])){
                echo($_SESSION["loginIncorreto"]);
                unset($_SESSION["loginIncorreto"]);
            }else{
                echo("Se já possui cadastro, faça login!");
            }
            ?> </p>
            <div class="alinhamentoCentro">
                <form action="control/login.php" method="post">
                    <input class="configInputLogin" type="email" name="email" id="emailLogin"
                        placeholder="Digite seu e-mail" required autocomplete="off">
                    <br><br>
                    <input class="configInputPassword" type="password" name="password" id="password"
                        placeholder="Digite sua senha" required minlength="5" maxlength="20"><span
                        style="margin-left: 2%;"><i style="cursor: pointer;" class="bi bi-eye"
                            id="togglePassword"></i></span>
                    <br>
                    <div id="alinhamentoEsquerda60">
                        <a href="view/email_esqueceu_senha.php" id="linkEsqueceuSenha">Esqueceu a senha?</a>
                    </div>
                    <a href="view/menu.php"><input type="submit" id="configBtnEntrar" value="Entrar"></a>
                </form>
            </div>
        </section>
    </div>
    <p class="configDireitosAutorais">
        All Rights Reserved® <br> © 2024 Felipe Cardoso, Luís Filipe Rabelo and Pedro Polido
    </p>
</body>

<script src="control/scriptPaginaInicial.js"></script>

</html>