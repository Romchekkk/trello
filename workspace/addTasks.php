<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('timestampFirst', 'timestampSecond', 'task', 'importance', 'category', 'complete_time', 'desk_id') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}
$today = date('Y-m-d');
$addDayFirst = date('Y-m-d', ceil($timestampFirst/1000));
if ($timestampSecond == "") {
    if ($today <= $addDayFirst) {
        $mysql->addTask($task, $importance, $category, date("Y.m.d", ceil($timestampFirst/1000)), $complete_time, 1, $desk_id);
    }
}
else{
    $addDaySecond = date('Y-m-d', ceil($timestampSecond/1000));
    $current = $addDayFirst;
    while($current <= $addDaySecond){
        if ($today <= $current) {
            $mysql->addTask($task, $importance, $category, date("Y.m.d", strtotime($current)), $complete_time, 1, $desk_id);
        }
        $current = date('Y-m-d', strtotime($current)+60*60*24);
    }
}