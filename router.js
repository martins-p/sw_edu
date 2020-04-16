function select_tab(id) {
    //console.log(id);
    // remove selected class from all buttons
    document.querySelectorAll(".route").forEach(item => item.classList.remove('selected'));
    // select clicked element (visually)
    document.querySelectorAll("#" + id).forEach(item => item.classList.add('selected'));
}

content = {
    "home": homePage,
    "add": addProductPage,
    "contacts": "<h1>404 - Page not found</h1>"
}

function load_content(id) {

    // Content loading
    document.querySelector("#page_container").innerHTML = content[id];
    switch (id) {
        case ("home"):
            document.querySelector("#page_container").addEventListener('load', getProducts().then(function (data) {

                for (i = 0; i < data.length; i++) {
                    createProductCard(data[i], i);
                };
                scanCheckboxes();
            }));

            const deleteProductForm = document.querySelector('#productCardForm');
            deleteProductForm.addEventListener('submit', (e) => {
                e.preventDefault();

                let checkboxes = document.querySelectorAll('input[class="product-checkbox"]:checked');
                let skus = [];
                checkboxes.forEach((checkbox) => {
                    skus.push(checkbox.value)
                });

                let data = {
                    'skus': skus
                }

                var json = JSON.stringify(data);
                console.log(json);
                axios.delete('http://localhost/sw_edu/api/delete.php', { data: json }).then((response) => {
                    console.log(response);
                    onRouteChanged(); //TODO : div reload
                }, (error) => {
                    console.log(error);
                });
            });
            break;
        case ("add"):
            document.addEventListener("load",
                getProductTypes().then(function (data) {

                    for (i = 0; i < data.length; i++) {
                        var option = document.createElement("option");
                        var optionText = document.createTextNode(data[i]);
                        //console.log(optionText);
                        option.appendChild(optionText);
                        document.getElementById("select-product-type").appendChild(option);
                    }
                })
            );
            document.getElementById("select-product-type").addEventListener("change", function () {
                var e = document.getElementById("select-product-type");
                var selection = e.options[e.selectedIndex].text;
                document.getElementById("special-attribute-field").innerHTML = productSpecAtbFields[selection];
            });

            //Form handling logic
            const addProductForm = document.querySelector('#addProductForm');
            addProductForm.addEventListener('submit', (e) => {
                e.preventDefault();

                new FormData(addProductForm);
            });
            addProductForm.onformdata = (e) => {
                console.log('Formdata fired');

                let product = {};
                e.formData.forEach((value, key) => {
                    product[key] = value;
                });
                var json = JSON.stringify(product);
                console.log(json);
                axios.post('http://localhost/sw_edu/api/create.php', json).then((response) => {
                    console.log(response);
                    onRouteChanged();
                }, (error) => {
                    console.log(error);
                });
            };
            break;
        default :
            document.querySelector("#page_container").innerHTML ="<h1>404 - Page not found</h1>";
            break;

    }
};
    function push(event) {
        // Get id attribute of the box or button or link clicked
        let id = event.target.id;
        // Visually select the clicked button/tab/box
        select_tab(id);
        // Update Title in Window's Tab
        document.title = id;
        // Load content for this tab/page
        load_content(id);
        // Finally push state change to the address bar
        window.history.pushState({ id }, `${id}`, `/sw_Edu/${id}`);
    }
    window.onload = event => {
        // Add history push() event when boxes are clicked
        window["home"].addEventListener("click", event => push(event))
        window["add"].addEventListener("click", event => push(event))
        window["contacts"].addEventListener("click", event => push(event))
    }
    // Listen for PopStateEvent (Back or Forward buttons are clicked)
    window.addEventListener("popstate", event => {
        // Grab the history state id
        let stateId = event.state.id;
        // Show clicked id in console (just for fun)
        console.log("stateId = ", stateId);
        // Visually select the clicked button/tab/box
        select_tab(stateId);
        // Load content for this tab/page
        load_content(stateId);
    });

    function createProductCard(product, index) {
        var productCard = document.createElement("div");
        productCard.setAttribute("class", "product-card");
        document.getElementById("product-grid").appendChild(productCard);
        document.getElementsByClassName("product-card")[index].innerHTML = productCardTemplate;

        document.getElementsByName("sku")[index].textContent = product.sku;
        document.getElementsByName("productName")[index].textContent = product.name;
        document.getElementsByName("price")[index].textContent = "Price: " + product.price + " €";
        document.getElementsByClassName("product-checkbox")[index].value = product.sku;
    }

    function getProducts() {
        const url = 'http://localhost/sw_edu/api/read.php';
        return axios.get(url)
            .then(response => { return response.data })
    }

    //Send GET to Prodtypes API
    function getProductTypes() {
        const url = 'http://localhost/sw_edu/api/readCat.php';
        return axios.get(url)
            .then(response => { return response.data })
    }

    function scanCheckboxes() {
        var container = document.getElementById("product-grid");
        var checkboxes = container.getElementsByTagName("input");
        // console.log(checkboxes);
        const checkboxesArr = [...checkboxes];
        //console.log(checkboxesArr);
        checkboxesArr.forEach(box => box.addEventListener("change", function () {
            if (checkboxesArr.filter(e => e.checked === true).length > 0) {
                //console.log(this);
                document.getElementById("deleteBtn").style.display = "block";
            } else {
                document.getElementById("deleteBtn").style.display = "none";
            };
        }));

    }