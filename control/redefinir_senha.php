<?php
include_once "conexao.php";

session_start();

// receber os dados vindos do formulário
$senha = $_POST["password"];
$senha2 = $_POST["password2"];
$senhaCriptografada = sha1($senha);
$senhaCriptografada2 = sha1($senha2);
$email = $_SESSION["email"];

// Query SQL com dois updates
$sql = "
    UPDATE usuario SET senha = '$senhaCriptografada' WHERE email = '$email';
    UPDATE usuario SET acesso = 'nao' WHERE email = '$email';
";
if ($senhaCriptografada == $senhaCriptografada2) {
    if ($conn->multi_query($sql)) {  // Usando multi_query para executar várias instruções
        ?>
        <script>
            alert("Senha alterada com sucesso");
            <?php
            $_SESSION['senha'] = $senha;
            ?>
            window.location = "../view/menu.html";
        </script>
        <?php
    } else {
        ?>
        <script>
            alert("Erro ao atualizar a senha!");
            window.history.back();
        </script>
        <?php
    }
} else {
    ?>
    <script>
        alert('Dados incompatíveis nos campos!!!')
        window.history.back();  
    </script>
    <?php
}
?>