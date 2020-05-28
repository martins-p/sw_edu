import * as utils from '../utils/utils.js';
import specAtbFields from './components/special_attr_fields.js';

async function getProductTypes() {
  const url = 'http://localhost:80/api/readTypes.php';

  return axios
    .get(url, { timeout: 4000 })
    .then((response) => response.data)
    .catch((err) => {
      if (err.code === 'ECONNABORTED') {
        return { error: true, message: 'Error: connection timeout' };
      }
      switch (err.response.status) {
        case 404:
          return { error: true, message: 'Server not found.' };
        default:
          return err.response.data;
      }
    });
}

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
    const productTypes = await getProductTypes();

    const generateTypeList = (productTypes) => {
      if (productTypes.error === true) {
        return /*html*/ `<div class="error-message">Cannot retrieve product types.
                                <br>${productTypes.message}</div>`;
      }
      const productTypesList = productTypes
        .map((prodType) => `<option>${prodType}</option>`)
        .join(' ');
      const productTypesSelector = /*html*/ `
                <select name="type" id="select-product-type" class="input_type" autocomplete="off" value="">
                    <option selected hidden style='display: none' value=''></option>
                    ${productTypesList}
                </select>`;
      return productTypesSelector;
    };

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
                        <td>${generateTypeList(productTypes)}
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
          utils.showModal('Product successfully added.');
          document.getElementById('content-container').innerHTML = await Add.render();
          Add.afterRender();
        })
        .catch((err) => {
          let messages;
          if (err.code === 'ECONNABORTED') {
            messages = {
              errorType: 'general_error',
              errorMessage: 'Error: connection timeout',
            };
          } else {
            messages = err.response.data;
          }
          //    Remove obsolete error messages
          while (document.querySelector('.input-error-message')) {
            document.querySelector('.input-error-message').remove();
          }

          if (messages.hasOwnProperty('errorType')) {
            if (messages.errorType === 'validation_error') {
              utils.validationErrOutput(messages);
            } else if (messages.errorType === 'general_error') {
              utils.showModal(messages.errorMessage);
            }
          }
        });
    });
  },
};

export { Add };
