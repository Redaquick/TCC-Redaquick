<?php
require '../vendor/autoload.php';

use Zxing\QrReader;

include_once "conexao.php";
session_start();

header('Content-Type: application/json');

$dados = file_get_contents('php://input');
$base64 = explode(',', $dados)[1];

$imagemBinaria = base64_decode($base64);
if (!$imagemBinaria) {
    echo json_encode(['error' => 'Falha ao decodificar os dados base64']);
    exit();
}

$imagem = imagecreatefromstring($imagemBinaria);
if (!$imagem) {
    echo json_encode(['error' => 'Falha ao criar a imagem a partir dos dados']);
    exit();
}

ob_start(); // Inicia o buffer de saída

imagepng($imagem); // Salva a imagem no buffer de saída como PNG
$imagemPng = ob_get_clean(); // Captura os dados PNG e limpa o buffer
imagedestroy($imagem); // Libera a memória da imagem

// Instancia o leitor de QR Code
$qrcode = new QrReader($imagemPng, QrReader::SOURCE_TYPE_BLOB);

// Obtém o texto do QR Code
$textoQRCode = $qrcode->text();
if (!$textoQRCode) {
    echo json_encode(['error' => 'QR Code não encontrado ou inválido']);
    exit();
}

$vetortextoQRCode = explode("|", $textoQRCode);

$_SESSION ['NumRA'] = $vetortextoQRCode[0];
$_SESSION ['turma'] = $vetortextoQRCode[1];
$_SESSION ['trimestre'] = $vetortextoQRCode[2]; 
$_SESSION ['ano'] = $vetortextoQRCode[3];
$_SESSION ['id_atividade'] = $vetortextoQRCode[4];
$_SESSION ['id_instituicao'] = $vetortextoQRCode[5];

$response = [
    'NumRA' => $_SESSION ['NumRA'],
    'turma' => $_SESSION ['turma'],
    'trimestre' => $_SESSION ['trimestre'],
    'ano' => $_SESSION ['ano'],
    'id_atividade' => $_SESSION ['id_atividade'],
    'id_instituicao' => $_SESSION ['id_instituicao']
];

// Enviando a resposta como JSON
echo json_encode($response);
