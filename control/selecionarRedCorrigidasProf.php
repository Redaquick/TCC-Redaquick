<?php
include_once "conexao_pdo.php";
session_start();

header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true);
$redCorrigidas = $dados[''];

$idCorretor = $_SESSION["id_usuario"];

$sql = "SELECT id_redacao FROM correcao WHERE id_corretor = ?";
$stmt = $conn->prepare($sql);

$resultadoSelect = null;

try {
    $sqlSelect = "SELECT * FROM redacao WHERE id_redacao = ? ORDER BY curso";
    $stmtSelect = $conn->prepare($sqlSelect);
    $stmt->execute([$idCorretor]);

    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($resultado != null) {
        
        try {
            $stmtSelect->execute([]);
            $resultadoSelect = $stmtSelect->fetchAll(PDO::FETCH_ASSOC);
        } catch (PDOException $ex) {
            echo ('');
            exit();
        }
    }
} catch (PDOException $e) {
    echo ('');
    exit();
}
