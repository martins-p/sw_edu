export function showModal(message) {
  let modalTextDiv = document.querySelector(".modal-text");
  let modalContainer = document.querySelector(".modal");

  modalTextDiv.innerHTML = message;
  modalContainer.style.display = "block";

  document.querySelector(".close-modal-btn").addEventListener("click", () => {
    modalContainer.style.display = "none";
    modalTextDiv.innerHTML = "";
  });
  document.addEventListener("click", (e) => {
    if (e.target == modalContainer) {
      modalContainer.style.display = "none";
      modalTextDiv.innerHTML = "";
    }
  });
}

export function validationErrOutput(messages) {
  for (let property in messages) {
    if (
      messages[property] !== null &&
      messages[property] !== "" &&
      property !== "errorType" &&
      property !== "special_attribute"
    ) {
      if (document.querySelector(".input_" + property)) {
        document
          .querySelector(".input_" + property)
          .insertAdjacentHTML(
            "afterend",
            '<span class="input-error-message">' +
              messages[property] +
              "</span>"
          );
      }
    }
  }
}

export function getHash() {
  return window.location.hash || "#home";
}
