'use strict';

(function () {

  var MAX_VISIBLE_OFFERS = 5;
  var LOW_PRICE = 10000;
  var HIGH_PRICE = 50000;

  var pinFilter = document.querySelector('.map__filters');
  var pinContainer = document.querySelector('.map__pins');
  var pinSelectors = Array.from(pinFilter.querySelectorAll('select'));
  var pinInputs = Array.from(pinFilter.querySelectorAll('input'));
  var filterObject = {};
  var prevTimer;

  // Проервка совпадения цены
  var priceFilter = function (value) {
    if (filterObject.price === 'middle') {
      return value >= LOW_PRICE && value <= HIGH_PRICE;
    } else if (filterObject.price === 'low') {
      return value < LOW_PRICE;
    } else if (filterObject.price === 'high') {
      return value > HIGH_PRICE;
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

  var filters = {
    type: null,
    rooms: null,
    guests: null,
    price: priceFilter,
    features: featuresFilter
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


  var filterPins = function () {
    var pinNodes = Array.from(pinContainer.children).slice(2);

    var filteredPins = pinNodes.filter(function (pinNode) {
      var offer = pinNode.pinData.offer;
      var filteredKeys = Object
          .keys(filters)
          .filter(function (filterKey) {
            var filterValue = filterObject[filterKey];
            var offerValue = offer[filterKey];

            // если фильтр имееть any, нет смысла далее проверять
            if (filterObject[filterKey] === 'any') {
              return true;
            }

            // преобразорвание типа данных
            if (['rooms', 'guests'].includes(filterKey)) {
              offerValue = String(offerValue);
            }

            var result;
            if (filters[filterKey] !== null) {
              // делегирование фильтрации функции
              result = filters[filterKey](offerValue);
            } else {
              // принимаем решение сами (без внешних функций)
              result = offerValue === filterValue;
            }

            return result;
          });

      return filteredKeys.length === Object.keys(filters).length;
    })
        .slice(0, MAX_VISIBLE_OFFERS);

    pinNodes.forEach(function (pinNode) {
      if (filteredPins.includes(pinNode)) {
        pinNode.classList.remove('hidden');
      } else {
        pinNode.classList.add('hidden');
      }

      if (pinNode.classList.contains('map__pin--active') && pinNode.classList.contains('hidden')) {
        window.pin.deactivatePinButton();
        window.card.removePopup(document.querySelector('.popup'));
      }
    });
  };


})();
