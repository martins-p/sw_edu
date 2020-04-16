<?php

class Dbc
{
    private $servername = "localhost";
    private $username = "root";
    private $password = "";
    private $dbname = "sw_edu";
    private $pdo;

    /*     protected function query($query)
    {
        $this->connect();
        if ($this->pdo) {
            return $this->pdo->query($query);
        } else {
            throw new Exception("Database query failed");
        }
    } */

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
