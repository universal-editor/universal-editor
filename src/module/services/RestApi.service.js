(function() {
    'use strict';

    angular
        .module('universal-editor')
        .service('RestApiService', RestApiService);

    RestApiService.$inject = ['$q', '$rootScope', '$http', 'configData', 'EditEntityStorage', '$location', '$timeout', '$state', '$httpParamSerializer', '$document', 'FilterFieldsStorage', 'ModalService', 'toastr', '$translate', '$httpParamSerializerJQLike', '$window'];

    function RestApiService($q, $rootScope, $http, configData, EditEntityStorage, $location, $timeout, $state, $httpParamSerializer, $document, FilterFieldsStorage, ModalService, toastr, $translate, $httpParamSerializerJQLike, $window) {
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

        $rootScope.$on('editor:set_entity_type', function(event, type) {
            entityObject = type;
            itemsKey = 'items';
        });

        $rootScope.$on('editor:create_entity', function(event, request) {
            self.addNewItem(request);
        });

        $rootScope.$on('editor:update_entity', function(event, request) {
            self.updateItem(request);
        });

        $rootScope.$on('editor:presave_entity', function(event, request) {
            self.presaveItem(request);
        });

        this.getQueryParams = function() {
            try {
                return JSON.parse(JSON.stringify(queryTempParams));
            } catch (e) {
                return {};
            }
        };

        this.setQueryParams = function(params) {
            if (Object.keys(params).length > 0) {
                queryTempParams = params;
            } else {
                queryTempParams = undefined;
            }
        };

        this.setFilterParams = function(params) {
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

        this.getItemsList = function(request) {

            //** cancel previouse request if request start again 
            var canceler = setTimeOutPromise(request.options.$parentComponentId, 'read');
            request.options.isLoading = true;
            var dataSource = request.options.$dataSource;

            var deferred = $q.defer();

            var _method = 'GET';
            var _url = request.url;

            var params = request.params || {};
            _method = request.method || _method;
            if (!!request.options && request.options.sort !== undefined) {
                params.sort = request.options.sort;
            }

            var id = request.options.$parentComponentId;
            var filters = FilterFieldsStorage.getFilterQueryObject(request.options.prefixGrid ? request.options.prefixGrid + '-filter' : 'filter');
            var beforeSend;
            if (!!request.childId) {
                filters = filters || {};
                filters[request.parentField] = request.childId;
            }


            if (filters) {
                angular.extend(params, { filter: JSON.stringify(filters) });
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

            var expandFields = [];

            angular.forEach(dataSource.fields, function(field) {
                if (field.hasOwnProperty('expandable') && field.expandable === true) {
                    expandFields.push(field.name);
                }
            });

            if (expandFields.length > 0) {
                params.expand = expandFields.join(',');
            }

            $http({
                method: _method,
                url: _url,
                params: params,
                timeout: canceler.promise,
                beforeSend: beforeSend
            }).then(function(response) {
                if (response.data[itemsKey].length === 0) {
                    $rootScope.$broadcast('editor:parent_empty');
                }
                response.data.$parentComponentId = request.options.$parentComponentId;
                $rootScope.$broadcast('editor:items_list', response.data);
                deferred.resolve(response.data);
            }, function(reject) {
                reject.$parentComponentId = request.options.$parentComponentId;
                $rootScope.$broadcast('editor:error_get_data', reject);
            }).finally(function() {
                request.options.isLoading = false;
            });

            return deferred.promise;
        };

        this.getData = function(api, params) {
            return $http({
                method: 'GET',
                url: api,
                params: params
            });
        };

        this.addNewItem = function(request) {

            if (request.options.isLoading) {
                return;
            }
            var dataSource = request.options.$dataSource;

            var parentField = dataSource.fields.parent;
            var paramName = request.options.prefixGrid ? request.options.prefixGrid + '-parent' : 'parent';
            if (parentField && $location.search()[paramName]) {
                var isNotEditableParentField = !$document[0].querySelector(".field-wrapper [name='" + parentField + "']");
                if (isNotEditableParentField) {
                    request.data[parentField] = $location.search()[paramName];
                }
            }

            request.options.isLoading = true;
            var params = {};
            var _method = 'POST';
            var _url = dataSource.url;
            var idField = 'id';
            var state;

            if (dataSource.hasOwnProperty('fields')) {
                idField = dataSource.fields.primaryKey || idField;
            }
            $http({
                method: request.method || _method,
                url: request.method || _url,
                data: request.data,
                beforeSend: request.before
            }).then(function(response) {
                if (!!request.success) {
                    request.success(response);
                }
                var data = {
                    id: response.data[idField],
                    $parentComponentId: request.options.$parentComponentId
                };
                $rootScope.$broadcast('editor:presave_entity_created', data);
                request.options.isLoading = false;
                $rootScope.$broadcast('uploader:remove_session');
                $rootScope.$broadcast('editor:entity_success');
                successCreateMessage();

                var params = {};
                var paramName = request.options.prefixGrid ? request.options.prefixGrid + '-parent' : 'parent';
                if ($location.search()[paramName]) {
                    params.parent = $location.search()[paramName];
                }
                if ($location.search().back && request.useBackUrl) {
                    params.state = $location.search().back;
                    state = $location.search().back;
                } else {
                    state = request.state;
                }
                if (!ModalService.isModalOpen()) {
                    if (state) {
                        $state.go(state, params).then(function() {
                            if (params.back) {
                                delete params.back;
                            }
                            $location.search(params);
                            $rootScope.$broadcast('editor:read_entity', request.options.$parentComponentId);
                        });
                    } else {
                        replaceToURL(request.href);
                    }
                } else {
                    ModalService.close();
                }
            }, function(reject) {
                if (!!request.error) {
                    request.error(reject);
                }
                var wrongFields = reject.data.hasOwnProperty('data') ? reject.data.data : reject.data;

                if (wrongFields.length > 0) {
                    angular.forEach(wrongFields, function(err) {
                        if (err.hasOwnProperty('field')) {
                            $rootScope.$broadcast('editor:api_error_field_' + err.field, err.message);
                            if (err.hasOwnProperty('fields')) {
                                angular.forEach(err.fields, function(innerError, key) {
                                    $rootScope.$broadcast('editor:api_error_field_' + err.field + '_' + key + '_' + innerError.field, innerError.message);
                                });
                            }
                        }
                    });
                }
                proccessRejection(reject);
                request.options.isLoading = false;
            }).finally(function() {
                if (!!request.complete) {
                    request.complete();
                }
            });
        };

        this.updateItem = function(request) {
            if (request.options.isLoading) {
                return;
            }
            var dataSource = request.options.$dataSource;

            request.options.isLoading = true;
            var params = {};
            var _method = 'PUT';

            var _url = dataSource.url + '/' + self.editedEntityId;
            var state;
            var idField = 'id';

            $http({
                method: request.method || _method,
                url: request.url || _url,
                data: request.data || {},
                beforeSend: request.before
            }).then(function(response) {
                if (!!request.success) {
                    request.success(response);
                }
                var data = {
                    id: response.data[idField],
                    $parentComponentId: request.options.$parentComponentId
                };
                $rootScope.$broadcast('editor:presave_entity_updated', data);
                request.options.isLoading = false;
                $rootScope.$broadcast('uploader:remove_session');
                $rootScope.$broadcast('editor:entity_success');
                successUpdateMessage();
                var params = {};
                var paramName = request.options.prefixGrid ? request.options.prefixGrid + '-parent' : 'parent';
                if ($location.search()[paramName]) {
                    params.parent = $location.search()[paramName];
                }
                if ($location.search().back && request.useBackUrl) {
                    state = $location.search().back;
                } else {
                    state = request.state;
                }
                if (!ModalService.isModalOpen()) {
                    if (state) {
                        $state.go(state, params).then(function() {
                            $location.search(params);
                            $rootScope.$broadcast('editor:read_entity', request.options.$parentComponentId);
                        });
                    } else {
                        replaceToURL(request.href);
                    }
                } else {
                    ModalService.close();
                }
            }, function(reject) {
                if (!!request.error) {
                    request.error(reject);
                }
                var wrongFields = reject.data.hasOwnProperty('data') ? reject.data.data : reject.data;

                if (wrongFields.length > 0) {
                    angular.forEach(wrongFields, function(err) {
                        if (err.hasOwnProperty('field')) {
                            $rootScope.$broadcast('editor:api_error_field_' + err.field, err.message);
                            if (err.hasOwnProperty('fields')) {
                                angular.forEach(err.fields, function(innerError, key) {
                                    $rootScope.$broadcast('editor:api_error_field_' + err.field + '_' + key + '_' + innerError.field, innerError.message);
                                });
                            }
                        }
                    });
                }
                proccessRejection(reject);
                request.options.isLoading = false;
            }).finally(function() {
                if (!!request.complete) {
                    request.complete();
                }
            });
        };

        this.presaveItem = function(request) {
            var _url;
            var _method = 'POST';
            var idField = 'id';
            var isCreate = true;
            if (request.options.isLoading) {
                return;
            }
            var dataSource = request.options.$dataSource;

            request.options.isLoading = true;

            if (self.editedEntityId !== '') {
                _url = dataSource.url + '/' + self.editedEntityId;
                _method = 'PUT';
                isCreate = false;
            } else {
                _url = dataSource.url;
            }

            if (dataSource.hasOwnProperty('fields')) {
                idField = dataSource.fields.primaryKey || idField;
            }

            $http({
                method: request.method || _method,
                url: request.url || _url,
                data: request.data || {},
                beforeSend: request.before
            }).then(function(response) {
                if (!!request.success) {
                    request.success(response);
                }
                var newId = response.data[idField];
                var par = {};
                par['pk'] = newId;
                var searchString = $location.search();
                $state.go($state.current.name, par, { reload: false, notify: false }).then(function() {
                    $location.search(searchString);
                    $rootScope.$broadcast('editor:update_item', {
                        $gridComponentId: request.options.$gridComponentId,
                        value: response.data
                    });
                });
                var data = {
                    id: newId,
                    $parentComponentId: request.options.$parentComponentId
                };
                if (isCreate) {
                    $rootScope.$broadcast('editor:presave_entity_created', data);
                    successPresaveCreateMessage();
                } else {
                    successUpdateMessage();
                    $rootScope.$broadcast('editor:presave_entity_updated', data);
                }
                proccessRejection(reject);
            }, function(reject) {
                if (!!request.error) {
                    request.error(reject);
                }
                if ((reject.status === 422 || reject.status === 400) && reject.data) {
                    var wrongFields = reject.data.hasOwnProperty('data') ? reject.data.data : reject.data;

                    angular.forEach(wrongFields, function(err) {
                        if (err.hasOwnProperty('field')) {
                            $rootScope.$broadcast('editor:api_error_field_' + err.field, err.message);
                            if (err.hasOwnProperty('fields')) {
                                angular.forEach(err.fields, function(innerError, key) {
                                    $rootScope.$broadcast('editor:api_error_field_' + err.field + '_' + key + '_' + innerError.field, innerError.message);
                                });
                            }
                        }
                    });
                }
            }).finally(function() {
                if (!!request.complete) {
                    request.complete();
                }
                request.options.isLoading = false;
            });
        };

        this.getItemById = function(id, par, options) {
            var qParams = {},
                expandFields = [],
                expandParam = '',
                dataSource = options.$dataSource || entityObject.dataSource;

            options.isLoading = true;
            angular.forEach(dataSource.fields, function(field) {
                if (field.hasOwnProperty('expandable') && field.expandable === true) {
                    expandFields.push(field.name);
                }
            });
            if (expandFields.length > 0) {
                qParams.expand = expandFields.join(',');
            }

            $http({
                method: 'GET',
                url: dataSource.url + '/' + id,
                params: qParams
            }).then(function(response) {
                var data = response.data;
                data.$parentComponentId = options.$parentComponentId;
                data.editorEntityType = 'exist';
                $rootScope.$broadcast('editor:entity_loaded', data);
            }, function(reject) {
                reject.$parentComponentId = options.$parentComponentId;
                $rootScope.$broadcast('editor:error_get_data', reject);
            }).finally(function() {
                options.isLoading = false;
            });
        };

        this.deleteItemById = function(request) {
            var state;
            if (request.options.isLoading) {
                return;
            }
            var dataSource = request.options.$dataSource;
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
            return $http({
                method: request.method || 'DELETE',
                url: request.url || _url,
                params: request.params || {},
                beforeSend: request.before
            }).then(function(response) {
                if (!!request.success) {
                    request.success(response);
                }
                request.options.isLoading = false;
                self.setQueryParams({});
                self.setFilterParams({});
                $rootScope.$broadcast('editor:entity_success_deleted');
                successDeleteMessage();
                var params = {};
                var paramName = request.options.prefixGrid ? request.options.prefixGrid + '-parent' : 'parent';
                if ($location.search()[paramName]) {
                    params[paramName] = $location.search()[paramName];
                }
                if ($location.search().back && request.useBackUrl) {
                    state = $location.search().back;
                } else {
                    state = request.state;
                }

                state = state || $state.current.name;

                if (!ModalService.isModalOpen()) {
                    if (state) {
                        $state.go(state, params).then(function() {
                            $location.search(params);
                            $rootScope.$broadcast('editor:read_entity', request.options.$parentComponentId);
                        });
                    } else {
                        replaceToURL(request.href);
                    }
                } else {
                    ModalService.close();
                }
            }, function(reject) {
                if (!!request.error) {
                    request.error(reject);
                }
                proccessRejection(reject);
                request.options.isLoading = false;
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
        this.getUrlResource = function getUrlResource(request) {
            request.defer = request.defer || $q.defer();
            request.res = request.res || [];
            var promiseStack = [];
            request.fromP = request.fromP || 1;
            request.toP = request.toP || 0;

            if (request.fromP === 12) {
                request.fromP = 11;
            }
            if (!request.toP) {
                promiseStack.push(getPromise(request.url));
            } else {
                for (var i = request.fromP; i <= request.toP; i++) {
                    promiseStack.push(getPromise(request.url, i));
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

            $q.all(promiseStack).then(function(allResp) {
                var resp;
                var countP;
                for (var i = allResp.length; i--;) {
                    resp = allResp[i];
                    request.res = request.res.concat(resp.data.items);
                    if (angular.isFunction(request.callback)) {
                        request.callback(resp.data.items);
                    }
                }
                if (resp && resp.data._meta) {
                    countP = resp.data._meta.pageCount;
                }

                if (!countP || countP === request.toP || countP === 1) {
                    request.defer.resolve({ data: { items: request.res } });
                } else {
                    if (request.fromP === 1) {
                        request.fromP = 2;
                    } else if (request.fromP === 2) {
                        request.fromP += 4;
                    } else {
                        request.fromP += 5;
                    }
                    request.toP += 5;
                    if (request.toP > countP) {
                        request.toP = countP;
                    }
                    return getrequest.urlResource(request);
                }
            }, function(reject) {
                reject.$parentComponentId = request.$id;
                $rootScope.$broadcast('editor:error_get_data', reject);
            });
            return request.defer.promise;
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
                proccessRejection(reject);
                deferred.reject(reject);
            }).finally(function() {
                if (!!request.complete) {
                    request.complete();
                }
                self.isProcessing = false;
            });

            return deferred.promise;
        };

        this.loadChilds = function(request) {
            var data = {
                parentId: request.id,
                $parentComponentId: request.options.$parentComponentId
            };
            var parent;
            $rootScope.$broadcast('editor:parent_id', data);
            request.childId = request.id;
            self.getItemsList(request).then(function() {
                parent = null;
                if (request.childId) {
                    parent = request.childId;
                }
                var paramName = request.options.prefixGrid ? request.options.prefixGrid + '-parent' : 'parent';
                $location.search(paramName, parent);
            });
        };

        this.loadParent = function(request) {
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
                }).then(function(response) {
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

                }, function(reject) {
                    reject.$parentComponentId = request.options.$parentComponentId;
                    $rootScope.$broadcast('editor:error_get_data', reject);
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

        this.getEntityObject = function() {
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

        this.getUrlDepend = function(url, queryParams, dependField, dependValue) {
            if (angular.isString(dependValue)) {
                dependValue = '"' + dependValue + '"';
            }
            if (angular.isArray(dependValue)) {
                dependValue = dependValue.filter(function(item) {
                    return !!item;
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


        function proccessRejection(rejection) {
            if (rejection.status !== -1) {
                try {
                    var json = JSON.parse(JSON.stringify(rejection));

                    if (rejection.data !== null && rejection.data.hasOwnProperty('message') && rejection.data.message.length > 0) {
                        toastr.error(rejection.data.message);
                    } else if (rejection.status === 422 || rejection.status === 400) {
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
