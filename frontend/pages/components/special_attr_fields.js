const specAtbFields = {
  default: /*html*/ `
                      <input type="hidden" name="special_attribute" value="">
                      <input type="hidden" name="special_attribute_value" value="">`,

  'DVD-Disc': /*html*/ `
                  <input type="hidden" name="special_attribute" value="Size">
                  <span>Size</span>
                  <input type="number" step="0.01" name="special_attribute_value" > GB 
                  <span class="input_special_attribute_value"></span><br>
                  <p>Please specify size in GB. The value must be a valid number. Use "." as the decimal separator.</p>`,

  Book: /*html*/ `
                  <input type="hidden" name="special_attribute" value="Weight">
                  <span>Weight</span><input type="number" step="0.01" name="special_attribute_value" class="input_value"> Kg 
                  <span class="input_special_attribute_value"></span><br>
                  <p>Please specify weight in Kg. The value must be a valid number. Use "." as the decimal separator.</p>`,

  Furniture: /*html*/ `
                  <input type="hidden" name="special_attribute" value="Dimensions">
                  <table class="dimensions-table"><tr>
                      <td>Height</td>
                      <td><input type="number" step="0.1" id="furniture-height" name="height"> cm <span class="input_height"></td>
                  </tr>
                  <tr>
                      <td>Width</td>
                      <td><input type="number" step="0.1" id="furniture-width" name="width"> cm <span class="input_width"></td>
                  </tr>
                  <tr>
                      <td>Length</td>
                      <td><input type="number" step="0.01" id="furniture-length" name="length"> cm <span class="input_length"></td>
                  </tr></table>
                  <p>Please specify Dimensions in cm. The value must be a valid number. Use "." as the decimal separator.</p>`,
};

export default specAtbFields;
