<?php

class Dbc
{
    private $servername = "localhost";
    private $username = "root";
    private $password = "";
    private $dbname = "sw_edu";
    private $pdo;

    public function connect()

    {
        $this->pdo = null;

        try {
            $dsn = "mysql:host=" . $this->servername . ";dbname=" . $this->dbname;
            $this->pdo = new PDO($dsn, $this->username, $this->password);
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            throw $e;
        }        
        return $this->pdo;
    }
}
