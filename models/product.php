<?php
/* require_once 'dbc.php';
require_once 'validation.php'; */

class Product
{
    private $conn;

    public $sku;
    public $name;
    public $price;
    public $type;
    public $specialAttribute;
    public $specialAttributeValue;
    public $skus= array ();

    public function __construct($db)
    {
        $this->conn = $db;
    }

    /*  public static function withProductData($data)
    {
        $instance = new self();
        $instance->fillData($data);
        return $instance;
    }

    private function fillData($data)
    {
        $this->sku = $data['sku'];
        $this->name = $data['name'];
        $this->price = $data['price'];
        $this->type = $data['type'];
        $this->specialAttribute = $data['special_attribute'];
        $this->specialAttributeValue = $data['special_attribute_value'];
    } */

    public function getAllProducts()
    {
        $query = 'SELECT products.id, products.sku, name, price, attribute, value FROM products LEFT JOIN attributes ON products.sku = attributes.sku';


        $stmt = $this->conn->prepare($query);
        // Execute query
        $stmt->execute();

        return $stmt;
        /*        $output = array();
         try {
            while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
                $output[] = $this->addUnits($row);
            }
        } catch (Exception $e) {
            throw $e;
        }
        if (count($output) > 0) {
            return $output;
        } else {
            throw new Exception('No products to display');
        }*/
    }

    protected function getAllProdTypes()
    {
        $stmt = $this->query('SELECT type FROM product_types');
        $output = array();
        try {
            while ($row = $stmt->fetch()) {
                $output[] = $row;
            }
        } catch (Exception $e) {
            throw $e;
        }
        if (count($output) > 0) {
            return $output;
        } else {
            throw new Exception('No product types to display');
        }
    }

    public function create()
    {
        
        $query_product = 'INSERT INTO products (sku, name, price, type) VALUES (:sku,:name,:price,:type)';
        $query_attribute = 'INSERT INTO attributes (sku, attribute, value) VALUES (:sku, :attribute, :value)';

        $stmtProduct = $this->conn->prepare($query_product);
        $stmtAttribute = $this->conn->prepare($query_attribute);

        try {
            $this->conn->beginTransaction();

            $stmtProduct->execute(array(
                'sku' => $this->sku,
                'name' => $this->name,
                'price' => $this->price,
                'type' => $this->type
            ));
            $stmtAttribute->execute(array(
                'sku' => $this->sku,
                'attribute' => $this->specialAttribute,
                'value' => $this->specialAttributeValue
            ));

            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
           /*  if ($e->getCode() == 23000) {
                throw new Exception('SKU already exists in database' . $e);
            } else { */
                throw $e;
           // }
        }
        return true;
    }

    public function delete()
    {
        $queryPlaceholders = str_repeat('?,', count($this->skus) - 1) . '?';
        //$pdo = $this->connect();
        $stmtProduct = $this->conn->prepare("DELETE FROM products WHERE sku IN ($queryPlaceholders)");
        $stmtAttribute = $this->conn->prepare("DELETE FROM attributes WHERE sku IN ($queryPlaceholders)");

        try {
            $this->conn->beginTransaction();
            $stmtAttribute->execute($this->skus);
            $stmtProduct->execute($this->skus);
            /* $count = $stmtProduct->rowCount();
            if ($count == 0) {
                throw new Exception('Product could not be deleted.');
            } */
            $this->conn->commit();
        } catch (Exception $e) {
            $this->conn->rollback();
            throw $e;
        }
        return true;
    }

    private function addUnits($productData)
    {
        switch ($productData['attribute']) {
            case 'Size':
                $productData['measure_unit'] = 'GB';
                break;
            case 'Weight':
                $productData['measure_unit'] = 'Kg';
                break;
            case 'Dimensions':
                $productData['measure_unit'] = 'cm';
                break;
            default:
                break;
        }
        return $productData;
    }
}
