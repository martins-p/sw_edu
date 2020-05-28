<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../config/dbc.php';
include_once '../models/product.php';
include_once 'validation.php';
include_once 'sanitizer.php';

// Instantiate DB & connect
$database = new Dbc();
$conn = $database->connect();

// Get raw posted data
$data = json_decode(file_get_contents("php://input"), true);

//Sanitize input
foreach ($data as $key => $value) {
  if (is_array($value)) {
    foreach ($value as $subKey => $subValue) {
      $value[$subKey] = InputSanitizer::sanitizeInput($subKey, $subValue);
    }
    $sanitizedData[$key] = $value;
  } else {
    $sanitizedData[$key] = InputSanitizer::sanitizeInput($key, $value);
  }
}
unset($value);

// Validate input
$validator = new ProductValidator($sanitizedData);
$validationResult = $validator->isInputValid();
if ($validationResult) {
  $validationResult['errorType'] = 'validation_error';
  http_response_code(400);
  exit(json_encode($validationResult));
}

// Instantiate product object and bind values
$product = new Product($conn);

$product->sku = $sanitizedData['sku'];
$product->name = $sanitizedData['name'];
$product->price = $sanitizedData['price'];
$product->type = $sanitizedData['type'];
$product->specialAttribute = $sanitizedData['special_attribute'];
if (is_array($sanitizedData['special_attribute_value'])) {
  $product->specialAttributeValue = $product->dimensionsToString($sanitizedData['special_attribute_value']);
} else {
  $product->specialAttributeValue = $sanitizedData['special_attribute_value'];
}

// Create product
try {
  $product->create();
} catch (Exception $e) {
  if ($e->getPrevious()->errorInfo[1] == 1062) {
    http_response_code(409);
  } else {
    http_response_code(500);
  }
  echo json_encode(
    array(
      'errorType' => 'general_error',
      'errorMessage' => $e->getMessage()
    )
  );
}
