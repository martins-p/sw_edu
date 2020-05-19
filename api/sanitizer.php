<?php

class InputSanitizer {
      
    public static function sanitizeInput($key, $value) {
        
        $value = stripslashes($value);
        $value = trim($value);
        switch ($key) {
            case 'sku':
            case 'name':
            case 'type':
            case 'special_attribute' :
                $output = filter_var($value, FILTER_SANITIZE_STRING);
                break;
            case 'price':
            case 'special_attribute_value' :
            case 'length' :
            case 'height' :
            case 'width' :
                $output = filter_var($value, FILTER_SANITIZE_NUMBER_FLOAT);
                break;
            default :
                $output = filter_var($value, FILTER_SANITIZE_STRING);
                break;
        }
        
        return $output;
    }
}