'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var buttonTemplate = document.querySelector('template').content.querySelector('button.map__pin');
  window.pin = {
    createPinButton: function (pinData) {
      var button = buttonTemplate.cloneNode(true);
      button.querySelector('img').src = pinData.author.avatar;
      button.style.left = pinData.location.x - PIN_WIDTH / 2 + 'px';
      button.style.top = pinData.location.y - PIN_HEIGHT + 'px';
      button.classList.add('hidden');

      return button;
    },
    changeSelectPinActive: function (targetNode) {
      var activePinNode = document.querySelector('.map__pin--active');
      if (activePinNode) {
        activePinNode.classList.remove('map__pin--active');
      }
      targetNode.classList.add('map__pin--active');
    },
    deactivatePinButton: function () {
      var activePinNode = document.querySelector('.map__pin--active');
      if (activePinNode) {
        activePinNode.classList.remove('map__pin--active');
      }
    }
  };

})();
