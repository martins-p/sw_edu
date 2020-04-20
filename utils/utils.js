
function showModal(message) {
    document.getElementsByClassName('modal-text')[0].innerHTML = message;
    console.log(document.getElementsByClassName('modal')[0]);
    document.getElementsByClassName('modal')[0].style.display = 'block';
    document.getElementsByClassName('close')[0].addEventListener('click', ( () => {
        document.getElementsByClassName('modal')[0].style.display = 'none';
        document.getElementsByClassName('modal-text')[0].innerHTML = "";
    }));
    document.addEventListener("click", (e) => {
        var targetElement = document.getElementsByClassName('modal')[0];
        if (targetElement = e.target) {
            document.getElementsByClassName('modal')[0].style.display = 'none';
            document.getElementsByClassName('modal-text')[0].innerHTML = "";
        }

    });
}

function validationErrOutput(messages) {
    
        for(let property in messages)  {
            if (messages[property] !== null && messages[property] !== '' && property !== 'errType' && property !== "special_attribute") {
                document.querySelector('.input_' + property).insertAdjacentHTML('afterend', '<span class="input-error-message">' + messages[property] + '</span>');
            }
        };
    //}
};

export {showModal};
export {validationErrOutput}