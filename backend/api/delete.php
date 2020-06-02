<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: DELETE');
header('Access-Control-Allow-Headers: Access-Control-Allow-Headers, Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

include_once '../config/dbc.php';
include_once '../models/product.php';

$database = new Dbc();
$conn = $database->connect();

$data = json_decode(file_get_contents("php://input"));

$product = new Product($conn);

$product->skuArray = $data->skuArray;

try {
  $product->delete();
} catch (Exception $e) {
  http_response_code(400);
  echo json_encode(
    array(
      'message' => $e->getMessage()
    )
  );
}
