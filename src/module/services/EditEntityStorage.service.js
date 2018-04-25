

function EditEntityStorage($rootScope, $timeout, $location, $state, $translate, ApiService) {
  'ngInject';
  var fieldControllers = [],
    self = this,
    storage = {},
    groups = {},
    collection = [];

  this.constructOutputValue = constructOutputValue;
  this.getComponentBySetting = getComponentBySetting;
  this.getChildFieldComponents = getChildFieldComponents;
  this.getChildGroupComponents = getChildGroupComponents;
  this.newSourceEntity = newSourceEntity;
  this.addFieldController = addFieldController;
  this.deleteFieldController = deleteFieldController;
  this.editEntityUpdate = editEntityUpdate;
  this.editEntityPresave = editEntityPresave;
  this.updateComponents = updateComponents;
  this.updateValueOfComponent = updateValueOfComponent;
  this.constructObjectByPointScheme = constructObjectByPointScheme;
  this.getValueFromObjectByPointScheme = getValueFromObjectByPointScheme;

  /**
   * Gets component from registration service by id or configuration of component.
   * @param {string | object} id ID of component or configuration of component
   */
  function getComponentBySetting(id) {
    var model = null;
    if (angular.isObject(id) && id.component) {
      id = id.component.$id;
    }
    if (id) {
      angular.forEach(collection, function(controller, ind) {
        var componentId = controller.setting && controller.setting.component && controller.setting.component.$id;
        if (componentId && componentId === id) {
          model = controller;
        }
      });
    }
    return model;
  }

  /**
   * Gets children components of the component with id if it registered your children by addFieldController-method.
   * @param {string} componentId ID of component
   */
  function getChildFieldComponents(componentId) {
    return storage[componentId] || [];
  }

  /**
   * @deprecated
   * Gets children components of the ue-group with id if it registered your children by addFieldController-method.
   * @param {string} componentId ID of component
   */
  function getChildGroupComponents(componentId) {
    return groups[componentId] || [];
  }

  /**
   * @deprecated
   * Updates value of component by id of ue-form in nested mode
   * @param {string} componentId ID of component
   */
  function newSourceEntity(id, dataSource) {
    var parent = $location.search().parent;
    if (parent && angular.isObject(dataSource) && dataSource.parentKey) {
      var data = { editorEntityType: 'new', $componentId: id };
      data[dataSource.parentKey] = parent;
      data.$dataSource = dataSource;
      $rootScope.$broadcast('ue:componentDataLoaded', data);
    }
  }

  /**
   * Updates value of component with name.
   * @param {string} componentId ID of component
   * @param {string} componentName Name of component (name in root of configuration of component)         *
   * @param {any} value Value of component
   * @param {object} options Object with additional data that will be sent to 'ue:componentDataLoaded'-event.
   */
  function updateValueOfComponent(componentId, componentName, value, options) {
    var data = {
      $componentId: componentId,
      [componentName]: value
    };
    if (options) {
      angular.merge(data, options);
    }
    $rootScope.$broadcast('ue:componentDataLoaded', data);
  }

  /**
   * Registers the component in service.
   * @param {object} ctrl Model of the component that is registering.
   * Model can cantain the 'parentComponentId'-property with id of the parent component (see getChildFieldComponents-method)
   * @param @deprecated {isGroup} Flag of group component
   */
  function addFieldController(ctrl, isGroup) {
    let id = ctrl.parentComponentId || ctrl.$componentId;
    ctrl.$fieldHash = Math.random().toString(36).substr(2, 15);
    collection.push(ctrl);
    if (id) {
      if (isGroup === true) {
        groups[id] = groups[id] || [];
        groups[id].push(ctrl);
      } else {
        storage[id] = storage[id] || [];
        storage[id].push(ctrl);
      }
    }
  }

  /**
   * Removes the component in the service.
   * @param {object} ctrl Model of the component that is removed from service.
   */
  function deleteFieldController(ctrl) {
    var controllers = storage[ctrl.parentComponentId];
    angular.forEach(collection, function(controller, ind) {
      if (controller.$fieldHash === ctrl.$fieldHash) {
        collection.splice(ind, 1);
      }
    });
    if (controllers) {
      angular.forEach(controllers, function(controller, ind) {
        if (controller.$fieldHash === ctrl.$fieldHash) {
          controllers.splice(ind, 1);
        }
      });
    }
  }

  /**
   * Contructs data of the component and sends data to ApiService.
   * @param {string} type Specifies the type of updating.
   * Avaliable values: 'create' or 'update'.
   * @param {object} request Can be 'create' or 'update'. Specifies the type of updating.
   * Format:
   * {
   *   $componentId: string, – id of component that inits the method
   *   isError: {true | false}, – Tell us about errors in validation, that disabled sending the request. Default, false
   *   params: object, –  Set of query-parameters for request
   *   data: object, – Data for request
   *   handlers: object, – callbacks from other components (before, success, error, complete)
   *   method: string – type of method (PUT,GET,POST..)
   * }
   */
  function editEntityUpdate(type, request) {
    var entityObject = constructOutputValue(request);
    if (request.isError) {
      request.data = entityObject;
      switch (type) {
        case 'create':
          ApiService.addNewItem(request);
          break;
        case 'update':
          ApiService.updateItem(request);
          break;
      }
    }
  }

  /**
  * Contructs data of the component and sends data to ApiService.
  * @param {object} request See comments of editEntityUpdate-method
  */
  function editEntityPresave(request) {
    var entityObject = constructOutputValue(request);
    if (request.isError) {
      request.data = entityObject;
      request.action = 'presave';
      ApiService.presaveItem(request);
    }
  }

  /**
   * Contructs data of the component.
   * @param {object} request Object like { $componentId: <id of component> }
   * @param {boolean} extended Generates id-values as object-value
   * @returns {object}
   */
  function constructOutputValue(request, extended) {
    var entityObject = {}, componentId;
    if (angular.isString(request)) {
      componentId = request;
    } else if (angular.isObject(request)) {
      componentId = request.$componentId || request.options.$componentId;
    }
    var controllers = storage[componentId] || [],
      groupControllers = groups[componentId] || [];

    if (request) {
      if (angular.isObject(request)) {
        request.isError = true;
      }
      angular.forEach(controllers, function(fCtrl) {
        if (angular.isObject(request)) {
          request.isError = (fCtrl.error.length === 0 && !fCtrl.validationInputError) && request.isError;
        }
        if (fCtrl.disabled !== true && fCtrl.useable !== false && angular.isFunction(fCtrl.getFieldValue)) {
          var value = {};
          value = fCtrl.getFieldValue(extended);
          if (fCtrl.fieldName && typeof (value[fCtrl.fieldName]) !== 'undefined' && value[fCtrl.fieldName] !== null) {
            value = value[fCtrl.fieldName];
          } else {
            value = null;
          }

          if (angular.isFunction(fCtrl.inputLeave)) {
            if (!fCtrl.multiple) {
              fCtrl.inputLeave(fCtrl.fieldValue);
            } else {
              var flagError = true;
              angular.forEach(fCtrl.fieldValue, function(val, index) {
                if (flagError) {
                  fCtrl.inputLeave(val, index);
                  if (fCtrl.error.length !== 0) {
                    flagError = false;
                  }
                }
              });
            }
          }

          if (angular.isString(fCtrl.fieldName)) {
            var names = fCtrl.fieldName.split('.');
            var tempObject = entityObject;
            var partName = '';
            angular.forEach(names, function(name, i) {
              var empty = {};
              partName = partName ? (partName + '.' + name) : name;
              if (name.lastIndexOf('[]') === (name.length - 2)) {
                name = name.substr(0, name.length - 2);
                empty = [];
              }
              let component = fCtrl.getParentComponent(partName);
              if (angular.isArray(tempObject)) {
                if (component) {
                  var parentIndex = component.parentFieldIndex || 0;
                  tempObject[parentIndex] = tempObject[parentIndex] || {};
                  tempObject = tempObject[parentIndex];
                }
              }
              if (i !== (names.length - 1)) {
                tempObject[name] = tempObject[name] || empty;
                tempObject = tempObject[name];
              } else {
                tempObject[name] = value;
              }
              if (component && component.resourceType && angular.isObject(tempObject) && !angular.isArray(tempObject)) {
                tempObject.$type = component.resourceType;
              }
            });
          }
        }
      });

      angular.forEach(groupControllers, function(fGroup) {
        if (angular.isString(fGroup.setting.name) && fGroup.multiple === true) {
          var names = fGroup.setting.name.split('.');
          var tempObject = entityObject;
          var partName = '';
          angular.forEach(names, function(name, i) {
            partName = partName ? (partName + '.' + name) : name;
            if (name.lastIndexOf('[]') === (name.length - 2)) {
              name = name.substr(0, name.length - 2);
            }
            if (angular.isObject(tempObject[name])) {
              tempObject = tempObject[name];
            } else {
              tempObject[name] = '';
            }
          });
        }
      });
    }
    return entityObject;
  }

  /**
   * Inits $scope-event 'ue:componentValueChanged' on the component, that pulls useable and readonly callbacks in BaseController.
   * @param {object} componentId Id of the component
   */
  function updateComponents(componentId) {
    var output = constructOutputValue(componentId, true);
    output.$componentId = componentId;
    $rootScope.$broadcast('ue:componentValueChanged', output);
  }

  /**
  * Creates object or modifies this one according to the scheme fields which is a set of field names using a dot (like this 'field1.field2.fieldN')
  * @param {string} scheme String with format 'field1.field2.fieldN'
  * @param {any} value The value that the output object will store
  * @param {object} result The output object which will contains the value
  * {
  *  field1: {
  *    field2: {
  *      ....
  *      fieldN: <value>
  *    }
  *  }
  * }
  * @returns {object} Returns the third argument if it is passed.
  */
  function constructObjectByPointScheme(scheme, value, result = {}) {
    if (scheme && angular.isString(scheme)) {
      let subresult = result;
      scheme.split('.').forEach((property, index, collection) => {
        if (angular.isObject(subresult)) {
          if (index === (collection.length - 1)) {
            subresult[property] = value;
          } else {
            subresult[property] = subresult[property] || {};
            subresult = subresult[property];
          }
        }
      });
    }
    return result;
  }

  /**
  * Get value according to the scheme fields at the first argument from json-object.
  * @param {string} scheme String with format 'field1.field2.fieldN'
  * @param {object} source Json-object where from you get value.
  * @returns {any}
  *
  * For example, getValueFromObjectByPointScheme('field1.field2.field3', {field1: {field2: {field3: 'field3_value'}}}) = 'field3_value';
   */
  function getValueFromObjectByPointScheme(scheme, source) {
    let output = source;
    scheme = scheme.split('.');
    angular.forEach(scheme, function(key) {
      if (angular.isObject(output)) {
        output = output[key];
      }
    });
    return output;
  }
}

export { EditEntityStorage };
