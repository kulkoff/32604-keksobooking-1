'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var PIN_MIN_Y_VALUE = 150;
  var PIN_MAX_Y_VALUE = 500;

  var pinContainer = document.querySelector('.map__pins');
  var map = document.querySelector('section.map');
  var body = document.querySelector('body');
  var pinMain = document.querySelector('.map__pin--main');
  var pinButtonWidth = parseInt(getComputedStyle(pinMain).width, 10);
  var pinButtonHeight = parseInt(getComputedStyle(pinMain).height, 10) + parseInt(getComputedStyle(pinMain, 'after').height, 10);
  var pinInitialLeft = pinMain.style.left;
  var pinInitialTop = pinMain.style.top;

  // клик на нажатие пина
  pinContainer.addEventListener('click', function (e) {
    var target = e.target.parentNode;
    if (target.tagName !== 'BUTTON' || target.classList.contains('map__pin--main')) {
      return;
    }
    window.pin.setActive(target);
    window.card.removePopup();
    window.card.createPopup(map, target.pinData);
    window.images.bindListeners();

    document.addEventListener('keydown', onPopEscPress); // Закрытие на ESC

  });
  // Закрытие попапа на крестик
  map.addEventListener('click', function (e) {
    var target = e.target;
    if (target.tagName === 'BUTTON' && target.classList.contains('popup__close')) {
      window.card.removePopup();
      window.pin.setActive(target);
    }

  });
  // Закрытие попапа на крестик ENTERом
  map.addEventListener('keydown', function (e) {
    var target = e.target;
    if (target.tagName === 'BUTTON' && target.classList.contains('popup__close') && e.keyCode === ENTER_KEYCODE) {
      window.card.removePopup();
      window.pin.setActive(target);
    }

  });

  // Обработчик нажатия на ESC
  var onPopEscPress = function (evt) {
    var popup = document.querySelector('.popup');
    if (popup && evt.keyCode === ESC_KEYCODE) {
      window.card.removePopup();
      window.pin.deactivate();
      document.removeEventListener('keydown', onPopEscPress);
    }
  };

  // Открываем попап на ENTER
  pinContainer.addEventListener('keydown', function (e) {
    if (e.target.tagName !== 'BUTTON' || e.target.classList.contains('map__pin--main') || e.keyCode !== ENTER_KEYCODE) {
      return;
    }
    window.pin.setActive(e.target);
    window.card.removePopup();
    window.card.createPopup(e.target.pinData);

    document.addEventListener('keydown', onPopEscPress);
  });

  // Функция получения координат
  var fillCoordinates = function () {
    var xCoordinate = parseInt(pinMain.style.left, 10) + pinButtonWidth / 2 - 0.5;
    var yCoordinate = parseInt(pinMain.style.top, 10) + (pinButtonHeight);
    var inputCoordinates = document.querySelector('#address');
    inputCoordinates.disabled = false;
    inputCoordinates.readOnly = true;
    inputCoordinates.value = xCoordinate + ', ' + yCoordinate;
  };

  // Функция удаления координат
  var resetCoordinates = function () {
    var inputCoordinates = document.querySelector('#address');
    inputCoordinates.value = '';
    pinMain.style.left = pinInitialLeft;
    pinMain.style.top = pinInitialTop;
  };

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

      var limitYTop = PIN_MIN_Y_VALUE - pinButtonHeight;
      var limitYBottom = PIN_MAX_Y_VALUE - pinButtonHeight;
      var limitXLeft = body.offsetLeft - pinButtonWidth / 2;
      var limitXRight = body.offsetLeft + body.offsetWidth - pinButtonWidth / 2;

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
  var formReset = document.querySelector('.ad-form__reset');
  var formData = document.querySelector('.ad-form');
  var successBlock = document.querySelector('.success');

  formData.addEventListener('submit', function (evt) {
    evt.preventDefault();

    window.backend.save(new FormData(formData), onSuccessCallback, onErrorCallback);
  });

  // Функция сброса страницы
  var resetPage = function () {
    window.images.clear();
    window.images.unbindListeners();
    window.form.disableFields();
    formData.reset();
    resetCoordinates();
    window.card.removePopup();
    var pinNodes = Array.from(pinContainer.children).slice(2);
    pinNodes.forEach(function (e) {
      e.parentNode.removeChild(e);
    });
    pinMain.addEventListener('mouseup', window.map.drawPins);
  };

  var onSuccessCallback = function () {
    resetPage();
    successBlock.classList.remove('hidden');
    resetCoordinates();
    resetPage();
  };

  var onErrorCallback = function (errorMessage) {
    var errorNode = document.createElement('div');
    errorNode.style = 'z-index: 100; top: 1600px; position: absolute; margin: 0 auto; width: 1200px; height: 40px; text-align: center;  background-color: rgb(253, 94, 83); font-size: 35px; color: white;';
    errorNode.textContent = errorMessage + ' Пожалуйста перезагрузите страницу.';
    document.body.insertAdjacentElement('afterbegin', errorNode);
  };

  // Коллбеки для загрузки
  var onloadData = function (data) {
    window.map = {
      dataPins: data
    };
  };

  var onErrorDataLoad = function (errorMessage) {
    var errorNode = document.createElement('div');
    errorNode.style = 'z-index: 100; top: 0px; position: fixed; margin: 0 auto; width: 1200px; height: 40px; text-align: center;  background-color: rgb(253, 94, 83); font-size: 35px; color: white;';
    errorNode.textContent = errorMessage + ' Пожалуйста перезагрузите страницу.';
    document.body.insertAdjacentElement('afterbegin', errorNode);
  };

  // Обработчики загрузки сообщений
  formData.addEventListener('change', function (evt) {
    var nameElement = evt.target.name;

    switch (nameElement) {
      case 'avatar':
        window.images.readFiles(evt);
        break;
      case 'images':
        window.images.readFiles(evt);
        break;
    }
  });

  // Добавляю disable форме
  window.form.disableFields();

  // Активация карты
  window.backend.load(onloadData, onErrorDataLoad);
  pinMain.addEventListener('mouseup', window.map.drawPins);

  // Клик на нажатие кнопки очистить
  formReset.addEventListener('click', resetPage);


})();


