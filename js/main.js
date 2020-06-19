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
var MIN_FEATURES = 0;
var MIN_PHOTOS = 0;

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

var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('map__card');

var getArrayRandElement = function (arr) {
  var rand = Math.floor(Math.random() * arr.length);
  return arr[rand];
};

var getRandomNumber = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var createArrayOfObjects = function (count) {
  var result = [];
  var featuresLength = FEATURES_LIST.length - 1;
  var photosLength = PHOTOS_LIST.length - 1;

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
        type: getArrayRandElement(TYPE_LIST),
        rooms: getRandomNumber(MIN_ROOMS, MAX_ROOMS),
        guests: getRandomNumber(MIN_GUESTS, MAX_GUESTS),
        checkin: getArrayRandElement(CHECK_LIST),
        checkout: getArrayRandElement(CHECK_LIST),
        features: FEATURES_LIST.slice(getRandomNumber(MIN_FEATURES, featuresLength)),
        description: 'Строка с описанием',
        photos: PHOTOS_LIST.slice(getRandomNumber(MIN_PHOTOS, photosLength))
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

var ads = createArrayOfObjects(ELEMENTS_AMOUNT);

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

var renderCard = function (card) {
  var cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('.popup__title').textContent = card.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '&#8381/ночь';

  if (card.offer.type === 'flat') {
    cardElement.querySelector('.popup__type').textContent = 'Квартира';
  } else if (card.offer.type === 'bungalo') {
    cardElement.querySelector('.popup__type').textContent = 'Бунгало';
  } else if (card.offer.type === 'house') {
    cardElement.querySelector('.popup__type').textContent = 'Дом';
  } else {
    cardElement.querySelector('.popup__type').textContent = 'Дворец';
  }

  cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ',' + ' выезд до ' + card.offer.checkout;

  for (var j = 0; j < card.offer.features.length; j++) {
    var popupFeatures = cardElement.querySelector('.popup__features');
    if (card.offer.features[j] === 'wifi') {
      popupFeatures.children[0].textContent = 'wifi';
    } else {
      popupFeatures.children[0].remove();
    }

    if (card.offer.features[j] === 'dishwasher') {
      popupFeatures.children[1].textContent = 'dishwasher';
    } else {
      popupFeatures.children[1].remove();
    }

    if (card.offer.features[j] === 'parking') {
      popupFeatures.children[2].textContent = 'parking';
    } else {
      popupFeatures.children[2].remove();
    }

    if (card.offer.features[j] === 'washer') {
      popupFeatures.children[3].textContent = 'washer';
    } else {
      popupFeatures.children[3].remove();
    }

    if (card.offer.features[j] === 'elevator') {
      popupFeatures.children[4].textContent = 'elevator';
    } else {
      popupFeatures.children[4].remove();
    }

    if (card.offer.features[j] === 'conditioner') {
      popupFeatures.children[5].textContent = 'conditioner';
    } else {
      popupFeatures.children[5].remove();
    }
  }

  cardElement.querySelector('.popup__description').textContent = card.offer.description;

  var fragmentPhotos = document.createDocumentFragment();
  for (var photo = 0; photo < card.offer.photos.length; photo++) {
    fragmentPhotos.appendChild(cardElement.querySelector('.popup__photos').querySelector('.popup__photo').setAttribute('src', card.offer.photos[photo]));
  }
  cardElement.querySelector('.popup__photos').appendChild(fragment);

  cardElement.querySelector('.popup__avatar').setAttribute('src', card.author.avatar);

  return cardElement;
};

mapPins.insertAdjacentHTML('afterend', renderCard(ads[0]));
