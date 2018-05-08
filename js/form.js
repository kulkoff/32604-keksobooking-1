'use strict';

(function () {

  var ROOMS_TO_CAPACITY = {
    '1': [2],
    '2': [1, 2],
    '3': [0, 1, 2],
    '100': [3]
  };
  var TYPES_MIN_PRICES = {
    palace: 10000,
    flat: 1000,
    house: 5000,
    bungalo: 0
  };
  var form = document.querySelector('.ad-form ');
  var map = document.querySelector('.map');
  var typeRoom = document.querySelector('#type');
  var priceRoom = document.querySelector('#price');
  var timeIn = document.querySelector('#timein');
  var timeOut = document.querySelector('#timeout');
  var numberOfRoom = document.querySelector('#room_number');
  var capacityRoom = document.querySelector('#capacity');

  numberOfRoom.addEventListener('change', function (e) {
    var roomsNumber = e.target.value;
    var indexesToEnable = ROOMS_TO_CAPACITY[roomsNumber];

    for (var i = 0; i < capacityRoom.length; i++) {
      capacityRoom.options[i].disabled = !indexesToEnable.includes(i);
      capacityRoom.options[i].selected = false;
    }
    capacityRoom.options[indexesToEnable[0]].selected = true;
  });

  // Синхронизация типа жилья с ценой
  var changePriceInput = function (price) {
    priceRoom.setAttribute('placeholder', price);
    priceRoom.setAttribute('min', price);
  };

  var onHousingTypeChange = function (e) {
    changePriceInput(TYPES_MIN_PRICES[e.target.value]);
  };
  typeRoom.addEventListener('change', onHousingTypeChange);

  // Синхронизация времени;
  timeIn.addEventListener('change', function (e) {
    timeOut.value = e.target.value;
  });
  timeOut.addEventListener('change', function (e) {
    timeIn.value = e.target.value;
  });

  window.form = {
    enableFields: function () {
      var formFieldsets = document.querySelectorAll('.ad-form fieldset');
      for (var i = 0; i < formFieldsets.length; i++) {
        formFieldsets[i].disabled = false;
      }
      map.classList.remove('map--faded');
      form.classList.remove('ad-form--disabled');
    },

    disableFields: function () {
      var formFieldsets = document.querySelectorAll('.ad-form fieldset');
      for (var i = 0; i < formFieldsets.length; i++) {
        formFieldsets[i].disabled = true;
      }
      map.classList.add('map--faded');
      form.classList.add('ad-form--disabled');
    }
  };


})();
