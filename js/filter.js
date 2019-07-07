'use strict';

(function () {
  var typeFilter = document.querySelector('#housing-type');
  var map = document.querySelector('.map__pins');

  /**
   * Удаляет все пины с карты
   */
  var cleanMap = function () {
    var pins = map.querySelectorAll('button[type = button]');
    for (var i = 0; i < pins.length; i++) {
      pins[i].remove();
    }
  };

  /**
   * Реагирует на изменение значения фильтра с типом жилья (отображает только соответствующие пины на карте)
   * @param {Object} evt Стандартый объект события (event)
   */
  var onHouseTypeChange = function (evt) {
    evt.preventDefault();
    cleanMap();
    var ads = window.pins;
    var typeChoice = typeFilter.value;
    var checkTypes = function (it) {
      if (typeChoice === 'any') {
        return it;
      } else {
        return it.offer.type === typeChoice;
      }
    };
    var filteredAds = ads.filter(checkTypes).slice(0, 5);
    window.pin.renderPins(filteredAds);
  };

  typeFilter.addEventListener('change', onHouseTypeChange);

})();
