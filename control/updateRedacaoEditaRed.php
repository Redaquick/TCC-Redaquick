<?php
include_once "conexao_pdo.php";
session_start();

// Recebendo o corpo da requisição como JSON
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true); // Decodifica o JSON recebido
$jsonAtualizado = $input;

$idRedacao = $_SESSION["id_redacaoAtual"];

$sql = "UPDATE redacao SET json = ? WHERE id_redacao = ?";
$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$jsonAtualizado, $idRedacao]);
    if ($stmt->rowCount() > 0) {
        echo json_encode("UpdateRedacaoEditaRedConcluido");
    } else {
        echo json_encode("NENHUMupdateRedacaoEditaRedREALIZADO");
    }
} catch (PDOException $e) {
    echo json_encode("ERRO SQL UPDATE-REDACAO: " . $e->getMessage());
}
