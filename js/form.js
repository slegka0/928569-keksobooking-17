'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var houseType = document.querySelector('#type');
  var priceForNight = document.querySelector('#price');
  var addressInput = adForm.querySelector('#address');
  var roomNumber = document.querySelector('#room_number');
  var houseCapacity = document.querySelector('#capacity');
  var adFormInputs = Array.from(adForm.querySelectorAll('input'));
  var adFormSelects = Array.from(adForm.querySelectorAll('select'));
  var adFormButtons = Array.from(adForm.querySelectorAll('button'));
  var adFormTextareas = Array.from(adForm.querySelectorAll('textarea'));
  var adFormFields = adFormInputs.concat(adFormSelects, adFormButtons, adFormTextareas);
  var minPrices = {
    bungalo: 0,
    flat: 1000,
    house: 5000,
    palace: 10000
  };
  var countOfRooms = {
    1: [1],
    2: [1, 2],
    3: [1, 2, 3],
    100: [0]
  };

  /**
   * Задает предварительные настройки
   */
  var setup = function () {
    toggleActiveMode(adFormFields, true);
    toggleActiveMode(window.filter.allFilters, true);
    findPinCoordinates('circle');
  };

  /**
   * Находит текущие координаты метки и заполняет их значениями поле адреса
   * @param {string} mode Указывает на форму метки. Метка может быть круглой (в самом начале) или с острым концом снизу (shapeless)
   */
  var findPinCoordinates = function (mode) {
    var mainPinX = window.pin.mainPin.style.left;
    var mainPinY = window.pin.mainPin.style.top;
    mainPinX = window.util.cutTwoLastSymbols(mainPinX) + window.pin.MAIN_PIN_WIDTH / 2;
    mainPinY = window.util.cutTwoLastSymbols(mainPinY) + window.pin.MAIN_PIN_HEIGHT / 2;
    if (mode === 'shapeless') {
      mainPinY = mainPinY + window.pin.MAIN_PIN_HEIGHT / 2 + window.pin.MAIN_PIN_ARROW;
    }
    addressInput.value = mainPinX + ',' + mainPinY;
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
   * Меняет время заезда в ответ на изменение времени выезда и наоборот
   * @param {Object} evt Стандартый объект события (event)
   */
  var onTimeChange = function (evt) {
    if (evt.currentTarget === timeIn) {
      timeOut.value = evt.currentTarget.value;
    } else {
      timeIn.value = evt.currentTarget.value;
    }
  };

  /**
   * Меняет плейсхолдер и минимальное значение поля с ценой за ночь в ответ на изменение поля тип жилья
   * @param {Object} evt Стандартый объект события (event)
   */
  var onHouseTypeChange = function (evt) {
    priceForNight.placeholder = minPrices[evt.currentTarget.value];
    priceForNight.min = minPrices[evt.currentTarget.value];
  };

  /**
   * Генерит ошибку в зависимости от выбранного количества комнат и гостей
   * @param {HTMLSelectElement} room Хранит в себе данные о выбранном количестве комнат
   * @param {HTMLSelectElement} capacity Хранит в себе данные о выбранном количестве гостей
   * @return {string}
   */
  var getCapacityError = function (room, capacity) {
    var result = '';
    if (Number(room.value) < Number(capacity.value)) {
      result = 'Количество комнат меньше, чем количество гостей :(';
    } else {
      if (room.value === '100' || capacity.value === '0') {
        result = '100 комнат идеально подойдут не для гостей';
      }
    }
    return result;
  };

  /**
   * Проверяет соответствие количества комнат количеству гостей
   */
  var onRoomOrCapacityChange = function () {
    if (countOfRooms[roomNumber.value].indexOf(parseInt(houseCapacity.value, 10)) === -1) {
      roomNumber.setCustomValidity(getCapacityError(roomNumber, houseCapacity));
    } else {
      roomNumber.setCustomValidity('');
    }
  };

  /**
   * сбрасывает страницу в исходное неактивное состояние без перезагрузки: все заполненные поля стираются, метки похожих объявлений и карточка активного объявления удаляются,
   * метка адреса возвращается в исходное положение, значение поля адреса корректируется соответственно положению метки.
   * @param {Object} evt Стандартый объект события (event)
   */
  var onResetClick = function (evt) {
    var LEFT_CENTER = 570;
    var TOP_CENTER = 375;
    evt.preventDefault();
    window.card.deleteCurrentCard();
    window.filter.cleanMap();
    window.pin.mainPin.style.left = LEFT_CENTER + 'px';
    window.pin.mainPin.style.top = TOP_CENTER + 'px';
    adForm.reset();
    findPinCoordinates('round');
  };

  [roomNumber, houseCapacity].forEach(function (select) {
    select.addEventListener('change', onRoomOrCapacityChange);
  });
  houseType.addEventListener('change', onHouseTypeChange);
  timeOut.addEventListener('change', onTimeChange);
  timeIn.addEventListener('change', onTimeChange);
  resetButton.addEventListener('click', onResetClick);
  window.form = {
    'findPinCoordinates': findPinCoordinates,
    'toggleActiveMode': toggleActiveMode,
    'adFormFields': adFormFields
  };
  setup();
})();
