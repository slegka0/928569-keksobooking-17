'use strict';

(function () {
  /**
   * Удаляет два последних символа строки и преобразует оставшуюся часть в число
   * @param {string} someString Строка, над которой совершаются вышеперечисленные действия
   * @return {number}
   */
  var cutTwoLastSymbols = function (someString) {
    return Number(someString.substr(0, someString.length - 2));
  };

  /**
   * Генерирует рандомное число от min до max
   * @param {number} min Минимальное число, участвующее в генерации
   * @param {number} max Максимальное число
   * @return {number} Сгенерированное рандомное число
   */
  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  /**
   * Возвращает рандомный элемент указанного массива
   * @param {*[]} arr Массив из которого берется рандомный элемент
   * @return {*}
   */
  var getRandomElement = function (arr) {
    return arr[getRandomNumber(0, arr.length - 1)];
  };

  window.util = {
    'cutTwoLastSymbols': cutTwoLastSymbols,
    'getRandomNumber': getRandomNumber,
    'getRandomElement': getRandomElement,
  };
})();
