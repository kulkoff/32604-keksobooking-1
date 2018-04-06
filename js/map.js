'use strict';

// Объявляю переменные, которые в будущем буду использовать для генерации объекта

var types = ['flat', 'house', 'bungalo'];
var titles = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var minPrice = 1000;
var maxPrice = 1000000;
var roomsMin = 1;
var roomsMax = 5;
var minGuest = 1;
var maxGuest = 6;
var times = ['12-00', '13-00', '14-00'];
var featuresList = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var featuresMin = 0;
var featuresMax = featuresList.length;
var minXLocation = 300;
var maxXLocation = 900;
var minYLocation = 100;
var maxYLocation = 500;

var mapObjects = []; // Пустой массив, в который вставляем объект

// DOM - элементы
var buttonElement = document.querySelector('.map__pins');
var buttonTemplate = document.querySelector('template').content.querySelector('button.map__pin');
var articleTemplate = document.querySelector('template').content.querySelector('article');
var articleElement = document.querySelector('section.map');

var fragment = document.createDocumentFragment();


// Убираю класс
document.querySelector('.map').classList.remove('map--faded');

// Генерируем массив с объектами
for (var i = 1; i <= 8; i++) {
  mapObjects.push(createObjectMap());
}
// Отрисовываем кнопки
for (i = 0; i < 8; i++) {
  fragment.appendChild(renderButtonMap(mapObjects));
}
buttonElement.appendChild(fragment);

// Отрисовываем объявление
for (i = 0; i < 1; i++) {
  var fragmentAdvert = fragment.appendChild(renderArticleMap(mapObjects));
  articleElement.appendChild(fragmentAdvert);
}

// Функция генерации объекта
function createObjectMap() {
  var xCoord = getRandomNumber(minXLocation, maxXLocation);
  var yCoord = getRandomNumber(minYLocation, maxYLocation);

  return {
    author: {
      avatar: 'img/avatars/user0' + i + '.png'
    },
    offer: {
      title: titles[i - 1],
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
function renderButtonMap(object) {
  var button = buttonTemplate.cloneNode(true);
  button.querySelector('img').src = object[i].author.avatar;
  button.style.left = object[i].location.x - 20 + 'px';
  button.style.top = object[i].location.y - 20 + 'px';

  return button;
}

// Функция генерации объявления
function renderArticleMap(object) {
  var advert = articleTemplate.cloneNode(true);
  advert.querySelector('.popup__title').textContent = object[i].offer.title;
  advert.querySelector('.popup__text--address').textContent = object[i].offer.address;
  advert.querySelector('.popup__text--price').innerHTML = object[i].offer.price + '&#x20bd;/ночь';

  var typeOfAccommodation;
  if (object[i].offer.type === 'flat') {
    typeOfAccommodation = 'Квартира';
  } else if (object[i].offer.type === 'bungalo') {
    typeOfAccommodation = 'Бунгало';
  } else {
    typeOfAccommodation = 'Дом';
  }

  advert.querySelector('.popup__type').textContent = typeOfAccommodation;
  advert.querySelector('.popup__text--capacity').textContent = object[i].offer.rooms + 'комнат' + ' для ' + object[i].offer.guests + ' гостей';
  advert.querySelector('.popup__text--time').textContent = 'Заезд после ' + object[i].offer.checkin + ', выезд до ' + object[i].offer.checkout;
  var listItems = [];
  for (var j = 0; j < object[i].offer.features.length; j++) {
    listItems.push('<li class="feature feature--' + object[i].offer.features[j] + '"></li>');
  }
  advert.querySelector('.popup__features').innerHTML = listItems.join(' ');
  advert.querySelector('.popup__avatar').src = object[i].author.avatar;

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
  return array.slice(getRandomNumber(featuresMin, featuresMax));
}
