'use strict';

(function () {
  var map = document.querySelectorAll('.map');
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MAP_START_X = 0;
  var MAP_START_Y = 130;
  var MAP_END_Y = 630;
  var mapEndX = map[0].clientWidth;
  var offersTypes = ['palace', 'flat', 'house', 'bungalo'];
  var avatars = ['user01', 'user02', 'user03', 'user04', 'user05', 'user06', 'user07', 'user08'];


  /**
   * Генерирует путь до картинки (аватара)
   * @param {string} pictureName Название картинки
   * @return {string} Путь до картинки (аватара)
   */
  var generateAvatar = function (pictureName) {
    return 'img/avatars/' + pictureName + '.png';
  };

  /**
   * Генерирует координаты расположения хаты
   * @return {{X: number, Y: number}} Координаты хаты: Х - по горизонтали, Y - по вертикали
   */
  var generateLocation = function () {
    return {
      X: window.util.getRandomNumber(MAP_START_X + PIN_WIDTH / 2, mapEndX - PIN_WIDTH / 2),
      Y: window.util.getRandomNumber(MAP_START_Y, MAP_END_Y),
    };
  };

  /**
   * Создает объект, который будет описывать похожее объявление неподалёку (Кекс по соседству)
   * @param {string} pictureName Название картинки (аватара)
   * @return {{offer: {type: string}, author: {avatar: string}, location: {X: number, Y: number}}}
   */
  var generateAd = function (pictureName) {
    return {
      author: {
        avatar: generateAvatar(pictureName),
      },
      offer: {
        type: window.util.getRandomElement(offersTypes),
      },
      location: generateLocation(),
    };
  };

  /**
   * Создает массив из объектов, которые будут описывать похожие объявления неподалёку (Кексы по соседству)
   * @param {number} countOfObjects Количество тех объектов, которые необходимо добавить в массив
   * @return {Array}
   */
  var addObjects = function (countOfObjects) {
    var myObjects = [];
    for (var i = 0; i < countOfObjects; i++) {
      var currentAvatar = avatars[i];
      myObjects[i] = generateAd(currentAvatar);
    }
    return myObjects;
  };
  window.data = {
    'addObjects': addObjects,
    'PIN_WIDTH': PIN_WIDTH,
    'MAP_START_X': MAP_START_X,
    'MAP_START_Y': MAP_START_Y,
    'MAP_END_Y': MAP_END_Y,
    'mapEndX': mapEndX,
    'PIN_HEIGHT': PIN_HEIGHT,
    'map': map
  };
})();
