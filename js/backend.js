'use strict';

(function () {
  var GET_URL = 'https://22.javascript.pages.academy/keksobooking/data';
  var POST_URL = 'https://javascript.pages.academy/keksobooking';

  var ResponseStatus = {
    Code: {
      SUCCESS_OK: 200,
      MOVED_PERMANENTLY: 301,
      FOUND: 302,
      FORBIDDEN: 403,
      NOT_FOUND: 404,
      INTERNAL_SERVER_ERROR: 500,
      SERVICE_UNAVAILABLE: 503,
    },
    Description: {
      SUCCESS_OK: 'Запрос выполнен успешно',
      MOVED_PERMANENTLY: 'Запрошенный ресурс был окончательно перемещен',
      FOUND: 'Запрошенный ресурс был временно перемещен',
      FORBIDDEN: 'Отказ сервера в авторизации запроса',
      NOT_FOUND: 'Сервер не может найти запрошенный ресурс',
      INTERNAL_SERVER_ERROR: 'Внутренняя ошибка сервера',
      SERVICE_UNAVAILABLE: 'Сервер не готов обработать данный запрос',
    },
  };

  var request = function (url, onSuccess, onError, method, data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === ResponseStatus.Code.SUCCESS_OK) {
        onSuccess(xhr.response);
      } else {
        onError();
      }
    });

    xhr.addEventListener('error', function () {
      onError();
    });
    xhr.addEventListener('timeout', function () {
      onError();
    });

    xhr.open(method, url);

    if (data) {
      xhr.send(data);
    } else {
      xhr.send();
    }
  };

  window.backend = {
    load: function (onSuccess, onError) {
      request(GET_URL, onSuccess, onError, 'GET');
    },
    save: function (onSuccess, onError, data) {
      request(POST_URL, onSuccess, onError, 'POST', data);
    },
  };
})();
