(function() {
  'use strict';

  module.exports = window.DataSource = class DataSource {
    constructor(options) {
      this.url = options.url;
      this.transport = options.transport;
      this.standard = options.standard;
      this.primaryKey = options.primaryKey || 'id';
      this.parentKey = options.parentField;
      this.tree = options.tree;
      this.fields = options.fields;
      this.resourceType = options.resourceType;
      this.keys = options.keys;
      this.sortBy = options.sortBy;
      this.$hash = options.$hash;

      if (this.transport) {
        this.url = options.transport.url;
      }
    }

    getURL(action, entity) {
      let url = this.url;
      if (angular.isString(action) && angular.isObject(this.transport)) {
        if (angular.isObject(this.transport[action])) {
          url = this.transport[action].url || url;
        } else {
          if (url) {
            if (action !== 'read' && action !== 'create' && entity[this.primaryKey]) {
              url += '/' + entity[this.primaryKey];
            }
          }
        }
      }
      if (angular.isFunction(url)) {
        url = url.bind(this)(entity);
      }
      if (angular.isString(url) && angular.isObject(entity)) {
        angular.forEach(entity, function(value, key) {
          url = url.replace(':' + key, value);
        });
      }
      return url;
    }

    getHeaders(action, entity) {
      let headers = {};
      if (angular.isString(action) && angular.isObject(this.transport)) {
        if (angular.isObject(this.transport.headers)) {
          angular.merge(headers, this.transport.headers);
        }
        if (angular.isObject(this.transport[action]) && angular.isFunction(this.transport[action].headers)) {
          angular.merge(headers, this.transport[action].headers.bind(this)(entity));
        }
      }
      return headers;
    }

    getMethod(action) {
      let method = null;
      if (angular.isString(action) && angular.isObject(this.transport) && angular.isObject(this.transport[action]) && angular.isString(this.transport[action].method)) {
        method = this.transport[action].method;
      }
      return method;
    }

    getData(action, entity) {
      let data = {};
      if (angular.isString(action) && angular.isObject(this.transport) && angular.isObject(this.transport[action]) && angular.isFunction(this.transport[action].data)) {
        angular.merge(data, this.transport[action].data.bind(this)(entity));
      }
      return data;
    }

    getParams(action, entity) {
      let params = {};
      if (angular.isString(action) && angular.isObject(this.transport) && angular.isObject(this.transport[action]) && angular.isFunction(this.transport[action].params)) {
        angular.merge(params, this.transport[action].params.bind(this)(entity));
      }
      return params;
    }

    getHandlers(action) {
      let handlers = {};
      if (angular.isString(action) && angular.isObject(this.transport) && angular.isObject(this.transport[action]) && angular.isObject(this.transport[action].handlers)) {
        handlers = this.transport[action].handlers;
      }
      return handlers;
    }
  }
})();