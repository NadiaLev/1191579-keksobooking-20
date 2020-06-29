'use strict';

var ELEMENTS_AMOUNT = 8;
var MIN_FEATURES = 0;
var MIN_PHOTOS = 0;

var COUNT_X = {
  min: 50,
  max: 1150
};

var COUNT_Y = {
  min: 130,
  max: 630
};

var PRICE = {
  min: 200,
  max: 2000
};

var ROOMS = {
  min: 1,
  max: 5
};

var GUESTS = {
  min: 1,
  max: 10
};

var TYPE_LIST = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец'
};

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
    var locationX = getRandomNumber(COUNT_X.min, COUNT_X.max);
    var locationY = getRandomNumber(COUNT_Y.min, COUNT_Y.max);

    var element = {
      author: {
        avatar: 'img/avatars/user0' + (i + 1) + '.png'
      },
      offer: {
        title: 'Заголовок предложения',
        address: String(locationX) + ',' + String(locationY),
        price: getRandomNumber(PRICE.min, PRICE.max),
        type: getArrayRandElement(TYPE_LIST),
        rooms: getRandomNumber(ROOMS.min, ROOMS.max),
        guests: getRandomNumber(GUESTS.min, GUESTS.max),
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

var renderPin = function (pin) {
  var pinElement = pinTemplate.cloneNode(true);

  pinElement.setAttribute('style', 'left: ' + pin.location.x + 'px; top: ' + pin.location.y + 'px;');
  pinElement.querySelector('img').setAttribute('src', pin.author.avatar);
  pinElement.querySelector('img').setAttribute('alt', pin.offer.title);

  return pinElement;
};

var fragment = document.createDocumentFragment();

var ads = createArrayOfObjects(ELEMENTS_AMOUNT);

for (var i = 0; i < ads.length; i++) {
  fragment.appendChild(renderPin(ads[i]));
}
mapPins.appendChild(fragment);

var cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.map__card');


var renderCard = function (card) {
  var cardElement = cardTemplate.cloneNode(true);

  cardElement.querySelector('.popup__title').textContent = card.offer.title;
  cardElement.querySelector('.popup__text--address').textContent = card.offer.address;
  cardElement.querySelector('.popup__text--price').textContent = card.offer.price + '₽/ночь';
  cardElement.querySelector('.popup__type').textContent = TYPE_LIST[card.offer.type];
  cardElement.querySelector('.popup__text--capacity').textContent = card.offer.rooms + ' комнаты для ' + card.offer.guests + ' гостей';
  cardElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + card.offer.checkin + ',' + ' выезд до ' + card.offer.checkout;

  var features = cardElement.querySelector('.popup__features');
  var featureItem = features.querySelector('.popup__feature');
  features.innerHTML = '';
  card.offer.features.forEach(function (item) {
    var newFeatureItem = featureItem.cloneNode();
    newFeatureItem.className = '';
    newFeatureItem.classList.add('popup__feature', 'popup__feature--' + item);
    newFeatureItem.textContent = item;
    features.appendChild(newFeatureItem);
  });

  cardElement.querySelector('.popup__description').textContent = card.offer.description;

  var photos = cardElement.querySelector('.popup__photos');
  var photosItem = photos.querySelector('.popup__photo');
  photos.innerHTML = '';
  card.offer.photos.forEach(function (item) {
    var newPhotoItem = photosItem.cloneNode();
    newPhotoItem.src = item;
    photos.appendChild(newPhotoItem);
  });

  return cardElement;
};

map.insertBefore(renderCard(ads[0]), document.querySelector('.map__filters-container'));
