'use strict';

(function () {
  var map = document.querySelector('section.map');
  var pinMain = document.querySelector('.map__pin--main');
  var pinContainer = document.querySelector('.map__pins');
  var fragmentPin = document.createDocumentFragment();

  // Добавляю disable форме
  window.form.disableFields();
  // Функция, которая генерируем массив с объектами и отрисовываем кнопки

  window.map = {
    drawPins: function () {
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
      window.filter.onFilterClick();
      pinMain.removeEventListener('mouseup', window.map.drawPins);
    }
  };

})();
