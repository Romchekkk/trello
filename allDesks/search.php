<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('text') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}
$desks = array();
if ($text != ""){
    $desks = $mysql->searchDesks($text);
}
echo json_encode($desks);