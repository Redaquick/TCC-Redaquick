<?php
include_once "conexao.php";

session_start();

//receber os dados vindo do form
$nome = $_POST["nomePerfil"];
$email = $_SESSION["email"];
$senha = $_POST["passwordPerfil"];

$sql = "UPDATE usuario SET nome = '$nome', senha = '$senha' WHERE email = '$email'";

if ($conn->query($sql) === TRUE) {
?>
    <script>
        alert("Registro alterado com sucesso!");
        <?php
        $_SESSION['senha'] = $senha;
        ?>
        window.location = "../view/perfil.php";
    </script>
<?php
} else {
?>
    <script>
        alert("Erro ao atualizar o registro!");
        window.history.back();
    </script>
<?php
}
?>