(function() {
    'use strict';

    angular
        .module('universal-editor')
        .service('YiiSoftApiTypeService', YiiSoftApiTypeService);

    function YiiSoftApiTypeService($q, $rootScope, $http, $location, $state, $httpParamSerializer, $document, FilterFieldsStorage, toastr, $translate, $httpParamSerializerJQLike, $window, $injector) {
        'ngInject';
        var self = this;

        self.getHeaders = function(config) {
            var headers = config.headers || {};
            return headers;
        };

        self.getMethod = function(config) {
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

            if (~['list', 'one'].indexOf(config.action)) {
                method = 'GET';
            }

            return method;
        };

        self.getData = function(config) {
            var data;
            return config.data;
        };

        self.setFiltering = function(config) {
            if (config.filter) {
                var filter = {};
                angular.forEach(config.filter, function(value, key) {
                    value.forEach(function(f) {
                        if (f.operator == '%:value%') {
                            filter[key] = '%' + f.value + '%';
                        } else if (f.operator == '>=:key') {
                            filter['>=' + key] = f.value;
                        } else if (f.operator == '<=:key') {
                            filter['<=' + key] = f.value;
                        } else {
                            filter[key] = f.value;
                        }
                    });
                });
                delete config.params.filter;
                if (!$.isEmptyObject(filter)) {
                    config.params.filter = JSON.stringify(filter);
                }
            }
        };

        self.setPagination = function(config) {
            if (config.pagination) {
                config.params.page = config.pagination.page;
                config.params['per-page'] = config.pagination.perPage;
            }
        };

        self.getParams = function(config) {
            config.params = config.params || {};
            delete config.params.root;
            if (config.action == 'list') {
                self.setPagination(config);
            }
            self.setFiltering(config);
            config.params.sort = config.sortFieldName;
            return config.params;
        };

        self.getURL = function(config) {
            return config.url;
        };

        self.processResponse = function(config, responseServer, success, fail) {
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
        };
    }
})();
