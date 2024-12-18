<?php
include_once "conexao_pdo.php";
session_start();

// Recebendo o corpo da requisição como JSON
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true);

$id_aluno = $_SESSION["id_usuario"];

$sql = "SELECT json FROM redacao WHERE id_aluno = ?";
$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$id_aluno]);

    $resultado = $stmt->fetch(PDO::FETCH_ASSOC); 
      
} catch (PDOException $ex) {
    echo json_encode('ERRO: ' . $ex->getMessage());
    exit();
};

$response = [
    'vetorJson' => $resultado
];

// Enviando a resposta como JSON
echo json_encode($response);
?>