import { uploadForm, fileInput, hashtagInput, descriptionInput } from './form-api.js';

const uploadOverlay = document.querySelector('.img-upload__overlay'); // Блок формы
const closeButton = uploadOverlay.querySelector('.img-upload__cancel'); // Крестик

let currentScale = 100;
const scaleSmaller = uploadOverlay.querySelector('.scale__control--smaller');
const scaleBigger = uploadOverlay.querySelector('.scale__control--bigger');
const scaleValue = uploadOverlay.querySelector('.scale__control--value');

export let currentEffect = 'none';
const effectRadios = document.querySelectorAll('input[name="effect"]');
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

  if (hashtags.length > 5) {
    return false; // Максимум 5 хэштегов
  }
  return hashtags.every((tag) => hashtagPattern.test(tag)) &&
    new Set(hashtags).size === hashtags.length; // Проверка на уникальность
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
    const imageUrl = URL.createObjectURL(file); // Создаём временный URL для изображения
    previewImage.src = imageUrl; // Устанавливаем путь для previewImage
    uploadOverlay.classList.remove('hidden'); // Показываем форму
    document.body.classList.add('modal-open'); // Добавляем класс modal-open

    // Установка начального состояния
    currentEffect = 'none';
    updateSlider(currentEffect); // Сбрасываем слайдер в состояние для "оригинал"
    effectLevelValue.value = ''; // Очищаем значение эффекта
    previewImage.style.filter = ''; // Сбрасываем фильтры
    pristine.reset(); // Сбрасываем ошибки валидации
    applyScale(currentScale); // Применяем начальный масштаб
  }
});

// --------- Функция для применения масштаба ---------

export function applyScale(scale) {
  scaleValue.value = `${scale}%`; // Исправлено: корректный синтаксис
  const scaleFactor = scale / 100;
  previewImage.style.transform = `scale(${scaleFactor})`; // Исправлено: корректный синтаксис
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

function applyEffect(effect, value) {
  const imageElement = document.querySelector('.img-upload__preview img');
  imageElement.className = ''; // Сбрасываем предыдущий класс эффекта
  previewImage.style.filter = ''; // Сбрасываем фильтр

  if (effect !== 'none') {
    imageElement.classList.add(`effects__preview--${effect}`); // Исправлено: использование шаблонной строки
    const filterValue = value / 100; // Пример нормализации значения слайдера
    switch (effect) {
      case 'chrome':
        previewImage.style.filter = `grayscale(${filterValue})`; // Исправлено
        break;
      case 'sepia':
        previewImage.style.filter = `sepia(${filterValue})`; // Исправлено
        break;
      case 'marvin':
        previewImage.style.filter = `invert(${filterValue * 100}%)`; // Исправлено
        break;
      case 'phobos':
        previewImage.style.filter = `blur(${filterValue * 3}px)`; // Исправлено
        break;
      case 'heat':
        previewImage.style.filter = `brightness(${1 + filterValue * 2})`; // Исправлено
        break;
    }
  }
}

// Обновление слайдера при переключении фильтра
function updateSlider(effect) {
  if (effect === 'none') {
    effectLevelSlider.classList.add('hidden');
    effectLevelValue.value = 0; // Устанавливаем значение эффекта в 0
    if (effectLevelSlider.noUiSlider) {
      effectLevelSlider.noUiSlider.set(0); // Перемещаем ползунок в 0
    }
    previewImage.style.filter = '';
  } else {
    effectLevelSlider.classList.remove('hidden');
    effectLevelSlider.noUiSlider.updateOptions({
      range: { min: 0, max: 100 },
      start: 100, // Сброс значения слайдера в 100
    });
    effectLevelValue.value = 100; // Устанавливаем начальное значение для эффекта
  }
}

// Обработчик переключения фильтров
effectRadios.forEach((radio) => {
  radio.addEventListener('change', (evt) => {
    currentEffect = evt.target.value;
    updateSlider(currentEffect); // Сбрасываем слайдер в 0 при смене эффекта
    applyEffect(currentEffect, effectLevelSlider.noUiSlider.get());
  });
});

// Обновление эффекта при движении слайдера
effectLevelSlider.noUiSlider.on('update', (values) => {
  const value = Math.round(values[0]);
  effectLevelValue.value = value; // Записываем значение в скрытое поле
  applyEffect(currentEffect, value); // Применяем эффект
});

// --------- Закрытие формы ---------

export function resetForm() {
  uploadForm.reset();
  pristine.reset();
  uploadOverlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  fileInput.value = ''; // Очищаем контрол загрузки файла
  currentScale = 100; // Сбрасываем масштаб
  applyScale(currentScale); // Применяем сброс масштаба
  previewImage.className = ''; // Удаляем классы эффектов
  currentEffect = 'none'; // Устанавливаем эффект в 'оригинал'
  updateSlider(currentEffect); // Сбрасываем слайдер
  previewImage.style.filter = ''; // Удаляем все фильтры
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
