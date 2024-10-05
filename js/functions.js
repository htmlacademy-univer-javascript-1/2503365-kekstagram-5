function stringCheck(text, length) {
  return text.length <= length;
}
console.log(stringCheck('аааа', 5));
console.log(stringCheck('аааа', 2));


// палиндром функция
function isPalindrom(word) {
  return word === word.split('').reverse().join('');
}
console.log(isPalindrom('топот'));
console.log(isPalindrom('барабан'));

// числовая функция

function takeInteger(text) {
  let massive = text.split('');  // Разбиваем строку на массив символов
  let result = '';  // Переменная для хранения результата

  for (let i = 0; i < massive.length; i++) {
    if (!isNaN(massive[i]) && massive[i] !== ' ') {  // Проверяем, является ли символ числом и не является пробелом
      result += massive[i];  // Добавляем цифру к результату
    }
  }

  return Number(result);  // Преобразуем строку чисел в число
}

console.log(takeInteger('привет 1233'));  // Теперь вернёт 1233
