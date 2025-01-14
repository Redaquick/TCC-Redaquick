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

$flagSession = $dados['flagSession'];

$sql = "UPDATE comentario SET comentario = ?, comentarioPadrao = ?, corTxt = ? WHERE id_redacao = ?";
$stmt = $conn->prepare($sql);

if ($flagSession === 'true') {
    $idRedacao = $_SESSION["VerificaCorrecaoIDredacao"];
} else if ($flagSession === 'false') {
    $idRedacao = $_SESSION["id_redacaoAtual"];
}

try {
    $stmt->execute([$comentarioGeral, $comentarioPadrao, $corText, $idRedacao]);
    if ($stmt->rowCount() > 0) {
        echo json_encode('COMENTARIOS ATUALIZADOS COM SUCESSO');
    } else {
        echo json_encode("NENHUMupdateREALIZADOComentarios");
    }
} catch (PDOException $ex) {
    echo json_encode('ERRO AO ATUALIZAR COMENTARIOS: ' . $ex->getMessage());
    exit();
}
