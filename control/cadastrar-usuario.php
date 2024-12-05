<?php
include_once "conexao_pdo.php";
session_start();
//receber os dados vindo do form
$nome = $_POST["nomeUsuario"];
$email = $_POST["email"];
$senha = $_POST["password"];
$senhaCriptografada = sha1($senha);
$ra = $_POST["raUsuario"];
$id_instituicao = $_SESSION["id_instituicao"];

$sql = "INSERT INTO usuario (nome, ra, id_instituicao, email, senha, status, acesso) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

$sqlSelect = "SELECT * FROM usuario WHERE email = ? OR (ra = ? AND id_instituicao = ?)";
$stmtSelect = $conn->prepare($sqlSelect);

try {
    $stmtSelect->execute([$email, $ra, $id_instituicao]);
    $resultado = $stmtSelect->fetchAll(PDO::FETCH_ASSOC);

    if ($resultado == null) {
        $status = 'Aluno';
        $acesso = 'sim';
        try {
            $stmt->execute([$nome, $ra, $id_instituicao, $email, $senhaCriptografada, $status, $acesso]);
            $_SESSION['mensagemCadastroRealizado'] = "Cadastro Realizado com sucesso!";
            try {
                $sqlSelectAluno = "SELECT * FROM aluno WHERE RA = ? AND id_instituicao = ?";
                $stmtSelectAluno = $conn->prepare($sqlSelectAluno);

                $sqlAluno = "INSERT INTO aluno (ra, nome, id_instituicao) VALUES (?, ?, ?)";
                $stmtAluno = $conn->prepare($sqlAluno);

                $stmtSelectAluno->execute([$ra, $id_instituicao]);
                $resultado = $stmtSelectAluno->fetchAll(PDO::FETCH_ASSOC);

                if ($resultado == null) {
                    try {
                        $stmtAluno->execute([$ra, $nome, $id_instituicao]);
                    } catch (PDOException $e) {
                        echo ("ERRO SQL-INSERIR-TABELA-ALUNO: " . $e->getMessage());
                        exit();
                    }
                }
?>
                <script>
                    window.location = "../view/cadastro_usuario.php";
                </script>
        <?php
            } catch (PDOException $e) {
                echo $e->getMessage();
                exit();
            }
        } catch (PDOException $ex) {
            echo $ex->getMessage();
            exit();
        }
    } else {
        $_SESSION['erroTitulo'] = "Dados já Cadastrados";
        ?>
        <script>
            window.location = "../view/cadastro_usuario.php";
        </script>
    <?php
    }
} catch (PDOException $e) {
    ?>
    <script>
        alert('Erro ao consultar aluno cadastrado');
    </script>
<?php
}
?>