'use strict';

(function () {
  /**
   * Создает карточку объявления и возвращает её
   * @param {Object} ad Объект с данными, которые будут записаны на карточке
   * @return {Node}
   */
  var generateCard = function (ad) {
    var templateCard = document.querySelector('#card').content;
    var card = templateCard.cloneNode(true);
    var cardTitle = card.querySelector('.popup__title');
    var cardAddress = card.querySelector('.popup__text--address');
    var cardPrice = card.querySelector('.popup__text--price');
    var cardType = card.querySelector('.popup__type');
    var cardCapacity = card.querySelector('.popup__text--capacity');
    var cardTime = card.querySelector('.popup__text--time');
    var cardFeatures = card.querySelector('.popup__features');
    var cardDescription = card.querySelector('.popup__description');
    var cardPhotos = card.querySelector('.popup__photos');
    var cardAvatar = card.querySelector('.popup__avatar');
    var typeDict = {
      'flat': 'Квартира',
      'bungalo': 'Бунгало',
      'house': 'Дом',
      'palace': 'Дворец'
    };

    cardTitle.textContent = ad.offer.title;
    cardAddress.textContent = ad.offer.address;
    cardPrice.textContent = ad.offer.price + '₽/ночь';
    cardType.textContent = typeDict[ad.offer.type];
    cardCapacity.textContent = ad.offer.rooms + ' комнаты для ' + ad.offer.guests + ' гостей';
    cardTime.textContent = 'Заезд после ' + ad.offer.checkin + ' выезд до ' + ad.offer.checkout;
    cardDescription.textContent = ad.offer.description;
    cardAvatar.src = ad.author.avatar;

    window.util.deleteNodeChild(cardFeatures);
    for (var i = 0; i < ad.offer.features.length; i++) {
      var li = document.createElement('li');
      li.classList.add('popup__feature');
      li.classList.add('popup__feature--' + ad.offer.features[i]);
      cardFeatures.appendChild(li);
    }
    window.util.deleteNodeChild(cardPhotos);
    for (var j = 0; j < ad.offer.photos.length; j++) {
      var img = document.createElement('img');
      img.src = ad.offer.photos[j];
      img.height = 40;
      img.width = 45;
      cardPhotos.appendChild(img);
    }

    return card;
  };

  /**
   * Отрисовывает созданную карточку
   * @param {Object} ad Объект с данными, которые будут отрисованы на карточке
   */
  var renderCard = function (ad) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(generateCard(ad));
    window.pin.map.appendChild(fragment);
  };

  /**
   * Удаляет из DOM'а отрисованную карточку объявления, если она существует (Помогает не засорять разметку кучей наложенных друг на друга карточек)
   */
  var deleteCurrentCard = function () {
    var currentCard = window.pin.map.querySelector('article.map__card');
    if (currentCard) {
      window.pin.map.removeChild(currentCard);
    }
  };

  window.card = {
    'generateCard': generateCard,
    'renderCard': renderCard,
    'deleteCurrentCard': deleteCurrentCard
  };
})();
