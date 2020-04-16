
let getProducts = async () => {
    const url = 'http://localhost/sw_edu/api/read.php';
    return axios.get(url)
        .then(response => { return response.data })
        .catch(e => { console.log("Error retrieving products:" + e) })
}

let Home = {
    render: async () => {
        let products = await getProducts();
        let view = `<form id="productCardForm" method="post">
                        <div id="product-grid">
                            ${ products.map(product =>
            `<div class="product-card">
                                <input type="checkbox" class="product-checkbox" autocomplete="off" name="selected_sku[]" value="${product.sku}">
                                    <p name="sku">${product.sku}</p>
                                    <h3 name="productName">${product.name}</h3>
                                    <p name="price">Price: ${product.price} €</p>
                                    </div>`).join(' ')
            }    
                        </div>
                    </form>
                    <div class="col">
                        <button type="submit" id="deleteBtn" value="delete" form="productCardForm" class="delete-button btn btn-warning">Delete</button>
                    </div>`

        return view;
    },
    afterRender: async (router) => {
        //Delete button show/hide logic
        let checkboxes = document.getElementsByClassName('product-checkbox');
        const checkboxesArr = [...checkboxes];
        checkboxesArr.forEach(box => box.addEventListener("change", function () {
            if (checkboxesArr.filter(box => box.checked === true).length > 0) {
                document.getElementById("deleteBtn").style.display = "block";
            } else {
                document.getElementById("deleteBtn").style.display = "none";
            };
        }));

        //Product deletion logic
        let productDeleteForm = document.getElementById('productCardForm');
        productDeleteForm.addEventListener('submit', (event) => {
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
            axios.delete('http://localhost/sw_edu/api/delete.php', { data: json }).then((response) => {
                console.log(response);
                router();
            }).catch(error => {
                console.log(error);
            });
        });
    }
}

export { Home };