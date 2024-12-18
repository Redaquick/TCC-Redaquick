<?php
include_once "conexao_pdo.php";
session_start();

// Recebendo o corpo da requisição como JSON
header('Content-Type: text/plain');
$input = file_get_contents('php://input');
$dados = json_decode($input, true); // Decodifica o JSON recebido
$id_redacaoAtual = $_SESSION['id_redacaoAtual'];

$sql = "SELECT json FROM redacao WHERE id_redacao = ?";
$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$id_redacaoAtual]);
      
} catch (PDOException $ex) {
    echo ('ERRO: ' . $ex->getMessage());
    exit();
};

// Enviando a resposta como JSON
echo ('teste');
?>