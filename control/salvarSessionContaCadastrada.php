<?php
session_start();
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true);

$email = $dados['emailContaCadastrada'];
$ra = $dados['raContaCadastrada'];
$nome = $dados['nomeContaCadastrada'];

$_SESSION['emailContaCadastrada'] = $email; 
$_SESSION['raContaCadastrada'] = $ra;
$_SESSION['nomeContaCadastrada'] = $nome;

echo json_encode("Dados Conta Salvos com Sucesso");
?>