'use strict';

(function () {
  var MAIN_PIN_ARROW = 18;
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var NUMBER_OF_LOCATION = 8;
  var ifMouseMoved = false;
  var firstStart = true;
  var pinMode = 'round';
  var mainPin = document.querySelector('.map__pin--main');
  var mapPinButton = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinsContainer = document.querySelector('.map__pins');
  var adForm = document.querySelector('.ad-form');
  var mapFilter = document.querySelector('.map__filters');

  /**
   * Переводит страницу в активное состояние
   */
  var startPage = function () {
    if (window.data.map[0].classList.contains('map--faded')) {
      window.data.map[0].classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      mapFilter.classList.remove('map__filters--disabled');
      window.form.toggleActiveMode(window.form.adFormFields, false);
      renderPins(window.data.addObjects(NUMBER_OF_LOCATION));
    } else {
      window.form.findPinCoordinates('shapeless');
    }
  };
  /**
   * Описывает drag-and-drop для главной метки
   * @param {Object} evt Стандартый объект события (event)
   */
  var onMainPinMouseDown = function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMainPinMouseMove = function (moveEvt) {
      ifMouseMoved = true;
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };
      var mainPinTop = mainPin.offsetTop - shift.y;
      var mainPinLeft = mainPin.offsetLeft - shift.x;
      if (mainPinTop > window.data.MAP_END_Y) {
        mainPinTop = window.data.MAP_END_Y;
      }
      if (mainPinTop < window.data.MAP_START_Y) {
        mainPinTop = window.data.MAP_START_Y;
      }
      if (mainPinLeft > window.data.mapEndX - MAIN_PIN_WIDTH) {
        mainPinLeft = window.data.mapEndX - MAIN_PIN_WIDTH;
      }
      if (mainPinLeft < window.data.MAP_START_X) {
        mainPinLeft = window.data.MAP_START_X;
      }

      mainPin.style.top = mainPinTop + 'px';
      mainPin.style.left = mainPinLeft + 'px';
      window.form.findPinCoordinates(pinMode);
    };

    var onMainPinMouseUp = function () {
      if (firstStart && ifMouseMoved) {
        startPage();
        firstStart = false;
        pinMode = 'shapeless';
      }
      window.form.findPinCoordinates(pinMode);
      document.removeEventListener('mousemove', onMainPinMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseUp);
    };

    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  };

  /**
   * Создает метку для хаты, путём клонирования шаблона и подгона значений его атрибутов
   * @param {object} somePin Объект, для которого создаётся метка
   * @return {Node}
   */
  var generatePin = function (somePin) {
    var pin = mapPinButton.cloneNode(true);
    var pinPositionX = somePin.location.X - window.data.PIN_WIDTH / 2 + 'px';
    var pinPositionY = somePin.location.Y - window.data.PIN_HEIGHT + 'px';
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
  mainPin.addEventListener('mousedown', onMainPinMouseDown);
  window.pin = {
    'MAIN_PIN_ARROW': MAIN_PIN_ARROW,
    'MAIN_PIN_WIDTH': MAIN_PIN_WIDTH,
    'MAIN_PIN_HEIGHT': MAIN_PIN_HEIGHT,
    'mainPin': mainPin
  };
})();
