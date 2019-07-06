'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking/data';

  /**
   * Загружает данные с сервера и реагирует на успешность/неуспешность их загрузки
   * @param {function} onSuccess Вызывается, если данные загружены успешно
   * @param {function} onError Вызывается, если что-то пошло не так
   */
  var load = function (onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onSuccess(xhr.response);
      } else {
        onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.open('GET', URL);
    xhr.send();
  };
  window.load = {
    'load': load
  };
})();
