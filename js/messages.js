const showMessage = (messageElement, closeButtonClass) => {
  const body = document.querySelector('body');
  body.append(messageElement);
  document.addEventListener('keydown', onDocumentKeydown);
  body.addEventListener('click', onBodyCLick);
  messageElement.querySelector(closeButtonClass).addEventListener('click', hideMessage);
};

const showSuccessMessage = (successMessage) => {
  showMessage(successMessage, '.success__button');
};

const showErrorMessage = (errorMessage, message) => {
  const errorElement = errorMessage.cloneNode(true);
  errorElement.querySelector('.error__title').textContent = message;
  errorElement.querySelector('.error__button').textContent = 'Закрыть';
  showMessage(errorElement, '.error__button');
};

function onDocumentKeydown(evt) {
  if (evt.key === 'Escape') {
    hideMessage();
  }
}

function hideMessage() {
  const messageElement = document.querySelector('.success') || document.querySelector('.error');
  if (messageElement) {
    messageElement.remove();
    document.removeEventListener('keydown', onDocumentKeydown);
    document.querySelector('body').removeEventListener('click', onBodyCLick);
  }
}

function onBodyCLick(evt) {
  if (
    evt.target.closest('.success__inner') || evt.target.closest('.error__inner')
  ) {
    return;
  }
  hideMessage();
}

export { showSuccessMessage, showErrorMessage, hideMessage, onDocumentKeydown };
