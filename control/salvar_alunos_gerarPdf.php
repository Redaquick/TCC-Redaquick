<?php
include_once "conexao_pdo.php";
session_start();

header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true);

$nome = $dados['nome'];
$RA = $dados['RA'];
$id_instituicao = $_SESSION['id_instituicao'];

$sqlSelect = "SELECT * FROM aluno WHERE RA = ? AND id_instituicao = ?";
$stmtSelect = $conn->prepare($sqlSelect);

$sql = "INSERT INTO aluno (ra, nome, id_instituicao) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);

try {
    for ($i = 0; $i < count($RA); $i++) {
        $stmtSelect->execute([$RA[$i], $id_instituicao]);
        $resultado = $stmtSelect->fetchAll(PDO::FETCH_ASSOC);

        if ($resultado == null) {
            try {
                $stmt->execute([$RA[$i], $nome[$i], $id_instituicao]);
            } catch (PDOException $e) {
                echo json_encode("ERRO SQL-PRIMEIRO: " . $e->getMessage());
                exit();
            }
        }
    };
    echo json_encode("INSERCAO CONCLUIDA");
} catch (PDOException $e) {
    echo json_encode("ERRO SQL-SEGUNDO: " . $e->getMessage());
};
