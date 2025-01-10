const EffectSetups = {
  none: {
    filter: '',
    min: 0,
    max: 100,
    step: 1,
    unit: ''
  },
  chrome: {
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  sepia: {
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: ''
  },
  marvin: {
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%'
  },
  phobos: {
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px'
  },
  heat: {
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: ''
  }
};

const DEFAULT_EFFECT = EffectSetups.none;
let chosenEffect = DEFAULT_EFFECT;

const updateEffect = (effectLevelSlider, imgUploadPreview, effectLevel, effectLevelValue) => {
  if (chosenEffect === EffectSetups.none) {
    imgUploadPreview.style.filter = '';
    effectLevel.classList.add('hidden');
  } else {
    effectLevel.classList.remove('hidden');
    const effectValue = effectLevelSlider.noUiSlider.get();
    imgUploadPreview.style.filter = `${chosenEffect.filter}(${effectValue}${chosenEffect.unit})`;
    effectLevelValue.value = parseFloat(effectValue).toFixed(2);
  }
};

const onEffectChange = (evt, effectLevelSlider) => {
  if (evt.target.matches('input[type="radio"]')) {
    chosenEffect = EffectSetups[evt.target.value];
    effectLevelSlider.noUiSlider.updateOptions({
      range: {
        min: chosenEffect.min,
        max: chosenEffect.max
      },
      step: chosenEffect.step,
      start: chosenEffect.max
    });
    updateEffect(effectLevelSlider, document.querySelector('.img-upload__preview img'), document.querySelector('.img-upload__effect-level'), document.querySelector('.effect-level__value'));
  }
};

const resetEffects = (effectLevelSlider) => {
  chosenEffect = DEFAULT_EFFECT;
  effectLevelSlider.noUiSlider.updateOptions({
    range: {
      min: DEFAULT_EFFECT.min,
      max: DEFAULT_EFFECT.max
    },
    step: DEFAULT_EFFECT.step,
    start: DEFAULT_EFFECT.max
  });
  updateEffect(effectLevelSlider, document.querySelector('.img-upload__preview img'), document.querySelector('.img-upload__effect-level'), document.querySelector('.effect-level__value'));
};

export { updateEffect, onEffectChange, resetEffects };
