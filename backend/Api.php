<?php

class API {

    function createShoppingList()
    {
        $db         = new Connect;
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $list_name = $_POST['list_name'];
            $list_color = $_POST['list_color'];
            if(!empty($list_name) AND !empty($list_color)){
                // insert
                try {
                    $sql = "INSERT INTO lists (list_name, list_color, list_created, list_updated) VALUES (?,?, NOW(), NOW())";
                    $db->prepare($sql)->execute([$list_name, $list_color]);
                    return json_encode(array("success" => "List was created"));
                }
                catch(PDOException $e) {
                    return json_encode(array("error" => $e->getMessage()));
                }
            }else{
                return json_encode(array("error" => "Empty fields"));
            }
        }else{
            return json_encode(array("error" => "Bad request"));
        }
    }

    function getShoppingLists()
    {
        $db         = new Connect;
        $return     = array();
        $data       = $db->prepare('SELECT * FROM lists ORDER by list_updated DESC');
        $data->execute();
        $temp = array();
        while($res = $data->fetch(PDO::FETCH_ASSOC)){
            $all = $db->prepare('SELECT * FROM list WHERE list_id = '.$res['list_id']);
            $all->execute();
            $all = $all->rowCount();

            $paid = $db->prepare('SELECT * FROM list WHERE list_id = '.$res['list_id'].' AND price > 0');
            $paid->execute();
            $paid = $paid->rowCount();

            $temp[] = [
                "all" => $all,
                "paid" => $paid,
                "list" => $res
            ];
        }
        $return = $temp;
        return json_encode($return);
    }

    function deleteShoppingList($list_id)
    {
        if(empty($list_id) OR $list_id === NULL){
            return json_encode(array("error" => "Shopping List ID missing"));
        }
        $db         = new Connect;
        $data       = $db->prepare('SELECT * FROM lists WHERE list_id = '.$list_id);
        $data->execute();
        if($data->rowCount() == 0){
            return json_encode(array("error" => "Shopping List not isset"));
        }
        // delete 
        try {
            $sql = "DELETE FROM list WHERE list_id = ?";
            $db->prepare($sql)->execute([$list_id]);
            $sql = "DELETE FROM lists WHERE list_id = ?";
            $db->prepare($sql)->execute([$list_id]);
            
            return json_encode(array("success" => "List deleted"));
        }
        catch(PDOException $e) {
            return json_encode(array("error" => $e->getMessage()));
        }
    }

    function getShoppingList($list_id)
    {
        if(empty($list_id) OR $list_id === NULL){
            return json_encode(array("error" => "Shopping List ID missing"));
        }
        $db         = new Connect;
        $return     = array();
        $data       = $db->prepare('SELECT * FROM list WHERE list_id = '.$list_id.' ORDER by price ASC');
        $data->execute();
        // if($data->rowCount() == 0){
        //     return json_encode(array("error" => "Shopping List not isset"));
        // }
        $listinfo = $db->prepare('SELECT * FROM lists WHERE list_id = '.$list_id);
        $listinfo->execute();
        $listinfo = $listinfo->fetch(PDO::FETCH_ASSOC);
        $return['listinfo'] = $listinfo;
        while($res = $data->fetch(PDO::FETCH_ASSOC)){
            $return['list'][] = $res;
        }
        return json_encode($return);
    }

    function addShoppingListItem($list_id)
    {
        if(empty($list_id) OR $list_id === NULL){
            return json_encode(array("error" => "Shopping List ID missing"));
        }
        $db         = new Connect;
        $data       = $db->prepare('SELECT * FROM lists WHERE list_id = '.$list_id);
        $data->execute();
        if($data->rowCount() == 0){
            return json_encode(array("error" => "Shopping List not isset"));
        }
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $item = $_POST['item'];
            if(!empty($item)){
                // insert
                try {
                    $sql = "INSERT INTO list (list_id, item) VALUES (?,?)";
                    $db->prepare($sql)->execute([$list_id, $item]);
                    $sql = "INSERT INTO suggest (suggest_item) VALUES (?)";
                    $db->prepare($sql)->execute([$item]);
                    $sql = "UPDATE lists SET list_updated = NOW() WHERE list_id=?";
                    $db->prepare($sql)->execute([$list_id]);
                    return json_encode(array("success" => "Item added"));
                }
                catch(PDOException $e) {
                    return json_encode(array("error" => $e->getMessage()));
                }
            }else{
                return json_encode(array("error" => "Empty fields"));
            }
        }else{
            return json_encode(array("error" => "Bad request"));
        }
    }

    function deleteShoppingListItem($item_id)
    {
        if(empty($item_id) OR $item_id === NULL){
            return json_encode(array("error" => "Item ID missing"));
        }
        $db         = new Connect;
        $data       = $db->prepare('SELECT * FROM list WHERE id = '.$item_id);
        $data->execute();
        if($data->rowCount() == 0){
            return json_encode(array("error" => "Item is not isset"));
        }
        // delete 
        try {
            $sql = "DELETE FROM list WHERE id = ?";
            $db->prepare($sql)->execute([$item_id]);
            
            return json_encode(array("success" => "Item deleted"));
        }
        catch(PDOException $e) {
            return json_encode(array("error" => $e->getMessage()));
        }
    }

    function editShoppingListItem($item_id)
    {
        if(empty($item_id) OR $item_id === NULL){
            return json_encode(array("error" => "Item ID missing"));
        }
        $db         = new Connect;
        $data       = $db->prepare('SELECT * FROM list WHERE id = '.$item_id);
        $data->execute();
        if($data->rowCount() == 0){
            return json_encode(array("error" => "Item is not isset"));
        }
        // edit price 
        if($_SERVER['REQUEST_METHOD'] == 'POST'){
            $price = $_POST['price'];
            if(isset($price)){
                try {
                    $list_id = $data->fetch(PDO::FETCH_ASSOC)['list_id'];
                    $sql = "UPDATE list SET price = ? WHERE id = ?";
                    $db->prepare($sql)->execute([$price, $item_id]);
                    $sql = "UPDATE lists SET list_updated = NOW() WHERE list_id=?";
                    $db->prepare($sql)->execute([$list_id]);
                    return json_encode(array("success" => "Item edited"));
                }
                catch(PDOException $e) {
                    return json_encode(array("error" => $e->getMessage()));
                }
            }else{
                return json_encode(array("error" => "Empty fields"));
            }
        }else{
            return json_encode(array("error" => "Bad request"));
        }
    }

    

}