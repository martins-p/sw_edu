<?php
// Headers
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include_once '../config/dbc.php';
include_once '../models/prodtype.php';

// Instantiate DB & connect
$database = new Dbc();
$conn = $database->connect();

// Instantiate product type object
$productTypes = new ProductType($conn);

// Product type query
$result = $productTypes->getAllProductTypes();
// Get row count
$count = $result->rowCount();

// Check if any product types retrieved
if ($count > 0) {
  // Product type array
  $productTypes_arr = array();
  while ($row = $result->fetch(PDO::FETCH_COLUMN, 1)) {
    // Push to array
    array_push($productTypes_arr, $row);
  }

  // Turn to JSON & output
  echo json_encode($productTypes_arr);
} else {
  // No ProdTypes available
  echo json_encode(array(
    'error' => true,
    'message' => 'No Product Types Found')
  );
}
