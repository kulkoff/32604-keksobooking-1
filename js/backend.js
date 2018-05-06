'use strict';

(function () {
  var request = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.timeout = 10000;
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выплниться за ' + xhr.timeout + ' мс');
    });

    return xhr;
  };

  window.backend = {
    save: function (data, onLoad, onError) {
      var xhr = request(onLoad, onError);
      xhr.open('POST', 'https://js.dump.academy/keksobooking');
      xhr.send(data);
    },
    load: function (onLoad, onError) {
      var xhr = request(onLoad, onError);

      xhr.open('GET', 'https://js.dump.academy/keksobooking/data');
      xhr.send();
    }
  };

})();
