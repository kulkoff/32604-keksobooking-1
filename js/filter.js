'use strict';

(function () {

  var pinFilter = document.querySelector('.map__filters');
  var pinContainer = document.querySelector('.map__pins');
  var pinSelectors = Array.from(pinFilter.querySelectorAll('select'));
  var pinInputs = Array.from(pinFilter.querySelectorAll('input'));
  var filterObject = {};
  var prevTimer;

  // Событие клика на фильтр, создание динамического объекта с фильтрами
  pinFilter.addEventListener('change', function () {
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
  });

  // Функця фильтрации пинов
  function filterPins() {
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
      } else if (isPassed === true && pinNode.classList.contains('hidden') === true) {
        pinNode.classList.remove('hidden');
      }
    });
  }

  // Проервка совпадения цены
  function priceFilter(value) {
    if (filterObject.price === 'middle') {
      return value >= 10000 && value <= 50000;
    } else if (filterObject.price === 'low') {
      return value < 10000;
    } else if (filterObject.price === 'high') {
      return value > 50000;
    }
    return false;
  }

  // Проверка совпадния удобств
  function featuresFilter(value) {
    if (filterObject.features.length === 0) {
      return true;
    }
    var featureIn = true;
    featureIn = filterObject.features.every(function (feature) {
      return value.includes(feature);
    });
    return featureIn;
  }

})();
