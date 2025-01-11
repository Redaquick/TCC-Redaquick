<?php
include_once "conexao_pdo.php";
session_start();

// Recebendo o corpo da requisição como JSON
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true); // Decodifica o JSON recebido
$id_redacaoAtual = $_SESSION['id_redacaoAtual'];

$sql = "SELECT nota_c1, nota_c2, nota_c3, nota_c4, nota_c5 FROM correcao WHERE id_redacao = ?";
$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$id_redacaoAtual]);
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);  
} catch (PDOException $ex) {
    echo json_encode ('ERRO: ' . $ex->getMessage());
    exit();
};

$response = [
    'nota_c1' => $resultado['nota_c1'],
    'nota_c2' => $resultado['nota_c2'],
    'nota_c3' => $resultado['nota_c3'],
    'nota_c4' => $resultado['nota_c4'],
    'nota_c5' => $resultado['nota_c5']
];

echo json_encode($response);
?>