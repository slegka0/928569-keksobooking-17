'use strict';

var PIN_HEIGHT = 70;
var PIN_WIDTH = 50;
var MAP_START_X = 0;
var MAP_START_Y = 130;
var MAP_END_Y = 630;
var NUMBER_OF_LOCATION = 8;

var mainPin = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var mapFilter = document.querySelector('.map__filters');
var adFormInputs = adForm.querySelectorAll('input');
var adFormSelects = adForm.querySelectorAll('select');
var addressInput = adForm.querySelector('#address');
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
  activateFields(adFormInputs, 'deactivate');
  activateFields(adFormSelects, 'deactivate');
  findPinCoordinates('circle');
};

/**
 * Переводит поля формы в указанное состояние (активное или неактивное)
 * @param {node[]} arr Массив, содержащий поля формы
 * @param {string} mode Указывает на текущий режим страницы, значение activate соответствует активному состоянию
 */
var activateFields = function (arr, mode) {
  for (var i = 0; i < arr.length; i++) {
    if (mode === 'activate') {
      arr[i].disabled = false; // Тут подчеркивате disabled серым цветом и пишет, что данное свойство не подходит для типа node.
    } else {
      arr[i].disabled = true; // Как быть? Ведь у меня тут могут быть и HTMLInputElement, и HTMLSelectElement, в JSDoc как-то можно указать несколько типов для параметра?
    }
  }
};

/**
 * Находит текущие координаты метки и заполняет их значениями поле адреса
 * @param {string} mode Указывает на форму метки. Метка может быть круглой (в самом начале) или с острым концом снизу (shapeless)
 */
var findPinCoordinates = function (mode) {
  var mainPinX = mainPin.style.left;
  var mainPinY = mainPin.style.top;
  mainPinX = Number(mainPinX.substr(0, mainPinX.length - 2));
  mainPinY = Number(mainPinY.substr(0, mainPinY.length - 2));
  if (mode === 'shapeless') {
    mainPinX = mainPinX - PIN_WIDTH / 2;
    mainPinY = mainPinY - PIN_HEIGHT;
  }
  addressInput.value = mainPinX + ',' + mainPinY;
};

/**
 * Переводит страницу в активное состояние после первого щелчка на метку
 */
var onMainPinMouseUp = function () {
  if (map[0].classList.contains('map--faded')) {
    map[0].classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    mapFilter.classList.remove('map__filters--disabled');
    activateFields(adFormInputs, 'activate');
    activateFields(adFormSelects, 'activate');
    renderPins(addObjects(NUMBER_OF_LOCATION));
  } else {
    findPinCoordinates('shapeless');
  }
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

mainPin.addEventListener('mouseup', onMainPinMouseUp);
setup();
