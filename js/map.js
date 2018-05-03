'use strict';

(function () {
  var map = document.querySelector('section.map');
  var pinMain = document.querySelector('.map__pin--main');
  var pinContainer = document.querySelector('.map__pins');
  var fragmentPin = document.createDocumentFragment();

  // Добавляю disable форме
  window.form.disableFields();
  // Функция, которая генерируем массив с объектами и отрисовываем кнопки
  function drawPins() {
    if (map.classList.contains('map--faded')) {
      for (var id = 0; id <= 9; id++) {
        var pinData = window.map.dataPins[id];
        var pinNode = window.pin.createPinButton(pinData);
        pinNode.pinData = pinData;
        fragmentPin.appendChild(pinNode);
      }
    }

    window.form.enableFields();
    pinContainer.appendChild(fragmentPin);
    window.filter.filterPins();
    pinMain.removeEventListener('mouseup', drawPins);
  }
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

  // Активация карты
  window.backend.load(onloadData, onErrorDataLoad);
  pinMain.addEventListener('mouseup', drawPins);
})();
