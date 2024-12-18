<?php
session_start();

header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true); // Decodifica o JSON recebido
$id_redacaoAtual = $dados['id_redacaoAtual'];

$_SESSION['id_redacaoAtual'] = $id_redacaoAtual;

$response = [
    'resposta' => 'idSalvoComSucesso'
];

echo json_encode($response);
?>