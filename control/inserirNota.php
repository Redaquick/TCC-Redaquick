<?php
include_once "conexao_pdo.php";
session_start();

// Recebendo o corpo da requisição como JSON
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true); // Decodifica o JSON recebido

$notaC1 = $dados['c1'];
$notaC2 = $dados['c2'];
$notaC3 = $dados['c3'];
$notaC4 = $dados['c4'];
$notaC5 = $dados['c5'];
$notaTotalEnem = $dados['notaTotalEnem'];
$notaDecimal = $notaTotalEnem / 100.0;

$sql = "INSERT INTO correcao (id_corretor, id_redacao, nota_c1, nota_c2, nota_c3, nota_c4, nota_c5, nota_enem, nota_decimal) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

$id_corretor = $_SESSION["id_usuario"];
$id_redacao = $_SESSION["idRedacao"];

try {
    $stmt->execute([$id_corretor, $id_redacao, $notaC1, $notaC2, $notaC3, $notaC4, $notaC5, $notaTotalEnem, $notaDecimal]);
} catch (PDOException $ex) {
    echo json_encode('ERRO AO INSERIR NOTAS: ' . $ex->getMessage());
    exit();
}

echo json_encode('NOTAS INSERIDAS COM SUCESSO');