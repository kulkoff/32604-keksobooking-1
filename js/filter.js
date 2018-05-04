'use strict';

(function () {

  var pinFilter = document.querySelector('.map__filters');
  var pinContainer = document.querySelector('.map__pins');
  var pinSelectors = Array.from(pinFilter.querySelectorAll('select'));
  var pinInputs = Array.from(pinFilter.querySelectorAll('input'));
  var filterObject = {};
  var prevTimer;


  var filterPins = function () {
    var indexCount = 0;
    var pinNodes = Array.from(pinContainer.children).slice(2);
    pinNodes.filter(function (pinNode) {

      var isPassed = true;
      var offer = pinNode.pinData.offer;
      for (var key in offer) {
        if (offer.hasOwnProperty(key)) {
          var isPassedKey;
          var value = offer[key];
          if (filterObject[key] === 'any') {
            continue;
          } else if (key === 'type') {
            isPassedKey = filterObject.type === value;
          } else if (key === 'rooms') {
            isPassedKey = filterObject.rooms === String(value);
          } else if (key === 'guests') {
            isPassedKey = filterObject.guests === String(value);
          } else if (key === 'price') {
            isPassedKey = priceFilter(value);
          } else if (key === 'features') {
            isPassedKey = featuresFilter(value);
          }
          if (isPassedKey === false) {
            isPassed = false;
            break;
          }
        }
      }
      if (isPassed === false) {
        pinNode.classList.add('hidden');
        var popup = document.querySelector('.popup');
        window.pin.deactivatePin();
        window.card.removePopup(popup);
      } else {
        indexCount++;
        popup = document.querySelector('.popup');
        window.pin.deactivatePin();
        window.card.removePopup(popup);
        if (indexCount <= 5) {
          if (isPassed === true && pinNode.classList.contains('hidden') === true) {
            pinNode.classList.remove('hidden');

          }
        } else {
          pinNode.classList.add('hidden');
          popup = document.querySelector('.popup');
          window.pin.deactivatePin();
          window.card.removePopup(popup);
        }
      }
    });
  };

  // Проервка совпадения цены
  var priceFilter = function (value) {
    if (filterObject.price === 'middle') {
      return value >= 10000 && value <= 50000;
    } else if (filterObject.price === 'low') {
      return value < 10000;
    } else if (filterObject.price === 'high') {
      return value > 50000;
    }
    return false;
  };

  // Проверка совпадния удобств
  var featuresFilter = function (value) {
    if (filterObject.features.length === 0) {
      return true;
    }
    var featureIn = true;
    featureIn = filterObject.features.every(function (feature) {
      return value.includes(feature);
    });
    return featureIn;
  };

  // Функця фильтрации пинов
  window.filter = {
    onFilterClick: function () {
      var features = [];
      pinSelectors.forEach(function (array) {
        filterObject[array.name.substr(8)] = array.value;
      });
      pinInputs.forEach(function (array) {
        if (array.checked) {
          features.push(array.value);
        }
      });
      filterObject.features = features;
      window.clearTimeout(prevTimer);
      prevTimer = window.setTimeout(function () {
        filterPins();
      }, 500);
    }
  };

  // Событие клика на фильтр, создание динамического объекта с фильтрами
  pinFilter.addEventListener('change', window.filter.onFilterClick);


})();
