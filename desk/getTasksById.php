<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('tasksId', 'desk_id') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}
$tasks = $mysql->getTasksById($tasksId, $desk_id);
echo json_encode($tasks);