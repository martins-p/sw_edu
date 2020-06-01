/* eslint-disable linebreak-style */
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
  for (let property in messages) {
    if (
      messages[property] !== null &&
      messages[property] !== '' &&
      property !== 'error' &&
      property !== 'validationError' &&
      property !== 'special_attribute'
    ) {
      if (document.querySelector('.input_' + property)) {
        document
          .querySelector('.input_' + property)
          .insertAdjacentHTML(
            'afterend',
            '<span class="input-error-message">' +
              messages[property] +
              '</span>'
          );
      }
    }
  }
}

export function getHash() {
  return window.location.hash || '#home';
}

export function requestErrorHandler(err) {
  if (err.request) {
    if (err.code === 'ECONNABORTED') {
      return {
        error: true,
        message: 'Error connecting to server. Request timed out.',
      };
    }
    return {
      error: true,
      message: 'Error: sending request failed.',
    };
  }
  switch (err.response.status) {
    case 404:
      return {
        error: true,
        message: 'Server not found.',
      };
    case 400:
      if (err.response.data.validationError) {
        return err.response.data;
      }
      return {
        error: true,
        message: err.response.data,
      };
    default:
      return {
        error: true,
        message: err.response.data.message,
      };
  }
}
