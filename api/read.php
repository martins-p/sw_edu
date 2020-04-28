<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../config/dbc.php';
include_once '../models/product.php';

// Instantiate DB & connect
$database = new Dbc();
try {
  $conn = $database->connect();
} catch (Exception $e) {
  $response = array(
    'dataStatus' => false,
    'message' => 'Database connection error'
  );
  http_response_code(500);
  echo json_encode($response);
  die();
};

// Instantiate product object
$product = new Product($conn);

// Product query
$result = $product->getAllProducts();
// Get row count
$num = $result->rowCount();

// Check if any products
if ($num > 0) {
  // Product array
  $products_arr = array();

  while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
    extract($row);

    $product_item = array(
      'sku' => $sku,
      'name' => $name,
      'price' => $price,
      'attribute' => $attribute,
      'value' => $value
    );
    $product_item = $product->addUnits($product_item);

    // Push to "data"
    array_push($products_arr, $product_item);
  }

  // Turn to JSON & output
  echo json_encode($products_arr);
} else {
  // No Products
  echo json_encode(
    array(
      'dataStatus' => false,
      'message' => 'No Products Found'
    )
  );
}
