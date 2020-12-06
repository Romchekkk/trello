<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('timestamp', 'desk_id') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}
$tasks = $mysql->getTasks(date("Y.m.d", ceil($timestamp/1000)), $desk_id);
echo json_encode($tasks);