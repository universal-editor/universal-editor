function MessagesService(toastr, $translate) {
  'ngInject';
  this.success = success;
  this.error = error;
  this.warning = warning;
  this.consoleError = consoleError;
  this.httpStatusMsg = httpStatusMsg;
  this.mapReplacingKeys = mapReplacingKeys;

  function success(translateName, replaceKeys){
    $translate(translateName).then(function(translation) {
      toastr.success(mapReplacingKeys(translation, replaceKeys));
    });
  }

  function error(translateName, replaceKeys){
    $translate(translateName).then(function(translation) {
      toastr.error(mapReplacingKeys(translation, replaceKeys));
    });
  }

  function warning(translateName, replaceKeys){
    $translate(translateName).then(function(translation) {
      toastr.warning(mapReplacingKeys(translation, replaceKeys));
    });
  }

  function consoleError(translateName, replaceKeys) {
    $translate(translateName).then(function(translation) {
      console.error(mapReplacingKeys(translation, replaceKeys));
    });
  }

  function mapReplacingKeys(translation, keys = {}) {
    angular.forEach(keys, (value, key) => {
      translation = translation.replace(new RegExp(key, 'g'), value);
    });
    return translation;
  }

  function httpStatusMsg(status) {
    if (status !== -1) {
      try {
        if (status === 422 || status === 400) {
          warning('RESPONSE_ERROR.INVALID_DATA');
        } else if (status === 401) {
          warning('RESPONSE_ERROR.UNAUTHORIZED');
        } else if (status === 403) {
          error('RESPONSE_ERROR.FORBIDDEN');
        } else {
          error('RESPONSE_ERROR.SERVICE_UNAVAILABLE');
        }
      } catch (e) {
        console.error(e);
        error('RESPONSE_ERROR.UNEXPECTED_RESPONSE');
      }
    }
  }
}

export { MessagesService };
