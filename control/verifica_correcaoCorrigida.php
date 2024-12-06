<?php
include_once "conexao_pdo.php";
session_start();

// Recebendo o corpo da requisição como JSON
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true);
$estado = $dados['estado'];

$ra = $_SESSION['NumRA'];
$curso = $_SESSION['turma'];
$trimestre = $_SESSION['trimestre'];
$ano =  $_SESSION['ano'];
$id_atividade = $_SESSION['id_atividade'];
$id_instituicao = $_SESSION["id_instituicao"];

$sql = "SELECT * FROM redacao WHERE id_aluno = ? AND curso = ? AND trimestre = ? AND ano = ? AND id_tarefa = ?";
$stmt = $conn->prepare($sql);

$resultadoSelect = null;

try {
    $sqlSelect = "SELECT id_aluno FROM aluno WHERE ra = ? AND id_instituicao = ?";
    $stmtSelect = $conn->prepare($sqlSelect);
    $stmtSelect->execute([$ra, $id_instituicao]);

    $resultado = $stmtSelect->fetch(PDO::FETCH_ASSOC);

    if ($resultado != null) {
        $id_aluno = $resultado['id_aluno'];
        try {
            $stmt->execute([$id_aluno, $curso, $trimestre, $ano, $id_atividade]);
            $resultadoSelect = $stmt->fetchAll(PDO::FETCH_ASSOC); 
            
        } catch (PDOException $ex) {
            echo json_encode('ERRO AO CONSULTAR REDACAO: ' . $ra . " " . $id_instituicao . " " . $ex->getMessage());
            exit();
        }
    }
} catch (PDOException $e) {
    echo json_encode('ERRO AO CONSULTAR ALUNO: ' . $e->getMessage());
    exit();
}

$response = [
    'resultadoSelect' => $resultadoSelect
];

echo json_encode($response);

