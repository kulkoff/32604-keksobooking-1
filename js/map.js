'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

// Объявляю переменные, которые в будущем буду использовать для генерации объекта

var types = ['palace', 'flat', 'house', 'bungalo'];
var titles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];
var minPrice = 1000;
var maxPrice = 1000000;
var roomsMin = 1;
var roomsMax = 5;
var minGuest = 1;
var maxGuest = 6;
var times = ['12-00', '13-00', '14-00'];
var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var featuresMin = 0;
var minXLocation = 300;
var maxXLocation = 900;
var minYLocation = 100;
var maxYLocation = 500;
var photoLinks = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

// DOM - элементы
var pinContainer = document.querySelector('.map__pins');
var buttonTemplate = document.querySelector('template').content.querySelector('button.map__pin');
var articleTemplate = document.querySelector('template').content.querySelector('article');
var map = document.querySelector('section.map');
var fragmentPin = document.createDocumentFragment();

// Элементы формы и карты
var formFieldsets = document.querySelectorAll('.ad-form fieldset');
var form = document.querySelector('.ad-form ');
var pinMain = document.querySelector('.map__pin--main');

var typeRoom = document.querySelector('#type');
var priceRoom = document.querySelector('#price');
var timeIn = document.querySelector('#timein');
var timeOut = document.querySelector('#timeout');
var numberOfRoom = document.querySelector('#room_number');
var capacityRoom = document.querySelector('#capacity');


// Синхронизация типа жилья с ценой
typeRoom.addEventListener('change', function () {
  if (typeRoom.options[0].selected === true) {
    priceRoom.min = 1000;
    priceRoom.placeholder = 'от 1000 рублей';
  } else if (typeRoom.options[1].selected === true) {
    priceRoom.min = 0;
    priceRoom.placeholder = 'от 0 рублей';
  } else if (typeRoom.options[2].selected === true) {
    priceRoom.min = 5000;
    priceRoom.placeholder = 'от 5000 рублей';
  } else if (typeRoom.options[3].selected === true) {
    priceRoom.min = 10000;
    priceRoom.placeholder = 'от 10000 рублей';
  }
});

// Синхронизация времени;
timeIn.addEventListener('change', function () {
  if (timeIn.options[0].selected === true) {
    timeOut.options[0].selected = true;
  } else if (timeIn.options[1].selected === true) {
    timeOut.options[1].selected = true;
  } else if (timeIn.options[2].selected === true) {
    timeOut.options[2].selected = true;
  }
});
timeOut.addEventListener('change', function () {
  if (timeOut.options[0].selected === true) {
    timeIn.options[0].selected = true;
  } else if (timeOut.options[1].selected === true) {
    timeIn.options[1].selected = true;
  } else if (timeOut.options[2].selected === true) {
    timeIn.options[2].selected = true;
  }
});

// Синхронизация количества комнат и гостей;
numberOfRoom.addEventListener('change', function () {
  if (numberOfRoom.options[0].selected === true) {
    capacityRoom.options[0].disabled = true;
    capacityRoom.options[1].disabled = true;
    capacityRoom.options[2].disabled = false;
    capacityRoom.options[2].selected = true;
    capacityRoom.options[3].disabled = true;
  } else if (numberOfRoom.options[1].selected === true) {
    capacityRoom.options[0].disabled = true;
    capacityRoom.options[1].disabled = false;
    capacityRoom.options[1].selected = true;
    capacityRoom.options[2].disabled = false;
    capacityRoom.options[3].disabled = true;
  } else if (numberOfRoom.options[2].selected === true) {
    capacityRoom.options[0].disabled = false;
    capacityRoom.options[1].disabled = false;
    capacityRoom.options[2].disabled = false;
    capacityRoom.options[0].selected = true;
    capacityRoom.options[3].disabled = true;
  } else if (numberOfRoom.options[3].selected === true) {
    capacityRoom.options[0].disabled = true;
    capacityRoom.options[1].disabled = true;
    capacityRoom.options[2].disabled = true;
    capacityRoom.options[3].disabled = false;
    capacityRoom.options[3].selected = true;
  }
});

// Добавляю disable форме
disableFields(formFieldsets);

// Активация карты
pinMain.addEventListener('mouseup', drawPins);

// клик на нажатие пина
pinContainer.addEventListener('click', function (e) {
  var target = e.target.parentNode;
  if (target.tagName !== 'BUTTON' || target.classList.contains('map__pin--main')) {
    return;
  }
  changeSelectPinActive(target);
  removePopup();
  createPopup(target.pinData);

  document.addEventListener('keydown', onPopEscPress); // Закрытие на ESC

});

// Закрытие попапа на крестик
map.addEventListener('click', function (e) {
  var target = e.target;
  if (target.tagName === 'BUTTON' && target.classList.contains('popup__close')) {
    removePopup();
    changeSelectPinActive(target);
  }

});


// Открываем попап на ENTER
pinContainer.addEventListener('keydown', function (e) {
  if (e.target.tagName !== 'BUTTON' || e.target.classList.contains('map__pin--main') || e.keyCode !== ENTER_KEYCODE) {
    return;
  }
  changeSelectPinActive(e.target);
  removePopup();
  createPopup(e.target.pinData);

  document.addEventListener('keydown', onPopEscPress);
});

// Закрытие попапа на крестик
map.addEventListener('keydown', function (e) {
  var target = e.target;
  if (target.tagName === 'BUTTON' && target.classList.contains('popup__close') && e.keyCode === ENTER_KEYCODE) {
    removePopup();
    changeSelectPinActive(target);
  }

});

