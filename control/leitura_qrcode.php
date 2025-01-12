<?php
require '../vendor/autoload.php';

use Zxing\QrReader;

include_once "conexao.php"; // Certifique-se de que este arquivo exista e funcione
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

// Obtém as dimensões da imagem original
$larguraOriginal = imagesx($imagem);
$alturaOriginal = imagesy($imagem);

// *** Valores de corte: ajuste-os conforme necessário ***
$x = $larguraOriginal/1.5;
$y = 0;
$larguraCorte = $larguraOriginal - $x;
$alturaCorte = $alturaOriginal/4;

// Verificação importante: valores de corte dentro dos limites da imagem
if ($x + $larguraCorte > $larguraOriginal || $y + $alturaCorte > $alturaOriginal || $x < 0 || $y < 0 || $larguraCorte <= 0 || $alturaCorte <= 0) {
    imagedestroy($imagem); // Libera a memória
    echo json_encode(['error' => 'Valores de corte inválidos']);
    exit();
}

// Cria a imagem cortada
$imagemCortada = imagecreatetruecolor($larguraCorte, $alturaCorte);
imagecopy($imagemCortada, $imagem, 0, 0, $x, $y, $larguraCorte, $alturaCorte);

imagefilter($imagemCortada, IMG_FILTER_CONTRAST, -50);
imagefilter($imagemCortada, IMG_FILTER_BRIGHTNESS, 10);

// Processa a imagem cortada para leitura do QR Code
ob_start();
imagepng($imagemCortada);
$imagemPng = ob_get_clean();

imagedestroy($imagem);       // Libera a memória da imagem original
imagedestroy($imagemCortada); // Libera a memória da imagem cortada

// Instancia o leitor de QR Code
$qrcode = new QrReader($imagemPng, QrReader::SOURCE_TYPE_BLOB);

// Obtém o texto do QR Code
$textoQRCode = $qrcode->text();

if (!$textoQRCode) {
    echo json_encode(['error' => 'QR Code não encontrado ou inválido']);
    exit();
}

$vetortextoQRCode = explode("|", $textoQRCode);

// Verifique se o array tem o número correto de elementos
if (count($vetortextoQRCode) != 6) {
    echo json_encode(['error' => 'Formato do QR Code inválido']);
    exit();
}

$_SESSION['NumRA'] = $vetortextoQRCode[0];
$_SESSION['turma'] = $vetortextoQRCode[1];
$_SESSION['trimestre'] = $vetortextoQRCode[2];
$_SESSION['ano'] = $vetortextoQRCode[3];
$_SESSION['id_atividade'] = $vetortextoQRCode[4];
$_SESSION['id_instituicao'] = $vetortextoQRCode[5];

$response = [
    'NumRA' => $_SESSION['NumRA'],
    'turma' => $_SESSION['turma'],
    'trimestre' => $_SESSION['trimestre'],
    'ano' => $_SESSION['ano'],
    'id_atividade' => $_SESSION['id_atividade'],
    'id_instituicao' => $_SESSION['id_instituicao']
];

echo json_encode($response);
?>