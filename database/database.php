<?php

class dataBase{

    private $_mysql;

    public function __construct(){
        $this->_mysql = mysqli_connect('localhost', 'root', 'root', 'trello');
    }

    public function __destruct(){
        mysqli_close($this->_mysql);
    }

    public function addTask($task, $importance, $category, $date, $time, $adder_id, $desk_id){
        foreach (["task", "importance", "category", "date", "time", "adder_id", "desk_id"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $rows = 0;
        $result = mysqli_query($this->_mysql, "SELECT count(*) FROM `tasks` WHERE complete_date='$date' AND desk_id=$desk_id");
        while($row = mysqli_fetch_array($result)){
            $rows = $row[0];
        }
        mysqli_query($this->_mysql, "INSERT INTO `tasks`(`task`, `importance`, `category`, `complete_date`, `complete_time`, `adder_id`, `desk_id`, `day_order`) VALUES ('$task', '$importance', '$category', '$date', '$time', $adder_id, $desk_id, $rows)");
    }

    public function getTasks($date, $desk_id){
        foreach (["date", "desk_id"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $tasks = array();
        $result = mysqli_query($this->_mysql, "SELECT task, importance, category, id, is_complete, day_order, complete_time FROM `tasks` WHERE complete_date='$date' AND desk_id=$desk_id ORDER BY day_order");
        while($row = mysqli_fetch_array($result)){
            $tasks[] = array(
                'task' => $row[0],
                'importance' => $row[1],
                'category' => $row[2],
                'id' => $row[3],
                'isComplete' => $row[4],
                'dayOrder' => $row[5],
                'completeTime' => $row[6]
            );
        }
        return $tasks;
    }

    public function deleteTask($id){
        foreach (["id"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        mysqli_query($this->_mysql, "DELETE FROM `tasks` WHERE id=$id");
    }

    public function completeTask($id){
        foreach (["id"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        mysqli_query($this->_mysql, "UPDATE tasks SET is_complete=1 WHERE id=$id");
    }

    public function uncompleteTask($id){
        foreach (["id"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        mysqli_query($this->_mysql, "UPDATE tasks SET is_complete=0 WHERE id=$id");
    }

    public function addUser($login, $password){
        foreach (["login", "password"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        mysqli_query($this->_mysql, "LOCK TABLES desks WRITE, tasks WRITE, users WRITE, users_desks_memory WRITE");
        $result = mysqli_query($this->_mysql, "INSERT INTO users(login, password) VALUES('$login', '$password')");
        if ($result) {
            $user_id = mysqli_insert_id($this->_mysql);
            mysqli_query($this->_mysql, "UNLOCK TABLES");
            return $user_id;
        }
        mysqli_query($this->_mysql, "UNLOCK TABLES");
        return false;
    }

    public function isUserExist($login){
        foreach (["login"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $result = mysqli_query($this->_mysql, "SELECT * FROM `users` WHERE login='$login'");
        if ($result){
            $row = mysqli_fetch_array($result);
            if ($row){
                return 1;
            }
            else{
                return 0;
            }
        }
        return 2;
    }

    public function getParticularUserById($id){
        foreach (["id"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $result = mysqli_query($this->_mysql, "SELECT * FROM `users` WHERE id='$id'");
        if ($result){
            $row = mysqli_fetch_array($result);
            if ($row){
                return $row["login"];
            }
            else{
                return false;
            }
        }
        return false;
    }

    public function getParticularUserByLogin($login){
        foreach (["login"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $result = mysqli_query($this->_mysql, "SELECT * FROM `users` WHERE login='$login'");
        if ($result){
            $row = mysqli_fetch_array($result);
            if ($row){
                return $row;
            }
            else{
                return false;
            }
        }
        return false;
    }

    public function dragTask($date, $id, $destination, $target){
        foreach (["date", "id", "destination", "target"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $result = mysqli_query($this->_mysql, "SELECT complete_date FROM `tasks` WHERE id=$id");
        $oldDate = "";
        while($row = mysqli_fetch_array($result)){
            $oldDate = $row["complete_date"];
        }
        if ($oldDate != $date) {
            mysqli_query($this->_mysql, "UPDATE tasks SET complete_date='$date' WHERE id=$id");
            $result = mysqli_query($this->_mysql, "SELECT id FROM `tasks` WHERE complete_date='$oldDate' ORDER BY day_order");
            $order = 0;
            while ($row = mysqli_fetch_array($result)) {
                $idTemp = $row["id"];
                mysqli_query($this->_mysql, "UPDATE tasks SET day_order=$order WHERE id=$idTemp");
                $order += 1;
            }
        }
        if ($oldDate != $date && $destination != $target) {
            $result = mysqli_query($this->_mysql, "SELECT id, day_order FROM `tasks` WHERE complete_date='$date' ORDER BY day_order");
            $order = 0;
            $flag = true;
            while ($row = mysqli_fetch_array($result)) {
                $idTemp = $row["id"];
                $dayOrder = $row["day_order"];
                if ($id == $idTemp) {
                    continue;
                } elseif ($dayOrder == $destination) {
                    $flag = false;
                    if ($target > $destination) {
                        mysqli_query($this->_mysql, "UPDATE tasks SET day_order=$order WHERE id=$id");
                        $order += 1;
                        mysqli_query($this->_mysql, "UPDATE tasks SET day_order=$order WHERE id=$idTemp");
                        $order += 1;
                    } else {
                        mysqli_query($this->_mysql, "UPDATE tasks SET day_order=$order WHERE id=$idTemp");
                        $order += 1;
                        mysqli_query($this->_mysql, "UPDATE tasks SET day_order=$order WHERE id=$id");
                        $order += 1;
                    }
                } else {
                    mysqli_query($this->_mysql, "UPDATE tasks SET day_order=$order WHERE id=$idTemp");
                    $order += 1;
                }
            }
            if ($flag) {
                mysqli_query($this->_mysql, "UPDATE tasks SET day_order=$order WHERE id=$id");
            }
        }
    }

    public function searchDesks($text){
        foreach (["text"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $desks = array();
        $result = mysqli_query($this->_mysql, "SELECT id, desk_name, access_rights FROM `desks` WHERE INSTR(desk_name, '$text')=1 ORDER BY desk_name");
        while ($row = mysqli_fetch_array($result)) {
            $desks[] = array(
                'id' => $row[0],
                'desk_name' => $row[1]
            );
        }
        return $desks;
    }

    public function searchGroups($text){
        foreach (["text"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $groups = array();
        $result = mysqli_query($this->_mysql, "SELECT id, group_name FROM `groups` WHERE INSTR(group_name, '$text')=1 ORDER BY group_name");
        while ($row = mysqli_fetch_array($result)) {
            $groups[] = array(
                'id' => $row[0],
                'group_name' => $row[1]
            );
        }
        return $groups;
    }

    public function searchUsersAccessed($deskId, $text){
        foreach (["text", "deskId"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $users = array();
        $result = mysqli_query($this->_mysql, "SELECT id, `login` FROM `users_desks_access` JOIN `users` ON `user_id` = id WHERE desk_id=$deskId AND INSTR(`login`, '$text')=1 ORDER BY `login`");
        while ($row = mysqli_fetch_array($result)) {
            $users[] = array(
                'id' => $row[0],
                'login' => $row[1]
            );
        }
        return $users;
    }

    public function searchUsersNotAccessed($deskId, $text, $ownerId){
        foreach (["text", "deskId", "ownerId"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $users = array();
        $result = mysqli_query($this->_mysql, "SELECT * FROM `users` WHERE id NOT IN (SELECT `user_id` FROM `users_desks_access` JOIN `desks` ON desk_id=id WHERE desk_id=$deskId UNION SELECT $ownerId `user_id`) AND INSTR(`login`, '$text')=1");
        while ($row = mysqli_fetch_array($result)) {
            $users[] = array(
                'id' => $row[0],
                'login' => $row[1]
            );
        }
        return $users;
    }

    public function getDesks($id, $type){
        foreach (["id", "type"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $desks = array();
        $result = mysqli_query($this->_mysql, "SELECT id, desk_name, last_date FROM (SELECT * FROM `users_desks_memory` WHERE user_id=$id AND type='$type') udm JOIN `desks` ON udm.desk_id=desks.id ORDER BY last_date DESC");
        while ($row = mysqli_fetch_array($result)) {
            $desks[] = array(
                'id' => $row[0],
                'desk_name' => $row[1],
            );
        }
        while ($type == "history" && count($desks) > 6){
            mysqli_query($this->_mysql, "DELETE FROM `users_desks_memory` WHERE user_id=$id AND type='history' AND desk_id=".$desks[count($desks)-1]["id"]);
            unset($desks[count($desks)-1]);
        }
        return $desks;
    }

    public function addDeskToHistory($id, $desk_id){
        foreach (["id", "desk_id"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $result = mysqli_query($this->_mysql, "SELECT * FROM `users_desks_memory` WHERE user_id=$id AND type='history' AND desk_id=$desk_id");
        if (mysqli_fetch_array($result)){
            mysqli_query($this->_mysql, "UPDATE `users_desks_memory` SET `last_date`=DEFAULT WHERE user_id=$id AND type='history' AND desk_id=$desk_id");
        }
        else{
            mysqli_query($this->_mysql, "INSERT INTO users_desks_memory(user_id, desk_id, type) VALUES ($id, $desk_id, 'history')");
        }
    }

    public function createDesk($id, $deskName){
        foreach (["id", "deskName"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        mysqli_query($this->_mysql, "LOCK TABLES desks WRITE, tasks WRITE, users WRITE, users_desks_memory WRITE");
        $result = mysqli_query($this->_mysql, "INSERT INTO desks(desk_name, creator_id, access_rights) VALUES('$deskName', $id, 0)");
        if ($result) {
            $desk_id = mysqli_insert_id($this->_mysql);
            mysqli_query($this->_mysql, "INSERT INTO users_desks_memory(user_id, desk_id, type) VALUES ($id, $desk_id, 'history')");
            mysqli_query($this->_mysql, "INSERT INTO users_desks_memory(user_id, desk_id, type) VALUES ($id, $desk_id, 'own')");
            mysqli_query($this->_mysql, "UNLOCK TABLES");
            return $desk_id;
        }
        mysqli_query($this->_mysql, "UNLOCK TABLES");
        return false;
    }

    public function isCreator($user_id, $desk_id){
        foreach (["user_id", "desk_id"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $result = mysqli_query($this->_mysql, "SELECT creator_id FROM `desks` WHERE id=$desk_id");
        if ($result){
            if ($user_id == mysqli_fetch_array($result)["creator_id"]){
                return true;
            }
        }
        return false;
    }

    public function getAccessRights($desk_id, $withGroup = false){
        foreach (["desk_id"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $result = mysqli_query($this->_mysql, "SELECT access_rights, group_access FROM `desks` WHERE id=$desk_id");
        if ($result){
            if ($withGroup){
                return mysqli_fetch_array($result);
            }
            else{
                return mysqli_fetch_array($result)["access_rights"];
            }
        }
        return false;
    }

    public function isInUserDesksAccess($desk_id, $user_id){
        foreach (["desk_id", "user_id"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $result = mysqli_query($this->_mysql, "SELECT * FROM `users_desks_access` WHERE desk_id=$desk_id AND `user_id`=$user_id");
        if ($result){
            if (mysqli_fetch_array($result)){
                return true;
            }
        }
        return false;
    }

    public function isInGroupAccess($desk_id, $user_id){
        foreach (["desk_id", "user_id"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $result = mysqli_query($this->_mysql, "SELECT * FROM `users_groups` JOIN `desks` ds ON group_access=group_id WHERE `user_id`=$user_id AND ds.id=$desk_id");
        if ($result){
            if (mysqli_fetch_array($result)){
                return true;
            }
        }
        return false;
    }

    public function getGroupName($group_id){
        foreach (["group_id"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        $result = mysqli_query($this->_mysql, "SELECT group_name FROM `groups` WHERE id=$group_id");
        if ($result){
            return mysqli_fetch_array($result);
        }
        return false;
    }

    public function changeAccessRights($desk_id, $newType, $newGroup){
        foreach (["desk_id", "newType", "newGroup"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        if ($newType != 2){
            mysqli_query($this->_mysql, "UPDATE desks SET access_rights=$newType, group_access=1 WHERE id=$desk_id");
        }
        else{
            $result = mysqli_query($this->_mysql, "SELECT `id` FROM `groups` WHERE group_name='$newGroup'");
            if ($result){
                $groupName = mysqli_fetch_array($result)["id"];
                if ($groupName == "") {
                    $groupName = 1;
                }
                mysqli_query($this->_mysql, "UPDATE desks SET access_rights=$newType, group_access=$groupName WHERE id=$desk_id");
            }
        }
    }

    public function swapUserDedicatedAccess($deskId, $userId){
        foreach (["deskId", "userId"] as $param) {
            $$param = mysqli_real_escape_string($this->_mysql, $$param);
        }
        if ($this->isInUserDesksAccess($deskId, $userId)){
            mysqli_query($this->_mysql, "DELETE FROM `users_desks_access` WHERE `user_id`=$userId AND `desk_id`=$deskId");
        }
        else{
            mysqli_query($this->_mysql, "INSERT INTO `users_desks_access`(`user_id`, `desk_id`) VALUES ($userId, $deskId)");
        }
    }
}