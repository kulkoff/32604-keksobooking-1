'use strict';

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

// DOM - элементы
var buttonElement = document.querySelector('.map__pins');
var buttonTemplate = document.querySelector('template').content.querySelector('button.map__pin');
var articleTemplate = document.querySelector('template').content.querySelector('article');
var articleElement = document.querySelector('section.map');

var fragmentPin = document.createDocumentFragment();


// Убираю класс
document.querySelector('.map').classList.remove('map--faded');

// Генерируем массив с объектами и отрисовываем кнопки
for (var i = 0; i < 8; i++) {
  var objectMap = createPin(i);
  fragmentPin.appendChild(renderButtonMap(objectMap));

  // Отрисовываем объявление
  if (i === 0) {
    var fragmentAdvert = fragmentPin.appendChild(renderArticleMap(objectMap));
    articleElement.appendChild(fragmentAdvert);
  }
  buttonElement.appendChild(fragmentPin);


}

// Функция генерации объекта
function createPin(id) {
  var xCoord = getRandomNumber(minXLocation, maxXLocation);
  var yCoord = getRandomNumber(minYLocation, maxYLocation);

  return {
    author: {
      avatar: 'img/avatars/user0' + (id + 1) + '.png'
    },
    offer: {
      title: titles[id - 1],
      address: xCoord + ', ' + yCoord,
      price: getRandomNumber(minPrice, maxPrice),
      type: getRandomNumberOfArray(types),
      rooms: getRandomNumber(roomsMin, roomsMax),
      guests: getRandomNumber(minGuest, maxGuest),
      checkin: getRandomNumberOfArray(times),
      checkout: getRandomNumberOfArray(times),
      features: makeRandomLengthArray(featuresList),
      description: '',
      photos: []
    },
    location: {
      x: xCoord,
      y: yCoord
    }
  };
}

// Функция генерации метки
function renderButtonMap(pinData) {
  var button = buttonTemplate.cloneNode(true);
  button.querySelector('img').src = pinData.author.avatar;
  button.style.left = pinData.location.x - 20 + 'px';
  button.style.top = pinData.location.y - 20 + 'px';

  return button;
}

// Функция генерации объявления
function renderArticleMap(pinData) {
  var advert = articleTemplate.cloneNode(true);
  advert.querySelector('.popup__title').textContent = pinData.offer.title;
  advert.querySelector('.popup__text--address').textContent = pinData.offer.address;
  advert.querySelector('.popup__text--price').innerHTML = pinData.offer.price + '&#x20bd;/ночь';

  var typeOfAccommodation;
  if (pinData.offer.type === 'flat') {
    typeOfAccommodation = 'Квартира';
  } else if (pinData.offer.type === 'bungalo') {
    typeOfAccommodation = 'Бунгало';
  } else {
    typeOfAccommodation = 'Дом';
  }

  advert.querySelector('.popup__type').textContent = typeOfAccommodation;
  advert.querySelector('.popup__text--capacity').textContent = pinData.offer.rooms + 'комнат' + ' для ' + pinData.offer.guests + ' гостей';
  advert.querySelector('.popup__text--time').textContent = 'Заезд после ' + pinData.offer.checkin + ', выезд до ' + pinData.offer.checkout;
  var listItems = [];
  for (var j = 0; j < pinData.offer.features.length; j++) {
    listItems.push('<li class="feature feature--' + pinData.offer.features[j] + '"></li>');
  }
  advert.querySelector('.popup__features').innerHTML = listItems.join(' ');
  advert.querySelector('.popup__avatar').src = pinData.author.avatar;

  return advert;
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
