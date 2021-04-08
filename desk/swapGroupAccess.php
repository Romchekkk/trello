<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('deskId', 'groupId') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}
if ($deskId != "" && $groupId != ""){
    $mysql->swapGroupAccess($deskId, $groupId);
}