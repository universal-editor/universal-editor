(function() {
    'use strict';

    angular
        .module('universal-editor')
        .service('YiiSoftApiService', YiiSoftApiService);

    function YiiSoftApiService($q, $rootScope, $http, $location, $state, $httpParamSerializer, $document, FilterFieldsStorage, toastr, $translate, $httpParamSerializerJQLike, $window, $injector) {
        'ngInject';
        var self = this;

        self.convertSorting = function(sorting) {
            var fields = sorting.split(',');
            var result = {};
            angular.forEach(fields, function(field) {
                field = field.trim();
                if (field[0] === '-') {
                    result[field.substr(1)] = 'desc';
                }
                if (field[0] !== '-') {
                    result[field] = 'asc';
                }
            });
            return result;
        };

        self.setExpands = function(config) {
            var expandFields = [],
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

                if (dataSource && angular.isObject(dataSource.tree) && angular.isString(dataSource.tree.childrenField)) {
                    expandFields.push(dataSource.tree.childrenField);
                }
                if (expandFields.length) {
                    config.params.expand = expandFields.toString();
                }
            }
            return expandFields;
        }

        self.getSorting = function(tableFields) {
            if (angular.isArray(tableFields)) {
                var parameter = '';
                angular.forEach(tableFields, function(column) {
                    if (column.sort.enable) {
                        if (column.sort.direction === 'asc') {
                            parameter += parameter === '' ? column.field : (',' + column.field);
                        }
                        if (column.sort.direction === 'desc') {
                            parameter += parameter === '' ? ('-' + column.field) : (',-' + column.field);
                        }
                    }
                });
                return parameter || null;
            } else {
                return null;
            }
        };

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

            if (~['read', 'one'].indexOf(config.action)) {
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
            if (config.action == 'read' || config.action == 'one') {
                self.setPagination(config);
                self.setExpands(config);
                var fields = [];
                if (config.$dataSource && angular.isArray(config.$dataSource.fields)) {
                    angular.forEach(config.$dataSource.fields, function(field, index) {
                        if (field && field.name) {
                            fields.push(field.name);
                        }
                    });
                    if (fields.length) {
                        config.params.fields = fields.join(',');
                    }
                }
                self.setFiltering(config);
            }

            config.params.sort = config.sort;
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
