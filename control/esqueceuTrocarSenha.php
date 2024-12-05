<?php
include_once "conexao.php";

session_start();

$senha = $_POST["passwordEsqueceu"];
$senha2 = $_POST["passwordEsqueceuDois"];
$senhaCriptografada = sha1($senha);
$senhaCriptografada2 = sha1($senha2);

$email = $_SESSION["emailEsqueceuSenha"];

// Query SQL com dois updates
$sql = "UPDATE usuario SET senha = '$senhaCriptografada' WHERE email = '$email'";

if ($senhaCriptografada == $senhaCriptografada2) {
    if ($conn->query($sql) === TRUE) {
        ?>
        <script>                   
            window.location = "../index.php";
        </script>
        <?php
    } else {
        ?>
        <script>
            alert("Erro ao atualizar a senha!");
            window.location = '../view/esqueceu_senhaTela.php';
        </script>
        <?php
    }
} else {
    $_SESSION["dadosImcompativeisCamposEsqueceuSenha"] = 'Dados incompatíveis nos campos!!!';
    ?>
    <script>               
        window.location = '../view/esqueceu_senhaTela.php';
    </script>
    <?php
}
?>