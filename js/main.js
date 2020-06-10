'use strict';


var TYPE_LIST = ['palace', 'flat', 'house', 'bungalo'];
var CHECK_LIST = ['12:00', '13:00', '14:00'];
var FEATURES_LIST = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS_LIST = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var NUMBER_ADS = 8;
var NUMBER_AVATARS = 8;
var avatarList = [];
var ads = [];

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

var getAvatarArray = function (avatar) {
  for (var avatarElement = 0; avatarElement < NUMBER_AVATARS; avatarElement++) {
    var avatarElementNumber = avatarElement + 1;
    avatarList[avatarElement] = 'img/avatars/user0' + avatarElementNumber + '.png';
  }

  return avatar;
};

var numberRand = function (from, to) {
  return Math.floor(Math.random() * (to - from + 1) + from);
};

var createAd = function (element) {
  var locationX = numberRand(50, 1150);
  var locationY = numberRand(130, 630);

  element = {
    author: {
      avatar: getAvatarArray(avatarList)
    },
    offer: {
      title: 'Заголовок предложения',
      address: String(locationX) + ',' + String(locationY),
      price: numberRand(200, 2000),
      type: arrayRandElement(TYPE_LIST),
      rooms: numberRand(1, 5),
      guests: numberRand(1, 10),
      checkin: arrayRandElement(CHECK_LIST),
      checkout: arrayRandElement(CHECK_LIST),
      features: FEATURES_LIST.slice(numberRand(0, 3), numberRand(4, 7)),
      description: 'Строка с описанием',
      photos: PHOTOS_LIST.slice(numberRand(0, 1), numberRand(2, 3))
    },
    location: {
      x: locationX,
      y: locationY
    }
  };

  return element;
};


for (var j = 0; j < NUMBER_ADS; j++) {
  ads[j] = createAd(ads[j]);
  ads[j].author.avatar = avatarList[j];
}

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.setAttribute('style', 'left: ' + pin.location.x + 'px; top: ' + pin.location.y + 'px;');
  pinElement.querySelector('img').setAttribute('src', pin.author.avatar);
  pinElement.querySelector('img').setAttribute('alt', pin.offer.title);

  return pinElement;
};

var fragment = document.createDocumentFragment();
for (var i = 0; i < ads.length; i++) {
  fragment.appendChild(renderPin(ads[i]));
}
mapPins.appendChild(fragment);
