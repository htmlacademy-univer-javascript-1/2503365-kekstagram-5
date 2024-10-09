function stringCheck(text, length) {
  return text.length <= length;
}
stringCheck('аааа', 5);
stringCheck('аааа', 2);


// палиндром функция
function isPalindrom(word) {
  word = word.toLowerCase().replace(/\s+/g, '');
  return word === word.split('').reverse().join('');
}
isPalindrom('топот');
isPalindrom('барабан');
isPalindrom('А роза упала на лапу Азора');

// числовая функция
function takeInteger(text) {
  let massive = text.split('');
  let result = '';

  for (let i = 0; i < massive.length; i++) {
    if (!isNaN(massive[i]) && massive[i] !== ' ') {
      result += massive[i];
    }
  }

  return Number(result);
}

takeInteger('привет 1233');
