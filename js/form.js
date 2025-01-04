import { uploadForm, fileInput, hashtagInput, descriptionInput } from './form-api.js';

const uploadOverlay = document.querySelector('.img-upload__overlay'); // Блок формы
const closeButton = uploadOverlay.querySelector('.img-upload__cancel'); // Крестик

let currentScale = 100;
const scaleSmaller = uploadOverlay.querySelector('.scale__control--smaller');
const scaleBigger = uploadOverlay.querySelector('.scale__control--bigger');
const scaleValue = uploadOverlay.querySelector('.scale__control--value');

export let currentEffect = 'none';
const effectRadios = document.querySelectorAll('input[name="effect"]');
const effectLevelSliderContainer = document.querySelector('.effect-level'); // Контейнер слайдера
const effectLevelSlider = document.querySelector('.effect-level__slider');
const effectLevelValue = document.querySelector('.effect-level__value');

// Инициализация Pristine
export const pristine = new Pristine(uploadForm, {
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

  return hashtags.length <= 5 &&
    hashtags.every((tag) => hashtagPattern.test(tag)) &&
    new Set(hashtags).size === hashtags.length; // Уникальность
}

pristine.addValidator(
  hashtagInput,
  validateHashtags,
  'Хэш-теги должны начинаться с #, быть не длиннее 20 символов и без повторений. Максимум 5 хэштегов.'
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

const previewImage = uploadOverlay.querySelector('.img-upload__preview img');
fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if (file) {
    const imageUrl = URL.createObjectURL(file);
    previewImage.src = imageUrl;
    uploadOverlay.classList.remove('hidden');
    document.body.classList.add('modal-open');

    // Установка начального состояния
    currentEffect = 'none';
    updateSlider(currentEffect);
    effectLevelValue.value = '';
    previewImage.style.filter = '';
    pristine.reset();
    applyScale(currentScale);
  }
});

// --------- Функция для применения масштаба ---------
export function applyScale(scale) {
  scaleValue.value = `${scale}%`;
  const scaleFactor = scale / 100;
  previewImage.style.transform = `scale(${scaleFactor})`;
}

scaleSmaller.addEventListener('click', () => {
  if (currentScale > 25) {
    currentScale -= 25;
    applyScale(currentScale);
  }
});

scaleBigger.addEventListener('click', () => {
  if (currentScale < 100) {
    currentScale += 25;
    applyScale(currentScale);
  }
});

// --------- Слайдер и эффекты ---------
noUiSlider.create(effectLevelSlider, {
  range: {
    min: 0,
    max: 100,
  },
  start: 100,
  step: 1,
  connect: 'lower',
});

effectLevelSliderContainer.style.display = 'none'; // Скрываем слайдер по умолчанию

function applyEffect(effect, value) {
  const filterValue = value / 100;
  switch (effect) {
    case 'chrome':
      previewImage.style.filter = `grayscale(${filterValue})`;
      break;
    case 'sepia':
      previewImage.style.filter = `sepia(${filterValue})`;
      break;
    case 'marvin':
      previewImage.style.filter = `invert(${value}%)`;
      break;
    case 'phobos':
      previewImage.style.filter = `blur(${(value * 3) / 100}px)`;
      break;
    case 'heat':
      previewImage.style.filter = `brightness(${1 + (filterValue * 2)})`;
      break;
    case 'none':
    default:
      previewImage.style.filter = '';
      break;
  }
}

// Обновление слайдера при переключении фильтра
function updateSlider(effect) {
  if (effect === 'none') {
    effectLevelSliderContainer.style.display = 'none';
    effectLevelValue.value = '';
    previewImage.style.filter = '';
  } else {
    effectLevelSliderContainer.style.display = 'block';
    effectLevelSlider.noUiSlider.updateOptions({
      range: { min: 0, max: 100 },
      start: 100,
    });
    effectLevelValue.value = 100;
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
  effectLevelValue.value = value;
  applyEffect(currentEffect, value);
});

// --------- Закрытие формы ---------
export function resetForm() {
  uploadForm.reset();
  pristine.reset();
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  fileInput.value = '';
  currentScale = 100;
  applyScale(currentScale);
  previewImage.className = '';
  currentEffect = 'none';
  updateSlider(currentEffect);
  previewImage.style.filter = '';
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
