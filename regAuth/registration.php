<?php

session_start();

require_once('../database/database.php');

$_RESULT = array();

foreach(array('nickname', 'login', 'password', 'passwordRepeat') as $param){
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
if ($nickname == ""){
    $_RESULT['errorNickname'] = true;
}
if ($login == ""){
    $_RESULT['errorLogin'] = true;
}
if ($password == ""){
    $_RESULT['errorPassword'] = true;
}
if ($passwordRepeat == ""){
    $_RESULT['errorPasswordRepeat'] = true;
}
if (strlen($nickname) > 65){
    $_RESULT['errorNicknameLength'] = true;
}
if (strlen($login) > 65){
    $_RESULT['errorLoginLength'] = true;
}
if ($password != $passwordRepeat){
    $_RESULT['errorPasswordAssertion'] = true;
}
if ($_RESULT['errorLogin'] ||
    $_RESULT['errorPassword'] ||
    $_RESULT['errorPasswordRepeat'] ||
    $_RESULT['errorLoginLength'] ||
    $_RESULT['errorNicknameLength'] ||
    $_RESULT['errorPasswordAssertion'] ||
    $_RESULT['errorNickname']){
    echo json_encode($_RESULT);
    die();
}

$mysql = new dataBase();
$user = $mysql->getParticularUser('login', $login);
if ($mysql->getParticularUser('login', $login) !== false){
    $_RESULT['errorUserExisting'] = true;
    echo json_encode($_RESULT);
    die();
}
else{
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $mysql->addUser($nickname, $login, $passwordHash);
    $_SESSION['username'] = $username;
    $_RESULT['noErrors'] = true;
    $_RESULT['username'] = $username;
}
echo json_encode($_RESULT);