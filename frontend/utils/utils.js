/* eslint-disable linebreak-style */
export function getHash() {
  return window.location.hash || '#home';
}

export function showModal(message) {
  const modalTextDiv = document.querySelector('.modal-text');
  const modalContainer = document.querySelector('.modal');

  modalTextDiv.innerHTML = message;
  modalContainer.style.display = 'block';

  document.querySelector('.close-modal-btn').addEventListener('click', () => {
    modalContainer.style.display = 'none';
    modalTextDiv.innerHTML = '';
  });
  document.addEventListener('click', (e) => {
    if (e.target === modalContainer) {
      modalContainer.style.display = 'none';
      modalTextDiv.innerHTML = '';
    }
  });
}

export function validationErrOutput(messages) {
  Object.keys(messages).forEach((key) => {
    if (document.querySelector(`.input_${key}`)) {
      document
        .querySelector(`.input_${key}`)
        .insertAdjacentHTML(
          'afterend',
          `<span class="input-error-message">${messages[key]}</span>`
        );
    }
  });
}

export function requestErrorHandler(err) {
  const output = {};
  if (err.request && !err.response) {
    if (err.code === 'ECONNABORTED') {
      output.message = 'Error connecting to server. Request timed out.';
    } else {
      output.message = 'Error: sending request failed.';
    }
  } else if (err.response) {
    if (err.response.status === 404) {
      output.message = 'Resource not found.';
    } else if (err.response.data.validationError) {
      output.validationError = true;
      output.messages = err.response.data.validationMessages;
    } else {
      output.message = err.response.data.message;
    }
  } else {
    output.message = `Oops! Something went wrong: ${err.message}`;
  }
  output.error = true;
  return output;
}
