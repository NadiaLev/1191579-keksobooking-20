'use strict';

var ELEMENTS_AMOUNT = 8;
var MIN_FEATURES = 0;
var MIN_PHOTOS = 0;
var MAX_PRICE_VALUE = 1000000;

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

var TITLE_LENGTH = {
  min: 30,
  max: 100
};

var PIN_SIZE = {
  circle: 62,
  tip: 22
};

var TYPE_LIST = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец'
};

var MIN_PRICE_VALUE = {
  'bungalo': 0,
  'flat': 1000,
  'house': 5000,
  'palace': 10000
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
var mapPins = map.querySelector('.map__pins');
var mapPinMain = map.querySelector('.map__pin--main');

var pinTemplate = document.querySelector('#pin')
  .content
  .querySelector('.map__pin');

//  неактивное состояние, блокировка полей ввода формы ad-form-----------------------------------------------------
var adForm = document.querySelector('.ad-form');
var fieldsets = adForm.querySelectorAll('fieldset');
for (var field = 0; field < fieldsets.length; field++) {
  fieldsets[field].setAttribute('disabled', '');
}

//  неактивное состояние, блокировка формы map__filters-----
var mapFiltersForm = map.querySelector('.map__filters');
mapFiltersForm.classList.add('map__filters--disabled');

//  неактивное состояние, отображение координат в поле адрес
var addressInput = adForm.querySelector('#address');
addressInput.value = (parseFloat(mapPinMain.style.left) + PIN_SIZE.circle / 2) + ', ' + (parseFloat(mapPinMain.style.top) + PIN_SIZE.circle + PIN_SIZE.tip);

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

//  функция перехода в активное состояние------------------
var goToActiveStatus = function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  mapFiltersForm.classList.remove('map__filters--disabled');

  for (var input = 0; input < fieldsets.length; input++) {
    fieldsets[input].removeAttribute('disabled', '');
  }//  переменную i не получается написать, бьет ошибку, даже внутри функции

  mapPins.appendChild(fragment);
};

//  перемещение метки, перевод в активное состояние--------
mapPinMain.addEventListener('mousedown', function (evt) {
  if (evt.button === 0) {
    goToActiveStatus();
  }
});

mapPinMain.addEventListener('keydown', function (evt) {
  if (evt.key === 'Enter') {
    goToActiveStatus();
  }
});

//  ограничения на поля ввода---------------------------

// titleInput (заголовок)--------------
var titleInput = adForm.querySelector('#title');

titleInput.addEventListener('input', function () {
  var titleLength = titleInput.value.length;

  if (titleLength < TITLE_LENGTH.min) {
    titleInput.setCustomValidity('Ещё ' + (TITLE_LENGTH.min - titleLength) + ' симв.');
  } else if (titleLength > TITLE_LENGTH.max) {
    titleInput.setCustomValidity('Удалите лишние ' + (titleLength - TITLE_LENGTH.max) + ' симв.');
  } else {
    titleInput.setCustomValidity('');
  }
});


//  typeInput (тип жилья)--------------------
var priceInput = adForm.querySelector('#price');
var typeInput = adForm.querySelector('#type');

typeInput.addEventListener('change', function (evt) {
  for (var key in MIN_PRICE_VALUE) {
    if (evt.target.value === key) {
      priceInput.setAttribute('placeholder', MIN_PRICE_VALUE[key]);
    }
  }
});

//  priceInput (цена за ночь)--------------------
priceInput.addEventListener('input', function () {
  if (priceInput.value > MAX_PRICE_VALUE) {
    priceInput.setCustomValidity('Максимальное значение: ' + MAX_PRICE_VALUE);
  } else {
    priceInput.setCustomValidity('');
  }

  if (priceInput.value < priceInput.placeholder) {
    priceInput.setCustomValidity('Минимальное значение: ' + priceInput.placeholder);
  } else {
    priceInput.setCustomValidity('');
  }

});

/*
//  room_number (количество комнат)
var roomNumberInput = adForm.querySelector('#room_number');
var capacityInput = adForm.querySelector('#capacity');


roomNumberInput.addEventListener('change', function (evt) {
  if (evt.target.value === '3') {
    for (var i = 0; i < capacityInput.length; i++) {
      if (capacityInput.options[i].value === 0) {
        capacityInput.options[i].setAttribute('disabled', '');
      }
    }
  }
});
*/

//  отрисовка карточек
/* var cardTemplate = document.querySelector('#card')
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

map.insertBefore(renderCard(ads[0]), document.querySelector('.map__filters-container'));*/
