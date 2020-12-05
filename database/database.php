<?php

class dataBase{

    private $_mysql;

    public function __construct(){
        $this->_mysql = mysqli_connect('localhost', 'root', 'root', 'trello');
    }

    public function __destruct(){
        mysqli_close($this->_mysql);
    }

    public function addTask($task, $importance, $category, $date, $adder_id, $desk_id){
        $rows = 0;
        $result = mysqli_query($this->_mysql, "SELECT count(*) FROM tasks WHERE complete_date='$date' AND desk_id=$desk_id");
        while($row = mysqli_fetch_array($result)){
            $rows = $row[0];
        }
        mysqli_query($this->_mysql, "INSERT INTO `tasks`(`task`, `importance`, `category`, `complete_date`, `adder_id`, `desk_id`, `day_order`) VALUES ('$task', '$importance', '$category', '$date', $adder_id, $desk_id, $rows)");
    }

    public function getTasks($date, $desk_id){
        $tasks = array();
        $result = mysqli_query($this->_mysql, "SELECT task, importance, category, id, is_complete, day_order FROM tasks WHERE complete_date='$date' AND desk_id=$desk_id ORDER BY day_order");
        while($row = mysqli_fetch_array($result)){
            $tasks[] = array(
                'task' => $row[0],
                'importance' => $row[1],
                'category' => $row[2],
                'id' => $row[3],
                'isComplete' => $row[4],
                'dayOrder' => $row[5]
            );
        }
        return $tasks;
    }

    public function deleteTask($id){
        mysqli_query($this->_mysql, "DELETE FROM tasks WHERE id=$id");
    }

    public function completeTask($id){
        mysqli_query($this->_mysql, "UPDATE tasks SET is_complete=1 WHERE id=$id");
    }

    public function addUser($nickname, $login, $password){
        mysqli_query($this->_mysql, "INSERT INTO users(nickname, login, password) VALUES('$nickname', '$login', '$password')");
    }

    public function dragTask($date, $id, $destination, $target){
        $result = mysqli_query($this->_mysql, "SELECT complete_date FROM tasks WHERE id=$id");
        $oldDate = "";
        while($row = mysqli_fetch_array($result)){
            $oldDate = $row["complete_date"];
        }
        if ($oldDate != $date) {
            mysqli_query($this->_mysql, "UPDATE tasks SET complete_date='$date' WHERE id=$id");
            $result = mysqli_query($this->_mysql, "SELECT id FROM tasks WHERE complete_date='$oldDate' ORDER BY day_order");
            $order = 0;
            while ($row = mysqli_fetch_array($result)) {
                $idTemp = $row["id"];
                mysqli_query($this->_mysql, "UPDATE tasks SET day_order=$order WHERE id=$idTemp");
                $order += 1;
            }
        }
        if ($oldDate != $date && $destination != $target) {
            $result = mysqli_query($this->_mysql, "SELECT id, day_order FROM tasks WHERE complete_date='$date' ORDER BY day_order");
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
}