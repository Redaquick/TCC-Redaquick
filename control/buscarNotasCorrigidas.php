<?php
include_once "conexao_pdo.php";
session_start();

// Recebendo o corpo da requisição como JSON
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true); // Decodifica o JSON recebido

$nomes = $dados['nomes'];
$ids = $dados['ids'];

$sqlSelect = "SELECT ra FROM aluno WHERE nome = ? AND id_instituicao = ?";
$stmtSelect = $conn->prepare($sqlSelect);

$sql = "SELECT nota_enem, nota_decimal FROM correcao c WHERE id_redacao = ?";
$stmt = $conn->prepare($sql);

try {
    for ($i = 0; $i < count($nomes); $i++) {
        $stmtSelect->execute([$nomes[$i], $_SESSION['id_instituicao']]);
        $RAs[$i] = $stmtSelect->fetch(PDO::FETCH_ASSOC);
    }
} catch (PDOException $ex) {
    echo json_encode('ERRO: ' . $ex->getMessage());
    exit();
};

try {
    for ($i = 0; $i < count($ids); $i++) {
        $stmt->execute([$ids[$i]]);
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        $notasEnem[$i] = $result[0]['nota_enem'];
        $notasDecimal[$i] = $result[1]['nota_decimal'];
    }
} catch (PDOException $ex) {
    echo json_encode('ERRO: ' . $ex->getMessage());
    exit();
};

// Criando a resposta para retornar ao cliente
$response = [
    'RAs' => $RAs,
    'notasEnem' => $notasEnem,
    'notasDecimal' => $notasDecimal
];

// Enviando a resposta como JSON
echo json_encode($response);
