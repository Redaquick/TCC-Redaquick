<?php
include_once "conexao_pdo.php";
session_start();

// Recebendo o corpo da requisição como JSON
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true); // Decodifica o JSON recebido
$nomeAtividade = $dados['nomeAtividade'];

$sql = "INSERT INTO tarefa (nome) VALUES (?)";
$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$nomeAtividade]);
    $idTarefa = $conn->lastInsertId();  
      
} catch (PDOException $ex) {
    echo json_encode('ERRO: ' . $ex->getMessage());
    exit();
};

// Criando a resposta para retornar ao cliente
$response = [
    'id_atividade' => $idTarefa,
    'id_instituicao' => $_SESSION["id_instituicao"]
];

// Enviando a resposta como JSON
echo json_encode($response);
?>