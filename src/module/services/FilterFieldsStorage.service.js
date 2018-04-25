
function FilterFieldsStorage($rootScope, $timeout, $location) {
  'ngInject';
  var storage = {},
    filterComponentsStorage = {},
    queryObject = {},
    srvc = this,
    filterSearchString;

  /** set functions for service */
  angular.extend(srvc, {
    addFilterFieldController: addFilterFieldController,
    deleteFilterFieldController: deleteFilterFieldController,
    clearFiltersValue: clearFiltersValue,
    calculate: calculate,
    getFilterQueryObject: getFilterQueryObject,
    getFilterFieldController: getFilterFieldController,
    getFilterController: getFilterController,
    getFilterApi: getFilterApi,
    registerFilterController: registerFilterController,
    unRegisterFilterController: unRegisterFilterController,
    apply: apply,
    clear: clear,
    getFilterObject: getFilterObject,
    convertFilterToString: convertFilterToString,
    isFilterSearchParamEmpty: isFilterSearchParamEmpty,
    fillFilterComponent: fillFilterComponent,
    generateFilterKey: generateFilterKey
  });

  function generateFilterKey(prefix) {
    if (prefix) {
      return prefix + '-filter';
    }
    return 'filter';
  }

  /**
   * Registeres component from filter as a child of the component with id = @parentComponentId.
   * @param {object} ctrl Model of the component from filter
   * @param {string} parentComponentId Id of the parent component
   */
  function addFilterFieldController(ctrl, parentComponentId) {
    let id = parentComponentId || ctrl.parentComponentId;
    if (id) {
      let stackFields,
        filterCtrl = getFilterController(id),
        readyCount = 0;
      storage[id] = storage[id] || [];
      stackFields = storage[id];
      stackFields.push(ctrl);
      angular.forEach(filterCtrl.body, function(group) {
        if (angular.isArray(group.filters)) {
          readyCount += group.filters.length;
        }
      });
      filterCtrl.isReady = filterCtrl.body.length === 0 || stackFields.length === readyCount;
      ctrl.$fieldHash = Math.random().toString(36).substr(2, 15);
    }
  }

  /**
  * Removes the component from the filter.
  * @param {object} ctrl Model of the component from filter
  */
  function deleteFilterFieldController(ctrl) {
    var id = ctrl.parentComponentId;
    if (id) {
      var filterControllers = storage[id];
      if (filterControllers) {
        angular.forEach(filterControllers, function(fc, ind) {
          if (fc.$fieldHash === ctrl.$fieldHash) {
            filterControllers.splice(ind, 1);
          }
        });
      }
    }
  }

  /**
   * Registeres the component as filter.
   * @param {object} ctrl Model of the component
   * @returns {boolean}
   */
  function registerFilterController(ctrl) {
    var id = ctrl.parentComponentId;
    if (id) {
      filterComponentsStorage[id] = filterComponentsStorage[id] || {};
      filterComponentsStorage[id] = ctrl;
      return true;
    }
    return false;
  }

  /**
   * Removed the component from the service.
   * @param {object} ctrl Model of the component
   * @returns {boolean}
   */
  function unRegisterFilterController(ctrl) {
    var id = ctrl.parentComponentId;
    if (id) {
      Reflect.deleteProperty(filterComponentsStorage, id);
      return true;
    }
    return false;
  }

  /**
   * Checks filter parameter in URL on emptiness.
   * @param {string} prefix Prefix, which is added to start of word '-filter' and is part of name of parameter.
   * @returns {boolean}
   */
  function isFilterSearchParamEmpty(prefix) {
    let searchParameters = $location.search(),
      filterName = 'filter',
      isEmpty = true;
    if (prefix) {
      filterName = prefix + '-' + filterName;
    }
    if (searchParameters && searchParameters[filterName] && !$.isEmptyObject(JSON.parse(searchParameters[filterName]))) {
      isEmpty = false;
    }
    return isEmpty;
  }

  /**
   * Gets registered filter-component.
   * @param {string} id id of the component who registered the filter.
   * @returns {boolean}
   */
  function getFilterController(id) {
    if (id) {
      var filterCtrl = filterComponentsStorage[id];
      if (!filterCtrl) {
        angular.forEach(filterComponentsStorage, function(ctrl, id) {
          if (ctrl.isParentComponent(id)) {
            filterCtrl = ctrl;
          }
        });
      }
      if (filterCtrl) {
        return filterCtrl;
      }
    }
    return false;
  }

  /**
  * Get filter API by id of the parent object.
  * @param {string} id id of the component who registered the filter.
  * @returns {object} Object with API of filter
  * {
  *   apply: function – Apply the filter
  *   clear: function – Clear the filter
  * }
  */
  function getFilterApi(id) {
    if (angular.isObject(id)) {
      id = id.$componentId;
    }
    if (id) {
      var fCtrl = filterComponentsStorage[id];
      if (fCtrl) {
        return {
          apply: fCtrl.apply,
          clear: fCtrl.clear
        };
      }
    }
  }

  /**
 * Get children components of the filter by id of the parent component.
 * @param {string} id id of the component who registered the filter.
 * @returns {Array} Array of choldren components.
 */
  function getFilterFieldController(id) {
    if (id && storage[id]) {
      return storage[id];
    }
    return false;
  }

  /**
  * Set values of the components in filter by value. Init $parseFilter-function in the settings of the components.
  * @param {string} id id of the component who registered the filter.
  * @param {object} filter Value of the filter. (for example, {title: '%James%', ">=age": 25})
  */
  function fillFilterComponent(id, filter) {
    var ctrls = getFilterFieldController(id);
    if(angular.isString(filter)) {
      try {
        filter = JSON.parse(filter);
      } catch(e) {}
    }
    angular.forEach(ctrls, function(ctrl) {
      if (ctrl.setting && angular.isFunction(ctrl.setting.component.settings.$parseFilter)) {
        ctrl.setting.component.settings.$parseFilter(ctrl, filter);
      }
    });
  }

  function calculate(id, paramName) {
    var ctrls = storage[id];
    var filters = {};
    //-- get list of filter fields
    angular.forEach(ctrls, function(ctrl) {
      //--get settings of the field
      var settings = ctrl.setting.component.settings;
      //--get operator from settings of the field
      var operator = ctrl.options.filterParameters.operator;
      //--get value of the field
      var fieldValue = ctrl.getFieldValue();

      //-- genarate filter objects with prepared filters
      var filterValue = settings.$toFilter(operator, ctrl.getFieldValue(), ctrl);
      angular.extend(filters, filterValue);
    });

    //** storage filter object
    if (!$.isEmptyObject(filters)) {
      queryObject[paramName] = angular.copy(filters);
    } else {
      Reflect.deleteProperty(queryObject, paramName);
      filters = false;
    }
    return filters;
  }

  function getFilterQueryObject(paramName) {
    return queryObject[paramName];
  }

  function apply(parentComponentId, filterName) {
    var filterJSON = null, filters;
    if (parentComponentId) {
      var fCtrl = filterComponentsStorage[parentComponentId];
      if (fCtrl) {
        filterName = filterName || fCtrl.filterName;
      }
      filters = $location.search()[filterName];
      if (filters) {
        filters = JSON.parse(filters);
      }
      var filterEntity = calculate(parentComponentId, filterName);

      if (filterEntity) {
        filters = filters || {};
        filters = JSON.stringify(filterEntity);
      } else {
        filters = null;
      }
      $location.search(filterName, filters);
      $rootScope.$broadcast('ue:collectionRefresh', parentComponentId);
    }
  }

  /**
   * Clears the filtes components.
   * @param {string} id id of the component who registered the filter.
   * @param {string} paramName Name of the filter in the query parameters.
   */
  function clearFiltersValue(id, paramName) {
    if (storage[id]) {
      angular.forEach(storage[id], function(ctrl) {
        ctrl.clear();
      });
      calculate(id, paramName);
    }
  }

  /**
   * Clears the filtes components and init scope-event 'ue:collectionRefresh'.
   * @param {string} parentComponentId id of the component who registered the filter.
   * @param {string} filterName Name of the filter in the query parameters.
   */
  function clear(parentComponentId, filterName) {
    if (parentComponentId) {
      clearFiltersValue(parentComponentId, filterName);
      if (filterName) {
        $location.search(filterName, null);
      }
      $rootScope.$broadcast('ue:collectionRefresh', parentComponentId);
    }
  }

  /**
   * Gets filter as object like {<fieldName>: [operator: <string>, value: <value>]}.
   * @param {string} parentComponentId id of the component who registered the filter.
   * @param {string} originFilters Value of filter in query parameters.
   * @returns {object} Object like {<fieldName>: [operator: <string>, value: <value>]}
   */
  function getFilterObject(parentComponentId, originFilters) {
    var filters = {};
    var filterCtrl = getFilterFieldController(parentComponentId);
    if (filterCtrl) {
      angular.forEach(filterCtrl, function(item) {
        filters[item.fieldName] = filters[item.fieldName] || [];
        var operator = item.options.filterParameters.operator;
        var value = item.getFieldValue();
        for (var key in value) {
          if (value[key] !== undefined && value[key] !== null && value[key] !== '' && (!angular.isArray(value[key]) || value[key].length > 0)) {
            if (originFilters && originFilters[key]) {
              value[key] = originFilters[key];
            }
            filters[item.fieldName].push({
              operator: operator,
              value: value[key]
            });
          }
        }
      });
    }
    for (var key in filters) {
      if (filters[key].length == 0) {
        delete filters[key];
      }
    }
    return filters;
  }

  /**
   * Converts object like {<fieldName>: [operator: <string>, value: <value>]} to query-string.
   * @param {object} filters Object of items like {<fieldName>: [operator: <string>, value: <value>]}.
   * @returns {string}
   */
  function convertFilterToString(filters) {
    var output = '', filter = {};
    angular.forEach(filters, function(value, key) {
      value.forEach(function(f) {
        if (~f.operator.indexOf(':key')) {
          filter[f.operator.replace(/\:key/g, key)] = f.value;
        }
        if (~f.operator.indexOf(':value')) {
          if (angular.isArray(f.value)) {
            filter[key] = f.value;
          } else {
            filter[key] = f.operator.replace(/\:value/g, f.value);
          }
          if (typeof f.value === 'number') {
            filter[key] = +filter[key];
          }
        }
      });
    });

    if ($.isEmptyObject(filter)) {
      return '';
    } else {
      return JSON.stringify(filter);
    }
  }
}
export { FilterFieldsStorage };
