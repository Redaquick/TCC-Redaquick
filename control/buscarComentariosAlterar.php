<?php
include_once "conexao_pdo.php";
session_start();

// Recebendo o corpo da requisição como JSON
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true); // Decodifica o JSON recebido
$id_redacaoAtual = $_SESSION['id_redacaoAtual'];

$sql = "SELECT comentario, corTxt FROM comentario WHERE id_redacao = ?";
$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$id_redacaoAtual]);
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);  
} catch (PDOException $ex) {
    echo json_encode ('ERRO: ' . $ex->getMessage());
    exit();
};

$response = [
    'comentario' => $resultado['comentario'],
    'corTxt' => $resultado['corTxt']
];

echo json_encode($response);
?>