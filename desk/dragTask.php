<?php

session_start();
require_once("../database/database.php");

$mysql = new dataBase();

foreach (array('timestamp', 'id', 'destination', 'target') as $parameterName) {
    $$parameterName = isset($_POST[$parameterName])
    ?$_POST[$parameterName]
    :"";
}
$today = date('Y-m-d');
$addDayFirst = date('Y-m-d', ceil($timestamp/1000));
if ($today <= $addDayFirst) {
    $mysql->dragTask(date("Y.m.d", ceil($timestamp/1000)), $id, $destination, $target);
}