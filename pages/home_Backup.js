import * as utils from '../utils/utils.js'

let getProducts = async () => {
    const url = 'http://localhost/sw_edu/api/read.php';
    return axios.get(url)
        .then(response => { return response.data })
        .catch(e => { 
            window.alert("Error retrieving products");
            return e.response.data;
        })
}

let Home = {

    render: async () => {
        let products = await getProducts();
        console.log (products);
        const generateProductCards = (products) => {
            if (products.error === true) {
                return `<div>No products found</div>`;  
            }
            let productCards = products.map(product =>
                `<div class="product-card">
                    <input type="checkbox" class="product-checkbox" autocomplete="off" name="selected_sku[]" value="${product.sku}">
                        <p name="sku">${product.sku}</p>
                        <h3 name="productName">${product.name}</h3>
                        <p name="price">Price: ${product.price} €</p>
                        <p class="product-attribute">${product.attribute}: ${product.value} ${product.measure_unit}</p>
                </div>`).join(' ');
            return productCards;
        }    
        let view =
            `<div class="col">
                
                </div>
                <form id="productCardForm" method="post">
                    <div id="product-grid">
                        ${generateProductCards(products)}    
                    </div>
                </form>`

        return view;
        },

    afterRender: async (router) => {

        //Delete button show/hide logic       
        let checkboxes = document.getElementsByClassName('product-checkbox');
        const checkboxesArr = [...checkboxes];
        checkboxesArr.forEach(box => box.addEventListener("change", function () {
            if (checkboxesArr.filter(box => box.checked === true).length > 0) {
                if (!document.getElementById('deleteBtn')) {
                    let button = document.createElement("Button");
                    button.setAttribute('type', 'submit');
                    button.setAttribute('id', 'deleteBtn');
                    button.setAttribute('form', 'productCardForm');
                    button.setAttribute('class', 'delete-button btn btn-warning');
                    button.innerHTML = "Delete";
                    document.getElementById('product-grid').appendChild(button);
                }
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
            let skus = [];
            checkboxes.forEach((checkbox) => {
                skus.push(checkbox.value)
            });

            let data = {
                'skus': skus
            }

            var json = JSON.stringify(data);
            axios.delete('http://localhost/sw_edu/api/delete.php', { data: json }).then(() => {
                this.render();
                //await this.afterRender(); 
                //router();
            }).catch(error => {
                
               // utils.showModal(error.response.data.errorMessage);
                
            });
        });
    }
}

export { Home };