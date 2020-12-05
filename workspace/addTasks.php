<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('timestampFirst', 'timestampSecond', 'task', 'importance', 'category', 'desk_id') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}

$mysql->addTask($task, $importance, $category, date("Y.m.d", ceil($timestampFirst/1000)), 1, $desk_id);