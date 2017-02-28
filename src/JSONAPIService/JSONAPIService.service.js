(function() {
    'use strict';

    angular
        .module('JSONAPIService', [])
        .service('JSONAPIApiTypeService', JSONAPITypeService);

    function JSONAPITypeService() {
        var self = this;

        self.getHeaders = function(config) {
            var headers = {};
            headers['Content-Type'] = 'application/x-www-form-urlencoded';
            return headers;
        };

        self.getMethod = function(config) {
            var method;
            if (config.action == 'create') {
                method = 'POST';
            }

            if (config.action == 'update') {
                method = 'PATCH';
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
            if (config.action == 'create' || config.action == 'update') {
                var attributes = {};
                var relationships = {};
                angular.forEach(config.data, function(value, key) {
                    if (angular.isObject(value) && !angular.isArray(value)) {
                        relationships[key] = relationships[key] || {};
                        relationships[key].data = relationships[key].data || {};
                        if (value.id) {
                            relationships[key].data = {
                                id: value.id,
                                type: value.__type
                            };
                        } else {
                            relationships[key] = null;
                        }
                        delete config.data[key];
                    } else {
                        attributes[key] = value;
                    }
                });
                data = {};
                data.attributes = attributes;
                data.relationships = relationships;
                data.type = config.__type;
                data.id = config.id || null;
            }
            return { data: data };
        };

        self.getParams = function(config) {
            config.params = config.params || {};
            delete config.params.root;
            if (config.action == 'list') {
                config.params.page = {
                    offset: (config.pagination.page - 1) * config.pagination.perPage,
                    limit: config.pagination.perPage
                };
            }
            if (config.action == 'list' || config.action == 'one') {
                if (config.params.expand) {
                    config.params.include = config.params.expand;
                    delete config.params.expand;
                }
            }
            if (config.filter) {
                var filter = {};
                angular.forEach(config.filter, function(value, key) {
                    value.forEach(function(f) {
                        if (f.operator == '%:value%') {
                            filter[key] = ':' + f.value;
                        } else if (f.operator == '>=:key') {
                            filter[key] = '>' + f.value;
                        } else if (f.operator == '<=:key') {
                            filter[key] = '<' + f.value;
                        } else {
                            filter[key] = f.value;
                        }
                    });
                });
                config.params.filter = filter;
            }

            config.params.sort = config.sortFieldName;

            return config.params;
        };

        self.getURL = function(config) {
            return config.url;
        };

        self.processResponse = function(config, responseServer, success, fail) {
            var response = responseServer.data;
            var output = {};
            var parse = proccessJsonApiElements.bind(config);
            if (response.errors) {
                var errors = [];
                if (response.errors[0]) {
                    var apiError = response.errors[0];
                    if (angular.isArray(apiError.detail)) {
                        apiError.detail.forEach(function(error) {
                            if (error.message && error.path) {
                                errors.push({ field: error.path || '', message: error.message || '' });
                            }
                        });
                    } else if (angular.isString(apiError.detail)) {
                        errors = {
                            status: apiError.status || -1,
                            data:
                            {
                                message: apiError.detail
                            }
                        };
                    }
                }
                if (angular.isFunction(fail)) {
                    fail(errors.length ? errors : responseServer);
                }
                return;
            }
            switch (config.action) {
                case 'list':
                    var metaPage = response.meta.page || { limit: 20, total: 0, offset: 0 };
                    output._meta = {
                        perPage: metaPage.limit,
                        totalCount: metaPage.total,
                        pageCount: Math.ceil(metaPage.total / metaPage.limit),
                        currentPage: Math.ceil((metaPage.offset + 1) / metaPage.limit)
                    };
                    output.items = parse(response);
                    break;
                case 'one':
                    output = parse(response);
                    break;
                case 'update':
                    output = parse(response);
                    break;
                case 'create':
                    output = parse(response);
                    break;
                case 'presave':
                    output = parse(response);
                    break;
                case 'delete': output = ''; break;
                default: break;
            }
            if (angular.isFunction(success)) {
                success(output);
            }
            return output;
        };

        this.proccessApiElements = proccessJsonApiElements;

        function proccessJsonApiElements(response) {
            var config = this, expands = [], output;
            if (angular.isString(config.params.include)) {
                expands = config.params.include.split(',');
            }
            if (angular.isArray(response.data)) {
                output = [];
                response.data.forEach(function(elementApi) {
                    var element = proccessData(elementApi);
                    if (element && !$.isEmptyObject(element)) {
                        output.push(element);
                    }
                });
            } else if (angular.isObject(response.data)) {
                output = proccessData(response.data);
            }
            return output;

            function proccessData(elementApi) {
                var element = {};
                try {
                    element.id = elementApi.id;
                    element.__type = elementApi.type;
                    element = angular.extend(element, elementApi.attributes);
                    expands.forEach(function(field) {
                        var relationship = elementApi.relationships[field];
                        {
                            var expandObject = relationship.data;
                            if (angular.isArray(expandObject)) {
                                element[field] = expandObject.map(function(i) { return findIncluded(i); });
                            } else if (angular.isObject(expandObject)) {
                                element[field] = findIncluded(expandObject);
                            }
                        }
                    });
                } catch (e) {
                    element = null;
                }
                return element;
            }
            function findIncluded(finding) {
                if (!angular.isArray(response.included)) {
                    return [];
                }
                var finded = response.included.filter(function(item) {
                    return item.id === finding.id && item.type === finding.type;
                }).map(function(item) {
                    var element = {};
                    element.id = item.id;
                    element.__type = item.type;
                    if (item.attributes) {
                        element = angular.extend(element, item.attributes);
                    }
                    return element;
                });
                return (finded && finded.length === 1) ? finded[0] : finded;
            }
        }
    }
})();