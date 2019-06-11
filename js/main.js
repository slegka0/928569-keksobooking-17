'use strict';

var PIN_HEIGHT = 70;
var PIN_WIDTH = 50;
var MAP_WIDTH = 1200;

var myObjects = [];
var numberOfLocation = 8;
var map = document.querySelectorAll('.map');
var mapPinButton = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPins = document.querySelector('.map__pins');
var offersType = ['palace', 'flat', 'house', 'bungalo'];

var createAvatar = function (number) {
  //  number++;
  return 'img/avatars/user0' + number + '.png';
};

var createOffer = function () {
  var currentIndex = Math.floor(Math.random() * offersType.length);
  return offersType[currentIndex];
};

var createXPosition = function (left, right) {
  return Math.floor(Math.random() * (right - left) + left);
};

var createYPosition = function (bottom, top) {
  return Math.floor(Math.random() * (top - bottom) + bottom);
};

var createLocation = function () {
  return {
    X: createXPosition(0, MAP_WIDTH),
    Y: createYPosition(130, 630),
  };
};

var createObject = function (i) {
  return {
    author: {
      avatar: createAvatar(i),
    },
    offer: {
      type: createOffer(),
    },
    location: createLocation(),
  };
};

var addObjects = function (countOfObjects) {
  for (var i = 1; i <= countOfObjects; i++) {
    myObjects[i] = createObject(i);
  }
};

var createOnePin = function (somePin) {
  var mapPinButtonN = mapPinButton.cloneNode(true);
  var mapPinPositionX = somePin.location.X - PIN_WIDTH / 2 + 'px';
  var mapPinPositionY = somePin.location.Y - PIN_HEIGHT / 2 + 'px';
  var mapPinImg = somePin.author.avatar;

  mapPinButtonN.style.left = mapPinPositionX;
  mapPinButtonN.style.top = mapPinPositionY;
  mapPinButtonN.querySelector('img').src = mapPinImg;
  mapPinButtonN.querySelector('img').alt = 'Какой-то там заголовок объявления';
  return mapPinButtonN;
};

var createPins = function (pins) {
  var fragment = document.createDocumentFragment();
  for (var i = 1; i < pins.length; i++) {
    fragment.appendChild(createOnePin(pins[i]));
  }
  mapPins.appendChild(fragment);
};

map[0].classList.remove('map--faded');

addObjects(numberOfLocation);
createPins(myObjects);
