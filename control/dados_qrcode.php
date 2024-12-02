<?php
include_once "conexao.php";
session_start();

// Recebendo o corpo da requisição como JSON
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true); // Decodifica o JSON recebido
$nomeAtividade = $dados['nomeAtividade'];

$sql = "INSERT INTO tarefa (nome) VALUES ('$nomeAtividade')";

try {
    $result = $conn->query($sql);
    $idTarefa = $conn->insert_id;
} catch (mysqli_sql_exception) {
?>
    <script>
        alert("Erro ao inserir o registro no sistema!");
    </script>
<?php
};

// Criando a resposta para retornar ao cliente
$response = [
    'id_atividade' => $idTarefa,
    'id_instituicao' => $_SESSION["id_instituicao"]
];

// Enviando a resposta como JSON
echo json_encode($response);
?>