(function() {
    'use strict';

    angular
        .module('universal.editor')
        .service('RestApiService', RestApiService);

    RestApiService.$inject = ['$q', '$rootScope', '$http', 'configData', 'EditEntityStorage', '$location', '$timeout', '$state', '$httpParamSerializer', '$document', 'FilterFieldsStorage', 'ModalService', 'toastr', '$translate'];

    function RestApiService($q, $rootScope, $http, configData, EditEntityStorage, $location, $timeout, $state, $httpParamSerializer, $document, FilterFieldsStorage, ModalService, toastr, $translate) {
        var entityType,
            self = this,
            queryTempParams,
            filterParams,
            itemsKey,
            entityObject,
            mixEntity,
            cancelerPromises = [];


        self.isProcessing = false;
        self.methodType = "";
        self.editedEntityId = null;

        $rootScope.$on('editor:set_entity_type', function(event, type) {
            //filterParams = undefined;
            entityObject = type;
            //itemsKey = "items";
            //entityObject = configData.entities.filter(function (item) {
            //    return item.name === entityType;
            //})[0];
            //mixEntity = self.getMixModeByEntity();
            itemsKey = "items";
            //if (angular.isDefined(entityObject.backend.keys)) {
            //   itemsKey = entityObject.backend.keys.items || itemsKey;
            //}
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

            var deferred = $q.defer();

            var _method = 'GET';
            var _url = request.url;

            var params = request.params || {};
            _method = request.method || _method;
            if (!!request.options && request.options.sort !== undefined) {
                params.sort = request.options.sort;
            }
            //  request.options.queryTempParams = params;

            var id = request.options.$parentComponentId;
            var filters = FilterFieldsStorage.getFilterQueryObject(id);
            var beforeSend;
            if (!!request.childId) {
                filters = filters || {};
                filters[request.parentField] = request.childId;
            }

            /** beforeSend handler */
            if (angular.isFunction(FilterFieldsStorage.callbackBeforeSend)) {
                beforeSend = FilterFieldsStorage.callbackBeforeSend;
                delete FilterFieldsStorage.callbackBeforeSend;
            }

            if (filters) {
                angular.extend(params, { filter: JSON.stringify(filters) });
            } else {
                delete params.filter;
            }

            if (!!request.options.mixedMode) {
                params = params || {};
                angular.extend(params, {
                    mixed: request.options.mixedMode.entityType
                });
            }

            if (entityObject.dataSource.hasOwnProperty("parentField")) {
                params = params || {};

                if (!params.hasOwnProperty("filter")) {
                    params.root = true;
                }
            }

            if (entityObject.dataSource.hasOwnProperty("sortBy") && !params.hasOwnProperty(entityObject.dataSource.sortBy) && !params.sort) {
                params = params || {};
                angular.extend(params, {
                    sort: entityObject.dataSource.sortBy
                });
            }

            if (params.hasOwnProperty("filter")) {
                delete params.root;
            }

            var expandFields = [];

            angular.forEach(entityObject.dataSource.fields, function(field) {
                if (field.hasOwnProperty("expandable") && field.expandable === true) {
                    expandFields.push(field.name);
                }
            });

            if (expandFields.length > 0) {
                params.expand = expandFields.join(',');
            }

            params['per-page'] = 8;


            $http({
                method: _method,
                url: _url,
                params: params,
                timeout: canceler.promise,
                beforeSend: beforeSend
            }).then(function(response) {
                if (response.data[itemsKey].length === 0) {
                    $rootScope.$broadcast("editor:parent_empty");
                }
                response.data.$parentComponentId = request.options.$parentComponentId;
                $rootScope.$broadcast('editor:items_list', response.data);
                request.options.isLoading = false;
                deferred.resolve();
            }, function(reject) {
                request.options.isLoading = false;
                deferred.reject();
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

            var parentField = entityObject.dataSource.fields.parent;
            if (parentField && $location.search().parent) {
                //-- проверяю редактируется ли поле parentField в форме. Если да, то его не нужно извлекать из адреса.
                var isNotEditableParentField = !$document[0].querySelector(".field-wrapper [name='" + parentField + "']");
                if (isNotEditableParentField) {
                    request.data[parentField] = $location.search().parent;
                }
            }

            request.options.isLoading = true;
            var params = {};
            var _method = 'POST';
            var _url = entityObject.dataSource.url;
            var idField = 'id';
            var type = entityType;

            if (entityObject.dataSource.hasOwnProperty('fields')) {
                idField = entityObject.dataSource.fields.primaryKey || idField;
            }
            $http({
                method: request.method || _method,
                url: request.method || _url,
                data: request.data
            }).then(function(response) {
                var data = {
                    id: response.data[idField],
                    $parentComponentId: request.options.$parentComponentId
                };
                $rootScope.$broadcast("editor:presave_entity_created", data);
                request.options.isLoading = false;
                $rootScope.$broadcast("uploader:remove_session");
                $rootScope.$broadcast("editor:entity_success");
                successCreateMessage();

                var params = {};
                if ($location.search().parent) {
                    params.parent = $location.search().parent;
                }
                if ($location.search().back) {
                    params.type = $location.search().back;
                    type = $location.search().back;
                }
                if (!ModalService.isModalOpen()) {
                    $state.go(type + '_index', params).then(function() {
                        $location.search(params);
                        $rootScope.$broadcast('editor:read_entity', request.options.$parentComponentId);
                    });
                } else {
                    ModalService.close();
                }
            }, function(reject) {
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
                request.options.isLoading = false;
            });
        };

        this.updateItem = function(request) {
            if (request.options.isLoading) {
                return;
            }

            request.options.isLoading = true;
            var params = {};
            var _method = 'PUT';
            var _url = entityObject.dataSource.url + '/' + self.editedEntityId;
            var type = entityType;
            var idField = 'id';

            $http({
                method: request.method || _method,
                url: request.url || _url,
                data: request.data || {}
            }).then(function(response) {
                var data = {
                    id: response.data[idField],
                    $parentComponentId: request.options.$parentComponentId
                };
                $rootScope.$broadcast("editor:presave_entity_updated", data);
                request.options.isLoading = false;
                $rootScope.$broadcast('uploader:remove_session');
                $rootScope.$broadcast('editor:entity_success');
                successUpdateMessage();
                var params = {};
                if ($location.search().parent) {
                    params.parent = $location.search().parent;
                }
                if ($location.search().back) {
                    params.type = $location.search().back;
                    type = $location.search().back;
                }
                if (!ModalService.isModalOpen()) {
                    $state.go(type + '_index', params).then(function() {
                        $location.search(params);
                        $rootScope.$broadcast('editor:read_entity', request.options.$parentComponentId);
                    });
                } else {
                    ModalService.close();
                }
            }, function(reject) {
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
                request.options.isLoading = false;
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

            request.options.isLoading = true;

            if (self.editedEntityId !== '') {
                _url = entityObject.dataSource.url + '/' + self.editedEntityId;
                _method = 'PUT';
                isCreate = false;
            } else {
                _url = entityObject.dataSource.url;
            }

            if (entityObject.dataSource.hasOwnProperty('fields')) {
                idField = entityObject.dataSource.fields.primaryKey || idField;
            }

            $http({
                method: request.method || _method,
                url: request.url || _url,
                data: request.data || {}
            }).then(function(response) {
                request.options.isLoading = false;
                var newId = response.data[idField];
                var par = {};
                par['pk' + EditEntityStorage.getLevelChild($state.current.name)] = newId;
                var searchString = $location.search();
                $state.go($state.current.name, par, { reload: false, notify: false }).then(function() {
                    $location.search(searchString);
                    $rootScope.$broadcast('editor:read_entity', request.options.$parentComponentId);
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
                    $rootScope.$broadcast("editor:presave_entity_updated", data);
                }
            }, function(reject) {
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
                request.options.isLoading = false;
            });
        };

        this.getItemById = function(id, par, options) {

            var qParams = {};
            options.isLoading = true;

            var expandFields = [];
            var expandParam = "";

            angular.forEach(entityObject.dataSource.fields, function(field) {
                if (field.hasOwnProperty("expandable") && field.expandable === true) {
                    expandFields.push(field.name);
                }
            });


            if (expandFields.length > 0) {
                qParams.expand = expandFields.join(',');
            }

            $http({
                method: 'GET',
                url: entityObject.dataSource.url + '/' + id,
                params: qParams
            }).then(function(response) {
                options.isLoading = false;
                response.data.$parentComponentId = options.$parentComponentId;
                EditEntityStorage.setSourceEntity(response.data);
            }, function(reject) {
                options.isLoading = false;
            });
        };

        this.deleteItemById = function(request) {
            if (request.options.isLoading) {
                return;
            }
            var url = entityObject.dataSource.url;
            var type = entityType;

            if (request.options.isMix) {
                url = request.options.mixedMode.dataSource.url;
            }
            request.options.isLoading = true;

            var _url = url + '/' + request.entityId;

            if (request.setting.buttonClass === 'edit') {
                _url = url.replace(':pk', request.entityId);
            }

            if (request.type === 'mix') {
                var config = configData.entities.filter(function(item) {
                    return item.name === mixEntity.entity;
                })[0];
                _url = config.dataSource.url + '/' + request.entityId;
            }

            return $http({
                method: request.method || 'DELETE',
                url: request.url || _url,
                params: request.params || {}
            }).then(function(response) {
                request.options.isLoading = false;
                self.setQueryParams({});
                self.setFilterParams({});
                $rootScope.$broadcast("editor:entity_success_deleted");
                successDeleteMessage();
                var params = {};
                if ($location.search().parent) {
                    params.parent = $location.search().parent;
                }
                if ($location.search().back) {
                    params.type = $location.search().back;
                    type = $location.search().back;
                }

                if (!ModalService.isModalOpen()) {
                    $state.go(type + '_index', params).then(function() {
                        $location.search(params);
                        $rootScope.$broadcast('editor:read_entity', request.options.$parentComponentId);
                    });
                } else {
                    ModalService.close();
                }
            }, function(reject) {
                request.options.isLoading = false;
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
        this.getUrlResource = function getUrlResource(url, res, def, fromP, toP) {
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
                        "per-page": 50
                    }
                });
            }

            $q.all(promiseStack).then(function(allResp) {
                var resp;
                var countP;
                for (var i = allResp.length; i--;) {
                    resp = allResp[i];
                    result = result.concat(resp.data.items);
                }
                if (resp.data._meta) {
                    countP = resp.data._meta.pageCount;
                }

                if (!countP || countP === toP || countP === 1) {
                    defer.resolve({ data: { items: result } });
                } else {
                    fromP = (fromP === 1 ? 2 : (fromP + 10));
                    toP += 10;
                    if (toP > countP) {
                        toP = countP;
                    }
                    return getUrlResource(url, result, defer, fromP, toP);
                }
            }, function(reject) { });
            return defer.promise;
        };

        this.actionRequest = function(request) {
            var deferred = $q.defer();

            var reqParams = request.params || {};
            var url = request.url;
            if (request.id) {
                url = request.url.replace(":id", id);
            }
            self.isProcessing = true;

            $http({
                method: request.method,
                url: url,
                params: reqParams,
                beforeSend: request.beforeSend
            }).then(function(response) {
                self.isProcessing = false;
                deferred.resolve(response);
            }, function(reject) {
                self.isProcessing = false;
                deferred.reject(reject);
            });

            return deferred.promise;
        };

        this.loadChilds = function(request) {
            var data = {
                parentId: request.id,
                $parentComponentId: request.options.$parentComponentId
            };
            $rootScope.$broadcast('editor:parent_id', data);
            request.childId = request.id;
            self.getItemsList(request).then(function() {
                // if (request.headComponent) {
                parent = $location.search().parent;
                if (parent) {
                    parent = JSON.parse(parent);
                }
                if (request.childId) {
                    parent = parent || {};
                    parent[request.options.$parentComponentId] = request.childId;
                }
                var parentJSON = parent ? JSON.stringify(parent) : null;
                $location.search("parent", parentJSON);
                //  }
            });
        };

        this.loadParent = function(request) {
            var data = {
                $parentComponentId: request.options.$parentComponentId
            };
            var entityId = typeof request.childId !== 'undefined' ? request.childId : undefined;
            if (entityId) {
                request.options.isLoading = true;
                $http({
                    method: 'GET',
                    url: request.url + "/" + entityId
                }).then(function(response) {
                    var parentId = response.data[request.parentField];

                    parent = $location.search().parent;
                    if (parent) {
                        parent = JSON.parse(parent);
                    }
                    if (parentId) {
                        parent = parent || {};
                        parent[request.options.$parentComponentId] = parentId;
                    } else {
                        delete parent[request.options.$parentComponentId];
                    }

                    var parentJSON = null;
                    if (!$.isEmptyObject(parent)) {
                        parentJSON = JSON.stringify(parent);
                    }
                    $location.search("parent", parentJSON);
                    request.options.isLoading = false;
                    data.parentId = parentId;
                    $rootScope.$broadcast('editor:parent_id', data);
                    request.childId = parentId;
                    self.getItemsList(request);

                }, function(reject) {
                    request.options.isLoading = false;
                });
            } else {
                reset();
            }
            function reset() {
                request.options.isLoading = false;
                request.parentField = null;
                $rootScope.$broadcast('editor:parent_id', data);
                var parentJSON = null;
                parent = $location.search().parent;
                if (parent) {
                    parent = JSON.parse(parent);
                    delete parent[request.options.$parentComponentId];
                    if (!$.isEmptyObject(parent)) {
                        parentJSON = JSON.stringify(parent);
                    }
                }
                $location.search("parent", parentJSON);
                request.childId = null;
                self.getItemsList(request);
            }
        };

        this.setEntityType = function(type) {
            entityType = type;
            //entityObject = configData.entities.filter(function (item) {
            //    return item.name === entityType;
            //})[0];
            //mixEntity = self.getMixModeByEntity();
        };

        this.getEntityType = function() {
            return entityType;
        };

        this.getEntityObject = function() {
            return entityObject;
        };

        this.getMixModeByEntity = function() {
            var mixMode = {};
            mixMode.existence = false;
            if (configData.hasOwnProperty("mixedMode")) {
                angular.forEach(configData.mixedMode, function(item) {
                    if (item.entities[0] == entityType) {
                        mixMode.existence = true;
                        mixMode.entity = item.entities[1];
                        mixMode.entityTypeName = item.fields.type;
                        mixMode.prependIcon = item.fields.prependIcon;
                    }
                });
            }
            return mixMode;
        };
    }
})();
