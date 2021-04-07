<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('text') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}
$groups = array();
if ($text != ""){
    $groups = $mysql->searchGroups($text);
}
echo json_encode($groups);