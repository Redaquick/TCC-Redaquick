<?php
include_once "conexao.php";

session_start();

$senha = $_POST["passwordEsqueceu"];
$senha2 = $_POST["passwordEsqueceuDois"];

$email = $_SESSION["emailEsqueceuSenha"];

// Query SQL com dois updates
$sql = "UPDATE usuario SET senha = '$senha' WHERE email = '$email'";

if ($senha == $senha2) {
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