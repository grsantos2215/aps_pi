<?php

$servidor = "localhost";
$usuario = "root";
$senha = "root";
$banco = "apspi";/**/

$link = mysqli_connect($servidor, $usuario, $senha, $banco);
mysqli_set_charset($link, 'utf8');
// Check connection
if ($link === false) {
    die("ERROR: Could not connect. " . mysqli_connect_error());
}
