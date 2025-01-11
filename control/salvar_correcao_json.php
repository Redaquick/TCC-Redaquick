<?php
include_once "conexao_pdo.php";
session_start();

// Recebendo o corpo da requisição como JSON
header('Content-Type: application/json');
$input = file_get_contents('php://input');
$canvasJSON = $input;

$sql = "INSERT INTO redacao (id_aluno, curso, trimestre, ano, json, id_tarefa, flag) VALUES (?, ?, ?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);

$ra = $_SESSION['NumRA'];
$curso = $_SESSION['turma'];
$trimestre = $_SESSION['trimestre'];
$ano =  $_SESSION['ano'];
$id_atividade = $_SESSION['id_atividade'];
$id_instituicao = $_SESSION["id_instituicao"];

try {
    $sqlSelect = "SELECT id_aluno FROM aluno WHERE ra = ? AND id_instituicao = ?";
    $stmtSelect = $conn->prepare($sqlSelect);
    $stmtSelect->execute([$ra, $id_instituicao]);

    $resultado = $stmtSelect->fetch(PDO::FETCH_ASSOC);

    if ($resultado != null) {
        $id_aluno = $resultado['id_aluno'];
        try {
            $stmt->execute([$id_aluno, $curso, $trimestre, $ano, $canvasJSON, $id_atividade, '0']);

            $idRedacao = $conn->lastInsertId();
            $_SESSION["idRedacao"] = $idRedacao;
        } catch (PDOException $ex) {
            echo json_encode('ERRO AO INSERIR REDACAO: ' . $ra . " " . $id_instituicao . " " . $ex->getMessage());
            exit();
        }
    }
} catch (PDOException $e) {
    echo json_encode('ERRO AO BUSCAR ALUNO: ' . $e->getMessage());
    exit();
}

echo json_encode('REDACAO INSERIDA COM SUCESSO');
