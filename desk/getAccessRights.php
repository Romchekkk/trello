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

$accessRights = $mysql->getAccessRights($desk_id, true);
$_RESULT["currentType"] = $accessRights["access_rights"];

$groupName = $mysql->getGroupName($accessRights["group_access"])["name"];

$_RESULT["groupName"] = $groupName;

echo json_encode($_RESULT);