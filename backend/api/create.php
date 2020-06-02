<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../config/dbc.php';
include_once '../models/product.php';
include_once 'validation.php';
include_once 'sanitizer.php';

$database = new Dbc();
$conn = $database->connect();

$data = json_decode(file_get_contents("php://input"), true);

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

$validator = new ProductValidator($sanitizedData);
$validationResult = $validator->isInputValid();
if ($validationResult) {
  $responseData = array(
    'validationError' => true,
    'validationMessages' => $validationResult
  );
  http_response_code(400);
  exit(json_encode($responseData));
}

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
      'message' => $e->getMessage()
    )
  );
}
