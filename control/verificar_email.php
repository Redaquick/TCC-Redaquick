<!--versão mais atual da API EmailJS-->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script src="scriptEmail_esqueceu_senha.js"></script>
<?php
include_once "conexao.php";
//Sessões são uma forma simples de armazenar dados para usuários individuais 
//usando um ID de sessão único. Sessões podem ser usadas para persistir
//informações entre requisições de páginas.
session_start(); //starta a session

$email = $_POST["email"];
$codigoPHP = mt_rand(100000, 999999);
$codigoPHP = (string) $codigoPHP;

$sql = "SELECT * FROM usuario WHERE email='$email'";
$resultado = $conn->query($sql); //executa o comando sql

if ($resultado->num_rows > 0) { //se a quant de registros é maior q0
    $dados_usuario = $resultado->fetch_assoc();
    $_SESSION['codigoEsqueceuSenha'] = $codigoPHP;
    $_SESSION["emailEsqueceuSenha"] = $email;
    ?>
    <script>
        <?php echo "enviarEmail('$email',$codigoPHP);"; ?>
    </script>
    <?php
} else {
    $_SESSION['verificarEmailEsqueceu'] = 'Email não cadastrado!';
    ?>
    <script>
        window.location = '../view/email_esqueceu_senha.php';
    </script>
    <?php
}
?>