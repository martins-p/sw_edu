import * as utils from '../utils/utils.js'

let getProducts = async () => {
    const url = 'http://localhost:80/api/read.php';
    return axios.get(url, {timeout: 200})
        .then(response => { return response.data })
        .catch(e => {
            console.log(e.response.data);
            return e.response.data;
        })
}

let Home = {

    preRender: () => {
        return  /*html*/ `
            <div class="d-flex justify-content-center">
                <div class="spinner-border" role="status">
                </div>
             </div>`;
    },  
    render: async () => {
        let products = await getProducts();
         const generateProductCards = (products) => {

            if (products.error === true) {
                return `<div>${products.message}</div>`;  
            }

            let productCards = products.map(product =>/*html*/ `
                <div class="product-card">
                    <input type="checkbox" class="product-checkbox" autocomplete="off" name="selected_sku[]" value="${product.sku}">
                        <p name="sku">${product.sku}</p>
                        <h3 name="productName">${product.name}</h3>
                        <p name="price">Price: ${product.price} €</p>
                        <p class="product-attribute">${product.attribute}: ${product.value} ${product.measure_unit}</p>
                </div>`).join(' ');
            return productCards;  }  
         
        let view =/*html*/ `
            <form id="productCardForm" method="post">
                <div id="product-grid">
                    ${generateProductCards(products)}
                    <button type="submit" id="deleteBtn" value="delete" form="productCardForm" class="delete-button btn btn-warning">Delete</button>    
                </div>
            </form>`

        return view;
        },

    afterRender: () => {

        //Delete button show/hide logic               
        let checkboxes = [...document.getElementsByClassName('product-checkbox')];
        checkboxes.forEach(box => box.addEventListener("change", function () {
            if (checkboxes.filter(box => box.checked === true).length > 0) {
                document.getElementById('deleteBtn').style.display = 'block';
            } else {
                document.getElementById("deleteBtn").style.display = "none";
            };
        }));

        //Product deletion logic
        let productDeleteForm = document.getElementById('productCardForm');
        productDeleteForm.addEventListener('submit', async (event) => {

            event.preventDefault();

            let checkboxes = document.querySelectorAll('input[class="product-checkbox"]:checked');
            if (!checkboxes.length > 0) {
                utils.showModal("No checkboxes selected");
                return;
            }
            let skuArray = [];
            checkboxes.forEach((checkbox) => {
                skuArray.push(checkbox.value)
            });
            let data = {
                'skuArray': skuArray
            }

            var json = JSON.stringify(data);
            axios.delete('http://localhost:80/api/delete.php', { data: json }).then(async () => {
                document.getElementById("content-container").innerHTML = await Home.render();
                Home.afterRender(); 
            }).catch(error => {
                utils.showModal(error.response.data.errorMessage);             
            });
        });
    }
}

export { Home };