<?php

session_start();

require_once('../database/database.php');

$_RESULT = array();

foreach(array('login', 'password', 'passwordRepeat') as $param){
    $$param = isset($_POST[$param])
        ? $_POST[$param]
        : "";
}

$_RESULT['errorLogin'] = false;
$_RESULT['errorLoginLength'] = false;
$_RESULT['errorPassword'] = false;
$_RESULT['errorPasswordRepeat'] = false;
$_RESULT['errorPasswordAssertion'] = false;
$_RESULT['errorUserExisting'] = false;
$_RESULT['noErrors'] = false;

// Проверка логина и пароля на корректность
if ($login == ""){
    $_RESULT['errorLogin'] = true;
}
if ($password == ""){
    $_RESULT['errorPassword'] = true;
}
if ($passwordRepeat == ""){
    $_RESULT['errorPasswordRepeat'] = true;
}
if (mb_strlen($login) > 20){
    $_RESULT['errorLoginLength'] = true;
}
if ($password != $passwordRepeat){
    $_RESULT['errorPasswordAssertion'] = true;
}
if ($_RESULT['errorLogin'] ||
    $_RESULT['errorPassword'] ||
    $_RESULT['errorPasswordRepeat'] ||
    $_RESULT['errorLoginLength'] ||
    $_RESULT['errorPasswordAssertion']){
    echo json_encode($_RESULT);
    die();
}

$mysql = new dataBase();
$isUserExist = $mysql->isUserExist($login);
if ($isUserExist === 1){
    $_RESULT['errorUserExisting'] = true;
    echo json_encode($_RESULT);
    die();
}
else if ($isUserExist === 2){
    $_RESULT['noErrors'] = true;
    echo json_encode($_RESULT);
    die();
}
else if ($isUserExist === 0){
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $user_id = $mysql->addUser($login, $passwordHash);
    if ($user_id){
        $_SESSION['user_id'] = $user_id;
        $_RESULT['noErrors'] = true;
        $_RESULT['userId'] = $user_id;
        $_RESULT['login'] = $login;
    }
    else{
        $_RESULT['noErrors'] = true;
    }
}
echo json_encode($_RESULT);