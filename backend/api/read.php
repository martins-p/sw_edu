<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../config/dbc.php';
include_once '../models/product.php';

// Instantiate DB & connect
$database = new Dbc();
$conn = $database->connect();

// Instantiate product object
$product = new Product($conn);

// Product query
$result = $product->getAllProducts();
// Get row count
$count = $result->rowCount();

// Check if any products
if ($count > 0) {
  // Product array
  $products_arr = array();

  while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
    //Add units to row
    $row = $product->addUnits($row);

    // Push to products array
    array_push($products_arr, $row);
  }

  // Turn to JSON & output
  echo json_encode($products_arr);
} else {
  // Response if no products available
  echo json_encode(
    array(
      'error' => true,
      'message' => 'No products found.'
    )
  );
}
