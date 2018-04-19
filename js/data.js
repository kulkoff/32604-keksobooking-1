'use strict';

(function () {

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

  // Функция генерации объекта

  window.data = {
    createPinData: function (id) {
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
  };


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
})();
