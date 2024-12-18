<?php
include_once "conexao.php";

session_start();

//receber os dados vindo do form
$nome = $_POST["nomePerfil"];
$email = $_SESSION["email"];
$senha = $_POST["passwordPerfil"];
$senhaCriptografada = sha1($senha);

$sql = "UPDATE usuario SET nome = '$nome', senha = '$senhaCriptografada' WHERE email = '$email'";

if ($conn->query($sql) === TRUE) {
    ?>
    <script>
        <?php
        $_SESSION['senha'] = $senha;
        $_SESSION['mensagemSucessoPerfil'] = "Registro alterado com sucesso!";
        ?>
        window.location = "../view/perfil.php";
    </script>
    <?php
} else {
    $_SESSION['mensagemErroPerfil'] = "Erro ao atualizar o registro!";
    ?>
    <script>
        window.history.back();
    </script>
    <?php
}
?>