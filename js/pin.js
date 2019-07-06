'use strict';

(function () {
  var MAIN_PIN_ARROW = 18;
  var MAIN_PIN_WIDTH = 62;
  var MAIN_PIN_HEIGHT = 62;
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var MAP_START_X = 0;
  var MAP_START_Y = 130;
  var MAP_END_Y = 630;
  var map = document.querySelectorAll('.map');
  var mapEndX = map[0].clientWidth;
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
    if (map[0].classList.contains('map--faded')) {
      map[0].classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      mapFilter.classList.remove('map__filters--disabled');
      window.form.toggleActiveMode(window.form.adFormFields, false);
      window.load.load(onSuccessLoad, onErrorLoad);
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
      if (mainPinTop > MAP_END_Y) {
        mainPinTop = MAP_END_Y;
      }
      if (mainPinTop < MAP_START_Y) {
        mainPinTop = MAP_START_Y;
      }
      if (mainPinLeft > mapEndX - MAIN_PIN_WIDTH) {
        mainPinLeft = mapEndX - MAIN_PIN_WIDTH;
      }
      if (mainPinLeft < MAP_START_X) {
        mainPinLeft = MAP_START_X;
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
    var pinPositionX = somePin.location.x - PIN_WIDTH / 2 + 'px';
    var pinPositionY = somePin.location.y - PIN_HEIGHT + 'px';
    var pinAlt = somePin.offer.description;
    var pinImg = somePin.author.avatar;

    pin.style.left = pinPositionX;
    pin.style.top = pinPositionY;
    pin.querySelector('img').src = pinImg;
    pin.querySelector('img').alt = pinAlt;
    return pin;
  };

  /**
   * Отрисовывает метки на карте, используя данные с сервера
   * @param {[]} offers Массив с данными для отрисовки
   */
  var renderPins = function (offers) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < offers.length; i++) {
      fragment.appendChild(generatePin(offers[i]));
    }
    pinsContainer.appendChild(fragment);
  };

  /**
   * Показывает ошибку, если произошли проблемы в процессе загрузки данных о "соседях" с сервера
   */
  var onErrorLoad = function () {
    var mainBlock = document.querySelector('main');
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorBlock = errorTemplate.cloneNode(true);
    var errorDescription = errorBlock.querySelector('.error__message');
    errorDescription.textContent = 'Ошибка получения данных ;(';
    mainBlock.appendChild(errorBlock);
  }

  /**
   * Выполняет отрисовку пинов на карте, если их загрузка произошла успешно
   * @param {[]} offers Массив с данными для отрисовки
   */
  var onSuccessLoad = function (offers) {
    renderPins(offers);
  };

  mainPin.addEventListener('mousedown', onMainPinMouseDown);
  window.pin = {
    'MAIN_PIN_ARROW': MAIN_PIN_ARROW,
    'MAIN_PIN_WIDTH': MAIN_PIN_WIDTH,
    'MAIN_PIN_HEIGHT': MAIN_PIN_HEIGHT,
    'mainPin': mainPin
  };
})();
