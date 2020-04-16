<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');
  header('Access-Control-Allow-Methods: POST');
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

  $product->sku = $data->sku;
  $product->name = $data->name;
  $product->price = $data->price;
    $product->type = $data->type;
$product->specialAttribute = $data->special_attribute;
  $product->specialAttributeValue = $data->special_attribute_value; 

  
  


  // Create post
  if($product->create()) {
    echo json_encode(
      array('message' => 'Post Created')
    );
  } else {
    echo json_encode(
      array('message' => 'Post Not Created')
    );
  } 