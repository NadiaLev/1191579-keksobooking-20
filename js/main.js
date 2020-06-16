'use strict';

var ELEMENTS_AMOUNT = 8;
var MIN_X = 50;
var MAX_X = 1150;
var MIN_Y = 130;
var MAX_Y = 630;
var MIN_PRICE = 200;
var MAX_PRICE = 2000;
var MIN_ROOMS = 1;
var MAX_ROOMS = 5;
var MIN_GUESTS = 1;
var MAX_GUESTS = 10;
var MIN_FEATURES_START = 0;
var MAX_FEATURES_START = 3;
var MIN_FEATURES_END = 4;
var MAX_FEATURES_END = 7;
var MIN_PHOTOS_START = 0;
var MAX_PHOTOS_START = 1;
var MIN_PHOTOS_END = 2;
var MAX_PHOTOS_END = 3;

var TYPE_LIST = [
  'palace',
  'flat',
  'house',
  'bungalo'
];
var CHECK_LIST = [
  '12:00',
  '13:00',
  '14:00'
];
var FEATURES_LIST = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];
var PHOTOS_LIST = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var mapPins = map.querySelector('.map__pins');

var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

var arrayRandElement = function (arr) {
  var rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var createArrayOfObjects = function (count) {
  var result = [];

  for (var i = 0; i < count; i++) {
    var locationX = getRandomNumber(MIN_X, MAX_X);
    var locationY = getRandomNumber(MIN_Y, MAX_Y);

    var element = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: 'Заголовок предложения',
        address: String(locationX) + ',' + String(locationY),
        price: getRandomNumber(MIN_PRICE, MAX_PRICE),
        type: arrayRandElement(TYPE_LIST),
        rooms: getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        checkin: arrayRandElement(CHECK_LIST),
        checkout: arrayRandElement(CHECK_LIST),
        features: FEATURES_LIST.slice(getRandomNumber(MIN_FEATURES_START, MAX_FEATURES_START), getRandomNumber(MIN_FEATURES_END, MAX_FEATURES_END)),
        description: 'Строка с описанием',
        photos: PHOTOS_LIST.slice(getRandomNumber(MIN_PHOTOS_START, MAX_PHOTOS_START), getRandomNumber(MIN_PHOTOS_END, MAX_PHOTOS_END))
      },
      location: {
        x: locationX,
        y: locationY
      }
    };
    result.push(element);
  }

  return result;
};

createArrayOfObjects(ELEMENTS_AMOUNT);

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.setAttribute('style', 'left: ' + pin.location.x + 'px; top: ' + pin.location.y + 'px;');
  pinElement.querySelector('img').setAttribute('src', pin.author.avatar);
  pinElement.querySelector('img').setAttribute('alt', pin.offer.title);

  return pinElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < createArrayOfObjects(ELEMENTS_AMOUNT).length; i++) {
  fragment.appendChild(renderPin(createArrayOfObjects(ELEMENTS_AMOUNT)[i]));
}
mapPins.appendChild(fragment);
