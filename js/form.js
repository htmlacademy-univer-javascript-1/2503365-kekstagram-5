import { photos } from './main.js';
import { renderThumbnails } from './thumbnails.js';


const uploadForm = document.querySelector('.img-upload__form');
const hashtagInput = uploadForm.querySelector('.text__hashtags');
const descriptionInput = uploadForm.querySelector('.text__description');
const fileInput = uploadForm.querySelector('.img-upload__input');
const uploadOverlay = document.querySelector('.img-upload__overlay'); // Блок формы
const closeButton = uploadOverlay.querySelector('.img-upload__cancel'); // Крестик

const scaleSmaller = uploadOverlay.querySelector('.scale__control--smaller');
const scaleBigger = uploadOverlay.querySelector('.scale__control--bigger');
const scaleValue = uploadOverlay.querySelector('.scale__control--value');

const effectRadios = document.querySelectorAll('input[name="effect"]');
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');

let currentScale = 100;
let currentEffect = 'none';

// Инициализация Pristine
const pristine = new Pristine(uploadForm, {
  classTo: 'img-upload__form',
  errorTextParent: 'img-upload__form',
  errorTextClass: 'form__error',
}, true);

// Проверка хэш-тегов
function validateHashtags(value) {
  if (!value) {
    return true; // Поле не обязательное
  }
  const hashtags = value.trim().toLowerCase().split(/\s+/);
  const hashtagPattern = /^#[a-zа-яё0-9]{1,19}$/;

  if (hashtags.length > 5) {
    return false; // Максимум 5 хэштегов
  }
  return hashtags.every((tag) => hashtagPattern.test(tag)) &&
    new Set(hashtags).size === hashtags.length; // Проверка дубликатов
}

pristine.addValidator(
  hashtagInput,
  validateHashtags,
  'Хэш-теги должны начинаться с #, быть не длиннее 20 символов и без повторений. Максимум 5 хэш-тегов.'
);

// Валидация комментария
function validateDescription(value) {
  return value.length <= 140;
}

pristine.addValidator(
  descriptionInput,
  validateDescription,
  'Комментарий не должен превышать 140 символов.'
);

const previewImage = uploadOverlay.querySelector('.img-upload__preview img'); // Пример выбора превью
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    previewImage.src = imageUrl; // Обновляем изображение
    uploadOverlay.classList.remove('hidden'); // Показываем форму
    document.body.classList.add('modal-open'); // Добавляем класс modal-open

    // Освобождение памяти после подгрузки
    previewImage.onload = () => {
      URL.revokeObjectURL(imageUrl);
    };
  }
});

// Функция для применения масштаба
function applyScale(scale) {
  scaleValue.value = `${scale}%`;
  const scaleFactor = scale / 100;
  previewImage.style.transform = `scale(${scaleFactor})`;
}

// Уменьшение масштаба
scaleSmaller.addEventListener('click', () => {
  if (currentScale > 25) {
    currentScale -= 25;
    applyScale(currentScale);
  }
});

// Увеличение масштаба
scaleBigger.addEventListener('click', () => {
  if (currentScale < 100) {
    currentScale += 25;
    applyScale(currentScale);
  }
});

// Инициализация слайдера
noUiSlider.create(effectLevelSlider, {
  range: {
    min: 0,
    max: 100,
  },
  start: 100,
  step: 1,
  connect: 'lower',
});

// Применение эффекта к изображению

function applyEffect(effect) {
  const imageElement = document.querySelector('.img-upload__preview img');
  currentEffect = effect; // Сохраняем активный эффект
  imageElement.className = ''; // Удаляем предыдущий класс эффекта
  if (effect !== 'none') {
    imageElement.classList.add(`effects__preview--${effect}`); // Применяем новый класс эффекта
  }
}


// Обновление слайдера при переключении фильтра
function updateSlider(effect) {
  if (effect === 'none') {
    effectLevelSlider.classList.add('hidden');
    effectLevelValue.value = '';
    previewImage.style.filter = '';
  } else {
    effectLevelSlider.classList.remove('hidden');
    effectLevelSlider.noUiSlider.updateOptions({
      range: { min: 0, max: 100 },
      start: 100,
    });
    effectLevelValue.value = 100; // Устанавливаем начальное значение
  }
}

// Обработчик переключения фильтров
effectRadios.forEach((radio) => {
  radio.addEventListener('change', (evt) => {
    currentEffect = evt.target.value;
    updateSlider(currentEffect);
    applyEffect(currentEffect, effectLevelSlider.noUiSlider.get());
  });
});

// Обновление эффекта при движении слайдера
effectLevelSlider.noUiSlider.on('update', (values) => {
  const value = Math.round(values[0]);
  effectLevelValue.value = value; // Записываем значение в скрытое поле
  applyEffect(currentEffect, value); // Применяем эффект
});


function resetForm() {
  uploadForm.reset();
  pristine.reset();
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  fileInput.value = ''; // Очищаем контрол загрузки файла
  currentScale = 100; // Сбрасываем масштаб
  applyScale(currentScale);
  previewImage.className = ''; // Удаляем классы эффектов
}

// Закрытие формы по Esc
document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && document.activeElement !== hashtagInput && document.activeElement !== descriptionInput) {
    resetForm();
  }
});

// Закрытие формы по клику на крестик
closeButton.addEventListener('click', () => {
  resetForm();
});

// Обработчик отправки формы
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
          renderThumbnails([newPhoto]); // Добавляем миниатюру
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


function showSuccessMessage() {
  const successTemplate = document.querySelector('#success').content;
  const successElement = successTemplate.cloneNode(true);
  document.body.appendChild(successElement);

  const closeButton = document.querySelector('.success__button');
  const successOverlay = document.querySelector('.success');

  function closeSuccess() {
    successOverlay.remove();
  }

  closeButton.addEventListener('click', closeSuccess);
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      closeSuccess();
    }
  });
  document.addEventListener('click', (evt) => {
    if (evt.target === successOverlay) {
      closeSuccess();
    }
  });
}

function showErrorMessage() {
  const errorTemplate = document.querySelector('#error').content;
  const errorElement = errorTemplate.cloneNode(true);
  document.body.appendChild(errorElement);

  const closeButton = document.querySelector('.error__button');
  const errorOverlay = document.querySelector('.error');

  function closeError() {
    errorOverlay.remove();
  }

  closeButton.addEventListener('click', closeError);
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      closeError();
    }
  });
  document.addEventListener('click', (evt) => {
    if (evt.target === errorOverlay) {
      closeError();
    }
  });
}
