<?php

function getApiMethod($val){
    $class_methods = get_class_methods('API');
    if(in_array($val, $class_methods)){
        return true;
    }else{
        return false;
    }
}

?>