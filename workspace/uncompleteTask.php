<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('id') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}
$mysql->uncompleteTask($id);