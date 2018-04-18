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
      for (var id = 1; id <= 8; id++) {
        var pinData = window.data.createPinData(id);
        var pinNode = window.pin.createPinButton(pinData);
        pinNode.pinData = pinData;
        fragmentPin.appendChild(pinNode);
      }
    }
    window.form.enableFields();
    pinContainer.appendChild(fragmentPin);
    pinMain.removeEventListener('mouseup', drawPins);
  }
  // Активация карты
  pinMain.addEventListener('mouseup', drawPins);


})();
