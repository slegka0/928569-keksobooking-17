'use strict';

var PIN_HEIGHT = 70;
var PIN_WIDTH = 50;
var MAP_START_X = 0;
var MAP_START_Y = 130;
var MAP_END_Y = 630;
var NUMBER_OF_LOCATION = 8;

var avatars = ['user01', 'user02', 'user03', 'user04', 'user05', 'user06', 'user07', 'user08'];
var map = document.querySelectorAll('.map');
var mapEndX = map[0].clientWidth;
var mapPinButton = document.querySelector('#pin').content.querySelector('.map__pin');
var pinsContainer = document.querySelector('.map__pins');
var offersTypes = ['palace', 'flat', 'house', 'bungalo'];

/**
 * Задает предварительные настройки
 */
var setup = function () {
  map[0].classList.remove('map--faded');
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
 * Генерирует путь до картинки (аватара)
 * @param {string} pictureName Название картинки
 * @return {string} Путь до картинки (аватара)
 */
var generateAvatar = function (pictureName) {
  return 'img/avatars/' + pictureName + '.png';
};

/**
 * Возвращает рандомный элемент указанного массива
 * @param {*[]} arr Массив из которого берется рандомный элемент
 * @return {*}
 */
var getRandomElement = function (arr) {
  return arr[getRandomNumber(0, arr.length - 1)];
};

/**
 * Генерит координаты расположения хаты
 * @return {{X: number, Y: number}} Координаты хаты: Х - по горизонтали, Y - по вертикали
 */
var generateLocation = function () {
  return {
    X: getRandomNumber(MAP_START_X + PIN_WIDTH / 2, mapEndX - PIN_WIDTH / 2),
    Y: getRandomNumber(MAP_START_Y, MAP_END_Y),
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
      type: getRandomElement(offersTypes),
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

/**
 * Создает метку для хаты, путём клонирования шаблона и подгона значений его атрибутов
 * @param {object} somePin Объект, для которого создаётся метка
 * @return {Node}
 */
var generatePin = function (somePin) {
  var pin = mapPinButton.cloneNode(true);
  var pinPositionX = somePin.location.X - PIN_WIDTH / 2 + 'px';
  var pinPositionY = somePin.location.Y - PIN_HEIGHT + 'px';
  var pinImg = somePin.author.avatar;

  pin.style.left = pinPositionX;
  pin.style.top = pinPositionY;
  pin.querySelector('img').src = pinImg;
  pin.querySelector('img').alt = 'Какой-то там заголовок объявления';
  return pin;
};

/**
 * Отрисовывает метки на карте
 * @param {Object[]} pins Массив из объектов, которые нужно отрисовать
 */
var renderPins = function (pins) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(generatePin(pins[i]));
  }
  pinsContainer.appendChild(fragment);
};

setup();
renderPins(addObjects(NUMBER_OF_LOCATION));
