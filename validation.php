<?php

class InputValidator
{
    private $inputData;
    private $validationErrors = [];
    private static $fields = ['sku', 'name', 'price', 'type', 'special_attribute', 'special_attribute_value'];

    public function __construct($postData)
    {
        $this->inputData = $postData;
    }

    public function validateForm()
    {
        foreach (self::$fields as $field) {
            if (!array_key_exists($field, $this->inputData)) {
                throw new Exception("Field \'$field\' is not present in form data");
            }
        }

        $this->inputData['name'] = $this->validateName($this->inputData['name']);
        $this->inputData['price'] = $this->validatePrice($this->inputData['price']);
        $this->inputData['sku'] = $this->validateSku($this->inputData['sku']);
        $this->inputData['type'] = $this->validateProductType($this->inputData['type']);
        $this->inputData['special_attribute'] = $this->validateAttrbType($this->inputData['special_attribute']);
        $this->inputData['special_attribute_value'] = $this->validateAttrbValue($this->inputData['special_attribute_value']);

        if (empty($this->validationErrors)) {
            return $this->inputData;
        } else {
            $this->validationErrors['errType'] = 'validationError';
            return $this->validationErrors;
        }
    }

    private function sanitizeString(string $input)
    {
        $output = trim($input);
        $output = stripslashes($output);
        $output = filter_var($output, FILTER_SANITIZE_STRING);
        return $output;
    }

    private function validateName($name)
    {
        $val = $this->sanitizeString($name);
        $this->checkInputEmpty('name', $val, 'Name');
        return $val;
    }

    public function validateSKU($sku)
    {
        $val = trim($sku);
        if(!$this->checkInputEmpty('sku', $val, 'SKU')){
            $this->checkAlphanum('sku', $val, 'SKU');
        }
        return $val;
    }

    private function validatePrice($price)
    {
        $val = trim($price);
        if (!$this->checkInputEmpty('price', $val, 'Price')) {
            $this->checkFloat('price', $val, 'Price');
        }
        return $val;
    }

    private function validateProductType($type)
    {
        $val = $this->sanitizeString($type);
        $this->checkInputEmpty('type', $val, 'Type');
        return $val;
    }

    private function validateAttrbType($attribute)
    {
        $val = $this->sanitizeString($attribute);
        $this->checkInputEmpty('special_attribute', $val, 'Attribute type');
        return $val;
    }

    private function validateAttrbValue($attributeValue)
    {

        if (is_array($attributeValue)) {

            foreach ($attributeValue as $key => $value) {
                $value = trim($value);
                if(!$this->checkInputEmpty($key, $value)) {
                $this->checkFloat($key, $value);}
            }
            if (!array_key_exists('height', $this->validationErrors) && !array_key_exists('width', $this->validationErrors) && !array_key_exists('length', $this->validationErrors)) {
                return $this->dimensionsToString($attributeValue);
            }
        } else {
            $val = trim($attributeValue);        
            if (!$this->checkInputEmpty('special_attribute_value', $val)) {
                $this->checkFloat('special_attribute_value', $val);
            }
            return $val;
        }
    }


    private function addError($key, $val)
    {
        $this->validationErrors[$key] = $val;
    }


    private function checkInputEmpty($key, $value, $fieldName = 'Value')
    {
        if (empty($value)) {
            $this->addError($key, $fieldName . ' can\'t be empty');
            return true;
        }
        return false;
    }

    private function checkFloat($key, $value, $fieldName = 'Value')
    {
        if (!filter_var($value, FILTER_VALIDATE_FLOAT)) {
            $this->addError($key, $fieldName . ' must be a valid number');
            return true;
        } else {
            return false;
        }
    }
    private function checkAlphanum($key, $value, $fieldName = 'Value')
    {
        if (!ctype_alnum($value)) {
            $this->addError($key, $fieldName . ' must be alphanumeric');
        }
    }

    private function dimensionsToString($array)
    {
        $trimmed = array_map('trim', $array);
        $string = implode('x', $trimmed);
        return $string;
    }
}
