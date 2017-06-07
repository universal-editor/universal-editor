(function() {
    'use strict';

    angular
        .module('universal-editor')
        .service('ApiService', ApiService);

    function ApiService($q, $rootScope, $http, $location, $state, $httpParamSerializer, $document, FilterFieldsStorage, toastr, $translate, $httpParamSerializerJQLike, $window, $injector) {
        'ngInject';
        var self = this,
            itemsKey = 'items',
            cancelerPromises = [];

        self.isProcessing = false;

        function setTimeOutPromise(id, mode) {
            var def = $q.defer();
            cancelerPromises[id] = cancelerPromises[id] || {};
            if (cancelerPromises[id][mode]) {
                cancelerPromises[id][mode].resolve();
            }
            cancelerPromises[id][mode] = def;
            return def;
        }

        this.getItemsList = function(request, notGoToState) {
            var deferred = $q.defer();
            var dataSource = request.options.$dataSource;
            notGoToState = notGoToState === true;
            //** cancel previouse request if request start again 
            var canceler = setTimeOutPromise(request.options.$componentId, 'read');
            var service = getCustomService(dataSource.standard);
            checkStandardParameter(dataSource.standard, service);
            request.options.isLoading = true;

            var _url = request.url;
            var _method = request.method || 'GET';
            var id = request.options.$componentId;

            var params = request.params || {};
            var filters = FilterFieldsStorage.getFilterQueryObject(request.options.prefixGrid ? request.options.prefixGrid + '-filter' : 'filter');

            if (!!request.childId) {
                filters = filters || {};
                filters[request.parentField] = request.childId;
            }
            var expandFields = [];

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

            if (expandFields.length > 0) {
                params.expand = expandFields.join(',');
            }

            var config = {
                action: 'list',
                url: _url,
                method: _method,
                data: {}
            };

            if (dataSource.resourceType) {
                config.__type = dataSource.resourceType;
            }

            config.filter = FilterFieldsStorage.getFilterObject(id, filters);
            if (!!request.childId) {
                config.filter = config.filter || {};
                config.filter[request.parentField] = [{
                    operator: ':text',
                    value: request.childId
                }];
            }
            config.sortFieldName = params.sort || null;
            config.pagination = {
                perPage: 20,
                page: 1
            };

            if (params.page) {
                config.pagination.page = params.page;
                delete params.page;
            }

            if (!!request.options.mixedMode) {
                config.mixMode = request.options.mixedMode.collectionType;
            }

            config.params = params || {};

            var options = getAjaxOptionsByTypeService(config, dataSource.standard);
            options.beforeSend = request.before;

            var objectBind = { action: 'list', parentComponentId: request.options.$componentId, notGoToState: notGoToState };

            $http(options).then(function(response) {
                var data;
                if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                    data = service.processResponse(
                        config,
                        response,
                        successAnswer.bind(objectBind),
                        failAnswer.bind(objectBind));
                }
                deferred.resolve(data);
            }, function(reject) {
                reject.canceled = canceler.promise.$$state.status === 1;
                if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                    var data = service.processResponse(config, reject,
                        successAnswer.bind(objectBind),
                        failAnswer.bind(objectBind));
                    reject.data = data;
                } else {
                    reject.$componentId = request.options.$componentId;
                    failAnswer.bind(objectBind)(reject);
                }
                deferred.reject(reject);
            }).finally(function() {
                request.options.isLoading = false;
            });
            return deferred.promise;
        };

        this.addNewItem = function(request) {
            var deferred = $q.defer();
            var dataSource = request.options.$dataSource;
            var service = getCustomService(dataSource.standard);
            checkStandardParameter(dataSource.standard, service);

            if (request.options.isLoading) {
                return;
            }

            var parentField = dataSource.fields.parent;
            var paramName = request.options.prefixGrid ? request.options.prefixGrid + '-parent' : 'parent';
            if (parentField && $location.search()[paramName]) {
                var isNotEditableParentField = !$document[0].querySelector(".field-wrapper [name='" + parentField + "']");
                if (isNotEditableParentField) {
                    request.data[parentField] = $location.search()[paramName];
                }
            }

            request.options.isLoading = true;
            var idField = 'id';
            var state;

            if (dataSource.hasOwnProperty('fields')) {
                idField = dataSource.fields.primaryKey || idField;
            }

            var config = {
                action: 'create',
                url: request.url || dataSource.url,
                method: request.method || 'POST',
                data: request.data,
                params: request.params || {}
            };

            if (dataSource.resourceType) {
                config.__type = dataSource.resourceType;
            }

            var options = getAjaxOptionsByTypeService(config, dataSource.standard);
            options.beforeSend = request.before;

            var objectBind = {
                action: 'create',
                parentComponentId: request.options.$componentId,
                request: request,
                idField: idField
            };

            $rootScope.$broadcast('ue:beforeEntityCreate', objectBind);
            $http(options).then(function(response) {
                if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                    service.processResponse(
                        config,
                        response,
                        successAnswer.bind(objectBind),
                        failAnswer.bind(objectBind)
                    );
                } else {
                    successAnswer.bind(objectBind)(response.data);
                }
                deferred.resolve(response.data);
            }, function(reject) {
                if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                    service.processResponse(
                        config,
                        reject,
                        successAnswer.bind(objectBind),
                        failAnswer.bind(objectBind)
                    );
                } else {
                    failAnswer.bind(objectBind)(reject);
                }
                deferred.reject(reject);
            }).finally(function() {
                request.options.isLoading = false;
                if (!!request.complete) {
                    request.complete();
                }
            });
            return deferred.promise;
        };

        function removePrimaryKey(ds, data) {
            if (ds && ds.primaryKey && data && data[ds.primaryKey]) {
                delete data[ds.primaryKey];
            }
        }

        this.updateItem = function(request) {
            if (request.options.isLoading) {
                return;
            }
            var dataSource = request.options.$dataSource;
            var service = getCustomService(dataSource.standard);
            checkStandardParameter(dataSource.standard, service);
            request.options.isLoading = true;

            var _url = dataSource.url + '/' + request.entityId;
            var idField = dataSource.primaryKey || 'id';
            removePrimaryKey(dataSource, request.data);
            var config = {
                action: 'update',
                url: request.url || _url,
                method: request.method || 'PUT',
                data: request.data,
                params: request.params || {}
            };

            config.id = request.entityId;

            if (dataSource.resourceType) {
                config.__type = dataSource.resourceType;
            }

            var options = getAjaxOptionsByTypeService(config, dataSource.standard);
            options.beforeSend = request.before;
            var objectBind = {
                action: 'update',
                parentComponentId: request.options.$componentId,
                request: request,
                idField: idField
            };
            $rootScope.$broadcast('ue:beforeEntityUpdate', objectBind);
            $http(options).then(function(response) {
                if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                    service.processResponse(
                        config,
                        response,
                        successAnswer.bind(objectBind),
                        failAnswer.bind(objectBind)
                    );
                } else {
                    successAnswer.bind(objectBind)(response.data);
                }
            }, function(reject) {
                if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                    service.processResponse(
                        config,
                        reject,
                        successAnswer.bind(objectBind),
                        failAnswer.bind(objectBind)
                    );
                } else {
                    failAnswer.bind(objectBind)(reject);
                }
                request.options.isLoading = false;
            }).finally(function() {
                if (!!request.complete) {
                    request.complete();
                }
            });
        };

        this.presaveItem = function(request) {
            var isCreate = true;
            if (request.options.isLoading) {
                return;
            }
            var dataSource = request.options.$dataSource;
            var service = getCustomService(dataSource.standard);
            checkStandardParameter(dataSource.standard, service);
            request.options.isLoading = true;
            var idField = dataSource.primaryKey || 'id';
            removePrimaryKey(dataSource, request.data);
            var config = {
                action: 'create',
                method: 'POST',
                data: request.data,
                params: request.params || {}
            };
            config.id = request.entityId;

            if (dataSource.resourceType) {
                config.__type = dataSource.resourceType;
            }


            if (request.entityId !== '') {
                config.url = dataSource.url + '/' + request.entityId;
                config.method = 'PUT';
                config.action = 'update';
                isCreate = false;
            } else {
                config.url = dataSource.url;
            }

            if (dataSource.hasOwnProperty('fields')) {
                idField = dataSource.fields.primaryKey || idField;
            }

            var options = getAjaxOptionsByTypeService(config, dataSource.standard);
            options.beforeSend = request.before;

            var objectBind = {
                parentComponentId: request.options.$componentId,
                action: 'presave',
                isCreate: isCreate,
                request: request,
                idField: idField
            };
            $rootScope.$broadcast('ue:beforeEntityUpdate', objectBind);

            $http(options).then(function(response) {
                if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                    service.processResponse(
                        config,
                        response,
                        successAnswer.bind(objectBind),
                        failAnswer.bind(objectBind)
                    );
                } else {
                    successAnswer.bind(objectBind)(response.data);
                }
            }, function(reject) {
                if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                    service.processResponse(
                        config,
                        reject,
                        successAnswer.bind(objectBind),
                        failAnswer.bind(objectBind)
                    );
                } else {
                    failAnswer.bind(objectBind)(reject);
                }
            }).finally(function() {
                if (!!request.complete) {
                    request.complete();
                }
                request.options.isLoading = false;
            });
        };

        this.getItemById = function(id, options) {
            var deferred = $q.defer(),
                qParams = {},
                expandFields = [],
                dataSource = options.$dataSource;
            if (angular.isObject(dataSource) && dataSource.url) {
                var service = getCustomService(dataSource.standard);
                checkStandardParameter(dataSource.standard, service);
                options.isLoading = true;
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
                if (expandFields.length > 0) {
                    qParams.expand = expandFields.join(',');
                }
                var url = id ? (dataSource.url + '/' + id) : dataSource.url;

                var config = {
                    action: 'one',
                    url: url,
                    method: 'GET',
                    params: qParams
                };
                if (dataSource.resourceType) {
                    config.__type = dataSource.resourceType;
                }

                var optionsHttp = getAjaxOptionsByTypeService(config, dataSource.standard);

                var objectBind = {
                    action: 'one',
                    parentComponentId: options.$componentId
                };
                $http(optionsHttp).then(function(response) {
                    var data = response.data;
                    if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                        data = service.processResponse(
                            config,
                            response,
                            successAnswer.bind(objectBind),
                            failAnswer.bind(objectBind)
                        );
                    } else {
                        successAnswer.bind(objectBind)(data);
                    }
                    deferred.resolve(data);
                }, function(reject) {
                    if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                        var data = service.processResponse(config, reject,
                            successAnswer.bind(objectBind),
                            failAnswer.bind(objectBind));
                        reject.data = data;
                    } else {
                        reject.$componentId = options.$componentId;
                        failAnswer.bind(objectBind)(reject);
                    }
                    deferred.reject(reject);
                });
            }
            return deferred.promise;
        };

        this.deleteItemById = function(request, notGoToState) {
            var state;
            notGoToState = notGoToState === true;
            if (request.options.isLoading) {
                return;
            }
            var dataSource = request.options.$dataSource;
            var service = getCustomService(dataSource.standard);
            checkStandardParameter(dataSource.standard, service);
            var url;

            if (request.options.isMix) {
                url = request.options.mixedMode.dataSource.url;
            } else {
                url = dataSource.url;
            }
            request.options.isLoading = true;

            var _url = url + '/' + request.entityId;

            if (request.setting.buttonClass === 'edit') {
                _url = url.replace(':pk', request.entityId);
            }

            var config = {
                action: 'delete',
                url: request.url || _url,
                method: request.method || 'DELETE',
                data: request.data,
                params: request.params || {}
            };

            if (dataSource.resourceType) {
                config.__type = dataSource.resourceType;
            }

            var options = getAjaxOptionsByTypeService(config, dataSource.standard);
            options.beforeSend = request.before;

            var objectBind = {
                parentComponentId: request.options.$componentId,
                action: 'delete',
                request: request,
                notGoToState: notGoToState
            };

            $rootScope.$broadcast('ue:beforeEntityDelete', objectBind);

            return $http(options).then(function(response) {
                if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                    service.processResponse(config, response,
                        successAnswer.bind(objectBind),
                        failAnswer.bind(objectBind)
                    );
                } else {
                    successAnswer.bind(objectBind)(response.data);
                }
            }, function(reject) {
                if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                    service.processResponse(config, reject,
                        successAnswer.bind(objectBind),
                        failAnswer.bind(objectBind)
                    );
                } else {
                    failAnswer.bind(objectBind)(reject);
                }
            }).finally(function() {
                if (!!request.complete) {
                    request.complete();
                }
            });
        };

        function successDeleteMessage() {
            $translate('CHANGE_RECORDS.DELETE').then(function(translation) {
                toastr.success(translation);
            });
        }

        function successUpdateMessage() {
            $translate('CHANGE_RECORDS.UPDATE').then(function(translation) {
                toastr.success(translation);
            });
        }

        function successPresaveUpdateMessage() {
            $translate('CHANGE_RECORDS.UPDATE').then(function(translation) {
                toastr.success(translation);
            });
        }

        function successPresaveCreateMessage() {
            $translate('CHANGE_RECORDS.CREATE').then(function(translation) {
                toastr.success(translation);
            });
        }

        function successCreateMessage() {
            $translate('CHANGE_RECORDS.CREATE').then(function(translation) {
                toastr.success(translation);
            });
        }

        //-- read all pages
        this.getUrlResource = function getUrlResource(config) {
            config.defer = config.defer || $q.defer();
            config.result = config.result || [];
            var promiseStack = [];
            config.fromP = config.fromP || 1;
            config.toP = config.toP || 0;
            config.params = config.params || {};
            var defaultStandard = !config.standard || config.standard === 'YiiSoft';
            var options = {};
            config.action = 'list';

            if (defaultStandard && config.filter) {
                config.params.filter = FilterFieldsStorage.convertFilterToString(config.filter);
            }

            if (!config.toP) {
                promiseStack.push(getPromise(config.url));
            } else {
                for (var i = config.fromP; i <= config.toP; i++) {
                    promiseStack.push(getPromise(config.url, i));
                }
            }

            //-- read items from one page
            function getPromise(url, page) {
                config.pagination = {};
                config.pagination.page = page || 1;
                config.pagination.perPage = 50;
                options = angular.merge({}, getAjaxOptionsByTypeService(config, config.standard));
                return $http(options);
            }

            var service = getCustomService(config.standard);

            $q.all(promiseStack).then(function(allResp) {
                var resp;
                var countP;
                for (var i = allResp.length; i--;) {
                    resp = allResp[i];
                    var list = [];
                    if (defaultStandard) {
                        list = resp.data.items;
                    } else {
                        var serviceResponce = service.processResponse(config, resp);
                        list = serviceResponce.items || [];
                    }
                    config.result = config.result.concat(list);
                    if (angular.isFunction(config.callback)) {
                        config.callback(list);
                    }
                }
                if (resp && resp.data._meta) {
                    countP = resp.data._meta.pageCount;
                }

                if (!countP || countP === config.toP || countP === 1 || !config.serverPagination) {
                    config.defer.resolve({ data: { items: config.result } });
                } else {
                    if (config.fromP === 1) {
                        config.fromP = 2;
                    } else if (config.fromP === 2) {
                        config.fromP += 4;
                    } else {
                        config.fromP += 5;
                    }
                    config.toP += 5;
                    if (config.toP > countP) {
                        config.toP = countP;
                    }
                    return getUrlResource(config);
                }
            }, function(reject) {
                reject.$componentId = config.$id;
                if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                    var data = service.processResponse(config, reject,
                        successAnswer.bind(config),
                        failAnswer.bind(config));
                    reject.data = data;
                } else {
                    failAnswer.bind(config)(reject);
                }
                config.defer.reject(reject);
            });
            return config.defer.promise;
        };

        function takeRemoteValuesInTree(data = [], component, childrenField, selfField, filter = []) {
            data.forEach(function(item) {
                var value = selfField ? item[selfField][component.name] : item[component.name];
                if (angular.isArray(value)) {
                    value.forEach(function(valueItem) {
                        if (angular.isString(component.component.settings.multiname)) {
                            valueItem = valueItem[component.component.settings.multiname];
                        } else {
                            if (angular.isObject(valueItem) && keyValue) {
                                valueItem = valueItem[keyValue];
                            }
                        }
                        if (valueItem !== undefined && valueItem !== null && filter.indexOf(valueItem) === -1) {
                            filter.push(valueItem);
                        }
                    });
                } else {
                    if (value !== undefined && value !== null && filter.indexOf(value) === -1) {
                        filter.push(value);
                    }
                }
                if (angular.isArray(item[childrenField]) && item[childrenField].length > 0) {
                    takeRemoteValuesInTree(item[childrenField], component, childrenField, selfField, filter);
                }
            });
            return filter;
        }

        var storageRemotedComponents = {};
        this.saveToStorage = saveToStorage;
        this.getFromStorage = getFromStorage;

        function saveToStorage(component, list) {
            var url = component.component.settings.valuesRemote.url;
            var keyValue = component.component.settings.valuesRemote.fields.value;
            var storage = storageRemotedComponents[url] || [];
            if (angular.isArray(list)) {
                angular.forEach(list, checkExisting);
            } else if (angular.isObject(list)) {
                checkExisting(list);
            }
            storageRemotedComponents[url] = storage;
            function checkExisting(listItem) {
                var id = listItem[keyValue];
                if (id !== undefined && id !== null) {
                    var isExist = storage.some(function(storageItem) {
                        return storageItem[keyValue] === listItem[keyValue];
                    });
                    if (!isExist) {
                        storage.push(listItem);
                    }
                }
            }
        }

        function getFromStorage(component, list) {
            var url = component.component.settings.valuesRemote.url;
            var keyValue = component.component.settings.valuesRemote.fields.value;
            var storage = storageRemotedComponents[url] || [];
            var outputSet = [];
            if (!angular.isArray(list)) {
                list = [list];
            }
            if (component.component.settings.multiname) {
                var multiname = component.component.settings.multiname;
                list = list.map(function(item) { return angular.isObject(item) ? item[multiname] : null; });
            }
            angular.forEach(storage, function(storageItem) {
                var index = list.indexOf(storageItem[keyValue]);
                if (index !== -1) {
                    outputSet.push(storageItem);
                }
            });
            if (outputSet.length === list.length && list.length > 0) {
                return outputSet;
            } else {
                return false;
            }
        }

        this.extendData = function extendData(options) {
            var data = options.data,
                components = options.components,
                $id = options.$id,
                childrenField = options.childrenField,
                selfField = options.selfField;
            var configs = [];
            var remoteComponents = components.filter(function(component) {
                return angular.isObject(component.component.settings.valuesRemote);
            });
            var defaultStandard = !options.standard || options.standard === 'YiiSoft';
            var promiseStack = [];

            /** Generate promise stacks */
            remoteComponents.forEach(function(component) {
                var fields = [];
                var filter = [];
                var options = component.component.settings.valuesRemote;

                if (angular.isObject(options.fields)) {
                    angular.forEach(options.fields, function(value, key) {
                        if (angular.isString(value)) {
                            fields.push(value);
                        }
                    });
                }
                fields = fields.join(',');
                if (angular.isString(options.url)) {
                    var keyValue = component.component.settings.valuesRemote.fields.value;
                    filter = takeRemoteValuesInTree(data, component, childrenField, selfField);

                    if (filter.length > 0) {
                        var casheValues = getFromStorage(component, filter);
                        if (casheValues !== false) {
                            return promiseStack.push($q.when(data));
                        }

                        var filterObject = {};
                        filterObject[keyValue] = [];
                        filterObject[keyValue].push({
                            operator: ':value',
                            value: filter
                        });
                        var config = {
                            action: 'list',
                            url: options.url,
                            method: 'GET',
                            params: {
                                fields: fields,
                                filter: FilterFieldsStorage.convertFilterToString(filterObject),
                                page: 1,
                                'per-page': 50
                            },
                            pagination: {
                                page: 1,
                                perPage: 50
                            }
                        };
                        configs.push(config);
                        promiseStack.push($http(getAjaxOptionsByTypeService(config)));
                    }
                }
            });
            var service = getCustomService(options.standard || 'YiiSoft');
            return $q.all(promiseStack).then(function(allResp) {
                allResp.forEach(function(response, index) {
                    if (response.data) {
                        var list = service.processResponse(configs[index], response).items || [];
                        var component = remoteComponents.filter(function(component) {
                            return component.component.settings.valuesRemote.url === response.config.url;
                        })[0];
                        saveToStorage(component, list);
                    }
                });
                return data;
            }, function(reject) {
                reject.$componentId = $id;
                var config = {
                    action: 'list',
                    parentComponentId: $id
                };
                if (angular.isDefined(service) && angular.isFunction(service.processResponse)) {
                    var data = service.processResponse(config, reject,
                        successAnswer.bind(config),
                        failAnswer.bind(config));
                    reject.data = data;
                } else {
                    failAnswer.bind(config)(reject);
                }
            });
        };


        this.actionRequest = function(request) {
            var deferred = $q.defer();

            var reqParams = request.params || {};
            var url = request.url;
            if (request.id) {
                url = request.url.replace(':id', id);
            }
            self.isProcessing = true;

            $http({
                method: request.method,
                url: url,
                params: reqParams,
                beforeSend: request.before
            }).then(function(response) {
                if (!!request.success) {
                    request.success(response);
                }
                deferred.resolve(response);
            }, function(reject) {
                if (!!request.error) {
                    request.error(reject);
                }
                deferred.reject(reject);
            }).finally(function() {
                if (!!request.complete) {
                    request.complete();
                }
                self.isProcessing = false;
            });

            return deferred.promise;
        };

        function replaceToURL(url, entityId) {
            if (url) {
                if (entityId) {
                    url = url.replace(':pk', entityId);
                }
                var params = $location.search();
                if (params.back) {
                    delete params.back;
                }
                var isReload = !~url.indexOf($location.path());
                var searchParams = $httpParamSerializerJQLike(params);
                if (searchParams) {
                    searchParams = '?' + searchParams;
                }
                $window.location.href = url + searchParams;
                if (isReload) {
                    $window.location.reload();
                }
            }
        }

        this.getUrlDepend = function(url, queryParams, dependField, dependValue) {
            if (angular.isString(dependValue)) {
                dependValue = '"' + dependValue + '"';
            }
            if (angular.isArray(dependValue)) {
                dependValue = dependValue.filter(function(item) {
                    return item !== null && item !== undefined;
                });
                dependValue = '"' + dependValue.join(',') + '"';
            }
            url = url.replace(':dependField', dependField).replace(':dependValue', dependValue);
            return this.getUrlWithParams(url, queryParams);
        };

        this.getUrlWithParams = function(url, queryParams) {
            url = decodeURI(url);
            var urlArray = url.split('?'),
                search = [],
                searchObject = {},
                split;

            if (!!urlArray[1]) {
                search = urlArray[1].split('&');
            }

            for (var i = 0; i < search.length; i++) {
                split = search[i].split('=');
                searchObject[split[0]] = eval('(' + split[1] + ')');
            }
            if (queryParams) {
                searchObject = angular.merge(searchObject, queryParams);
            }
            var params = $httpParamSerializer(searchObject);
            return urlArray[0] + (params ? ('?' + params) : '');
        };

        function getCustomService(standard) {
            if ($injector.has(standard + 'ApiService')) {
                return $injector.get(standard + 'ApiService');
            }
            return undefined;
        }

        function getAjaxOptionsByTypeService(config, standard) {

            standard = standard || config.standard || 'YiiSoft';

            var serviceApi = getCustomService(standard);

            var options = {
                headers: config.headers,
                method: config.method,
                data: config.data,
                params: config.params,
                url: config.url
            };

            if (angular.isDefined(serviceApi)) {
                if (angular.isFunction(serviceApi.getHeaders)) {
                    options.headers = serviceApi.getHeaders(config);
                }
                if (angular.isFunction(serviceApi.getMethod)) {
                    options.method = serviceApi.getMethod(config);
                }
                if (angular.isFunction(serviceApi.getData)) {
                    options.data = serviceApi.getData(config);
                }
                if (angular.isFunction(serviceApi.getParams)) {
                    options.params = serviceApi.getParams(config);
                }
                if (angular.isFunction(serviceApi.getURL)) {
                    options.url = serviceApi.getURL(config);
                }
            }

            return options;
        }

        function checkStandardParameter(standard, serviceApi) {
            if (angular.isUndefined(standard)) {
                $translate('ERROR.FIELD.EMPTY').then(function(translation) {
                    console.error(translation.replace('%field', 'standard'));
                });
            }

            if (angular.isUndefined(serviceApi)) {
                $translate('ERROR.UNDEFINED_API_SERVICE').then(function(translation) {
                    console.error(translation);
                });
            }
        }

        function successAnswer(data) {
            var config = this, params, paramName;
            var parentComponentId = config.parentComponentId;
            var searchString = $location.search();
            switch (config.action) {
                case 'list':
                    data.$componentId = parentComponentId;
                    $rootScope.$broadcast('ue:componentDataLoaded', data);
                    break;
                case 'one':
                    data.$componentId = parentComponentId;
                    data.editorEntityType = 'exist';
                    $rootScope.$broadcast('ue:componentDataLoaded', data);
                    break;
                case 'update':
                    var state;
                    if (!!config.request.success) {
                        config.request.success(data);
                    }
                    config.request.options.isLoading = false;
                    $rootScope.$broadcast('ue:afterEntityUpdate', {
                        id: data[config.idField],
                        $componentId: parentComponentId
                    });
                    successUpdateMessage();
                    state = getState(config);
                    if (state.name) {
                        $state.go(state.name, state.params).then(function() {
                            $location.search(searchString);
                        });
                    } else {
                        replaceToURL(config.request.href);
                    }
                    break;
                case 'create':
                    if (!!config.request.success) {
                        config.request.success(data);
                    }
                    config.request.options.isLoading = false;
                    $rootScope.$broadcast('ue:afterEntityCreate', {
                        id: data[config.idField],
                        $componentId: parentComponentId
                    });
                    successCreateMessage();
                    state = getState(config);
                    if (state.name) {
                        $state.go(state.name, state.params).then(function() {
                            if (params.back) {
                                delete params.back;
                            }
                            $location.search(searchString);
                        });
                    } else {
                        replaceToURL(config.request.href);
                    }
                    break;
                case 'presave':
                    if (!!config.request.success) {
                        config.request.success(data);
                    }
                    var newId = data[config.idField];
                    var par = {};
                    par.pk = newId;
                    var searchString = $location.search();
                    $state.go($state.current.name, par, { reload: false, notify: false }).then(function() {
                        $location.search(searchString);
                        $rootScope.$broadcast('ue:afterEntityUpdate', {
                            $componentId: parentComponentId,
                            action: 'presave',
                            value: data,
                            id: newId
                        });
                    });
                    if (config.isCreate) {
                        successPresaveCreateMessage();
                    } else {
                        successUpdateMessage();
                    }
                    break;
                case 'delete':
                    if (!!config.request.success) {
                        config.request.success(response);
                    }
                    config.request.options.isLoading = false;
                    $rootScope.$broadcast('ue:afterEntityDelete', {
                        $componentId: config.parentComponentId,
                        entityId: config.request.entityId
                    });
                    successDeleteMessage();
                    state = getState(config);
                    state.name = state.name || $state.current.name;
                    if (!config.notGoToState) {
                        if (state.name) {
                            $state.go(state.name, state.params).then(function() {
                                $location.search(searchString);
                                $rootScope.$broadcast('ue:collectionRefresh', parentComponentId);
                            });
                        } else {
                            replaceToURL(config.request.href);
                        }
                    }
                    break;
            }
        }

        function getState(config) {
            var state = {
                name: null,
                params: {}
            },
                paramName = config.request.options.prefixGrid ? config.request.options.prefixGrid + '-parent' : 'parent',
                locationSearch = $location.search();
            if (locationSearch[paramName]) {
                state.params.parent = locationSearch[paramName];
            }
            if (locationSearch.back && config.request.useBackUrl) {
                state.name = locationSearch.back;
            }
            if (angular.isObject(config.request.state)) {
               state.name = config.request.state.name;
               var parameters = config.request.state.parameters;
               if(angular.isObject(parameters)) {
                   angular.merge(state.params, parameters);
               } else if(angular.isFunction(parameters)) {
                   angular.merge(state.params, parameters());
               }
            }
            if (angular.isString(config.request.state)) {
                state.name = config.request.state;
            }
            return state;
        }

        function failAnswer(reject) {
            var config = this, parentComponentId = config.parentComponentId || config.$id;
            if (config.action == 'update' || config.action == 'create' || config.action == 'presave') {
                toastrUp(reject);
                if (!!config.request.error) {
                    config.request.error(reject);
                }
                var wrongFields = [];
                if (angular.isArray(reject)) {
                    wrongFields = reject;
                } else if (angular.isObject(reject)) {
                    if (angular.isArray(reject.data)) {
                        wrongFields = reject.data;
                    } else if (angular.isObject(reject.data) && angular.isArray(reject.data.data)) {
                        wrongFields = reject.data.data;
                    }
                }

                var eventObject = {
                    $componentId: parentComponentId,
                    data: wrongFields
                };
                if (angular.isArray(wrongFields) && wrongFields.length > 0) {
                    $rootScope.$broadcast('ue:componentError', eventObject);
                }
            } else if (config.action == 'delete') {
                toastrUp(reject);
                if (!!config.request.error) {
                    config.request.error(reject);
                }
                config.request.options.isLoading = false;
            } else if (config.action == 'list' || config.action == 'one') {
                reject.$componentId = parentComponentId;
                $rootScope.$broadcast('ue:errorComponentDataLoading', reject);
            }
        }

        function toastrUp(rejection) {
            if (rejection.status !== -1) {
                try {
                    var json = JSON.parse(JSON.stringify(rejection));

                    if (rejection.status === 422 || rejection.status === 400) {
                        $translate('RESPONSE_ERROR.INVALID_DATA').then(function(translation) {
                            toastr.warning(translation);
                        });
                    } else if (rejection.status === 401) {
                        $translate('RESPONSE_ERROR.UNAUTHORIZED').then(function(translation) {
                            toastr.warning(translation);
                        });
                    } else if (rejection.status === 403) {
                        $translate('RESPONSE_ERROR.FORBIDDEN').then(function(translation) {
                            toastr.error(translation);
                        });
                    } else {
                        $translate('RESPONSE_ERROR.SERVICE_UNAVAILABLE').then(function(translation) {
                            toastr.error(translation);
                        });
                    }
                } catch (e) {
                    console.error(e);
                    $translate('RESPONSE_ERROR.UNEXPECTED_RESPONSE').then(function(translation) {
                        toastr.error(translation);
                    });
                }
            }
        }
    }
})();
