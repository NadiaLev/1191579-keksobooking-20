'use strict';


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
var ELEMENTS_AMOUNT = 8;


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
    var locationX = getRandomNumber(50, 1150);
    var locationY = getRandomNumber(130, 630);

    var element = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: 'Заголовок предложения',
        address: String(locationX) + ',' + String(locationY),
        price: getRandomNumber(200, 2000),
        type: arrayRandElement(TYPE_LIST),
        rooms: getRandomNumber(1, 5),
        guests: getRandomNumber(1, 10),
        checkin: arrayRandElement(CHECK_LIST),
        checkout: arrayRandElement(CHECK_LIST),
        features: FEATURES_LIST.slice(getRandomNumber(0, 3), getRandomNumber(4, 7)),
        description: 'Строка с описанием',
        photos: PHOTOS_LIST.slice(getRandomNumber(0, 1), getRandomNumber(2, 3))
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
