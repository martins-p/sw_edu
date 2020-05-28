<?php

class ProductValidator
{
    private $inputData;
    private $validationErrors = [];
    private static $fields = ['sku', 'name', 'price', 'type', 'special_attribute', 'special_attribute_value'];

    public function __construct($data)
    {
        $this->inputData = $data;
    }

    public function isInputValid()
    {
        foreach (self::$fields as $field) {
            if (!array_key_exists($field, $this->inputData)) {
                throw new Exception("Field \'$field\' is not present in form data");
            }
        }

        $this->validateName($this->inputData['name']);
        $this->validatePrice($this->inputData['price']);
        $this->validateSku($this->inputData['sku']);
        $this->validateProductType($this->inputData['type']);
        $this->validateAttrbType($this->inputData['special_attribute']);
        $this->validateAttrbValue($this->inputData['special_attribute_value']);

        return $this->validationErrors;
    }

    private function validateName($name)
    {
        $this->checkInputEmpty('name', $name, 'Name');
    }

    public function validateSKU($sku)
    {
        $isEmpty = $this->checkInputEmpty('sku', $sku, 'SKU');
        if (!$isEmpty) {
            $this->checkAlphanum('sku', $sku, 'SKU');
        }
    }

    private function validatePrice($price)
    {
        $this->checkInputEmpty('price', $price, 'Price');
    }

    private function validateProductType($type)
    {
        $this->checkInputEmpty('type', $type, 'Type');
    }

    private function validateAttrbType($attribute)
    {
        $this->checkInputEmpty('special_attribute', $attribute, 'Attribute type');
    }

    private function validateAttrbValue($attributeValue)
    {

        if (is_array($attributeValue)) {

            foreach ($attributeValue as $key => $value) {
                $this->checkInputEmpty($key, $value);
            }
        } else {
            $this->checkInputEmpty('special_attribute_value', $attributeValue);
        }
    }


    private function addError($inputKey, $inputValue)
    {
        $this->validationErrors[$inputKey] = $inputValue;
    }

    private function checkInputEmpty($inputKey, $inputValue, $inputFieldName = 'Value')
    {
        if (empty($inputValue)) {
            $this->addError($inputKey, $inputFieldName . ' can\'t be empty');
            return true;
        } else {
            return false;
        }
    }

    private function checkAlphanum($inputKey, $inputValue, $inputFieldName = 'Value')
    {
        if (!ctype_alnum($inputValue)) {
            $this->addError($inputKey, $inputFieldName . ' must be alphanumeric');
        }
    }
}
