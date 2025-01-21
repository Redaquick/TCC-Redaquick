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

    <!--versão mais atual da API EmailJS-->
    <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
</head>

<body>
    <div class="barrinha">
        <img src="../imagens/LogoRedaQuick_nova.png" alt="Logo RedaQuick" class="configIMGLogoTCC">
    </div>

    <div class="containerSection">
        <section id="sectionEnviarEmail" style="display: block;">
            <p class="titulo" id="tituloPagina"><?php
            if(isset($_SESSION['verificarEmailEsqueceu'])){
                    echo($_SESSION['verificarEmailEsqueceu']);
                    unset($_SESSION['verificarEmailEsqueceu']);
                }else{
                    echo('Verificação de Email!');}
                    ?></p>
            <div class="alinhamentoCentro">
                <form action="../control/verificar_email.php" id="email-form" method="post">
                    <br><br>
                    <input class="configInputLogin" type="email" name="email" id="emailCodigoEsqueceuSenha"
                        placeholder="Digite seu e-mail" required>

                    <div class="button-container">
                        <a href="../index.php"><input class="configBtnVoltar" type="button" value="Voltar"></a>

                        <a><button type="submit" class="configBtnVoltar" id="botaoEnviarEmail">Enviar</button></a>
                    </div>
                </form>
            </div>
        </section>
    </div>
</body>

</html>