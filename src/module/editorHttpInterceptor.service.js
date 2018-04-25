function EditorHttpInterceptor($q) {
  'ngInject';
  return {
    'request': function(config) {
      /**
       * config.beforeSend – is the callback from datasource.transport[<action>].handlers.before
       * config.beforeSendButton – is the callback from buttons settings buttonSetting.component.settings.handlers.before
       * If one of the callback returns false the request will be rejected               *
       */
      if (config.beforeSend || config.beforeSendButton) {
        var defer = $q.defer();
        config.timeout = defer.promise;
        var success = true;
        if (config.beforeSendButton) {
          success = config.beforeSendButton(config);
        }
        if (success === false) {
          config.canceled = true;
          defer.resolve();
        }
        if (!config.canceled) {
          if (config.beforeSend) {
            success = config.beforeSend(config);
          }
          if (success === false) {
            config.canceled = true;
            defer.resolve();
          }
        }
      }
      return config;
    }
  };
}

export { EditorHttpInterceptor };
