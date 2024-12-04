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

$sql = "INSERT INTO comentario (id_redacao, comentario, comentarioPadrao, corTxt) VALUES (?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

$id_redacao = $_SESSION["idRedacao"];

try {
    $stmt->execute([$id_redacao, $comentarioGeral, $comentarioPadrao, $corText]);
} catch (PDOException $ex) {
    echo json_encode('ERRO AO INSERIR COMENTARIOS: ' . $ex->getMessage());
    exit();
}

echo json_encode('COMENTARIOS INSERIDOS COM SUCESSO');