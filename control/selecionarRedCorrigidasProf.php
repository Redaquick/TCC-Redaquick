<?php
include_once "conexao_pdo.php";
session_start();

header('Content-Type: application/json');
$input = file_get_contents('php://input');
$dados = json_decode($input, true);

$idCorretor = $_SESSION["id_usuario"];

$sql = "SELECT r.id_redacao, r.id_aluno, r.flag, a.nome AS nome_aluno, r.curso, r.trimestre, r.ano, r.id_tarefa, t.nome AS nome_tarefa
        FROM correcao c
        JOIN redacao r ON c.id_redacao  = r.id_redacao
        JOIN aluno a ON r.id_aluno = a.id_aluno
        JOIN tarefa t ON r.id_tarefa = t.id_tarefa
        WHERE c.id_corretor = ? ORDER BY r.ano DESC, r.trimestre DESC, r.curso, nome_aluno";

$stmt = $conn->prepare($sql);

try {
    $stmt->execute([$idCorretor]);
    $resultado = $stmt->fetchAll(PDO::FETCH_ASSOC);

    for ($i = 0; $i < count($resultado); $i++) {
        $nomes[$i] = $resultado[$i]['nome_aluno'];
        $cursos[$i] = $resultado[$i]['curso'];
        $trimestres[$i] = $resultado[$i]['trimestre'];
        $anos[$i] = $resultado[$i]['ano'];
        $tarefas[$i] = $resultado[$i]['nome_tarefa'];
        $id_tarefas[$i] = $resultado[$i]['id_tarefa'];
        $id_alunos[$i] = $resultado[$i]['id_aluno'];
        $id_redacoes[$i] = $resultado[$i]['id_redacao'];
        $flags[$i] = $resultado[$i]['flag'];
    }

    for ($i=0; $i < count($flags); $i++) { 
        if($flags[$i] === 0){
            $flagsConvertidas[$i] = 'Acesso não Liberado';
        }else{
            $flagsConvertidas[$i] = 'Acesso Liberado';
        }    
    }
    
    if ($resultado) {
        $response = [
            'nomes' => $nomes,
            'cursos' => $cursos,
            'trimestres' => $trimestres,
            'anos' => $anos,
            'tarefas' => $tarefas,
            'id_tarefas' => $id_tarefas,
            'id_alunos' => $id_alunos,
            'id_redacoes' => $id_redacoes,
            'flags' => $flagsConvertidas
        ];
        echo json_encode($response);
    } else {
        echo json_encode('NENHUMA REDAÇÃO FOI ENCONTRADA!');
    }
} catch (PDOException $e) {
    echo json_encode('Erro na sql: ' . $e->getMessage());
}
