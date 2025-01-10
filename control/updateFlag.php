<?php
include_once "conexao_pdo.php";
session_start();

header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true);

$idRedacoes = $dados['idRedacoes'];
$valorFlagAtual = $dados['valorFlag'];

$sql = "UPDATE redacao SET flag = ? WHERE id_redacao = ?";

$stmt = $conn->prepare($sql);

try {
    for ($i = 0; $i < count($idRedacoes); $i++) {
        $stmt->execute([$valorFlagAtual, $idRedacoes[$i]]);
        $resultado = $stmt->fetch(PDO::FETCH_ASSOC);
    }

    if ($stmt->rowCount() > 0) {
        echo json_encode("UpdateFLAGConcluido");
    } else {
        echo json_encode("NENHUMupdateFLAGrealizado");
    }
} catch (PDOException $e) {
    echo json_encode('Erro na sql: ' . $e->getMessage());
}
