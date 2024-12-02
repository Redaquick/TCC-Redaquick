<?php
// Configuração de dados para a conexão
$host = '127.0.0.1';
$dbname = 'redaquick_db';
$username = 'redaquick';
$password = '~N(2,!H&ap';

try {
    // Estabelecendo a conexão com o banco de dados usando PDO
    $conn = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);

    // Definindo o modo de erro para exceções
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    // Captura qualquer erro na conexão e exibe a mensagem
    echo "Erro na conexão: " . $e->getMessage();
}
?>