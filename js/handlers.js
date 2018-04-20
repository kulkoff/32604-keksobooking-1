'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  var pinContainer = document.querySelector('.map__pins');
  var map = document.querySelector('section.map');
  var body = document.querySelector('body');
  var pinMain = document.querySelector('.map__pin--main');

  // клик на нажатие пина
  pinContainer.addEventListener('click', function (e) {
    var target = e.target.parentNode;
    if (target.tagName !== 'BUTTON' || target.classList.contains('map__pin--main')) {
      return;
    }
    window.pin.changeSelectPinActive(target);
    window.card.removePopup();
    window.card.createPopup(map, target.pinData);

    document.addEventListener('keydown', onPopEscPress); // Закрытие на ESC

  });
  // Закрытие попапа на крестик
  map.addEventListener('click', function (e) {
    var target = e.target;
    if (target.tagName === 'BUTTON' && target.classList.contains('popup__close')) {
      window.card.removePopup();
      window.pin.changeSelectPinActive(target);
    }

  });
  // Закрытие попапа на крестик ENTERом
  map.addEventListener('keydown', function (e) {
    var target = e.target;
    if (target.tagName === 'BUTTON' && target.classList.contains('popup__close') && e.keyCode === ENTER_KEYCODE) {
      window.card.removePopup();
      window.pin.changeSelectPinActive(target);
    }

  });

  // Обработчик нажатия на ESC
  function onPopEscPress(event) {
    var popup = document.querySelector('.popup');
    if (popup && event.keyCode === ESC_KEYCODE) {
      window.card.removePopup();
      window.pin.deactivatePin();
      document.removeEventListener('keydown', onPopEscPress);
    }
  }

  // Открываем попап на ENTER
  pinContainer.addEventListener('keydown', function (e) {
    if (e.target.tagName !== 'BUTTON' || e.target.classList.contains('map__pin--main') || e.keyCode !== ENTER_KEYCODE) {
      return;
    }
    window.pin.changeSelectPinActive(e.target);
    window.card.removePopup();
    window.card.createPopup(e.target.pinData);

    document.addEventListener('keydown', onPopEscPress);
  });

  // Перемещение пина
  pinMain.addEventListener('mousedown', function (e) {
    e.preventDefault();
    var startCoords = {
      x: e.clientX,
      y: e.clientY
    };

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var limitYTop = 100 - 81;
      var limitYBottom = 500 - 81;
      var limitXLeft = body.offsetLeft - 32.5;
      var limitXRight = body.offsetLeft + body.offsetWidth - 32.5;

      // Высчитываем рамки для передвижения пина
      var pinPlaceY = pinMain.offsetTop - shift.y;
      var pinPlaceX = pinMain.offsetLeft - shift.x;

      if (pinPlaceY > limitYBottom) {
        pinPlaceY = limitYBottom;
      } else if (pinPlaceY < limitYTop) {
        pinPlaceY = limitYTop;
      } else {
        pinPlaceY = pinMain.offsetTop - shift.y;
      }

      if (pinPlaceX > limitXRight) {
        pinPlaceX = limitXRight;
      } else if (pinPlaceX < limitXLeft) {
        pinPlaceX = limitXLeft;
      } else {
        pinPlaceX = pinMain.offsetLeft - shift.x;
      }

      pinMain.style.top = pinPlaceY + 'px';
      pinMain.style.left = pinPlaceX + 'px';

      fillCoordinates();
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);

  });

  // Отправка формы
  var buttonForm = document.querySelector('.ad-form__submit');
  var formReset = document.querySelector('.ad-form__reset');
  var formData = document.querySelector('.ad-form');
  // var onErrorCallback = errorCallback();
  buttonForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(formData), function () {
      formReset.click();
    }, onErrorCallback);
  });

  var onErrorCallback = function (errorMessage) {
    var errorNode = document.createElement('div');
    errorNode.style = 'z-index: 100; top: 1600px; position: absolute; margin: 0 auto; width: 1200px; height: 40px; text-align: center;  background-color: rgb(253, 94, 83); font-size: 35px; color: white;';
    errorNode.textContent = errorMessage + ' Пожалуйста перезагрузите страницу.';
    document.body.insertAdjacentElement('afterbegin', errorNode);
  }

  // Функция получения координат
  function fillCoordinates() {
    var xCoordinate = parseInt(document.querySelector('.map__pin--main').style.left, 10) + 32;
    var yCoordinate = parseInt(document.querySelector('.map__pin--main').style.top, 10) + 65 + 16;
    var inputCoordinates = document.querySelector('#address');
    inputCoordinates.disabled = false;
    inputCoordinates.readOnly = true;
    inputCoordinates.value = xCoordinate + ', ' + yCoordinate;
  }
})();


