<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('id', 'deskName') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}

if ($id != "" && $deskName != ""){
    $desk_id = $mysql->createDesk($id, $deskName);
    if ($desk_id) {
        echo json_encode($desk_id);
    }
}