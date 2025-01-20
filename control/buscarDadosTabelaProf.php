<?php
include_once "conexao_pdo.php";
session_start();

// Recebendo o corpo da requisição como JSON
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true); // Decodifica o JSON recebido
$id_criador = $_SESSION["id_usuario"];

$sql = "SELECT nome, ra, email FROM usuario WHERE id_criador = ?";
$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$id_criador]);
    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $ex) {
    echo json_encode('ERRO AO BUSCAR DADOS TABELA: ' . $ex->getMessage());
    exit();
}

if ($resultado) {
    $nomes = [];
    $ras = [];
    $emails = [];

    for ($i = 0; $i < count($resultado); $i++) {
        $nomes[$i] = $resultado[$i]['nome'];
        $ras[$i] = $resultado[$i]['ra'];
        $emails[$i] = $resultado[$i]['email'];
    }
}

$response = [
    'nomes' => $nomes,
    'ras' => $ras,
    'emails' => $emails
];

echo json_encode($response);