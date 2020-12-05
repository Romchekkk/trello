<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('timestamp', 'task', 'importance', 'category', 'desk_id') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}

$mysql->addTask($task, $importance, $category, date("Y.m.d", ceil($timestamp/1000)), 1, $desk_id);