<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// config file
require_once __DIR__ . '/Config.php';
require_once __DIR__ . '/Api.php';
require_once __DIR__ . '/Helpers.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');


if(isset($_GET['api']) AND !empty($_GET['api'])){
    $apiURL = $_GET['api'];
    if(getApiMethod($apiURL)){
        $param = (isset($_GET['param'])) ? $_GET['param'] : null;
        $API = new API;
        print $API->$apiURL($param);
    }else{
        print json_encode(array("error" => "API URL is not isset"));
    }
}else{
    print json_encode(array("error" => "Please add api name"));
}

?>