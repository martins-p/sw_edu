import * as utils from '../utils/utils.js'

let getProductTypes = async () => {
    const url = 'http://localhost/sw_edu/api/readCat.php';
    return axios.get(url)
        .then(response => { return response.data })
        .catch((e) => {
            return e.response.data;
        })
}

let Add = {

    preRender: () => {
        let view = `
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
                        <td>Loading...
                        </td>
                    </tr>
                </table>
                <button disabled>Save</button>
        </form>`
        return view;
    },

    render: async () => {
        let productTypes = await getProductTypes();
        const generateTypeList = (productTypes) => {
            if (productTypes.error === true) {
                return `<div class="error-message">Cannot retrieve product types.<br>${productTypes.message}</div>`;
            }
            let productTypesList = 
                `<select name="type" id="select-product-type" class="input_type" autocomplete="off" value="">
                    <option selected hidden style='display: none' value=''></option>
                    ${productTypes.map(prodType => `<option>${prodType}</option>`).join(" ")}
                </select>`
            return productTypesList;
        }
        let view =
                `<form id="addProductForm" action="" method="post">
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
            </form>`
        return view;
    },
    afterRender: () => {

        //Special attribute field change handling logic
        let productTypeSelector = document.getElementById("select-product-type");
        productTypeSelector.addEventListener("change", () => {
            var selection = productTypeSelector.options[productTypeSelector.selectedIndex].text;
            document.getElementById("special-attribute-field").innerHTML = specAtbFields[selection];
            document.getElementById('save-button').disabled = false;
        });

        // Product creation form handler logic
        let productAddForm = document.getElementById('addProductForm');
        productAddForm.addEventListener('submit', (e) => {
            e.preventDefault();
            new FormData(productAddForm);
        });
        productAddForm.onformdata = async (e) => {
            let product = {};

            e.formData.forEach((value, key) => {
                if (key == 'height' || key == 'length' || key == 'width') {
                     if (!product['special_attribute_value']) {
                        product['special_attribute_value'] = {};
                    } 
                    product['special_attribute_value'][key] = value;

                } else {
                    product[key] = value;
                }
            });
            
            var json = JSON.stringify(product);

            axios.post('http://localhost/sw_edu/api/create.php', json)
                .then(async () => {
                    utils.showModal('Product added');
                    document.getElementById("content-container").innerHTML =  await Add.render();
                    Add.afterRender();
                })
                .catch((e) => {
                    let messages = e.response.data;

                    //Remove obsolete error messages
                    var nodes = document.getElementsByClassName('input-error-message');
                    while (nodes.length > 0) {
                        nodes[i].parentNode.removeChild(nodes[i]);
                    } 

                    if (messages.hasOwnProperty('errorType')) {
                        if (messages['errorType'] == 'validation_error') {
                            utils.validationErrOutput(messages);
                        }  else if (messages['errorType'] == 'general_error') {
                            utils.showModal(messages['errorMessage']);
                        } 
                    }
                });
        }
    }
}
let specAtbFields = {
    default: `  <input type="hidden" name="special_attribute" value="">
                <input type="hidden" name="special_attribute_value" value="">`,
    'DVD-Disc': `<input type="hidden" name="special_attribute" value="Size">
                <span>Size</span>
                <input type="number" step="0.01" name="special_attribute_value" > GB 
                <span class="input_special_attribute_value"></span><br>
                <p>Please specify size in GB. The value must be a valid number. Use "." as the decimal separator.</p>`,
    Book: `     <input type="hidden" name="special_attribute"               value="Weight">
                <span>Weight</span><input type="number" step="0.01" name="special_attribute_value" class="input_value" > Kg 
                <span class="input_special_attribute_value"></span><br>
                <p>Please specify weight in Kg. The value must be a valid number. Use "." as the decimal separator.</p>`,
    Furniture: `<input type="hidden" name="special_attribute" value="Dimensions">
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
}

export { Add };