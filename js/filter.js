/* eslint-disable valid-jsdoc */
'use strict';

(function () {
  var typeFilter = document.querySelector('#housing-type');
  var priceFilter = document.querySelector('#housing-price');
  var roomFilter = document.querySelector('#housing-rooms');
  var capacityFilter = document.querySelector('#housing-guests');
  var featuresFilter = document.querySelector('#housing-features');
  var featuresInputs = Array.from(featuresFilter.querySelectorAll('input'));
  var allFilters = [typeFilter, priceFilter, roomFilter, capacityFilter, featuresFilter];
  var debounce = 500;
  var lastTimeout;
  var priceDict = {
    'low': [0, 9999],
    'middle': [10000, 50000],
    'high': [50000, Infinity]
  };

  /**
   * Удаляет все пины с карты
   */
  var cleanMap = function () {
    var pins = window.pin.pinsContainer.querySelectorAll('button[type = button]');
    pins.forEach(function (pin) {
      pin.remove();
    });
  };

  /**
   * Отслеживает изменение каждого фильтра и соотвутствующе реагирует на эти изменения
   */
  var onFilterValueChange = function () {
    var ads = window.pins;
    if (lastTimeout) {
      window.clearTimeout(lastTimeout);
    }
    cleanMap();

    /**
     * Реагирует на изменение значения фильтра с типом жилья (для отображения только соответствующих пинов на карте)
     * @param {Object} it Объект, содержащий всю информацию о пине
     * @return {boolean|*}
     */
    var checkTypes = function (it) {
      var typeChoice = typeFilter.value;
      if (typeChoice === 'any') {
        return it;
      } else {
        return it.offer.type === typeChoice;
      }
    };

    /**
     * Реагирует на изменение значения фильтра с количеством комнат (для отображения только соответствующих пинов на карте)
     * @param {Object} it Объект, содержащий всю информацию о пине
     * @return {boolean|*}
     */
    var checkRoom = function (it) {
      var roomChoice = roomFilter.value;
      if (roomChoice === 'any') {
        return it;
      } else {
        return it.offer.rooms.toString() === roomChoice;
      }
    };

    /**
     * Реагирует на изменение значения фильтра с количеством гостей (для отображения только соответствующих пинов на карте)
     * @param {Object} it Объект, содержащий всю информацию о пине
     * @return {boolean|*}
     */
    var checkCapacity = function (it) {
      var capacityChoice = capacityFilter.value;
      if (capacityChoice === 'any') {
        return it;
      } else {
        return it.offer.guests.toString() === capacityChoice;
      }
    };

    /**
     * Реагирует на изменение значения фильтра с ценой за ночь (для отображения только соответствующих пинов на карте)
     * @param {Object} it Объект, содержащий всю информацию о пине
     * @return {boolean|*}
     */
    var checkPrice = function (it) {
      var priceChoice = priceFilter.value;
      if (priceChoice === 'any') {
        return it;
      } else {
        return (it.offer.price >= priceDict[priceChoice][0] && it.offer.price < priceDict[priceChoice][1]);
      }
    };

    /**
     * Реагирует на изменение значения фильтра дополнительными удобствами (для отображения только соответствующих пинов на карте)
     * @param {Object} it Объект, содержащий всю информацию о пине
     * @return {boolean|*}
     */
    var checkFeatures = function (it) {
      var checkedFeatures = [];
      featuresInputs.forEach(function (featureInput) {
        if (featureInput.checked) {
          checkedFeatures.push(featureInput.value);
        }
      });
      if (checkedFeatures.length === 0) {
        return it;
      } else {
        return checkedFeatures.every(function (elem) {
          return it.offer.features.indexOf(elem) !== -1;
        });
      }
    };

    /**
     * Проверяет метку на соответствие значениям каждого фильтра
     * @param {Object} elem Данные о метке
     * @return {boolean}
     */
    var filterIt = function (elem) {
      return checkTypes(elem) && checkRoom(elem) && checkCapacity(elem) && checkPrice(elem) && checkFeatures(elem);
    };

    var result = ads.filter(filterIt).slice(0, window.pin.MAX_PIN);
    lastTimeout = window.setTimeout(function () {
      window.allPins.forEach(function (pin) {
        pin.removeEventListener('click', window.card.onPinClick);
      });
      window.pin.renderPins(result);
    }, debounce);
    window.card.deleteCurrentCard();
  };

  window.filter = {
    'allFilters': allFilters,
    'cleanMap': cleanMap,
    'onFilterValueChange': onFilterValueChange,
    'featuresInputs': featuresInputs
  };
})();
