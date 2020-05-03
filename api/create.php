<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../config/dbc.php';
include_once '../models/product.php';
include_once 'validation.php';

// Instantiate DB & connect
$database = new Dbc();
try {
  $conn = $database->connect();
} catch (Exception $e) {
  $response = array(
    'status' => 500,
    'message' => 'Database connection error'
  );
  http_response_code(500);
  echo json_encode($response);
  die();
};

// Instantiate product object
$product = new Product($conn);

// Get raw posted data
$data = json_decode(file_get_contents("php://input"), true);


// Instantiate validator
$validator = new InputValidator($data);
$validationResult = $validator->validateForm();
if (array_key_exists('errorType', $validationResult)) {
  http_response_code(500);
  echo json_encode($validationResult);
  die();
}

$product->sku = $validationResult['sku'];
$product->name = $validationResult['name'];
$product->price = $validationResult['price'];
$product->type = $validationResult['type'];
$product->specialAttribute = $validationResult['special_attribute'];
$product->specialAttributeValue = $validationResult['special_attribute_value'];

// Create product
try {
  $product->create();

} catch (Exception $e){
    http_response_code(500);
    echo json_encode(array(
      'errorType' => 'modalError',
      'errorMessage' => $e->getMessage())
    );
}