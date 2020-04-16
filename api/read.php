<?php 
  // Headers
  header('Access-Control-Allow-Origin: *');
  header('Content-Type: application/json');

  include_once '../config/dbc.php';
  include_once '../models/product.php';

  // Instantiate DB & connect
  $database = new Dbc();
  $conn = $database->connect();

  // Instantiate blog post object
  $product = new Product($conn);

  // Blog post query
  $result = $product->getAllProducts();
  // Get row count
  $num = $result->rowCount();

  // Check if any posts
  if($num > 0) {
    // Post array
    $products_arr = array();
    // $posts_arr['data'] = array();

    while($row = $result->fetch(PDO::FETCH_ASSOC)) {
      extract($row);

      $product_item = array(
        'sku' => $sku,
        'name' => $name,
        'price' => $price,
        'attribute' => $attribute,
        'value' => $value
        );

      // Push to "data"
      array_push($products_arr, $product_item);
      // array_push($posts_arr['data'], $post_item);
    }

    // Turn to JSON & output
    echo json_encode($products_arr);

  } else {
    // No Posts
    echo json_encode(
      array('message' => 'No Posts Found')
    );
  }
