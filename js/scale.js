const SCALE_STEP = 25;
const MIN_SCALE = 25;
const MAX_SCALE = 100;
const DEFAULT_SCALE = 100;

const updateScale = (value, scaleControlValue, imgUploadPreview) => {
  scaleControlValue.value = `${value}%`;
  imgUploadPreview.style.transform = `scale(${value / 100})`;
};

const onScaleControlSmallerClick = (scaleControlValue, imgUploadPreview) => {
  const currentValue = parseInt(scaleControlValue.value, 10);
  const newValue = Math.max(currentValue - SCALE_STEP, MIN_SCALE);
  updateScale(newValue, scaleControlValue, imgUploadPreview);
};

const onScaleControlBiggerClick = (scaleControlValue, imgUploadPreview) => {
  const currentValue = parseInt(scaleControlValue.value, 10);
  const newValue = Math.min(currentValue + SCALE_STEP, MAX_SCALE);
  updateScale(newValue, scaleControlValue, imgUploadPreview);
};

const resetScale = (scaleControlValue, imgUploadPreview) => {
  updateScale(DEFAULT_SCALE, scaleControlValue, imgUploadPreview);
};

export { updateScale, onScaleControlSmallerClick, onScaleControlBiggerClick, resetScale };
