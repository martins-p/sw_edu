<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../config/dbc.php';
include_once '../models/prodtype.php';

$database = new Dbc();
$conn = $database->connect();

$productTypes = new ProductType($conn);

$result = $productTypes->getAllProductTypes();
$count = $result->rowCount();

if ($count > 0) {
  $productTypes_arr = array();
  while ($row = $result->fetch(PDO::FETCH_COLUMN, 1)) {
    array_push($productTypes_arr, $row);
  }

  echo json_encode($productTypes_arr);
} else {
  echo json_encode(array(
    'error' => true,
    'message' => 'No product types found'
  ));
}
