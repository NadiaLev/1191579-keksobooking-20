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
  width: 65,
  height: 65,
  tipHeight: 16
};

var TYPE_LIST = {
  'flat': 'Квартира',
  'bungalo': 'Бунгало',
  'house': 'Дом',
  'palace': 'Дворец'
};

var typeHousingMap = {
  'bungalo': {
    min: 0,
    max: 1000000
  },
  'flat': {
    min: 1000,
    max: 1000000
  },
  'house': {
    min: 5000,
    max: 1000000
  },
  'palace': {
    min: 10000,
    max: 1000000
  }
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

var roomForGuestsMap = {
  '1': ['1'],
  '2': ['2', '1'],
  '3': ['3', '2', '1'],
  '100': ['0'],
};

var pageActive = false;

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
var setMainPinCoords = function () {
  var addressInput = adForm.querySelector('#address');
  if (pageActive === true) {
    addressInput.value = (parseInt(mapPinMain.style.left, 10) + Math.round(PIN_SIZE.width / 2)) + ', ' + (parseInt(mapPinMain.style.top, 10) + PIN_SIZE.height + PIN_SIZE.tipHeight);
  } else {
    addressInput.value = (parseInt(mapPinMain.style.left, 10) + Math.round(PIN_SIZE.width / 2)) + ', ' + (parseInt(mapPinMain.style.top, 10) + Math.round(PIN_SIZE.height / 2));
  }
};
setMainPinCoords();

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

var ads = createArrayOfObjects(ELEMENTS_AMOUNT);

var renderAllPins = function () {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < ads.length; i++) {
    fragment.appendChild(renderPin(ads[i]));
  }
  return fragment;
};

//  функция перехода в активное состояние------------------
var goToActiveStatus = function () {
  pageActive = true;
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  mapFiltersForm.classList.remove('map__filters--disabled');

  for (var input = 0; input < fieldsets.length; input++) {
    fieldsets[input].removeAttribute('disabled', '');
  }//  переменную i не получается написать, бьет ошибку, даже внутри функции

  mapPins.appendChild(renderAllPins());
  setMainPinCoords();
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
  priceInput.value = '';
  var key = evt.target.value;
  if (typeHousingMap[key]) {
    priceInput.setAttribute('placeholder', typeHousingMap[key].min);
  }
});

//  priceInput (цена за ночь)--------------------
priceInput.addEventListener('input', function () {
  var value = Number(priceInput.value);
  var minValue = Number(priceInput.placeholder);

  if (priceInput.value > MAX_PRICE_VALUE) {
    priceInput.setCustomValidity('Максимальное значение: ' + MAX_PRICE_VALUE);
    return;
  }
  if (value < minValue) {
    priceInput.setCustomValidity('Минимальное значение: ' + minValue);
    return;
  }

  priceInput.setCustomValidity('');

});

//  room_number (количество комнат)
var roomNumberInput = adForm.querySelector('#room_number');
var capacityInput = adForm.querySelector('#capacity');


function changeRoomNumberValue(value) {
  Array.from(capacityInput.options).forEach(function (option) {
    if (roomForGuestsMap[value].includes(option.value)) {
      option.disabled = false;
    } else {
      option.disabled = true;
    }
  });
  capacityInput.value = value > 3 ? '0' : value;
}

changeRoomNumberValue(roomNumberInput.value);

function onChangeRooms(evt) {
  changeRoomNumberValue(evt.currentTarget.value);
}
roomNumberInput.addEventListener('change', onChangeRooms);

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
