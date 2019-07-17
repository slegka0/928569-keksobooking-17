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
  var MAX_PIN = 5;
  var map = document.querySelector('.map');
  var mapEndX = map.clientWidth;
  var mainPin = document.querySelector('.map__pin--main');
  var mapPinButton = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinsContainer = document.querySelector('.map__pins');
  var adForm = document.querySelector('.ad-form');
  var mapFilter = document.querySelector('.map__filters');
  window.ifMouseMoved = false;
  window.firstStart = true;
  window.pinMode = 'round';

  /**
   * Переводит страницу в активное состояние
   */
  var startPage = function () {
    if (map.classList.contains('map--faded')) {
      map.classList.remove('map--faded');
      adForm.classList.remove('ad-form--disabled');
      mapFilter.classList.remove('map__filters--disabled');
      window.form.toggleActiveMode(window.form.adFormFields, false);
      window.form.toggleActiveMode(window.filter.allFilters, false);
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
      moveEvt.preventDefault();
      window.ifMouseMoved = true;

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
      if (mainPinTop > MAP_END_Y - MAIN_PIN_HEIGHT / 2 && window.pinMode === 'round') {
        mainPinTop = MAP_END_Y - MAIN_PIN_HEIGHT / 2;
      }
      if (mainPinTop > MAP_END_Y - MAIN_PIN_HEIGHT - MAIN_PIN_ARROW && window.pinMode === 'shapeless') {
        mainPinTop = MAP_END_Y - MAIN_PIN_HEIGHT - MAIN_PIN_ARROW;
      }
      if (mainPinTop < MAP_START_Y - MAIN_PIN_HEIGHT / 2 && window.pinMode === 'round') {
        mainPinTop = MAP_START_Y - MAIN_PIN_HEIGHT / 2;
      }
      if (mainPinTop < MAP_START_Y - MAIN_PIN_HEIGHT - MAIN_PIN_ARROW && window.pinMode === 'shapeless') {
        mainPinTop = MAP_START_Y - MAIN_PIN_HEIGHT - MAIN_PIN_ARROW;
      }
      if (mainPinLeft > mapEndX - MAIN_PIN_WIDTH) {
        mainPinLeft = mapEndX - MAIN_PIN_WIDTH;
      }
      if (mainPinLeft < MAP_START_X) {
        mainPinLeft = MAP_START_X;
      }

      mainPin.style.top = mainPinTop + 'px';
      mainPin.style.left = mainPinLeft + 'px';
      window.form.findPinCoordinates(window.pinMode);
    };

    var onMainPinMouseUp = function () {
      if (window.firstStart && window.ifMouseMoved) {
        startPage();
        var mainPinTop = window.util.cutTwoLastSymbols(mainPin.style.top) - MAIN_PIN_HEIGHT / 2 - MAIN_PIN_ARROW;
        mainPin.style.top = mainPinTop + 'px';
        window.firstStart = false;
        window.pinMode = 'shapeless';
      }
      window.form.findPinCoordinates(window.pinMode);
      document.removeEventListener('mousemove', onMainPinMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseUp);
    };

    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  };

  /**
   * Функция-конструктор для пинов, которые отрисовываются на карте
   * @param {Object} somePin Содержит объект с данными для отрисовки самого пина и его карточки
   * @constructor
   */
  var Pin = function (somePin) {
    this.pin = mapPinButton.cloneNode(true);
    this.pinPositionX = somePin.location.x - PIN_WIDTH / 2 + 'px';
    this.pinPositionY = somePin.location.y - PIN_HEIGHT + 'px';
    this.pinAlt = somePin.offer.description;
    this.pinImg = somePin.author.avatar;
    this.setData = somePin;
  };

  /**
   * @param {object} pin Объект, для которого создаётся метка
   * @return {Node}
   */
  var generatePin = function (pin) {
    var currentPin = new Pin(pin);
    var currentNode = currentPin.pin;
    currentNode.style.left = currentPin.pinPositionX;
    currentNode.style.top = currentPin.pinPositionY;
    currentNode.fullData = currentPin.setData;
    currentNode.querySelector('img').src = currentPin.pinImg;
    currentNode.querySelector('img').alt = currentPin.pinAlt;
    currentNode.querySelector('img').fullData = currentNode.fullData;
    return currentNode;
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
    window.allPins = window.pin.pinsContainer.querySelectorAll('button[type = button]');
    for (var j = 0; j < window.allPins.length; j++) {
      window.allPins[j].addEventListener('click', window.card.onPinClick);
    }
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
  };

  /**
   * Выполняет отрисовку пяти пинов на карте, если их загрузка произошла успешно и отрисовывает карточку для первого из них
   * @param {[]} offers Массив с данными для отрисовки
   */
  var onSuccessLoad = function (offers) {
    window.pins = offers;
    var miniOffers = offers.slice(0, MAX_PIN);
    renderPins(miniOffers);
  };

  mainPin.addEventListener('mousedown', onMainPinMouseDown);
  window.pin = {
    'MAIN_PIN_ARROW': MAIN_PIN_ARROW,
    'MAIN_PIN_WIDTH': MAIN_PIN_WIDTH,
    'MAIN_PIN_HEIGHT': MAIN_PIN_HEIGHT,
    'mainPin': mainPin,
    'renderPins': renderPins,
    'pinsContainer': pinsContainer,
    'map': map,
    'MAX_PIN': MAX_PIN
  };
})();
