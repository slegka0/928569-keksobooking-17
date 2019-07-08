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
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
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
      var featuresChecked = [];
      for (var i = 0; i < featuresInputs.length; i++) {
        if (featuresInputs[i].checked) {
          featuresChecked.push(featuresInputs[i].value);
        }
      }
      if (featuresChecked.length === 0) {
        return it;
      } else {
        return featuresChecked.every(function (elem) {
          return it.offer.features.indexOf(elem) !== -1;
        });
      }
    };

    var filteredAds = ads.filter(checkTypes).
                          filter(checkRoom).
                          filter(checkCapacity).
                          filter(checkPrice).
                          filter(checkFeatures).
                          slice(0, window.pin.MAX_PIN);

    lastTimeout = window.setTimeout(function () {
      window.pin.renderPins(filteredAds);
    }, debounce);
    window.card.deleteCurrentCard();
  };

  for (var i = 0; i < allFilters.length; i++) {
    allFilters[i].addEventListener('change', onFilterValueChange);
  }

  window.filter = {
    'allFilters': allFilters
  };
})();
