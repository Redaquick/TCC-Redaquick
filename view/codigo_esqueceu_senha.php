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
        <section id="sectionVerificarCodigo">
            <p class="titulo" id="tituloPaginaCodigo"><?php 
            if(isset($_SESSION['resultadoCod'])){
                echo($_SESSION['resultadoCod']);
                unset($_SESSION['resultadoCod']);
            }else{
                echo('Verificação de Código');
            }
            ?></p>
            <div class="alinhamentoCentro">
                <br><br>
                <form action="../control/verificar_codigo.php" method="post">
                    <input class="configInputLogin" type="text" name="verificacaoCod" id="verificacaoCod"
                        placeholder="Digite o código de verificação" required maxlength="6">

                    <div class="button-container">
                        <a href="../index.php"><input class="configBtnVoltar" type="button" value="Voltar"></a>
                        <a><button type="submit" class="configBtnVoltar" id="botaoVerificaCodigo">Verificar Código</button></a>
                    </div>
                </form>
            </div>
        </section>
    </div>
</body>

</html>