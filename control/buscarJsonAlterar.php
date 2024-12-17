<?php
include_once "conexao_pdo.php";
session_start();

// Recebendo o corpo da requisição como JSON
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true); // Decodifica o JSON recebido
$id_redacao = $dados['id_redacaoAtual'];

$sql = "SELECT json FROM redacao WHERE id_redacao = ?";
$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$id_redacao]);
      
} catch (PDOException $ex) {
    echo json_encode('ERRO: ' . $ex->getMessage());
    exit();
};

// Criando a resposta para retornar ao cliente
$response = [
    
];

// Enviando a resposta como JSON
echo json_encode($response);
?>