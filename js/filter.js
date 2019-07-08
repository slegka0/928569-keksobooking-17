'use strict';

(function () {
  var typeFilter = document.querySelector('#housing-type');

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
    var filteredAds = ads.filter(checkTypes).slice(0, window.pin.MAX_PIN);
    window.pin.renderPins(filteredAds);
    window.card.deleteCurrentCard();
    window.card.renderCard(filteredAds[0]);
  };

  typeFilter.addEventListener('change', onHouseTypeChange);

})();
