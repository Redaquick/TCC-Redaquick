<?php
include_once "conexao.php";
//Sessões são uma forma simples de armazenar dados para usuários individuais 
//usando um ID de sessão único. Sessões podem ser usadas para persistir
//informações entre requisições de páginas.
session_start(); //starta a session

$codigoVerificacao = $_POST["verificacaoCod"];

if ($codigoVerificacao == $_SESSION['codigoEsqueceuSenha']) {
?>
    <script>
        window.location = '../view/esqueceu_senhaTela.php';
    </script>
<?php
} else {
    $_SESSION['resultadoCod'] = 'Código Incorreto!';
?>
    <script>
        window.location = '../view/codigo_esqueceu_senha.php';
    </script>
<?php
}
?>