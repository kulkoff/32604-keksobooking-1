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
        listItems.push('<li class="feature feature--' + pinData.offer.features[j] + '"></li>');
      }
      advert.querySelector('.popup__features').innerHTML = listItems.join(' ');
      advert.querySelector('.popup__avatar').src = pinData.author.avatar;
      advert.querySelector('.popup__photo').src = pinData.offer.photos;

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



  // Функция удаления попапа

})();