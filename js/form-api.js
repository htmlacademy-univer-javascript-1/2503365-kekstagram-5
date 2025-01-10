import { photos } from './photos.js';
// import { renderThumbnails } from './thumbnails.js';
import { pristine, currentEffect, resetForm } from './form.js';

export const uploadForm = document.querySelector('.img-upload__form');
export const fileInput = uploadForm.querySelector('.img-upload__input');
export const hashtagInput = uploadForm.querySelector('.text__hashtags');
export const descriptionInput = uploadForm.querySelector('.text__description');


// --------- Форма и создание поста ---------

uploadForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (isValid) {
    const formData = new FormData(uploadForm);
    const submitButton = uploadForm.querySelector('.img-upload__submit');
    submitButton.disabled = true; // Блокируем кнопку

    fetch('https://29.javascript.htmlacademy.pro/kekstagram', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (response.ok) {
          // Добавляем новую фотографию с эффектом
          const newPhoto = {
            id: photos.length + 1,
            url: URL.createObjectURL(fileInput.files[0]),
            description: descriptionInput.value || 'Новое фото',
            likes: 0,
            comments: [],
            effect: currentEffect // Сохраняем текущий эффект
          };
          photos.push(newPhoto); // Добавляем фото в массив
          // renderThumbnails([newPhoto]); // Добавляем миниатюру

          showSuccessMessage(); // Показ успешного сообщения
          resetForm();
        } else {
          throw new Error('Ошибка отправки данных');
        }
      })
      .catch(() => {
        showErrorMessage(); // Показ сообщения об ошибке
      })
      .finally(() => {
        submitButton.disabled = false; // Разблокируем кнопку
      });
  }
});

// --------- Обработчики успеха и ошибок ---------

function showSuccessMessage() {
  const successTemplate = document.querySelector('#success').content;
  const successElement = successTemplate.cloneNode(true);
  document.body.appendChild(successElement);

  const closeButton = document.querySelector('.success__button');
  const successOverlay = document.querySelector('.success');

  function closeSuccess() {
    successOverlay.remove();
    document.removeEventListener('keydown', onKeydownSuccess);
    document.removeEventListener('click', onClickOutsideSuccess);
  }

  function onKeydownSuccess(evt) {
    if (evt.key === 'Escape') {
      closeSuccess();
    }
  }

  function onClickOutsideSuccess(evt) {
    if (evt.target === successOverlay) {
      closeSuccess();
    }
  }

  closeButton.addEventListener('click', closeSuccess);
  document.addEventListener('keydown', onKeydownSuccess);
  document.addEventListener('click', onClickOutsideSuccess);
}

function showErrorMessage() {
  const errorTemplate = document.querySelector('#error').content;
  const errorElement = errorTemplate.cloneNode(true);
  document.body.appendChild(errorElement);

  const closeButton = document.querySelector('.error__button');
  const errorOverlay = document.querySelector('.error');

  function closeError() {
    errorOverlay.remove();
    document.removeEventListener('keydown', onKeydownError);
    document.removeEventListener('click', onClickOutsideError);
  }

  function onKeydownError(evt) {
    if (evt.key === 'Escape') {
      closeError();
    }
  }

  function onClickOutsideError(evt) {
    if (evt.target === errorOverlay) {
      closeError();
    }
  }

  closeButton.addEventListener('click', closeError);
  document.addEventListener('keydown', onKeydownError);
  document.addEventListener('click', onClickOutsideError);
}
