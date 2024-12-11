<?php
include_once "conexao_pdo.php";
session_start();

header('Content-Type: application/json');
$input = file_get_contents('php://input');
$jsonAtualizado = $input;

$idRedacao = $_SESSION["VerificaCorrecaoIDredacao"];

$sql = "UPDATE redacao SET json = ? WHERE id_redacao = ?";
$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$jsonAtualizado, $idRedacao]);

    if ($stmt->rowCount() > 0) {
        echo json_encode("UpdateRedacaoConcluido");
    } else {
        echo json_encode("NENHUMupdateREALIZADO");
    }

} catch (PDOException $e) {
    echo json_encode("ERRO SQL UPDATE-REDACAO: " . $e->getMessage());
}
?>