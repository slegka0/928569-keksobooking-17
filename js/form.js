'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var houseType = document.querySelector('#type');
  var priceForNight = document.querySelector('#price');
  var addressInput = adForm.querySelector('#address');
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
  /**
   * Задает предварительные настройки
   */
  var setup = function () {
    toggleActiveMode(adFormFields, true);
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
  houseType.addEventListener('change', onHouseTypeChange);
  timeOut.addEventListener('change', onTimeChange);
  timeIn.addEventListener('change', onTimeChange);
  window.form = {
    'findPinCoordinates': findPinCoordinates,
    'toggleActiveMode': toggleActiveMode,
    'adFormFields': adFormFields
  };
  setup();
})();