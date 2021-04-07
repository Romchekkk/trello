<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('deskId', 'text') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}
$users = array();
if ($deskId != ""){
    $users = $mysql->searchUsersAccessed($deskId, $text);
}
echo json_encode($users);