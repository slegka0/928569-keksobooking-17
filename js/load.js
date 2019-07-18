'use strict';

(function () {
  var URL_LOAD = 'https://js.dump.academy/keksobooking/datas';
  var URL_UPLOAD = 'https://js.dump.academy/keksobooking';
  var SUCCESS_LOAD_CODE = 200;

  /**
   * Загружает данные с сервера или отправляет их, реагирует на успешность/неуспешность их загрузки
   * @param {function} onSuccess Вызывается, если данные загружены успешно
   * @param {function} onError Вызывается, если что-то пошло не так
   * @param {Object} data Данные для отправки на сервер
   */
  var load = function (onSuccess, onError, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_LOAD_CODE) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });

    if (data) {
      xhr.open('POST', URL_UPLOAD);
      xhr.send(data);
    } else {
      xhr.open('GET', URL_LOAD);
      xhr.send();
    }
  };
  window.load = {
    'load': load
  };
})();
