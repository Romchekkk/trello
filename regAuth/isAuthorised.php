<?php

session_start();

require_once('../database/database.php');

$_RESULT = array();

$_RESULT['set'] = false;
if (isset($_SESSION['user_id'])){
    $mysql = new dataBase();
    $login = $mysql->getParticularUserById($_SESSION["user_id"]);
    if ($login) {
        $_RESULT['set'] = true;
        $_RESULT['login'] = $login;
        $_RESULT["userId"] = $_SESSION["user_id"];
    }
}
echo json_encode($_RESULT);