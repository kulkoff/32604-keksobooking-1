'use strict';

(function () {

  // Функция генерации объявления
  window.card = {
    renderAdvertOnMap: function (pinData) {
      var articleTemplate = document.querySelector('template').content.querySelector('article');
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
        listItems.push('<li class="popup__feature popup__feature--' + pinData.offer.features[j] + '"></li>');
      }
      advert.querySelector('.popup__description').textContent = pinData.offer.description;
      advert.querySelector('.popup__features').innerHTML = listItems.join(' ');
      advert.querySelector('.popup__avatar').src = pinData.author.avatar;
      var imgItems = [];
      for (j = 0; j < pinData.offer.images.length; j++) {
        imgItems.push('<img src="' + pinData.offer.images[j] + '" class="popup__photo" width="45" height="40" style="margin-bottom: 5px" alt="Фотография жилья' + j + '">');
      }
      advert.querySelector('.popup__photos').innerHTML = imgItems.join(' ');

      return advert;
    },
    createPopup: function (parent, pinData) {
      var cardNode = window.card.renderAdvertOnMap(pinData);
      parent.appendChild(cardNode);
    },
    removePopup: function () {
      var popup = document.querySelector('.popup');
      if (popup) {
        popup.remove();
      }
    }
  };

})();
