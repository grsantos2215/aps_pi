<?php

require_once("../config.php");

if (!empty($_POST) and (empty($_POST['usuario']) or empty($_POST['senha']))) {
    $response_array['status'] = "erro";
    $response_array['dados'] = $_POST;
}

$usuario = mysqli_real_escape_string($link, $_POST['usuario']);
$senha = mysqli_real_escape_string($link, $_POST['senha']);

$sql = "SELECT id AS `id_usuario`, nome AS `nome_usuario`, usuario AS `user_usuario`, fk_usuario_nivel AS `user_nivel` FROM  `tb_usuarios` WHERE tb_usuarios.usuario = '" . $usuario . "' AND tb_usuarios.senha = '" . sha1($senha) . "' AND tb_usuarios.status = '1'";

$result = mysqli_query($link, $sql);

if (mysqli_num_rows($result) != 1) {
    // Mensagem de erro quando os dados são inválidos e/ou o usuário não foi encontrado
    $response_array['status'] = "erro";
    $response_array['sql'] = $sql;
} else {
    // Salva os dados encontados na variável $result
    $row = mysqli_fetch_assoc($result);

    // Se a sessão não existir, inicia uma
    if (!isset($_SESSION)) session_start();

    // Salva os dados encontrados na sessão
    $_SESSION['UsuarioID']    = $row['id_usuario'];
    $_SESSION['UsuarioNome']  = $row['nome_usuario'];
    $_SESSION['UsuarioUser']  = $row['user_usuario'];
    $_SESSION['UsuarioNivel'] = $row['user_nivel'];


    if ($row['user_nivel'] == 1) {
        // Redireciona o visitante
        $response_array['return']["url"] = "index.php";
        $_SESSION['UsuarioCargo'] = "Ministro";
    }
    // } elseif ($row['nivel_usuario'] == 2) {
    //     // Redireciona o visitante
    //     $response_array['return']["url"] = "index-unidade.php";
    //     $_SESSION['UsuarioCargo'] = "Unidade";
    // } elseif ($row['nivel_usuario'] == 3) {
    //     // Redireciona o visitante
    //     $response_array['return']["url"] = "index-callcenter.php";
    //     $_SESSION['UsuarioCargo'] = "CallCenter";
    // }


    $response_array['return']["status"] = "success";
}/**/

header('Content-type: application/json');
echo json_encode($response_array);
