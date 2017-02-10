(function () {
    'use strict';

    angular
        .module('universal.editor')
        .service('YiiSoftApiService', YiiSoftApiService);

    YiiSoftApiService.$inject = ['$q', '$rootScope', '$http', '$location', '$state', '$httpParamSerializer', '$document', 'FilterFieldsStorage', 'ModalService', 'toastr', '$translate', '$httpParamSerializerJQLike', '$window', '$injector'];

    function YiiSoftApiService($q, $rootScope, $http, $location, $state, $httpParamSerializer, $document, FilterFieldsStorage, ModalService, toastr, $translate, $httpParamSerializerJQLike, $window, $injector) {
        var self = this,
            queryTempParams,
            filterParams,
            itemsKey,
            entityObject,
            mixEntity,
            cancelerPromises = [];

        self.isProcessing = false;
        self.methodType = '';
        self.editedEntityId = null;

        $rootScope.$on('editor:set_entity_type', function (event, type) {
            entityObject = type;
            itemsKey = 'items';
        });

        $rootScope.$on('editor:create_entity', function (event, request) {
            self.addNewItem(request);
        });

        $rootScope.$on('editor:update_entity', function (event, request) {
            self.updateItem(request);
        });

        $rootScope.$on('editor:presave_entity', function (event, request) {
            self.presaveItem(request);
        });

        this.getQueryParams = function () {
            try {
                return JSON.parse(JSON.stringify(queryTempParams));
            } catch (e) {
                return {};
            }
        };

        this.setQueryParams = function (params) {
            if (Object.keys(params).length > 0) {
                queryTempParams = params;
            } else {
                queryTempParams = undefined;
            }
        };

        this.setFilterParams = function (params) {
            if (Object.keys(params).length > 0) {
                filterParams = params;
            } else {
                filterParams = undefined;
            }
        };

        function setTimeOutPromise(id, mode) {
            var def = $q.defer();
            cancelerPromises[id] = cancelerPromises[id] || {};
            if (cancelerPromises[id][mode]) {
                cancelerPromises[id][mode].resolve();
            }
            cancelerPromises[id][mode] = def;
            return def;
        }

        this.getItemsList = function (request) {
            var dataSource = request.options.$dataSource;
            //** cancel previouse request if request start again 
            var canceler = setTimeOutPromise(request.options.$parentComponentId, 'read');
            var service = getCustomService(dataSource.standard);
            request.options.isLoading = true;

            var deferred = $q.defer();

            var _url = request.url;
            var _method = request.method || 'GET';
            var id = request.options.$parentComponentId;

            var params = request.params || {};
            var filters = FilterFieldsStorage.getFilterQueryObject(request.options.prefixGrid ? request.options.prefixGrid + '-filter' : 'filter');
            var filtersParams = {};
            var beforeSend;

            if (!!request.childId) {
                filtersParams[request.parentField] = request.childId;
            }

            var expandFields = [];

            angular.forEach(dataSource.fields, function (field) {
                if (field.hasOwnProperty('expandable') && field.expandable === true) {
                    expandFields.push(field.name);
                }
            });

            if (expandFields.length > 0) {
                params.expand = expandFields.join(',');
            }

            var config = {
                action: 'list',
                url: _url,
                method: _method,
                data: {}
            };

            if (angular.isUndefined(service) || !angular.isFunction(service.getParams)) {

                filtersParams = angular.merge(filtersParams, filters);

                if (!!request.options && request.options.sort !== undefined) {
                    params.sort = request.options.sort;
                }

                if (filtersParams) {
                    angular.extend(params, {filter: JSON.stringify(filtersParams)});
                } else {
                    delete params.filter;
                }

                if (!!request.options.mixedMode) {
                    params = params || {};
                    angular.extend(params, {
                        mixed: request.options.mixedMode.collectionType
                    });
                }

                if (dataSource.hasOwnProperty('parentField')) {
                    params = params || {};

                    if (!params.hasOwnProperty('filter')) {
                        params.root = true;
                    }
                }

                if (dataSource.hasOwnProperty('sortBy') && !params.hasOwnProperty(dataSource.sortBy) && !params.sort) {
                    params = params || {};
                    angular.extend(params, {
                        sort: dataSource.sortBy
                    });
                }

                if (params.hasOwnProperty('filter')) {
                    delete params.root;
                }
            } else {
                config.filter = FilterFieldsStorage.getFilterObject(id, filters);
                config.sortFieldName = (!!request.options && request.options.sort !== undefined) ? request.options.sort : '';
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
            }

            config.params = params || {};

            var options = getAjaxOptionsByTypeService(config, dataSource.standard);
            options.beforeSend = request.before;

            $http(options).then(function (response) {
                if (angular.isUndefined(service) || !angular.isFunction(service.processResponse)) {
                    successAnswer.bind({ action: 'list', parentComponentId: request.options.$parentComponentId})(response.data);
                    deferred.resolve(response.data);
                } else {
                    var data = service.processResponse(response,
                        successAnswer.bind({ action: 'list', parentComponentId: request.options.$parentComponentId}),
                        failAnswer.bind({ action: 'list', parentComponentId: request.options.$parentComponentId}));
                    deferred.resolve(data);
                }
            }).finally(function () {
                request.options.isLoading = false;
            });

            return deferred.promise;
        };

        this.getData = function (api, params) {
            return $http({
                method: 'GET',
                url: api,
                params: params
            });
        };

        this.addNewItem = function (request) {
            var dataSource = request.options.$dataSource;
            var service = getCustomService(dataSource.standard);

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
            var options = getAjaxOptionsByTypeService(config, dataSource.standard);
            options.beforeSend = request.before;

            var objectBind = {
                action: 'create',
                parentComponentId: request.options.$parentComponentId,
                request: request,
                idField: idField
            };

            $http(options).then(function (response) {
                if (angular.isUndefined(service) || !angular.isFunction(service.processResponse)) {
                    successAnswer.bind(objectBind)(response.data);
                } else {
                    service.processResponse(response, successAnswer, failAnswer);
                }
            }, function (reject) {
                if (angular.isUndefined(service) || !angular.isFunction(service.processResponse)) {
                    failAnswer.bind(objectBind)(reject.data);
                } else {
                    service.processResponse(reject, successAnswer, failAnswer);
                }
                request.options.isLoading = false;
            }).finally(function () {
                if (!!request.complete) {
                    request.complete();
                }
            });
        };

        this.updateItem = function (request) {
            if (request.options.isLoading) {
                return;
            }
            var dataSource = request.options.$dataSource;
            var service = getCustomService(dataSource.standard);
            request.options.isLoading = true;

            var _url = dataSource.url + '/' + self.editedEntityId;
            var idField = 'id';

            var config = {
                action: 'update',
                url: request.url || _url,
                method: request.method || 'PUT',
                data: request.data,
                params: request.params || {}
            };
            var options = getAjaxOptionsByTypeService(config, dataSource.standard);
            options.beforeSend = request.before;
            var objectBind = {
                action: 'update',
                parentComponentId: request.options.$parentComponentId,
                request: request,
                idField: idField
            };
            $http(options).then(function (response) {
                if (angular.isDefined(service) || !angular.isFunction(service.processResponse)) {
                    successAnswer.bind(objectBind)(response.data);
                } else {
                    service.processResponse(response, successAnswer, failAnswer);
                }
            }, function (reject) {
                if (angular.isUndefined(service) || !angular.isFunction(service.processResponse)) {
                    failAnswer.bind(objectBind)(reject.data);
                } else {
                    service.processResponse(reject, successAnswer, failAnswer)
                }
                request.options.isLoading = false;
            }).finally(function () {
                if (!!request.complete) {
                    request.complete();
                }
            });
        };

        this.presaveItem = function (request) {
            var idField = 'id';
            var isCreate = true;
            if (request.options.isLoading) {
                return;
            }
            var dataSource = request.options.$dataSource;
            var service = getCustomService(dataSource.standard);

            request.options.isLoading = true;

            var config = {
                action: 'create',
                method: 'POST',
                data: request.data,
                params: request.params || {}
            };

            if (self.editedEntityId !== '') {
                config.url = dataSource.url + '/' + self.editedEntityId;
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
                parentComponentId: request.options.$parentComponentId,
                gridComponentId: request.options.$gridComponentId,
                action: 'presave',
                isCreate: isCreate,
                request: request,
                idField: idField
            };

            $http(options).then(function (response) {
                if (angular.isUndefined(service) || !angular.isFunction(service.processResponse)) {
                    successAnswer.bind(objectBind)(response.data);
                } else {
                    service.processResponse(reject, successAnswer, failAnswer)
                }
            }, function (reject) {
                if (angular.isUndefined(service) || !angular.isFunction(service.processResponse)) {
                    failAnswer.bind(objectBind)(reject.data);
                } else {
                    service.processResponse(reject, successAnswer, failAnswer)
                }
            }).finally(function () {
                if (!!request.complete) {
                    request.complete();
                }
                request.options.isLoading = false;
            });
        };

        this.getItemById = function (id, par, options) {
            var qParams = {},
                expandFields = [],
                dataSource = options.$dataSource || entityObject.dataSource;
            var service = getCustomService(dataSource.standard);
            options.isLoading = true;
            angular.forEach(dataSource.fields, function (field) {
                if (field.hasOwnProperty('expandable') && field.expandable === true) {
                    expandFields.push(field.name);
                }
            });
            if (expandFields.length > 0) {
                qParams.expand = expandFields.join(',');
            }

            var config = {
                action: 'one',
                url: dataSource.url + '/' + id,
                method: 'GET',
                params: qParams
            };
            var optionsHttp = getAjaxOptionsByTypeService(config, dataSource.standard);

            $http(optionsHttp).then(function (response) {
                if (angular.isUndefined(service) || !angular.isFunction(service.processResponse)) {
                    successAnswer.bind({ action: 'one', parentComponentId: options.$parentComponentId})(response.data)
                } else {
                    service.processResponse(reject,
                        successAnswer.bind({ action: 'one', parentComponentId: options.$parentComponentId}),
                        failAnswer.bind({ action: 'list', parentComponentId: options.$parentComponentId}))
                }
            }).finally(function () {
                options.isLoading = false;
            });
        };

        this.deleteItemById = function (request) {
            var state;
            if (request.options.isLoading) {
                return;
            }
            var dataSource = request.options.$dataSource;
            var service = getCustomService(dataSource.standard);
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
            var options = getAjaxOptionsByTypeService(config, dataSource.standard);
            options.beforeSend = request.before;

            var objectBind = {
                parentComponentId: request.options.$parentComponentId,
                action: 'delete',
                request: request
            };

            return $http(options).then(function (response) {
                if (angular.isUndefined(service) || !angular.isFunction(service.processResponse)) {
                    successAnswer.bind(objectBind)(response.data);
                } else {
                    service.processResponse(response, successAnswer, failAnswer)
                }
            }, function (reject) {
                if (angular.isUndefined(service) || !angular.isFunction(service.processResponse)) {
                    failAnswer.bind(objectBind)(reject.data);
                } else {
                    service.processResponse(response, successAnswer, failAnswer)
                }
            }).finally(function () {
                if (!!request.complete) {
                    request.complete();
                }
            });
        };

        function successDeleteMessage() {
            $translate('CHANGE_RECORDS.DELETE').then(function (translation) {
                toastr.success(translation);
            });
        }

        function successUpdateMessage() {
            $translate('CHANGE_RECORDS.UPDATE').then(function (translation) {
                toastr.success(translation);
            });
        }

        function successPresaveUpdateMessage() {
            $translate('CHANGE_RECORDS.UPDATE').then(function (translation) {
                toastr.success(translation);
            });
        }

        function successPresaveCreateMessage() {
            $translate('CHANGE_RECORDS.CREATE').then(function (translation) {
                toastr.success(translation);
            });
        }

        function successCreateMessage() {
            $translate('CHANGE_RECORDS.CREATE').then(function (translation) {
                toastr.success(translation);
            });
        }

        //-- read all pages
        this.getUrlResource = function getUrlResource(url, callback, res, def, fromP, toP) {
            var defer = def || $q.defer();
            var result = res || [];
            var promiseStack = [];
            fromP = fromP || 1;
            toP = toP || 0;

            if (fromP === 12) {
                fromP = 11;
            }
            if (!toP) {
                promiseStack.push(getPromise(url));
            } else {
                for (var i = fromP; i <= toP; i++) {
                    promiseStack.push(getPromise(url, i));
                }
            }

            //-- read items from one page
            function getPromise(url, page) {
                return $http({
                    method: 'GET',
                    url: url,
                    params: {
                        page: page || 1,
                        'per-page': 50
                    }
                });
            }

            $q.all(promiseStack).then(function (allResp) {
                var resp;
                var countP;
                for (var i = allResp.length; i--;) {
                    resp = allResp[i];
                    result = result.concat(resp.data.items);
                    if (angular.isFunction(callback)) {
                        callback(resp.data.items);
                    }
                }
                if (resp && resp.data._meta) {
                    countP = resp.data._meta.pageCount;
                }

                if (!countP || countP === toP || countP === 1) {
                    defer.resolve({data: {items: result}});
                } else {
                    if (fromP === 1) {
                        fromP = 2;
                    } else if (fromP === 2) {
                        fromP += 4;
                    } else {
                        fromP += 5;
                    }
                    toP += 5;
                    if (toP > countP) {
                        toP = countP;
                    }
                    return getUrlResource(url, callback, result, defer, fromP, toP);
                }
            }, function (reject) {
            });
            return defer.promise;
        };

        this.actionRequest = function (request) {
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
            }).then(function (response) {
                if (!!request.success) {
                    request.success(response);
                }
                deferred.resolve(response);
            }, function (reject) {
                if (!!request.error) {
                    request.error(reject);
                }
                deferred.reject(reject);
            }).finally(function () {
                if (!!request.complete) {
                    request.complete();
                }
                self.isProcessing = false;
            });

            return deferred.promise;
        };

        this.loadChilds = function (request) {
            var data = {
                parentId: request.id,
                $parentComponentId: request.options.$parentComponentId
            };
            var parent;
            $rootScope.$broadcast('editor:parent_id', data);
            request.childId = request.id;
            self.getItemsList(request).then(function () {
                parent = null;
                if (request.childId) {
                    parent = request.childId;
                }
                var paramName = request.options.prefixGrid ? request.options.prefixGrid + '-parent' : 'parent';
                $location.search(paramName, parent);
            });
        };

        this.loadParent = function (request) {
            var data = {
                $parentComponentId: request.options.$parentComponentId
            };
            var entityId = typeof request.childId !== 'undefined' ? request.childId : undefined;
            var parent;
            if (entityId) {
                request.options.isLoading = true;
                $http({
                    method: 'GET',
                    url: request.url + '/' + entityId
                }).then(function (response) {
                    var parentId = response.data[request.parentField];

                    parent = null;
                    if (parentId) {
                        parent = parentId;
                    }
                    var paramName = request.options.prefixGrid ? request.options.prefixGrid + '-parent' : 'parent';
                    $location.search(paramName, parent);
                    request.options.isLoading = false;
                    data.parentId = parentId;
                    $rootScope.$broadcast('editor:parent_id', data);
                    request.childId = parentId;
                    self.getItemsList(request);

                }, function (reject) {
                    request.options.isLoading = false;
                });
            } else {
                reset();
            }
            function reset() {
                request.options.isLoading = false;
                request.parentField = null;
                $rootScope.$broadcast('editor:parent_id', data);
                var paramName = request.options.prefixGrid ? request.options.prefixGrid + '-parent' : 'parent';
                $location.search(paramName, null);
                request.childId = null;
                self.getItemsList(request);
            }
        };

        this.getEntityObject = function () {
            return entityObject;
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

        this.getUrlDepend = function (url, queryParams, dependField, dependValue) {
            if (angular.isString(dependValue)) {
                dependValue = '"' + dependValue + '"';
            }
            if (angular.isArray(dependValue)) {
                dependValue = dependValue.filter(function (item) {
                    return !!item;
                });
                dependValue = '"' + dependValue.join(',') + '"';
            }
            url = url.replace(':dependField', dependField).replace(':dependValue', dependValue);
            return this.getUrlWithParams(url, queryParams);
        };

        this.getUrlWithParams = function (url, queryParams) {
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
            if ($injector.has(standard + 'ApiTypeService')) {
                return $injector.get(standard + 'ApiTypeService');
            }
            return undefined;
        }

        function getAjaxOptionsByTypeService(config, standard) {

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

        function successAnswer(data) {
            var parentComponentId = this.parentComponentId;
            switch (this.action) {
                case 'list':
                    if (data[itemsKey].length === 0) {
                        $rootScope.$broadcast('editor:parent_empty');
                    }
                    data.$parentComponentId = parentComponentId;
                    $rootScope.$broadcast('editor:items_list', data);
                    break;
                case 'one':
                    data.$parentComponentId = parentComponentId;
                    data.editorEntityType = 'exist';
                    $rootScope.$broadcast('editor:entity_loaded', data);
                    break;
                case 'update':
                    var state;
                    if (!!this.request.success) {
                        this.request.success(data);
                    }
                    $rootScope.$broadcast('editor:presave_entity_updated', {
                        id: data[this.idField],
                        $parentComponentId: parentComponentId
                    });
                    this.request.options.isLoading = false;
                    $rootScope.$broadcast('uploader:remove_session');
                    $rootScope.$broadcast('editor:entity_success');
                    successUpdateMessage();
                    var params = {};
                    var paramName = this.request.options.prefixGrid ? this.request.options.prefixGrid + '-parent' : 'parent';
                    if ($location.search()[paramName]) {
                        params.parent = $location.search()[paramName];
                    }
                    if ($location.search().back && this.request.useBackUrl) {
                        state = $location.search().back;
                    } else {
                        state = this.request.state;
                    }
                    if (!ModalService.isModalOpen()) {
                        if (state) {
                            $state.go(state, params).then(function () {
                                $location.search(params);
                                $rootScope.$broadcast('editor:read_entity', parentComponentId);
                            });
                        } else {
                            replaceToURL(this.request.href);
                        }
                    } else {
                        ModalService.close();
                    }
                    break;
                case 'create':
                    if (!!this.request.success) {
                        this.request.success(data);
                    }
                    $rootScope.$broadcast('editor:presave_entity_created', {
                        id: data[this.idField],
                        $parentComponentId: parentComponentId
                    });
                    this.request.options.isLoading = false;
                    $rootScope.$broadcast('uploader:remove_session');
                    $rootScope.$broadcast('editor:entity_success');
                    successCreateMessage();

                    var params = {};
                    var paramName = this.request.options.prefixGrid ? this.request.options.prefixGrid + '-parent' : 'parent';
                    if ($location.search()[paramName]) {
                        params.parent = $location.search()[paramName];
                    }
                    if ($location.search().back && this.request.useBackUrl) {
                        params.state = $location.search().back;
                        state = $location.search().back;
                    } else {
                        state = this.request.state;
                    }
                    if (!ModalService.isModalOpen()) {
                        if (state) {
                            $state.go(state, params).then(function () {
                                if (params.back) {
                                    delete params.back;
                                }
                                $location.search(params);
                                $rootScope.$broadcast('editor:read_entity', parentComponentId);
                            });
                        } else {
                            replaceToURL(this.request.href);
                        }
                    } else {
                        ModalService.close();
                    }
                    break;
                case 'presave':
                    var gridComponentId = this.request.options.$gridComponentId;
                    if (!!this.request.success) {
                        this.request.success(data);
                    }
                    var newId = data[this.idField];
                    var par = {};
                    par['pk'] = newId;
                    var searchString = $location.search();
                    $state.go($state.current.name, par, {reload: false, notify: false}).then(function () {
                        $location.search(searchString);
                        $rootScope.$broadcast('editor:update_item', {
                            $gridComponentId: gridComponentId,
                            value: data
                        });
                    });
                    if (this.isCreate) {
                        $rootScope.$broadcast('editor:presave_entity_created', {
                            id: newId,
                            $parentComponentId: parentComponentId
                        });
                        successPresaveCreateMessage();
                    } else {
                        successUpdateMessage();
                        $rootScope.$broadcast('editor:presave_entity_updated', {
                            id: newId,
                            $parentComponentId: parentComponentId
                        });
                    }
                    break;
                case 'delete':
                    if (!!this.request.success) {
                        this.request.success(response);
                    }
                    this.request.options.isLoading = false;
                    self.setQueryParams({});
                    self.setFilterParams({});
                    $rootScope.$broadcast('editor:entity_success_deleted');
                    successDeleteMessage();
                    var params = {};
                    var paramName = this.request.options.prefixGrid ? this.request.options.prefixGrid + '-parent' : 'parent';
                    if ($location.search()[paramName]) {
                        params[paramName] = $location.search()[paramName];
                    }
                    if ($location.search().back && this.request.useBackUrl) {
                        state = $location.search().back;
                    } else {
                        state = this.request.state;
                    }

                    state = state || $state.current.name;

                    if (!ModalService.isModalOpen()) {
                        if (state) {
                            $state.go(state, params).then(function () {
                                $location.search(params);
                                $rootScope.$broadcast('editor:read_entity', parentComponentId);
                            });
                        } else {
                            replaceToURL(this.request.href);
                        }
                    } else {
                        ModalService.close();
                    }
                    break;
            }
        }

        function failAnswer(data) {
            var parentComponentId = this.parentComponentId;
            if (this.action == 'update' || this.action == 'create' || this.action == 'presave') {
                if (!!this.request.error) {
                    this.request.error(reject);
                }
                var wrongFields = data.hasOwnProperty('data') ? data.data : data;

                if (wrongFields.length > 0) {
                    angular.forEach(wrongFields, function (err) {
                        if (err.hasOwnProperty('field')) {
                            $rootScope.$broadcast('editor:api_error_field_' + err.field, err.message);
                            if (err.hasOwnProperty('fields')) {
                                angular.forEach(err.fields, function (innerError, key) {
                                    $rootScope.$broadcast('editor:api_error_field_' + err.field + '_' + key + '_' + innerError.field, innerError.message);
                                });
                            }
                        }
                    });
                }
            }
            if (this.action == 'delete') {
                if (!!this.request.error) {
                    this.request.error(reject);
                }
                this.request.options.isLoading = false;
            }
        }
    }
})();
