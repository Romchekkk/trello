<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('user_id', 'desk_id') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}
$desks = array();
if ($user_id != "" && $desk_id != ""){
    $desks = $mysql->addDeskToHistory($user_id, $desk_id);
}