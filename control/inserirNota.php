<?php
include_once "conexao.php";
session_start();

// Recebendo o corpo da requisição como JSON
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true); // Decodifica o JSON recebido
$notaRedacao = $dados['notaTotalEnem'];

//$sql = "INSERT INTO tarefa (nome) VALUES ('$nomeAtividade')";

try {
    
} catch (mysqli_sql_exception) {
    
};

// Criando a resposta para retornar ao cliente
$response = [
    'id_atividade' => $idTarefa,
    'id_instituicao' => $_SESSION["id_instituicao"]
];

// Enviando a resposta como JSON
echo json_encode($response);
?>