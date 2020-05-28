<?php
/* require_once 'dbc.php';
require_once 'validation.php'; */

class ProductType
{
    private $conn;

    public $type;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getAllProductTypes()
    {
        $query = 'SELECT type FROM product_types';

        $stmt = $this->conn->prepare($query);
        // Execute query
        $stmt->execute();

        return $stmt;
    }
}
