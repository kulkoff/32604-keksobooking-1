'use strict';

(function () {

  var pinFilter = document.querySelector('.map__filters');
  var pinContainer = document.querySelector('.map__pins');
  var pinSelectors = Array.from(pinFilter.querySelectorAll('select'));
  var pinInputs = Array.from(pinFilter.querySelectorAll('input'));
  var filterObject = {};
  var prevTimer;

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
        .slice(0, 5);

    pinNodes.forEach(function (pinNode) {
      if (filteredPins.includes(pinNode)) {
        pinNode.classList.remove('hidden');
      } else {
        pinNode.classList.add('hidden');
      }

      if (pinNode.classList.contains('map__pin--active') && pinNode.classList.contains('hidden')) {
        window.pin.deactivatePin();
        window.card.removePopup(document.querySelector('.popup'));
      }
    });
  };


})();
