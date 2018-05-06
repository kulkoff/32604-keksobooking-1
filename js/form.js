'use strict';

(function () {

  var form = document.querySelector('.ad-form ');
  var map = document.querySelector('.map');
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
