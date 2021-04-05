<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('desk_id', 'newType', 'newGroup') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}

$_RESULT = array();

if ($desk_id=="" || $newType==""){
    $_RESULT['error'] = true;
}
if ($newType == 2 && $newGroup==""){
    $_RESULT['error'] = true;
}

$mysql->changeAccessRights($desk_id, $newType, $newGroup);