<?php
include_once "conexao_pdo.php";
session_start();

header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true);

$id_criador = $_SESSION["id_usuario"];

$sql = "UPDATE usuario SET nome = ?, ra = ?, email = ? WHERE id_criador = ?";

$stmt = $conn->prepare($sql);

try {
    $stmt->execute([]);
    if ($stmt->rowCount() > 0) {
        echo json_encode("UpdateEditarInfoREALIZADO");
    } else {
        echo json_encode("NENHUMupdateEditarInfoREALIZADO");
    }
} catch (PDOException $e) {
    echo json_encode('Erro na sql: ' . $e->getMessage());
}
