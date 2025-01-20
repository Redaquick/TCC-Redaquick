<?php
include_once "conexao_pdo.php";
session_start();

header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true);

$email = $dados['emailUsuario'];

$sql = "DELETE FROM usuario WHERE email = ?";

$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$email]);
    if ($stmt->rowCount() > 0) {
        echo json_encode("DeleteApagarInfoREALIZADO");
    } else {
        echo json_encode("NENHUMdeleteApagarInfoREALIZADO");
    }
} catch (PDOException $e) {
    echo json_encode('Erro na sql: ' . $e->getMessage());
}
