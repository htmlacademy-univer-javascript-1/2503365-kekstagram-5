
export function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), timeoutDelay);
  };
};
