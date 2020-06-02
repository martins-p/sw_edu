<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../config/dbc.php';
include_once '../models/product.php';

$database = new Dbc();
$conn = $database->connect();

$product = new Product($conn);

$result = $product->getAllProducts();
$count = $result->rowCount();

if ($count > 0) {
  $products_arr = array();

  while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
    $row = $product->addUnits($row);
    array_push($products_arr, $row);
  }

  echo json_encode($products_arr);
} else {
  echo json_encode(
    array(
      'error' => true,
      'message' => 'No products found.'
    )
  );
}
