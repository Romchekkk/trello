<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('desk_id') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}

$user_id = isset($_SESSION['user_id'])?$_SESSION['user_id']:"";

$_RESULT["dontHaveAccess"] = false;
if ($user_id != "" && $desk_id != ""){
    if (haveAccess($user_id, $desk_id, $mysql)){
        $mysql->addDeskToHistory($user_id, $desk_id);
        $_SESSION["open_desk_id"] = $desk_id;
    }
    else{
        $_RESULT["dontHaveAccess"] = true;
    }
}

echo json_encode($_RESULT);

function haveAccess($user_id, $desk_id, $mysql){
    if ($mysql->isCreator($user_id, $desk_id)){
        return true;
    }
    else{
        $accessRights = $mysql->getAccessRights($desk_id);
        if ($accessRights !== false){
            if ($accessRights == 1){
                if ($mysql->isInUserDesksAccess($desk_id, $user_id)){
                    return true;
                }
            }
            else if ($accessRights == 2){
                if ($mysql->isInGroupAccess($desk_id, $user_id)){
                    return true;
                }
                return false;
            }
            else if ($accessRights == 3){
                return true;
            }
        }
    }
    return false;
}