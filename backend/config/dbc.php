<?php

class Dbc
{
    private $servername = "mysql-db";
    private $username = "root";
    private $password = "dbunlock123";
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
            $response = array(
                'error' => true,
                'message' => 'Error establishing a database connection. Error code: '. $e->getCode()
              );
              http_response_code(500);
              exit(json_encode($response));
        }        
        return $this->pdo;
    }
}