// Функция, которая генерируем массив с объектами и отрисовываем кнопки
function drawPins() {
  map.classList.remove('map--faded');
  enableFields(formFieldsets);
  fillCoordinates();
  for (var id = 1; id <= 8; id++) {
    var pinData = createPinData(id);
    var pinNode = createPinButton(pinData);
    pinNode.pinData = pinData;
    fragmentPin.appendChild(pinNode);
    pinContainer.appendChild(fragmentPin);
    pinMain.removeEventListener('mouseup', drawPins);
  }
}

// Функция скрывающая поля
function disableFields(arrayFields) {
  for (var i = 0; i < arrayFields.length; i++) {
    arrayFields[i].disabled = true;
  }
  map.classList.add('map--faded');
  form.classList.add('ad-form--disabled');
}

// Функция отображения скрытых полей
function enableFields(arrayFields) {
  for (var i = 0; i < arrayFields.length; i++) {
    arrayFields[i].disabled = false;
  }
  map.classList.remove('map--faded');
  form.classList.remove('ad-form--disabled');
}
// Функция генерации объекта
function createPinData(id) {
  var xCoord = getRandomNumber(minXLocation, maxXLocation);
  var yCoord = getRandomNumber(minYLocation, maxYLocation);

  return {
    author: {
      avatar: 'img/avatars/user0' + id + '.png'
    },
    offer: {
      title: titles.shift(),
      address: xCoord + ', ' + yCoord,
      price: getRandomNumber(minPrice, maxPrice),
      type: getRandomNumberOfArray(types),
      rooms: getRandomNumber(roomsMin, roomsMax),
      guests: getRandomNumber(minGuest, maxGuest),
      checkin: getRandomNumberOfArray(times),
      checkout: getRandomNumberOfArray(times),
      features: makeRandomLengthArray(featuresList),
      description: '',
      photos: getRandomNumberOfArray(photoLinks)
    },
    location: {
      x: xCoord,
      y: yCoord
    }
  };
}

// Функция генерации метки
function createPinButton(pinData) {
  var button = buttonTemplate.cloneNode(true);
  button.querySelector('img').src = pinData.author.avatar;
  button.style.left = pinData.location.x - 20 + 'px';
  button.style.top = pinData.location.y - 20 + 'px';

  return button;
}

// Функция генерации объявления
function renderAdvertOnMap(pinData) {
  var advert = articleTemplate.cloneNode(true);
  advert.querySelector('.popup__title').textContent = pinData.offer.title;
  advert.querySelector('.popup__text--address').textContent = pinData.offer.address;
  advert.querySelector('.popup__text--price').innerHTML = pinData.offer.price + ' &#x20bd;/ночь';

  var typeOfAccommodation;
  if (pinData.offer.type === 'flat') {
    typeOfAccommodation = 'Квартира';
  } else if (pinData.offer.type === 'bungalo') {
    typeOfAccommodation = 'Бунгало';
  } else {
    typeOfAccommodation = 'Дом';
  }

  advert.querySelector('.popup__type').textContent = typeOfAccommodation;
  advert.querySelector('.popup__text--capacity').textContent = pinData.offer.rooms + ' комнаты' + ' для ' + pinData.offer.guests + ' гостей';
  advert.querySelector('.popup__text--time').textContent = 'Заезд после ' + pinData.offer.checkin + ', выезд до ' + pinData.offer.checkout;
  var listItems = [];
  for (var j = 0; j < pinData.offer.features.length; j++) {
    listItems.push('<li class="feature feature--' + pinData.offer.features[j] + '"></li>');
  }
  advert.querySelector('.popup__features').innerHTML = listItems.join(' ');
  advert.querySelector('.popup__avatar').src = pinData.author.avatar;
  advert.querySelector('.popup__photo').src = pinData.offer.photos;

  return advert;
}

// Функция смены класса активного пина
function changeSelectPinActive(targetNode) {
  var activePinNode = document.querySelector('.map__pin--active');
  if (activePinNode) {
    activePinNode.classList.remove('map__pin--active');
  }
  targetNode.classList.add('map__pin--active');
}

// Функция деактивации пина
function deactivatePin() {
  var activePinNode = document.querySelector('.map__pin--active');
  if (activePinNode) {
    activePinNode.classList.remove('map__pin--active');
  }
}

// Функция получения координат пина
function fillCoordinates() {
  var xCoordinate = parseInt(document.querySelector('.map__pin--main').style.left, 10) + 32.5;
  var yCoordinate = parseInt(document.querySelector('.map__pin--main').style.top, 10) + 65 + 16;
  var inputCoordinates = document.querySelector('#address');
  inputCoordinates.value = xCoordinate + ', ' + yCoordinate;
}

// Функция генерации попапа

function createPopup(pinData) {
  var noticeNode = renderAdvertOnMap(pinData);
  var fragmentAdvert = fragmentPin.appendChild(noticeNode);
  map.appendChild(fragmentAdvert);
}

// Удаляю попап

function removePopup() {
  var popup = map.querySelector('.popup');
  if (popup) {
    popup.remove();
  }
}


// Обработчик нажатия на ESC
function onPopEscPress(event) {
  var popup = map.querySelector('.popup');
  if (popup && event.keyCode === ESC_KEYCODE) {
    removePopup();
    deactivatePin();
    document.removeEventListener('keydown', onPopEscPress);
  }
}

// Функции рандомайзеры
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomNumberOfArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function makeRandomLengthArray(array) {
  return array.slice(getRandomNumber(featuresMin, featuresList.length));
}
