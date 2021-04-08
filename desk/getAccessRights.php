<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

$_RESULT = array();
foreach (array('desk_id') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}

$accessRights = $mysql->getAccessRights($desk_id);
$_RESULT["currentType"] = $accessRights;

echo json_encode($_RESULT);