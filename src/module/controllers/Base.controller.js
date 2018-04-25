function BaseController($scope, EditEntityStorage, FilterFieldsStorage, $templateCache, $compile, $translate, $element, toastr) {
  /* jshint validthis: true */
  'ngInject';
  var self = $scope.vm,
    componentSettings = self.setting.component.settings;

  self.options = self.options || {};
  self.unShowComponentIfError = true;
  self.resetErrors = resetErrors;
  self.tryAddListener = tryAddListener;

  /**
   * Event handlers
   */
  self.onErrorApiHandler = onErrorApiHandler;
  self.onDestroyHandler = onDestroyHandler;
  self.onErrorComponentDataLoadingHandler = onErrorComponentDataLoadingHandler;
  self.onForceReadonlyHandler = onForceReadonlyHandler;
  self.onForceUseableHandler = onForceUseableHandler;
  self.onComponentValueChangedHandler = onComponentValueChangedHandler;

  // Uses in case when standard takes the value of JSONAPI
  self.resourceType = self.setting.resourceType;
  self.parentField = self.setting.parentField;
  self.parentFieldIndex = angular.isNumber(self.setting.parentFieldIndex) ? self.setting.parentFieldIndex : false;

  // Set general setttings of the component
  initGeneralConfigurationSettings();

  // Init dangerous and warning messages
  resetErrors();

  // listener storage for handlers
  initListeners();

  /** Supporting methods for work with hierarchy of component */

  /**
   * Checks whether the component with id from arguments is a parent of the current component
   * @param {string | object} id Id from confiruration of the component or object like {$id: 'component_id'} or {$componentId: 'component_id'}.
   * @param {object} scope is optional parameter. Is initial scope for search of parent component.
   * @return {boolean}
   */
  self.isParentComponent = function isParentComponent(id, scope) {
    scope = scope || $scope;
    if (angular.isObject(id)) {
      id = id.$componentId || id.$id;
    }
    if (!scope.$parent) {
      return false;
    }
    if (scope.vm && scope.vm.setting && scope.vm.setting.component) {
      if (scope.vm.setting.component.$id === id && scope.vm.setting.component.$id !== $scope.vm.setting.component.$id) {
        return true;
      }

      //if id is id of the current component.
      if(id === $scope.vm.setting.component.$id) {
        return true;
      }
    }
    return isParentComponent(id, scope.$parent);
  };

  /**
   * Checks whether the component with id from arguments the current component
   * @param {string | object} id Id from confiruration of the component or object like {$id: 'component_id'} or {$componentId: 'component_id'}.
   * @param {object} scope is optional parameter. Is initial scope which will check.
   * @return boolean
   */
  self.isComponent = function isComponent(id, scope) {
    scope = scope || $scope;
    if (angular.isObject(id)) {
      id = id.$componentId || id.$id;
    }
    return scope.vm && scope.vm.setting && scope.vm.setting.component && scope.vm.setting.component.$id === id;
  };

  /**
   * Get the parent settings of the current component.
   * @param {object} name name of parent component.
   * @param {object} scope is optional parameter. Is initial scope which will check.
   * @return object
   */
  self.getParentSetting = function getParentSetting(scope) {
    scope = scope || $scope.$parent;
    if (scope.vm && scope.vm.setting && scope.vm.setting.component && scope.vm.setting.component.$id !== $scope.vm.setting.component.$id) {
      return scope.vm.setting;
    }
    if (scope.$parent) {
      scope = scope.$parent;
    }
    return getParentSetting(scope);
  };

  /**
   * Get the parent of the current component, which has name from argements.
   * @param {object} name name of parent component.
   * @param {object} scope is optional parameter. Is initial scope which will check.
   * @return object
   */
  self.getParentComponent = function getParentComponent(name, scope) {
    scope = scope || $scope;
    scope = scope.$parent;
    if (!scope) {
      return null;
    }
    if (scope.vm && scope.vm.setting && scope.vm.setting.component && scope.vm.setting.component.$id !== $scope.vm.setting.component.$id) {
      if (name) {
        if (scope.vm.setting.name && (scope.vm.setting.name === name)) {
          return scope.vm;
        }
      } else {
        return scope.vm;
      }
    }
    return getParentComponent(name, scope);
  };

  $scope.$on('$destroy', onDestroyHandler);

  /** Initialization fnctions */

  function initGeneralConfigurationSettings() {
    // Set useable-setting
    self.useable = true;
    if (angular.isFunction(componentSettings.useable)) {
      self.useableCallback = componentSettings.useable;
    }

    // Set readonly-setting
    if (angular.isFunction(componentSettings.readonly)) {
      self.readonlyCallback = componentSettings.readonly;
    } else {
      self.readonly = componentSettings.readonly === true;
    }

    // Analize the validators section of configuration and set flag of numeric data.
    self.isNumber = false;
    if (angular.isArray(componentSettings.validators)) {
      self.isNumber = componentSettings.validators.some(function(f) { return f.type === 'number'; });
    }

    // Options is the buffer of component which is provided throut attribute of <component-wrapper data-options="{}">
    if (self.options) {
      self.parentComponentId = self.options.$componentId || '';
      self.regim = self.options.regim || 'edit';
    }

    // Set regim of view ('preview', 'filter', 'edit'). Default value is 'edit'.
    self.regim = componentSettings.mode || self.regim || 'edit';

    // Set name of component
    if (!self.fieldName) {
      self.fieldName = self.setting.name;
    }

    self.label = componentSettings.label || null;
    self.hint = componentSettings.hint || null;
    self.required = componentSettings.required === true;
    self.multiple = componentSettings.multiple === true;
    self.templates = angular.merge({}, componentSettings.templates);
    self.disabled = componentSettings.disabled || false;

    /** if template is set as a html-file */
    var htmlPattern = /[^\s]+(?=\.(html|jade)$)/;
    if (angular.isObject(self.templates)) {
      ['preview', 'filter', 'edit'].forEach(function(property) {
        var template = self.templates[property];
        if (angular.isFunction(template)) {
          template = template($scope);
        }
        if (template) {
          if (htmlPattern.test(template)) {
            self.templates[property] = $templateCache.get(template);
            if (self.templates[property] === undefined) {
              $translate('ERROR.FIELD.TEMPLATE').then(function(translation) {
                console.warn(translation.replace('%template', template));
              });
            }
          } else {
            self.templates[property] = template;
          }
        }
      });
    }
  }

  // wraps function-handler with calling one from controller model. It needs for unit-tests
  function wrapHandler(handlerName) {
    return (event, data) => {
      self[handlerName](event, data);
    };
  }

  function initListeners() {
    tryAddListener($scope.$on('ue:componentError', wrapHandler('onErrorApiHandler')));

    if (componentSettings.mode !== 'preview') {
      let valueWatcher = $scope.$watch(
        () => self.fieldValue,
        () => {
          if (self.options && self.options.$componentId) {
            EditEntityStorage.updateComponents(self.options.$componentId);
          }
        }, true);
      tryAddListener(valueWatcher);
    }
    if (angular.isFunction(self.useableCallback) || angular.isFunction(self.readonlyCallback)) {
      tryAddListener($scope.$on('ue:componentValueChanged', wrapHandler('onComponentValueChangedHandler')));
    }

    tryAddListener($scope.$on('ue-group:forceReadonly', wrapHandler('onForceReadonlyHandler')));
    tryAddListener($scope.$on('ue-group:forceUseable', wrapHandler('onForceUseableHandler')));
    tryAddListener($scope.$on('ue:errorComponentDataLoading', wrapHandler('onErrorComponentDataLoadingHandler')));
    tryAddListener($scope.$on('ue:beforeEntityCreate', wrapHandler('resetErrors')));
    tryAddListener($scope.$on('ue:beforeEntityUpdate', wrapHandler('resetErrors')));
    tryAddListener($scope.$on('ue:beforeEntityDelete', wrapHandler('resetErrors')));
    tryAddListener($scope.$on('$destroy', wrapHandler('onDestroyHandler')));
  }

  // Resets all error messages on component.
  function resetErrors() {
    self.dangers = [];
    self.warnings = [];
    self.error = [];
  }

  /**
   *  Adds listener in the storage, whis is cleared if $destroy-event is called.
   * @param {function} handler Function which we have after subscribing on scope-events or watchers.
   * @returns boolean
   */
  function tryAddListener(handler) {
    if (angular.isFunction(handler)) {
      self.listeners = self.listeners || [];
      self.listeners.push(handler);
      return true;
    }
    return false;
  }

  /**
   * Event handlers
   */

  function onDestroyHandler() {
    if (angular.isArray(self.listeners)) {
      self.listeners.forEach(function(listener) {
        if (angular.isFunction(listener)) {
          listener();
        }
      });
    }
    resetErrors();
    EditEntityStorage.deleteFieldController(self);
    FilterFieldsStorage.deleteFilterFieldController(self);
  }

  // Handler is called if component gets error answer from the server. For example, if error is eccured after submit ueForm.
  function onErrorApiHandler(event, eventObject) {
    // for location component related errors
    if (eventObject.$componentId && self.setting.component.$id && eventObject.$componentId === self.setting.component.$id) {
      event.preventDefault();
      var fields = eventObject.data;
      $scope.$broadcast('ue:componentError', {
        isChildComponent: true,
        fields: fields
      });
    }

    // broadcast event for child components
    if (eventObject.isChildComponent) {
      if (angular.isObject(eventObject) && angular.isArray(eventObject.fields)) {
        var data = eventObject.fields.filter(function(f) {
          var fieldName = self.fieldName;
          if (self.setting.hasOwnProperty('parentFieldIndex')) {
            fieldName = self.fieldName.replace('[]', '[' + self.setting.parentFieldIndex + ']');
          }
          return f.field === fieldName;
        });
        if (data.length > 0) {
          event.preventDefault();
          if (data[0].message) {
            self.error.push(data[0].message);
          }
          if (angular.isArray(data.fields)) {
            $scope.$broadcast('ue:componentError', {
              isChildComponent: true,
              fields: data.fields
            });
          }
        }
      }
    }
  }

  // Handler is called if component gets error answer from the server when try loading his initial remoted data.
  function onErrorComponentDataLoadingHandler(event, rejection) {
    function compareStatus(stack) {
      return stack.filter(function(w) { return w.status === rejection.status; }).length > 0;
    }
    if (self.isComponent(rejection) && !rejection.canceled) {
      if (rejection.config && rejection.config.canceled !== true) {
        self.loaded = true;
        self.loadingData = false;
        var isExist = compareStatus(self.warnings) || compareStatus(self.dangers);
        if (!isExist) {
          var error = {};
          error.status = rejection.status;

          if (rejection.data && rejection.data.message) {
            error.text = rejection.data.message;
          } else {
            var messageCode = error.status ? ('N' + error.status) : 'UNDEFINED';
            $translate('RESPONSE_ERROR.' + messageCode).then(function(translation) {
              var parts = translation.replace('%code', error.status).split(':');
              error.label = parts[0];
              if (parts[1]) {
                error.text = ':' + parts[1];
              }
            });
          }

          if (rejection.status === -1) {
            self.dangers.push(error);
            $translate('RESPONSE_ERROR.UNDEFINED').then(function(translation) {
              error.text = translation;
            });
          }

          if (/^4/.test(rejection.status)) {
            self.warnings.push(error);
          }
          if (/^5/.test(rejection.status)) {
            $translate('RESPONSE_ERROR.SERVICE_UNAVAILABLE').then(function(translation) {
              toastr.error(translation);
            });
          }
          event.preventDefault();
        }
      } else {
        self.loaded = true;
        self.isLoading = false;
      }
    }
  }

  // Handler is called on component in case when data of ueForm (for example) is changed.
  function onComponentValueChangedHandler(event, data) {
    if (self.isParentComponent(data)) {
      if (angular.isFunction(self.useableCallback)) {
        self.useable = self.useableCallback(data);
        var rootElement = $element.closest('.component-wrapper');
        if (self.useable === false) {
          rootElement.addClass('unuseable');
        } else {
          rootElement.removeClass('unuseable');
        }
        $scope.$broadcast('ue-group:forceUseable', {
          $componentId: self.setting.component.$id,
          value: self.useable
        });
      }
      if (angular.isFunction(self.readonlyCallback)) {
        self.readonly = self.readonlyCallback(data);
        $scope.$broadcast('ue-group:forceReadonly', {
          $componentId: self.setting.component.$id,
          value: self.readonly
        });
      }
    }
  }

  // Handler is called on component in case when anything parent component force to change readonly-parameter of all children components.
  function onForceReadonlyHandler(event, data) {
    if (self.isParentComponent(data) && componentSettings.readonly !== true) {
      self.readonly = data.value;
    }
  }

  // Handler is called on component in case when anything parent component force to change useable-parameter of all children components.
  function onForceUseableHandler(event, data) {
    if (self.isParentComponent(data)) {
      self.useable = data.value;
    }
  }
}

export { BaseController };
