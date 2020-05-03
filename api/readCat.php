<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../config/dbc.php';
include_once '../models/prodtype.php';

// Instantiate DB & connect
$database = new Dbc();
try {
  $conn = $database->connect();
} catch (Exception $e) {
  $response = array(
    'error' => true,
    'message' => 'Database connection error'
  );
  http_response_code(500);
  echo json_encode($response);
  die();
};
// Instantiate product type object
$product = new ProductType($conn);

// Product type query
$result = $product->getAllProductTypes();
// Get row count
$num = $result->rowCount();

// Check if any product types
if ($num > 0) {
  // Product type array
  $productTypes_arr = array();
  // $posts_arr['data'] = array();

  while ($row = $result->fetch(PDO::FETCH_COLUMN, 1)) {
    // Push to "data"
    $productTypes_arr[] = $row;
  }

  // Turn to JSON & output
  echo json_encode($productTypes_arr);
} else {
  // No ProdTypes
  echo json_encode(array(
    'error' => true,
    'message' => 'No Types Found')
  );
}
