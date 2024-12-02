<?php
$host = '127.0.0.1';
$dbname = 'redaquick_db';
$username = 'redaquick';
$password = '~N(2,!H&ap';

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Falha na conexão: " . $conn->connect_error); //retorna o erro
}
?>