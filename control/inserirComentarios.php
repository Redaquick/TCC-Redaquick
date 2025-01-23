<?php
include_once "conexao_pdo.php";
session_start();

// Recebendo o corpo da requisição como JSON
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true); // Decodifica o JSON recebido

$comentarioGeral = $dados['comentarioGeral'];
$comentarioPadrao = $dados['comentarioPadrao'];
$corText = $dados['corText'];

if ($comentarioGeral !== 'SEMCOMENTARIOREDAQUICK') {
    $sql = "INSERT INTO comentario (id_redacao, comentario, comentarioPadrao, corTxt) VALUES (?, ?, ?, ?)";
} else {
    $sql = "INSERT INTO comentario (id_redacao, comentarioPadrao) VALUES (?, ?)";
}
$stmt = $conn->prepare($sql);

$id_redacao = $_SESSION["idRedacao"];

try {
    if ($comentarioGeral !== 'SEMCOMENTARIOREDAQUICK') {
        $stmt->execute([$id_redacao, $comentarioGeral, $comentarioPadrao, $corText]);
    } else {
        $stmt->execute([$id_redacao, $comentarioPadrao]);
    }
} catch (PDOException $ex) {
    echo json_encode('ERRO AO INSERIR COMENTARIOS: ' . $ex->getMessage());
    exit();
}

echo json_encode('COMENTARIOS INSERIDOS COM SUCESSO');
