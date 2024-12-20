<?php
// Inclui a conexão com o banco de dados e inicia a sessão
include_once "conexao_pdo.php";
session_start();

// Define o tipo de resposta como JSON
header('Content-Type: application/json');

// Recebe o corpo da requisição em formato JSON
$input = file_get_contents('php://input');
$dados = json_decode($input, true); // Decodifica o JSON recebido

// Extrai os dados dos nomes e IDs enviados
$nomes = $dados['nomes'];
$ids = $dados['ids'];

// Prepara as consultas SQL
$sqlSelect = "SELECT ra FROM aluno WHERE nome = ? AND id_instituicao = ?"; // Para buscar o RA
$stmtSelect = $conn->prepare($sqlSelect);

$sql = "SELECT nota_enem, nota_decimal FROM correcao WHERE id_redacao = ?"; // Para buscar as notas
$stmt = $conn->prepare($sql);

$RAs = [];
$notasEnem = [];
$notasDecimal = [];

try {
    // Preenche o array de RAs baseado nos nomes
    for ($i = 0; $i < count($nomes); $i++) {
        $stmtSelect->execute([$nomes[$i], $_SESSION['id_instituicao']]);
        $ra = $stmtSelect->fetch(PDO::FETCH_ASSOC);
        $RAs[$i] = $ra ? $ra['ra'] : ''; // Se não encontrar o RA, coloca null
    }
} catch (PDOException $ex) {
    // Caso ocorra algum erro na consulta do RA
    echo json_encode(['erro' => 'ERRO: ' . $ex->getMessage()]);
    exit();
}

try {
    // Preenche as notas com base nos IDs
    for ($i = 0; $i < count($ids); $i++) {
        $stmt->execute([$ids[$i]]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC); // Obtém uma linha com as notas

        // Se encontrou as notas, armazena. Caso contrário, coloca null
        $notasEnem[$i] = $result ? $result['nota_enem'] : '';
        $notasDecimal[$i] = $result ? $result['nota_decimal'] : '';
    }
} catch (PDOException $ex) {
    // Caso ocorra algum erro na consulta das notas
    echo json_encode(['erro' => 'ERRO: ' . $ex->getMessage()]);
    exit();
}

// Prepara a resposta com os dados de RAs e notas
$response = [
    'RAs' => $RAs,
    'notasEnem' => $notasEnem,
    'notasDecimal' => $notasDecimal
];

// Retorna a resposta como JSON
echo json_encode($response);
