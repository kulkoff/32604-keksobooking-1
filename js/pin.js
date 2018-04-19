'use strict';

(function () {
  var buttonTemplate = document.querySelector('template').content.querySelector('button.map__pin');

  window.pin = {
    createPinButton: function (pinData) {
      var button = buttonTemplate.cloneNode(true);
      button.querySelector('img').src = pinData.author.avatar;
      button.style.left = pinData.location.x - 25 + 'px';
      button.style.top = pinData.location.y - 70 + 'px';

      return button;
    },
    changeSelectPinActive: function (targetNode) {
      var activePinNode = document.querySelector('.map__pin--active');
      if (activePinNode) {
        activePinNode.classList.remove('map__pin--active');
      }
      targetNode.classList.add('map__pin--active');
    },
    deactivatePin: function () {
      var activePinNode = document.querySelector('.map__pin--active');
      if (activePinNode) {
        activePinNode.classList.remove('map__pin--active');
      }
    }
  };

})();
