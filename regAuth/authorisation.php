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
$user = $mysql->getParticularUser('login', $login);
if (password_verify($password, $user['password']) === false){
    $_RESULT['errorUserAssertion'] = true;
    echo json_encode($_RESULT);
    die();
}
else{
    $newUser = array(
        'username' => $login
    );
    $_SESSION['user'] = $newUser;
    $_RESULT['noErrors'] = true;
    $_RESULT['username'] = $login;
}

echo json_encode($_RESULT);