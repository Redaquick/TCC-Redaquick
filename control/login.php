<?php
include_once "conexao.php";
//Sessões são uma forma simples de armazenar dados para usuários individuais 
//usando um ID de sessão único. Sessões podem ser usadas para persistir
//informações entre requisições de páginas.
session_start(); //starta a session

$email = $_POST["email"];
$senha = $_POST["password"];
$senhaCriptografada = sha1($senha);

$sql = "SELECT * FROM usuario WHERE email='$email' AND senha='$senhaCriptografada'";
$resultado = $conn->query($sql); //executa o comando sql

if ($resultado->num_rows > 0) { //se a quant de registros é maior q0
    $dados_usuario = $resultado->fetch_assoc();
    //preencher a session com os dados do usuario
    $_SESSION["nome"] = $dados_usuario["nome"];
    $_SESSION["email"] = $dados_usuario["email"];
    $_SESSION["status"] = $dados_usuario["status"];
    $_SESSION["senha"] = $senha;
    $_SESSION["acesso"] = $dados_usuario["acesso"];
    $_SESSION["id_instituicao"] = $dados_usuario["id_instituicao"];
    $_SESSION["id_usuario"] = $dados_usuario["id_usuario"];

    // Verifica o valor de "acesso" na SQL e redireciona de acordo com o valor (sim -> 1° acesso/ não -> 2° ou + acesso)
    if ($dados_usuario["acesso"] === "sim") {
        ?>
        <script>
            window.location = "../view/redefinir_senha_login.html"; // Página para quem irá fazer o 1° acesso
        </script>
        <?php
    } else {

        if ($dados_usuario["status"] === 'docente') {
            ?>
            <script>
                window.location = "../view/menu.html"; // Página para o docente quem já fez o 1° acesso
            </script>
            <?php
        } else {
            ?>
            <script>
                window.location = "../view/menuAluno.html"; // Página para o aluno quem já fez o 1° acesso
            </script>
            <?php
        }
    }
} else {
    $_SESSION["loginIncorreto"] = "Email ou senha incorretos!";
    ?>
    <script>
        window.location = "../index.php";        
    </script>
    <?php
}
?>