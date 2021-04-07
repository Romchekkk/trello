<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('deskId', 'userId') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}
if ($deskId != "" && $userId != $_SESSION['user_id']){
    $mysql->swapUserDedicatedAccess($deskId, $userId);
}