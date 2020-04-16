<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../config/dbc.php';
  include_once '../models/prodtype.php';

  // Instantiate DB & connect
  $database = new Dbc();
  $conn = $database->connect();

  // Instantiate blog post object
  $product = new ProductType($conn);

  // Blog post query
  $result = $product->getAllProductTypes();
  // Get row count
  $num = $result->rowCount();

  // Check if any posts
  if($num > 0) {
    // Post array
    $productTypes_arr = array();
    // $posts_arr['data'] = array();

    while($row = $result->fetch(PDO::FETCH_COLUMN, 1)) {
      // Push to "data"
      $productTypes_arr[] = $row;
      // array_push($posts_arr['data'], $post_item);
    }

    // Turn to JSON & output
    echo json_encode($productTypes_arr);

  } else {
    // No Posts
    echo json_encode(
      array('message' => 'No Types Found')
    );
  }
