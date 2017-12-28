import DataSource from '../classes/dataSource.js';

(function() {
    'use strict';

    angular
        .module('universal-editor')
        .service('ApiService', ApiService);

    function ApiService($q, $rootScope, $http, $location, $state, $httpParamSerializer, $document, FilterFieldsStorage, toastr, $translate, $httpParamSerializerJQLike, $window, $injector) {
        'ngInject';
        var self = this,
            itemsKey = 'items',
            cancelerPromises = [],
            storageRemotedComponents = {};

        self.isProcessing = false;
        this.saveToStorage = saveToStorage;
        this.getFromStorage = getFromStorage;
        this.getCustomService = getCustomService;
        this.checkStandardParameter = checkStandardParameter;
        this.getAjaxOptionsByTypeService = getAjaxOptionsByTypeService;

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
            var dataSource = request.dataSource;
            notGoToState = notGoToState === true;
            var canceler = setTimeOutPromise(request.options.$componentId, 'read');

            var service = getCustomService(dataSource.standard);
            checkStandardParameter(dataSource.standard, service);
            request.options.isLoading = true;
            var id = request.options.$componentId;

            var params = request.params || {};
            var filters = FilterFieldsStorage.getFilterQueryObject(request.options.prefixGrid ? request.options.prefixGrid + '-filter' : 'filter');

            if (!!request.childId) {
                filters = filters || {};
                filters[request.dataSource.parentKey] = request.childId;
            }

            var config = {
                action: 'read',
                $dataSource: dataSource,
                filter: FilterFieldsStorage.getFilterObject(id, filters),
                sort: params.sort || null,
                pagination: {
                    perPage: 20,
                    page: 1
                }
            };

            if (!!request.childId && dataSource.parentKey) {
                config.filter = config.filter || {};
                config.filter[dataSource.parentKey] = [{
                    operator: ':text',
                    value: request.childId
                }];
            }
            if (params.page) {
                config.pagination.page = params.page;
                delete params.page;
            }

            if (params['per-page']) {
                config.pagination.perPage = params['per-page'];
                delete params['per-page'];
            }

            config.params = params || {};

            if (!!request.options.mixedMode) {
                config.params.mixed = request.options.mixedMode.collectionType;
            }

            var options = getAjaxOptionsByTypeService(config, dataSource.standard);
            var handlers = dataSource.getHandlers('read');

            var objectBind = {
                action: 'read',
                parentComponentId: request.options.$componentId,
                notGoToState: notGoToState,
                request: handlers,
                $dataSource: dataSource
            };

            if (options.url) {
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
                    if (handlers.complete) {
                        handlers.complete();
                    }
                    request.options.isLoading = false;
                });
            } else {
                deferred.resolve([]);
                request.options.isLoading = false;
            }
            return deferred.promise;
        };

        this.addNewItem = function(request) {

            if (request.options.isLoading) {
                return;
            }
            var deferred = $q.defer();
            var dataSource = request.options.$dataSource;
            var service = getCustomService(dataSource.standard);
            checkStandardParameter(dataSource.standard, service);
            request.options.isLoading = true;
            var idField = dataSource.fields.primaryKey;

            var config = {
                action: 'create',
                $dataSource: dataSource,
                params: request.params || {},
                buttonHandlers: request.handlers,
                data: request.data || {}
            };

            var options = getAjaxOptionsByTypeService(config, dataSource.standard);
            var handlers = dataSource.getHandlers('create');

            var objectBind = {
                action: 'create',
                parentComponentId: request.options.$componentId,
                request: handlers,
                buttonHandlers: request.handlers,
                $dataSource: dataSource,
                options: request.options,
                state: request.state,
                useBackUrl: request.useBackUrl
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
                if (!!handlers.complete) {
                    handlers.complete();
                }

                if (request.buttonHandlers && request.buttonHandlers.complete) {
                    request.buttonHandlers.complete();
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

            var deferred = $q.defer();
            var dataSource = request.options.$dataSource;
            var idField = dataSource.fields.primaryKey;
            var service = getCustomService(dataSource.standard);
            checkStandardParameter(dataSource.standard, service);
            request.options.isLoading = true;
            removePrimaryKey(dataSource, request.data);
            var config = {
                action: 'update',
                data: request.data,
                $dataSource: dataSource,
                params: request.params || {},
                buttonHandlers: request.handlers,
                entityId: request.entityId
            };

            var options = getAjaxOptionsByTypeService(config, dataSource.standard, { [dataSource.primaryKey]: request.entityId });
            var handlers = dataSource.getHandlers('update');
            var objectBind = {
                action: 'update',
                parentComponentId: request.options.$componentId,
                request: handlers,
                buttonHandlers: request.handlers,
                $dataSource: dataSource,
                options: request.options,
                state: request.state,
                useBackUrl: request.useBackUrl,
                idField: request.idField
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
                if (!!handlers.complete) {
                    handlers.complete();
                }
                if (request.buttonHandlers && request.buttonHandlers.complete) {
                    request.buttonHandlers.complete();
                }
            });
            return deferred.promise;
        };

        this.presaveItem = function(request) {
            var deferred = $q.defer();
            var isCreate = true;
            if (request.options.isLoading) {
                return;
            }
            var dataSource = request.options.$dataSource;
            var service = getCustomService(dataSource.standard);
            checkStandardParameter(dataSource.standard, service);
            request.options.isLoading = true;
            var idField = dataSource.fields.primaryKey;
            removePrimaryKey(dataSource, request.data);
            var config = {
                action: 'create',
                $dataSource: dataSource,
                data: request.data || {},
                buttonHandlers: request.handlers,
                params: request.params || {}
            };

            if (request.entityId !== '') {
                config.action = 'update';
                isCreate = false;
            }
            var options = getAjaxOptionsByTypeService(config, dataSource.standard, { [dataSource.primaryKey]: request.entityId });
            var handlers = dataSource.getHandlers('update');
            var objectBind = {
                parentComponentId: request.options.$componentId,
                action: 'presave',
                isCreate: isCreate,
                request: handlers,
                buttonHandlers: request.handlers,
                $dataSource: dataSource,
                options: request.options,
                state: request.state,
                useBackUrl: request.useBackUrl,
                idField: request.idField
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
                if (!!request.complete) {
                    request.complete();
                }
                if (request.buttonHandlers && request.buttonHandlers.complete) {
                    request.buttonHandlers.complete();
                }
                request.options.isLoading = false;
            });
            return deferred.promise;
        };

        this.getItemById = function(id, options) {
            var deferred = $q.defer(),
                dataSource = options.$dataSource;
            if (angular.isObject(dataSource)) {
                var service = getCustomService(dataSource.standard);
                checkStandardParameter(dataSource.standard, service);
                options.isLoading = true;
                var config = {
                    action: 'one',
                    $dataSource: dataSource,
                    params: {}
                };
                var optionsHttp = getAjaxOptionsByTypeService(config, dataSource.standard, { [dataSource.primaryKey]: id });
                var handlers = dataSource.getHandlers('one');
                var objectBind = {
                    action: 'one',
                    parentComponentId: options.$componentId,
                    request: handlers,
                    $dataSource: dataSource
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
                }).finally(function() {
                    if (handlers.complete) {
                        handlers.complete();
                    }
                    request.options.isLoading = false;
                });
            }
            return deferred.promise;
        };

        this.deleteItemById = function(request, notGoToState) {
            notGoToState = notGoToState === true;
            if (request.options.isLoading) {
                return;
            }
            var dataSource = request.options.$dataSource;
            var service = getCustomService(dataSource.standard);
            checkStandardParameter(dataSource.standard, service);
            request.options.isLoading = true;
            var config = {
                action: 'delete',
                $dataSource: dataSource,
                data: request.data || {},
                params: request.params || {},
                buttonHandlers: request.handlers,
                idField: request.idField
            };

            var options = getAjaxOptionsByTypeService(config, dataSource.standard, { [dataSource.primaryKey]: request.entityId });
            var handlers = dataSource.getHandlers('delete');
            var objectBind = {
                parentComponentId: request.options.$componentId,
                action: 'delete',
                notGoToState: notGoToState,
                request: handlers,
                buttonHandlers: request.handlers,
                $dataSource: dataSource,
                options: request.options,
                state: request.state,
                useBackUrl: request.useBackUrl
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
                request.options.isLoading = false;
                if (!!handlers.complete) {
                    handlers.complete();
                }
                if (request.buttonHandlers && request.buttonHandlers.complete) {
                    request.buttonHandlers.complete();
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

        this.getUrlResource = function getUrlResource(config) {
            config.defer = config.defer || $q.defer();
            config.result = config.result || [];
            var promiseStack = [];
            config.fromP = config.fromP || 1;
            config.toP = config.toP || 0;
            config.params = config.params || {};
            var defaultStandard = !config.standard || config.standard === 'YiiSoft';
            var options = {};
            config.action = 'read';

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
                if (config.timeout) {
                    options.timeout = config.timeout;
                }
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

        self.alreadyRequested = [];

        function saveToStorage(component, list, options) {
            var url = component.component.settings.valuesRemote.url;
            if (angular.isObject(options) && options.dependValue) {
                var key = url + '[' + options.dependValue + ']';
                if (self.alreadyRequested.indexOf(key) === -1) {
                    self.alreadyRequested.push(key);
                }
            }
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

        function getFromStorage(component, list, options) {
            var url = component.component.settings.valuesRemote.url;
            if (angular.isObject(options) && options.dependValue) {
                var key = url + '[' + options.dependValue + ']';
                if (self.alreadyRequested.indexOf(key) === -1) {
                    return false;
                }
            }
            var dependField = component.component.settings.depend;
            var keyValue = component.component.settings.valuesRemote.fields.value;
            if (!storageRemotedComponents.hasOwnProperty(url)) {
                return false;
            }
            var storage = storageRemotedComponents[url] || [];
            var outputSet = [];
            if (list) {
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
            } else {
                if (angular.isObject(options) && options.dependValue) {
                    angular.forEach(storage, function(storageItem) {
                        if (storageItem[dependField] == options.dependValue) {
                            outputSet.push(storageItem);
                        }
                    });
                } else {
                    outputSet = storage;
                }
            }
            if (!list) {
                return outputSet;
            } else if (outputSet.length === list.length && list.length > 0) {
                outputSet = list.map(id => outputSet.filter(a => a[keyValue] === id)[0]);
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
            var standard = options.standard;
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
                            action: 'read',
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
                            },
                            standard: standard
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
                    action: 'read',
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
                try {
                    searchObject[split[0]] = eval('(' + split[1] + ')');
                } catch (e) {
                    searchObject[split[0]] = split[1];
                }
            }
            if (queryParams) {
                searchObject = angular.merge(searchObject, queryParams);
            }
            var params = decodeURIComponent($httpParamSerializer(searchObject));
            return urlArray[0] + (params ? ('?' + params) : '');
        };

        function getCustomService(standard) {
            if ($injector.has(standard + 'ApiService')) {
                return $injector.get(standard + 'ApiService');
            }
            return undefined;
        }

        function getAjaxOptionsByTypeService(config, standard, entity) {

            standard = standard || config.standard || 'YiiSoft';

            var serviceApi = getCustomService(standard);

            var options = {};
            if (config.$dataSource && config.$dataSource instanceof DataSource) {
                options = {
                    headers: config.$dataSource.getHeaders(config.action, entity),
                    method: config.$dataSource.getMethod(config.action),
                    data: config.$dataSource.getData(config.action, entity),
                    params: config.$dataSource.getParams(config.action, entity),
                    url: config.$dataSource.getURL(config.action, entity),
                    beforeSend: config.$dataSource.getHandlers(config.action).before
                };
            } else {
                options = {
                    headers: config.headers || {},
                    method: config.method,
                    data: config.data || {},
                    params: config.params || {},
                    url: config.url
                };
            }

            if (config.buttonHandlers && config.buttonHandlers.before) {
                options.beforeSendButton = config.buttonHandlers.before;
            }

            if (angular.isDefined(serviceApi)) {
                if (angular.isFunction(serviceApi.getHeaders)) {
                    angular.merge(options.headers, serviceApi.getHeaders(config));
                }
                if (angular.isFunction(serviceApi.getMethod)) {
                    options.method = options.method || serviceApi.getMethod(config);
                }
                if (angular.isFunction(serviceApi.getData)) {
                    angular.merge(options.data, serviceApi.getData(config));
                }
                if (angular.isFunction(serviceApi.getParams)) {
                    angular.merge(options.params, serviceApi.getParams(config));
                }
                if (angular.isFunction(serviceApi.getURL)) {
                    options.url = serviceApi.getURL(config) || options.url;
                }
            }
            if ($.isEmptyObject(options.headers)) {
                delete options.headers;
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
            let idField = config.$dataSource.primaryKey;
            if (angular.isObject(data)) {
                data.$dataSource = config.$dataSource;
            }
            switch (config.action) {
                case 'read':
                    if (config.request && config.request.success) {
                        config.request.success(data);
                    }
                    data.$componentId = parentComponentId;
                    $rootScope.$broadcast('ue:componentDataLoaded', data);
                    break;
                case 'one':
                    if (config.request && config.request.success) {
                        config.request.success(data);
                    }
                    data.$componentId = parentComponentId;
                    data.editorEntityType = 'exist';
                    $rootScope.$broadcast('ue:componentDataLoaded', data);
                    break;
                case 'update':
                    var state;
                    if (!!config.request.success) {
                        config.request.success(data);
                    }
                    if (config.buttonHandlers && config.buttonHandlers.success) {
                        config.buttonHandlers.success(data);
                    }
                    config.options.isLoading = false;
                    $rootScope.$broadcast('ue:afterEntityUpdate', {
                        id: config.id,
                        $componentId: parentComponentId
                    });
                    successUpdateMessage();
                    params = {};
                    paramName = config.options.prefixGrid ? config.options.prefixGrid + '-parent' : 'parent';
                    if ($location.search()[paramName]) {
                        params.parent = $location.search()[paramName];
                    }
                    if ($location.search().back && config.useBackUrl) {
                        state = $location.search().back;
                    } else {
                        state = config.state;
                    }
                    if (state) {
                        $state.go(state, params).then(function() {
                            $location.search(searchString);
                        });
                    } else {
                        replaceToURL(config.href);
                    }
                    break;
                case 'create':
                    if (!!config.request.success) {
                        config.request.success(data);
                    }
                    if (config.buttonHandlers && config.buttonHandlers.success) {
                        config.buttonHandlers.success(data);
                    }
                    config.options.isLoading = false;
                    $rootScope.$broadcast('ue:afterEntityCreate', {
                        id: data[idField],
                        $componentId: parentComponentId
                    });

                    params = {};
                    paramName = config.options.prefixGrid ? config.options.prefixGrid + '-parent' : 'parent';
                    if ($location.search()[paramName]) {
                        params.parent = $location.search()[paramName];
                    }
                    if ($location.search().back && config.useBackUrl) {
                        state = $location.search().back;
                    } else {
                        state = config.state;
                    }
                    if (state) {
                        $state.go(state, params).then(function() {
                            if (params.back) {
                                delete params.back;
                            }
                            $location.search(searchString);
                            successCreateMessage();
                        });
                    } else {
                        replaceToURL(config.href);
                        successCreateMessage();
                    }
                    break;
                case 'presave':
                    if (!!config.request.success) {
                        config.request.success(data);
                    }
                    if (config.buttonHandlers && config.buttonHandlers.success) {
                        config.buttonHandlers.success(data);
                    }
                    var newId = data[idField] || config.entityId;
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
                    $rootScope.$broadcast('ue:afterEntityUpdate', {
                        id: newId,
                        action: 'presave',
                        $componentId: parentComponentId
                    });
                    if (config.isCreate) {
                        successPresaveCreateMessage();
                    } else {
                        successUpdateMessage();
                    }
                    break;
                case 'delete':
                    if (!!config.request.success) {
                        config.request.success(data);
                    }
                    if (config.buttonHandlers && config.buttonHandlers.success) {
                        config.buttonHandlers.success(data);
                    }
                    config.options.isLoading = false;
                    $rootScope.$broadcast('ue:afterEntityDelete', {
                        $componentId: config.parentComponentId,
                        entityId: config.entityId
                    });
                    successDeleteMessage();
                    params = {};
                    paramName = config.options.prefixGrid ? config.options.prefixGrid + '-parent' : 'parent';
                    if ($location.search()[paramName]) {
                        params[paramName] = $location.search()[paramName];
                    }
                    if ($location.search().back && config.useBackUrl) {
                        state = $location.search().back;
                    } else {
                        state = config.state;
                    }

                    state = state || $state.current.name;

                    if (!config.notGoToState) {
                        if (state) {
                            $state.go(state, params).then(function() {
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

        function failAnswer(reject) {
            var config = this, parentComponentId = config.parentComponentId || config.$id;
            if (config.action == 'update' || config.action == 'create' || config.action == 'presave') {
                toastrUp(reject);
                if (!!config.request.error) {
                    config.request.error(reject);
                }
                if (config.buttonHandlers && config.buttonHandlers.error) {
                    config.buttonHandlers.error(data);
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
                if (config.buttonHandlers && config.buttonHandlers.error) {
                    config.buttonHandlers.error(data);
                }
                config.request.options.isLoading = false;
            } else if (config.action == 'read' || config.action == 'one') {
                if (config.request && config.request.error) {
                    config.request.error(reject);
                }
                if (config.buttonHandlers && config.buttonHandlers.error) {
                    config.buttonHandlers.error(data);
                }
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
