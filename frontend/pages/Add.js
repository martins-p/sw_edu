/* eslint-disable linebreak-style */

import * as utils from '../utils/utils.js';
import specAtbFields from './components/special_attr_fields.js';

async function getProductTypes() {
  const url = 'http://localhost:80/api/readTypes.php';

  return axios
    .get(url, { timeout: 4000 })
    .then((response) => response.data)
    .catch((err) => {
      const errorData = utils.requestErrorHandler(err);
      return errorData;
    });
}

const generateTypeList = (data) => {
  if (data.error) {
    const typeList = /*html*/ `<div class="error-message">Cannot retrieve product types.<br>
      ${data.message}</div>`;
    return typeList;
  }

  const productTypeList = data
    .map((prodType) => `<option>${prodType}</option>`)
    .join(' ');

  const productTypeSelector = /*html*/ `
            <select name="type" id="select-product-type" class="input_type" autocomplete="off" value="">
                <option selected hidden style='display: none' value=''></option>
                ${productTypeList}
            </select>`;

  return productTypeSelector;
};

const Add = {
  preRender: () => {
    const view = /*html*/ `
            <form id="addProductForm" action="" method="post">
                <table class="standard-table">
                    <tr>
                        <td>SKU</td>
                        <td><input type="text" disabled></td>
                    </tr>
                    <tr>
                        <td>Name</td>
                        <td><input type="text" disabled></td>
                    </tr>
                    <tr>
                        <td>Price</td>
                        <td><input type="number" disabled>
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td>
                            <div class="d-flex justify-content-center">
                            <div class="spinner-border" role="status">
                        </div>
                      </div>
                        </td>
                    </tr>
                </table>
                <button type="submit" name='addProduct' class="save-button btn btn-success" id="save-button" value="add" form="addProductForm" disabled>Save</button>
            </form>`;
    return view;
  },

  render: async () => {
    const receivedData = await getProductTypes();

    const view = /*html*/ `
            <form id="addProductForm" action="" method="post">
                <table class="standard-table">
                    <tr>
                        <td>SKU</td>
                        <td><input type="text" class="input_sku" name="sku" value="" placeholder="Enter SKU"></td>
                    </tr>
                    <tr>
                        <td>Name</td>
                        <td><input type="text" class="input_name" name="name" value="" placeholder="Enter name"></td>
                    </tr>
                    <tr>
                        <td>Price</td>
                        <td><input type="number" step="0.01" class="input_price" name="price" value="" placeholder="Enter price">
                    </tr>
                    <tr>
                        <td>Type</td>
                        <td>${generateTypeList(receivedData)}
                        </td>
                    </tr>
                </table>

                <div id="special-attribute-field">
                    <input type="hidden" name="special_attribute" value="">
                    <input type="hidden" name="special_attribute_value" value="">
                </div>
                <button type="submit" name='addProduct' class="save-button btn btn-success" id="save-button" value="add" form="addProductForm" disabled>Save</button>
            </form>`;
    return view;
  },
  afterRender: () => {
    //  Special attribute field change handling logic
    const productTypeDropdown = document.getElementById('select-product-type');

    if (productTypeDropdown) {
      productTypeDropdown.addEventListener('change', () => {
        const selection = productTypeDropdown.options[productTypeDropdown.selectedIndex].text;
        document.getElementById('special-attribute-field').innerHTML = specAtbFields[selection];
        document.getElementById('save-button').disabled = false;
      });
    }

    // Product creation form handler logic
    const productAddForm = document.getElementById('addProductForm');
    productAddForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const product = {};
      const formData = new FormData(productAddForm);

      formData.forEach((value, key) => {
        if (key === 'height' || key === 'length' || key === 'width') {
          if (!product.special_attribute_value) {
            product.special_attribute_value = {};
          }
          product.special_attribute_value[key] = value;
        } else {
          product[key] = value;
        }
      });

      const json = JSON.stringify(product);

      axios
        .post('http://localhost:80/api/create.php', json, { timeout: 3000 })
        .then(async () => {
          utils.showModal('Product successfully added');
          document.getElementById(
            'content-container',
          ).innerHTML = await Add.render();
          Add.afterRender();
        })
        .catch((err) => {
          const errorData = utils.requestErrorHandler(err);

          while (document.querySelector('.input-error-message')) {
            document.querySelector('.input-error-message').remove();
          }

          if (errorData.validationError) {
            utils.validationErrOutput(errorData.messages);
          } else {
            utils.showModal(errorData.message);
          }
        });
    });
  },
};

export { Add };
