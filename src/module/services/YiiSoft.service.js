let angular = window.angular;
let $ = window.jQuery;

function YiiSoftApiService(EditEntityStorage) {
  'ngInject';
  var self = this;

  self.toConvertSortingString = toConvertSortingString;
  self.getData = getData;
  self.getHeaders = getHeaders;
  self.getMethod = getMethod;
  self.getParams = getParams;
  self.getSorting = getSorting;
  self.getURL = getURL;
  self.setExpands = setExpands;
  self.setFiltering = setFiltering;
  self.setPagination = setPagination;
  self.processResponse = processResponse;


  /**
   * Converts the sorting-string to object that the editor undestands.
   * @param {string} sorting String with format '-field1.field2,field3,field4.field5...', Which is the query-parameter from API responsible for sorting
   * @returns {object}
   * {
   *  field1: {
   *    field2: 'asc' //по убыванию
   *  }
   *  field3: 'desc',  //по возрастанию
   *  field4: {
   *    field5: 'asc'
   *  }
   * }
   */
  function toConvertSortingString(sorting) {
    var fields = sorting.split(',');
    var result = {};
    angular.forEach(fields, function(field) {
      let prefix = 'asc';
      field = field.trim();
      if (field.startsWith('-')) {
        prefix = 'desc';
        field = field.substr(1);
      }
      EditEntityStorage.constructObjectByPointScheme(field, prefix, result);
    });
    return result;
  }

  /**
   * Gets query-parameters by the configuration object and modifyes 'params'-property in the configuration-object.
   * @param {object} config Configuration object.
   * Format
   * {
        action: 'read', – {read,one,create,delete,update} – Actions from transport-section of the datasource-object.
        $dataSource: dataSource, – datasource-object
        data:  {}, – Data which is sent to API
        params: {}, – Data which is sent to API in query-parameters of the URL
        sort: '-field1', – parameter for sorting (is sent by any component)
        pagination: {
          perPage: 20, – Count of element on one page
          page: 2, – Number of page
        },
        filter: {
          <fieldName>: [
            {
              operator: '%:value%',

              // The string with literals ':key' and ':value'.
              // If operator includes substring ':value' then the filter of the field will take the value of operator
              // which will be replaced by the ':value' on the value of value-property.
              // If operator includes substring ':key' then the key of field filter will take the value of operator
              // which will be replaced by the ':key' on the value of value-property.
              // For example,
              // 1) {
              //      filter: {
              //        name: [{
              //          operator: '%:value%',
              //          value: 'James'
              //        }]
              //      }
              //   }
              // convert to
              // filter: '{"name":"%:James%"}'
              //
              // 2)
              // {
              //  filter: {
              //    age: [{
              //      operator: '>=:key',
              //      value: 20
              //    }]
              //  }
              // }
              // convert to
              // filter: '{">=age":20}'

              value: 'Filter value'
            }
          ]
        } – Array of the filter value from ueFilter-component
    }
  * @returns {object} Params-property from the configuration-object
  */
  function getParams(config = {}) {
    config.params = config.params || {};
    if (config.action == 'read' || config.action == 'one') {
      let dataSource = config.$dataSource;
      self.setExpands(config);
      if (dataSource && angular.isArray(dataSource.fields)) {
        let fields = [];
        angular.forEach(dataSource.fields, function(field) {
          if (field && field.name) {
            fields.push(field.name);
          }
        });
        if (fields.length) {
          config.params.fields = fields.join(',');
        }
      }
      self.setFiltering(config);
      if (config.action === 'read') {
        self.setPagination(config);
        if (config.sort) {
          config.params.sort = config.sort;
        }
      }
    }
    if ($.isEmptyObject(config.params)) {
      Reflect.deleteProperty(config, 'params');
    }
    return config.params;
  }

  function getData(config) {
    config = config || {};
    return config.data;
  }

  function getHeaders(config) {
    config = config || { headers: {} };
    return config.headers;
  }

  function getMethod(config) {
    var method = config.method || 'GET';
    if (config.action == 'create') {
      method = 'POST';
    }

    if (config.action == 'update') {
      method = 'PUT';
    }

    if (config.action == 'delete') {
      method = 'DELETE';
    }

    if (~['read', 'one'].indexOf(config.action)) {
      method = 'GET';
    }

    return method;
  }

  /**
   * Gets query-parameter for sorting of format '-field1.field2.fieldN'.
   * @param {object} tableFields Array of objects of format
   * [
   *  {
   *   sort: {
   *     enable: {true|false},
   *     direction: {'asc', 'desc'}, // The direction of the sorting 'asc' – ascending, 'desc' – descending
   *   },
   *   field: <name> // The name of field
   *  }
   * ]
   * @returns {string}
   */
  function getSorting(tableFields) {
    let parameter = null,
      addToEnd = (start, end) => (start ? (',' + end) : end);

    if (angular.isArray(tableFields)) {
      parameter = parameter || '';
      angular.forEach(tableFields, function(column) {
        if (column && column.sort && column.sort.enable) {
          if (column.sort.direction === 'asc') {
            parameter += addToEnd(parameter, column.field);
          }
          if (column.sort.direction === 'desc') {
            parameter += addToEnd(parameter, '-' + column.field);
          }
        }
      });
      return parameter || null;
    }
    return null;
  }

  function getURL(config) {
    config = config || {};
    return config.url;
  }

  /**
   * Show in the $dataSource-property of the configuration object and gets the expandable fields and writes them into string through a comma.
   * @param {object} config The configuration file
   * @returns {string}
   */
  function setExpands(config = {}) {
    let expandFields = [],
      dataSource = config.$dataSource;
    if (dataSource) {
      angular.forEach(dataSource.fields, function(field) {
        if (field.component && field.component.settings && field.component.settings.expandable === true) {
          if (angular.isString(field.name)) {
            var name = field.name.split('.')[0].replace('[]', '');
            if (name && expandFields.indexOf(name) === -1) {
              expandFields.push(name);
            }
          }
        }
      });

      if (
        angular.isObject(dataSource.tree) &&
        angular.isString(dataSource.tree.childrenField) &&
        expandFields.indexOf(dataSource.tree.childrenField) === -1
      ) {
        expandFields.push(dataSource.tree.childrenField);
      }
      if (expandFields.length) {
        config.params = config.params || {};
        config.params.expand = expandFields.toString();
      }
    }
    return expandFields;
  }

  /**
   * Converts filter-property of the configuration object to string and writes them into params-property with name 'filter'
   * @param {object} config The configuration object
   * @returns {string}
   */
  function setFiltering(config = {}) {
    let filter = {};
    if (config.filter) {
      angular.forEach(config.filter, function(value, key) {
        angular.forEach(value, function(f) {
          if (angular.isString(f.operator)) {
            if (angular.isNumber(f.value)) {
              filter[key] = f.value;
            } else if (~f.operator.indexOf(':value')) {
              filter[key] = f.operator.replace(/\:value/g, f.value);
            }
            if (~f.operator.indexOf(':key')) {
              filter[f.operator.replace(/\:key/g, key)] = f.value;
            }
          }
        });
      });
      config.params = config.params || {};
      Reflect.deleteProperty(config.params, 'filter');
      if (!$.isEmptyObject(filter)) {
        config.params.filter = JSON.stringify(filter);
      }
    }
    return filter;
  }

  /**
   * Converts pagination-property of the configuration object to string and writes them into params-property
   * @param {object} config The configuration object
   * @returns {object}
  */
  function setPagination(config = {}) {
    let paginationParams = {};

    if (config.pagination) {
      paginationParams.page = config.pagination.page;
      paginationParams['per-page'] = config.pagination.perPage;

      config.params = config.params || {};
      angular.merge(config.params, paginationParams);
    }

    return paginationParams;
  }

  /**
   * Processes response of the server according to status and calls success or error callback.
   * @param {object} config The configuration object
   * @returns {object} Data of the server response.
  */
  function processResponse(config, responseServer = {}, success, fail) {
    if (responseServer.status >= 400 || responseServer.status === -1) {
      if (angular.isFunction(fail)) {
        fail(responseServer);
      }
    } else {
      if (angular.isFunction(success)) {
        success(responseServer.data);
      }
    }
    return responseServer.data;
  }
}

export { YiiSoftApiService };
