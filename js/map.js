'use strict';

// // Функция, которая генерируем массив с объектами и отрисовываем кнопки
// function drawPins() {
//
//   if (map.classList.contains('map--faded')) {
//     for (var id = 1; id <= 8; id++) {
//       var pinData = createPinData(id);
//       var pinNode = createPinButton(pinData);
//       pinNode.pinData = pinData;
//       fragmentPin.appendChild(pinNode);
//     }
//   }
//
//   enableFields(formFieldsets);
//   pinContainer.appendChild(fragmentPin);
//   pinMain.removeEventListener('mouseup', drawPins);
// }
//
// // Активация карты
// pinMain.addEventListener('mouseup', drawPins);