<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: DELETE');
  header('Access-Control-Allow-Headers: Access-Control-Allow-Headers,Content-Type,Access-Control-Allow-Methods, Authorization, X-Requested-With');

  include_once '../config/dbc.php';
  include_once '../models/product.php';

  // Instantiate DB & connect
  $database = new Dbc();
  $conn = $database->connect();

  // Instantiate blog post object
  $product = new Product($conn);

  // Get raw posted data
  $data = json_decode(file_get_contents("php://input"));

  // Set SKU to update
  $product->skus = $data->skus; 

  // Delete post
  if($product->delete()) {
    echo json_encode(
      array('message' => 'Post Deleted')
    );
  } else {
    echo json_encode(
      array('message' => 'Post Not Deleted')
    );
  }

