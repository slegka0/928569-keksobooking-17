'use strict';

var PIN_HEIGHT = 70;
var PIN_WIDTH = 50;
var MAP_WIDTH = 1150; // Изменил значение, чтобы за правый край пин не вылезал, правильное ли решение в данном случае? (раньше 1200 было)
var MAP_START_X = 25; //  Аналогично, раньше здесь было 0
var MAP_START_Y = 130;
var MAP_END_Y = 630;
var NUMBER_OF_LOCATION = 8;


var avatars = ['user01', 'user02', 'user03', 'user04', 'user05', 'user06', 'user07', 'user08'];
var map = document.querySelectorAll('.map');
var mapPinButton = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var offersType = ['palace', 'flat', 'house', 'bungalo'];

/**
 * Задает предварительные настройки
 */
//  Не очень понял, что значит выносить предварительные настройки в функцию setup, надеюсь, что я не полную дичь сделал :D
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
 * @param {number} number Индекс элемента массива, содержащего названия картинок (аватарок)
 * @return {string} Путь до картинки (аватара)
 */
var createAvatar = function (number) {
  return 'img/avatars/' + avatars[number] + '.png';
};

/**
 * Выдает рандомный тип хаты из массива с типами хат
 * @return {string} Тип хаты
 */
var createOffer = function () {
  var currentIndex = Math.floor(getRandomNumber(0, 1) * offersType.length);
  return offersType[currentIndex];
};

/**
 * Генерит координаты расположения хаты
 * @return {{X: number, Y: number}} Координаты хаты: Х - по горизонтали, Y - по вертикали
 */
var createLocation = function () {
  return {
    X: getRandomNumber(MAP_START_X, MAP_WIDTH),
    Y: getRandomNumber(MAP_START_Y, MAP_END_Y),
  };
};

/**
 * Создает объект, который будет описывать похожее объявление неподалёку (Кекс по соседству)
 * @param {number} i Индекс, участвующий в генерации пути до картинки (аватарки)
 * @return {{offer: {type: string}, author: {avatar: string}, location: {X: number, Y: number}}}
 */
var createObject = function (i) {
  return {
    author: {
      avatar: createAvatar(i),
    },
    offer: {
      type: createOffer(),
    },
    location: createLocation(),
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
    myObjects[i] = createObject(i);
  }
  return myObjects;
};

/**
 * Создает метку для хаты, путём клонирования шаблона и подгона значений его атрибутов
 * @param {object} somePin Объект, для которого создаётся метка
 * @return {Node}
 */
var createOnePin = function (somePin) {
  var Pin = mapPinButton.cloneNode(true);
  var PinPositionX = somePin.location.X - PIN_WIDTH / 2 + 'px';
  var PinPositionY = somePin.location.Y - PIN_HEIGHT + 'px';
  var PinImg = somePin.author.avatar;

  Pin.style.left = PinPositionX;
  Pin.style.top = PinPositionY;
  Pin.querySelector('img').src = PinImg;
  Pin.querySelector('img').alt = 'Какой-то там заголовок объявления';
  return Pin;
};

/**
 * Отрисовывает эти несчастные метки на карте :D
 * @param {Array} pins Массив из объектов, которые нужно отрисовать
 */
var createPins = function (pins) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < pins.length; i++) {
    fragment.appendChild(createOnePin(pins[i]));
  }
  mapPins.appendChild(fragment);
};

setup();
createPins(addObjects(NUMBER_OF_LOCATION));
