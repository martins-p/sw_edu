//import {productSpecAtbFields} from "../pages/Add.js"

//Watch for product type selection change
const changeSpecialAttributeField = () => {
    document.getElementById("select-product-type").addEventListener("change", () => {
        var list = document.getElementById("select-product-type");
        var selection = list.options[list.selectedIndex].text;
        document.getElementById("special-attribute-field").innerHTML = productSpecAtbFields[selection];
    })
}

//Form handling logic
let productAddFormHadler = () => {
    productAddForm = document.querySelector('#addProductForm');
    productAddForm.addEventListener('submit', (e) => {
        e.preventDefault();
        new FormData(productAddForm);
    });
    productAddForm.onformdata = (e) => {
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
    }
}

//Checkbox scanner
function showDeleteBtn(className) {
    var checkboxes = document.getElementsByClassName(className);
    const checkboxesArr = [...checkboxes];
    checkboxesArr.forEach(box => box.addEventListener("change", function () {
        if (checkboxesArr.filter(box => box.checked === true).length > 0) {
            document.getElementById("deleteBtn").style.display = "block";
        } else {
            document.getElementById("deleteBtn").style.display = "none";
        };
    }));

}


/* export {changeSpecialAttributeField};
export {productAddFormHadler};
export {showDeleteBtn}; */