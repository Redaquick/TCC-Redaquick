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

$sql = "UPDATE correcao SET nota_c1 = ?, nota_c2 = ?, nota_c3 = ?, nota_c4 = ?, nota_c5 = ?, nota_enem = ?, nota_decimal = ? WHERE id_redacao = ?";
$stmt = $conn->prepare($sql);

$idRedacao = $_SESSION["VerificaCorrecaoIDredacao"];

try {
    $stmt->execute([$notaC1, $notaC2, $notaC3, $notaC4, $notaC5, $notaTotalEnem, $notaDecimal, $idRedacao]);
    if ($stmt->rowCount() > 0) {
        echo json_encode('NOTAS ATUALIZADAS COM SUCESSO');
    } else {
        echo json_encode("NENHUMupdateREALIZADONotas");
    }
} catch (PDOException $ex) {
    echo json_encode('ERRO AO ATUALIZAR NOTAS: ' . $ex->getMessage());
    exit();
}