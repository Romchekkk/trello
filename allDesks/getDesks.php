<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('id', 'type') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}
$desks = array();
if ($id != "" && $type != ""){
    $desks = $mysql->getDesks($id, $type);
}
echo json_encode($desks);