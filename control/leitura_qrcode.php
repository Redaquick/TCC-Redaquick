<?php
require '../vendor/autoload.php';

use Zxing\QrReader;

// ... (conexão e sessão)

$dados = file_get_contents('php://input');
$base64 = explode(',', $dados)[1];

$imagemBinaria = base64_decode($base64);
if (!$imagemBinaria) {
    // ...
}

$imagem = imagecreatefromstring($imagemBinaria);
if (!$imagem) {
    // ...
}

// 1. Calcular dimensões originais
$larguraOriginal = imagesx($imagem);
$alturaOriginal = imagesy($imagem);

// 2. Definir um tamanho máximo (ajuste conforme necessário)
$larguraMaxima = 1200; // Aumentei o tamanho máximo
$alturaMaxima = 1200;

// 3. Redimensionar mantendo a proporção (com melhor qualidade)
if ($larguraOriginal > $larguraMaxima || $alturaOriginal > $alturaMaxima) {
    $proporcao = $larguraOriginal / $alturaOriginal;
    if ($larguraOriginal > $larguraMaxima) {
        $novaLargura = $larguraMaxima;
        $novaAltura = $novaLargura / $proporcao;
    } else {
        $novaAltura = $alturaMaxima;
        $novaLargura = $novaAltura * $proporcao;
    }

    $imagemRedimensionada = imagecreatetruecolor($novaLargura, $novaAltura);
    // Melhoria importante: usar imageantialias para melhor qualidade na redução
    imageantialias($imagemRedimensionada, true); 
    imagecopyresampled($imagemRedimensionada, $imagem, 0, 0, 0, 0, $novaLargura, $novaAltura, $larguraOriginal, $alturaOriginal);
    imagedestroy($imagem);
    $imagem = $imagemRedimensionada;
}

// 4. Converter para escala de cinza
imagefilter($imagem, IMG_FILTER_GRAYSCALE);

// 5. Ajuste de contraste (com valor mais suave)
imagefilter($imagem, IMG_FILTER_CONTRAST, -40); // Valor ligeiramente menor

// 6. Possível melhoria: aplicar um filtro de nitidez (opcional, teste)
//imagefilter($imagem, IMG_FILTER_SMOOTH, -8); // Testar valores negativos pequenos

ob_start();
imagepng($imagem);
$imagemPng = ob_get_clean();

imagedestroy($imagem);

$qrcode = new QrReader($imagemPng, QrReader::SOURCE_TYPE_BLOB);
$textoQRCode = $qrcode->text();

if (!$textoQRCode) {
    // Tentar uma segunda leitura com um contraste diferente, caso a primeira falhe
    $imagem = imagecreatefromstring($imagemPng);
    imagefilter($imagem, IMG_FILTER_CONTRAST, -60); // Contraste mais forte na segunda tentativa
    ob_start();
    imagepng($imagem);
    $imagemPng2 = ob_get_clean();
    imagedestroy($imagem);
    $qrcode2 = new QrReader($imagemPng2, QrReader::SOURCE_TYPE_BLOB);
    $textoQRCode = $qrcode2->text();
    if (!$textoQRCode){ //se ainda estiver null
        echo json_encode(['error' => 'QR Code não encontrado ou inválido']);
        exit();
    }
}

// Divide o texto do QR Code em partes
$vetortextoQRCode = explode("|", $textoQRCode);

// Verifica se todos os campos necessários estão presentes
if (count($vetortextoQRCode) < 6) {
    echo json_encode(['error' => 'Formato inválido de QR Code']);
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
