<?php
include_once "conexao.php";

session_start();

//receber os dados vindo do form
$nome = $_POST["nome"];
$ra = $_POST["ra"];
$email = $_POST["email"];

$sql = "UPDATE usuario SET nome = '$nome', ra = '$ra' WHERE email = '$email'";

if ($conn->query($sql) === TRUE) {
    ?>
    <script>
        <?php
        $_SESSION['mensagemSucessoContaCadastrda'] = "Registro alterado com sucesso!";

        $_SESSION['emailContaCadastrada'] = $email;
        $_SESSION['raContaCadastrada'] = $ra;
        $_SESSION['nomeContaCadastrada'] = $nome;
        ?>
        window.location = "../view/editaContaCadastrada_prof.php";
    </script>
    <?php
} else {
    $_SESSION['mensagemErroContaCadastrada'] = "Erro ao atualizar o registro!";
    ?>
    <script>
        window.history.back();
    </script>
    <?php
}
?>