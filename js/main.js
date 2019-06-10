'use strict';

var myObjects = [];
var map = document.querySelectorAll('.map');
var offersType = ['palace', 'flat', 'house', 'bungalo'];

var createAvatar = function (number) {
  return 'img/avatars/user0' + number + '.png';
};

var createOffer = function () {
  var currentIndex = Math.floor(Math.random() * offersType.length());
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
    X: createXPosition(0, 1200),
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

var addObjects = function () {
  for (var i = 0; i < 8; i++) {
    myObjects[i] = createObject(i);
  }
};

map[0].classList.remove('map--faded');
