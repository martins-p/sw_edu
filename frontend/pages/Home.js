/* eslint-disable linebreak-style */
import * as utils from '../utils/utils.js';

const getProducts = async () => {
  const url = 'http://localhost:80/api/read.php';
  return axios
    .get(url, { timeout: 4000 })
    .then((response) => response.data)
    .catch((err) => {
      const errorData = utils.requestErrorHandler(err);
      return errorData;
    });
};

const Home = {
  preRender: () => /*html*/ `
            <div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                </div>
            </div>`,

  render: async () => {
    const receivedData = await getProducts();
    const generateProductCards = (data) => {
      if (data.error) {
        return `<div>${data.message}</div>`;
      }

      const productCards = data
        .map(
          (product) => /*html*/ `
                <div class="product-card">
                    <input type="checkbox" class="product-checkbox" autocomplete="off" name="selected_sku[]" value="${product.sku}">
                        <p name="sku">${product.sku}</p>
                        <h3 name="productName">${product.name}</h3>
                        <p name="price">Price: ${product.price} €</p>
                        <p class="product-attribute">${product.attribute}: ${product.value} ${product.measure_unit}</p>
                </div>`,
        )
        .join(' ');

      return productCards;
    };

    const view = /*html*/ `
            <form id="productCardForm" method="post">
                <div id="product-grid">
                    ${generateProductCards(receivedData)}
                    <button type="submit" id="deleteBtn" value="delete" form="productCardForm" class="delete-button btn btn-warning">Delete</button>    
                </div>
            </form>`;

    return view;
  },

  afterRender: () => {
    //  Delete button show/hide logic
    const checkboxes = [...document.getElementsByClassName('product-checkbox')];
    checkboxes.forEach((box) => box.addEventListener('change', () => {
      if (checkboxes.filter((box) => box.checked === true).length > 0) {
        document.getElementById('deleteBtn').style.display = 'block';
      } else {
        document.getElementById('deleteBtn').style.display = 'none';
      }
    }),
    );

    //  Product deletion logic
    const productDeleteForm = document.getElementById('productCardForm');
    productDeleteForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const checkboxes = document.querySelectorAll(
        'input[class="product-checkbox"]:checked'
      );
      if (!checkboxes.length > 0) {
        utils.showModal('No checkboxes selected');
        return;
      }
      const skuArray = [];
      checkboxes.forEach((checkbox) => {
        skuArray.push(checkbox.value);
      });
      const data = {
        skuArray,
      };

      const json = JSON.stringify(data);
      axios
        .delete('http://localhost:80/api/delete.php', {
          data: json,
          timeout: 4000,
        })
        .then(async () => {
          document.getElementById('content-container').innerHTML = await Home.render();
          Home.afterRender();
        })
        .catch((err) => {
          const errorData = utils.requestErrorHandler(err);
          utils.showModal(errorData.message);
        });
    });
  },
};

export { Home };
