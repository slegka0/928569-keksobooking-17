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
var adFormInputs = Array.from(adForm.querySelectorAll('input'));
var adFormSelects = Array.from(adForm.querySelectorAll('select'));
var adFormButtons = Array.from(adForm.querySelectorAll('button'));
var adFormTextareas = Array.from(adForm.querySelectorAll('textarea'));
var timeIn = document.querySelector('#timein');
var timeOut = document.querySelector('#timeout');
var houseType = document.querySelector('#type');
var priceForNight = document.querySelector('#price');
var adFormFields = adFormInputs.concat(adFormSelects, adFormButtons, adFormTextareas);
var addressInput = adForm.querySelector('#address');
var avatars = ['user01', 'user02', 'user03', 'user04', 'user05', 'user06', 'user07', 'user08'];
var map = document.querySelectorAll('.map');
var mapEndX = map[0].clientWidth;
var mapPinButton = document.querySelector('#pin').content.querySelector('.map__pin');
var pinsContainer = document.querySelector('.map__pins');
var offersTypes = ['palace', 'flat', 'house', 'bungalo'];
var minPrices = {
  bungalo: 0,
  flat: 1000,
  house: 5000,
  palace: 10000
};

/**
 * Задает предварительные настройки
 */
var setup = function () {
  toggleActiveMode(adFormFields, true);
  findPinCoordinates('circle');
};

/**
 * Переводит поля формы в указанное состояние (активное или неактивное)
 * @param {Array<HTMLButtonElement|HTMLInputElement|HTMLSelectElement|HTMLTextAreaElement>} formElements Массив, содержащий поля формы
 * @param {boolean} disabled Текущее состояние (активное или неактивное)
 */
var toggleActiveMode = function (formElements, disabled) {
  for (var i = 0; i < formElements.length; i++) {
    formElements[i].disabled = disabled ? true : false;
  }
};

/**
 * Удаляет два последних символа строки и преобразует оставшуюся часть в число
 * @param {string} someString Строка, над которой совершаются вышеперечисленные действия
 * @return {number}
 */
var cutTwoLastSymbols = function (someString) {
  return Number(someString.substr(0, someString.length - 2));
};

/**
 * Находит текущие координаты метки и заполняет их значениями поле адреса
 * @param {string} mode Указывает на форму метки. Метка может быть круглой (в самом начале) или с острым концом снизу (shapeless)
 */
var findPinCoordinates = function (mode) {
  var mainPinX = mainPin.style.left;
  var mainPinY = mainPin.style.top;
  mainPinX = cutTwoLastSymbols(mainPinX);
  mainPinY = cutTwoLastSymbols(mainPinY);
  if (mode === 'shapeless') {
    mainPinX = mainPinX - PIN_WIDTH / 2;
    mainPinY = mainPinY - PIN_HEIGHT;
  }
  addressInput.value = mainPinX + ',' + mainPinY;
};

/**
 * Переводит страницу в активное состояние
 */
var onMainPinMouseUp = function () {
  if (map[0].classList.contains('map--faded')) {
    map[0].classList.remove('map--faded');
    adForm.classList.remove('ad-form--disabled');
    mapFilter.classList.remove('map__filters--disabled');
    toggleActiveMode(adFormFields, false);
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

// Ниже код для времени заезда и выезда.
//  Пытался написать универсальную функцию, которая принимала бы на вход элемент, который изменяется, а дальше уже производила действия, но мы ведь в обработчик события не можем ничего передавать? :(
//  var onTimeChange = function (element) {
//    if (element === timeIn) {
//      timeOut.value = element.value;
//    } else {
//      timeIn.value = element.value;
//  }
// (Кстати, можно ли было заменить код выше, вот такой штукой? element === timeIn ? timeOut.value = element.value : timeIn.value = element.value;
//  У меня почему-то не вышло, element до === подчеркивался)
//  };
//  В итоге пришлось писать два обработчика для каждого из элементов, нормально ли в данной ситуации?

/**
 * Изменяет значение времени выезда, в ответ на изменение времени заезда
 */
var onTimeInChange = function () {
  timeOut.value = timeIn.value;
};

/**
 * Изменяет значение времени заезда, в ответ на изменение времени выезда
 */
var onTimeOutChange = function () {
  timeIn.value = timeOut.value;
};

/**
 * Меняет плейсхолдер и минимальное значение поля с ценой за ночь в ответ на изменение поля тип жилья
 */
var onHouseTypeChange = function () {
  for (var key in minPrices) {
    if (key.toString() === houseType.value.toString()) {
      priceForNight.placeholder = minPrices[key];
      priceForNight.min = minPrices[key];
    }
  }
}

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
houseType.addEventListener('change', onHouseTypeChange);
timeOut.addEventListener('change', onTimeOutChange);
timeIn.addEventListener('change', onTimeInChange);
setup();
