<?php

session_start();

require_once('../database/database.php');

$_RESULT = array();

foreach(array('login', 'password') as $param){
    $$param = isset($_POST[$param])
        ? $_POST[$param]
        : "";
}

$_RESULT['errorLogin'] = false;
$_RESULT['errorPassword'] = false;
$_RESULT['errorUserAssertion'] = false;
$_RESULT['noErrors'] = false;

// Проверка логина и пароля на корректность
if ($login == ""){
    $_RESULT['errorLogin'] = true;
}
if ($password == ""){
    $_RESULT['errorPassword'] = true;
}
if ($_RESULT['errorLogin'] || $_RESULT['errorPassword']){
    echo json_encode($_RESULT);
    die();
}

$mysql = new dataBase();
$user = $mysql->getParticularUserByLogin($login);
if ($user) {
    if (password_verify($password, $user['password']) === false) {
        $_RESULT['errorUserAssertion'] = true;
        echo json_encode($_RESULT);
        die();
    } 
    else {
        $_SESSION['user_id'] = $user["id"];
        $_RESULT['noErrors'] = true;
        $_RESULT['login'] = $login;
        $_RESULT["userId"] = $user["id"];
    }
}

echo json_encode($_RESULT);