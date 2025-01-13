import { sendData } from './api.js';
import { isEscapeKey } from './util.js';
import { FormErrors, validateDescriptionLength, validateHashtagCount, validateHashtags, validateUniqueHashtags } from './validation.js';
import { updateEffect, onEffectChange, resetEffects } from './effects.js';
import { onScaleControlSmallerClick, onScaleControlBiggerClick, resetScale } from './scale.js';
import { showSuccessMessage, showErrorMessage, hideMessage, onDocumentKeydown } from './messages.js';

const FILE_TYPES = ['jpg', 'jpeg', 'png'];

const form = document.querySelector('.img-upload__form');
const fileField = form.querySelector('.img-upload__input');
const overlay = form.querySelector('.img-upload__overlay');
const body = document.body;
const hashtagsField = form.querySelector('.text__hashtags');
const descriptionField = form.querySelector('.text__description');
const closeButton = form.querySelector('.img-upload__cancel');
const scaleControlSmaller = form.querySelector('.scale__control--smaller');
const scaleControlBigger = form.querySelector('.scale__control--bigger');
const scaleControlValue = form.querySelector('.scale__control--value');
const imgUploadPreview = form.querySelector('.img-upload__preview img');
const effectLevelValue = form.querySelector('.effect-level__value');
const effectLevelSlider = form.querySelector('.effect-level__slider');
const effectLevel = form.querySelector('.img-upload__effect-level');
const submitButton = form.querySelector('.img-upload__submit');
const successMessage = document.querySelector('#success').content.querySelector('.success');
const errorMessage = document.querySelector('#error').content.querySelector('.error');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
});

const isCursorInInputField = () => document.activeElement === hashtagsField || document.activeElement === descriptionField;

const formPressESCHandler = (evt) => {
  if (isEscapeKey(evt) && !isCursorInInputField()) {
    evt.preventDefault();
    // eslint-disable-next-line no-use-before-define
    closeForm();
  }
};

const closeForm = () => {
  form.reset();
  pristine.reset();
  fileField.value = '';
  overlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', formPressESCHandler);
  resetScale(scaleControlValue, imgUploadPreview);
  resetEffects(effectLevelSlider);
  hideMessage();
};

const isValidType = (file) => {
  const fileName = file.name.toLowerCase();
  return FILE_TYPES.some((it) => fileName.endsWith(it));
};

const showForm = () => {
  overlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', formPressESCHandler);
};

const formFileIsSelectedHandler = (evt) => {
  const file = evt.target.files[0];
  if (file && isValidType(file)) {
    const reader = new FileReader();

    reader.onload = () => {
      imgUploadPreview.src = reader.result;
      const effectPreviews = document.querySelectorAll('.effects__preview');
      effectPreviews.forEach((preview) => {
        preview.style.backgroundImage = `url(${reader.result})`;
      });
      showForm();
    };

    reader.readAsDataURL(file);
  }
};

const onFormSubmit = (evt) => {
  evt.preventDefault();
  const isValid = pristine.validate();
  if (!isValid) {
    return;
  }
  submitButton.disabled = true;

  const formData = new FormData(evt.target);

  sendData(formData)
    .then(() => {
      closeForm();
      showSuccessMessage(successMessage);
    })
    .catch((error) => {
      showErrorMessage(errorMessage, error.message);
    })
    .finally(() => {
      submitButton.disabled = false;
    });
};

fileField.addEventListener('change', formFileIsSelectedHandler);
closeButton.addEventListener('click', closeForm);
scaleControlSmaller.addEventListener('click', () => onScaleControlSmallerClick(scaleControlValue, imgUploadPreview));
scaleControlBigger.addEventListener('click', () => onScaleControlBiggerClick(scaleControlValue, imgUploadPreview));
document.addEventListener('keydown', onDocumentKeydown);

noUiSlider.create(effectLevelSlider, {
  range: {
    min: 0,
    max: 100
  },
  start: 100,
  step: 1,
  connect: 'lower'
});

effectLevelSlider.noUiSlider.on('update', () => updateEffect(effectLevelSlider, imgUploadPreview, effectLevel, effectLevelValue));
document.querySelector('.effects__list').addEventListener('change', (evt) => onEffectChange(evt, effectLevelSlider));

pristine.addValidator(descriptionField, validateDescriptionLength, FormErrors.LONG_DESCRIPTION);
pristine.addValidator(hashtagsField, validateUniqueHashtags, FormErrors.UNIQUE_HASHTAGS);
pristine.addValidator(hashtagsField, validateHashtags, FormErrors.INCORRECT_HASHTAG);
pristine.addValidator(hashtagsField, validateHashtagCount, FormErrors.COUNT_EXCEEDED);

form.addEventListener('submit', onFormSubmit);

document.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('error__button')) {
    hideMessage();
  }
});
