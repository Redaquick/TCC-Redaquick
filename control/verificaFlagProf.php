<?php
include_once "conexao_pdo.php";
session_start();

header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true);

$idRedacao = $dados['idRedacao'];

$sql = "SELECT flag FROM redacao WHERE id_redacao = ?";

$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$idRedacao]);
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($resultado) {
        $response = [
            'flag' => $resultado['flag']
        ];
        echo json_encode($response);
    } else {
        echo json_encode('RESULTADO VAZIO!!!');
    }
} catch (PDOException $e) {
    echo json_encode('Erro na sql ao buscar flag: ' . $e->getMessage());
}
