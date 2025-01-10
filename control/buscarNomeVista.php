<?php
include_once "conexao_pdo.php";
session_start();

header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true);

$ra = $_SESSION['NumRA'];
$id_instituicao = $_SESSION["id_instituicao"];

$sql = "SELECT nome FROM aluno WHERE ra = ? AND id_instituicao = ?";

$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$ra, $id_instituicao]);
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($resultado) {
        $response = [
            'nome' => $resultado['nome']
        ];
        echo json_encode($response);
    } else {
        echo json_encode('NÃO FOI POSSÍVEL LOCALIZAR O NOME!');
    }
} catch (PDOException $e) {
    echo json_encode('Erro na sql: ' . $e->getMessage());
}
