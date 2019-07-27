<?php

class Connect extends PDO 
{
    public function __construct()
    {
        parent::__construct("mysql:host=localhost;dbname=dbname", 'username', 'password');
        $this->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $this->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
    }
}