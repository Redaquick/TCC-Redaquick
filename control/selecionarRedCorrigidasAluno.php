<?php
include_once "conexao_pdo.php";
session_start();

header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true);

$idUsuario = $_SESSION["id_usuario"];

$sql = "SELECT r.id_redacao, r.curso, r.trimestre, r.ano, t.nome AS nome_tarefa
        FROM usuario u
        JOIN aluno a ON u.ra = a.ra AND u.id_instituicao = a.id_instituicao
        JOIN redacao r ON a.id_aluno  = r.id_aluno        
        JOIN tarefa t ON r.id_tarefa = t.id_tarefa
        WHERE u.id_usuario = ? ORDER BY r.ano DESC, r.trimestre DESC, r.curso DESC, nome_tarefa";

$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$idUsuario]);
    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

    for ($i = 0; $i < count($resultado); $i++) {        
        $cursos[$i] = $resultado[$i]['curso'];
        $trimestres[$i] = $resultado[$i]['trimestre'];
        $anos[$i] = $resultado[$i]['ano'];
        $tarefas[$i] = $resultado[$i]['nome_tarefa'];     
        $id_redacoes[$i] = $resultado[$i]['id_redacao'];
    }

    if ($resultado) {
        $response = [
            'cursos' => $cursos,
            'trimestres' => $trimestres,
            'anos' => $anos,
            'tarefas' => $tarefas,
            'id_redacoes' => $id_redacoes
        ];
        echo json_encode($response);
    } else {
        echo json_encode('NENHUMA REDAÇÃO FOI ENCONTRADA!');
    }
} catch (PDOException $e) {
    echo json_encode('Erro na sql: ' . $e->getMessage());
}
