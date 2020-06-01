<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../config/dbc.php';
include_once '../models/product.php';

// Instantiate DB & connect
$database = new Dbc();
$conn = $database->connect();

// Get raw posted data
$data = json_decode(file_get_contents("php://input"));

// Instantiate product object
$product = new Product($conn);

// Set SKU to update
$product->skuArray = $data->skuArray;

// Delete product
try {
  $product->delete();
} catch (Exception $e) {
  http_response_code(400);
  echo json_encode(
    array(
      'error' => true,
      'message' => $e->getMessage()
    )
  );
}
