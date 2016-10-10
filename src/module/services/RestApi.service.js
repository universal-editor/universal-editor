(function () {
    'use strict';

    angular
        .module('universal.editor')
        .service('RestApiService',RestApiService);

    RestApiService.$inject = ['$q','$rootScope','$http','configData','EditEntityStorage','$location','$timeout','$state','$httpParamSerializer', '$document'];

    function RestApiService($q,$rootScope,$http,configData,EditEntityStorage,$location,$timeout,$state,$httpParamSerializer, $document){
        var entityType,
            self = this,
            queryTempParams,
            filterParams,
            itemsKey,
            entityObject,
            mixEntity;

        self.isProcessing = false;
        self.methodType = "";
        self.editedEntityId = null;

        $rootScope.$on('editor:set_entity_type', function (event,type) {
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

        $rootScope.$on('editor:create_entity', function (event,entity) {
            self.addNewItem(entity);
        });

        $rootScope.$on('editor:update_entity', function (event,entity) {
            self.updateItem(entity);
        });

        $rootScope.$on('editor:presave_entity', function (event,entity) {
            self.presaveItem(entity);
        });

        this.getQueryParams = function () {
            try{
                return JSON.parse(JSON.stringify(queryTempParams));
            } catch (e) {
                return {};
            }
        };

        this.setQueryParams = function (params) {
            if(Object.keys(params).length > 0){
                queryTempParams = params;
            } else {
                queryTempParams = undefined;
            }
        };

        this.setFilterParams = function(params){
            if(Object.keys(params).length > 0){
                filterParams = params;
            } else {
                filterParams = undefined;
            }
        };

        this.getItemsList = function (request) {

            var deferred = $q.defer();

            if(queryTempParams && queryTempParams.hasOwnProperty("filter")){
                delete queryTempParams.filter;
            }

            var params = this.getQueryParams();
            var _method = 'GET';
            var _url = request.url;

            if(typeof request !== 'undefined'){
                params = typeof request.params !== 'undefined' ? request.params : params;
                _method = typeof request.method !== 'undefined' ? request.method : _method;
                if(request.sort !== undefined){
                    params.sort = request.sort;
                }
            }
            queryTempParams = params;

            if(self.isProcessing){
                //return;
            }

            if($location.search().hasOwnProperty("parent")){
                var filterObject = {};
                filterObject[entityObject.dataSource.parentField] = $location.search().parent;
                angular.extend(params,{filter : JSON.stringify(filterObject)});
            }

            if(filterParams){
                if(params.hasOwnProperty("filter")){
                    var tempFilter = JSON.parse(params.filter);
                    angular.extend(tempFilter,filterParams);
                    params.filter = JSON.stringify(tempFilter);
                } else {
                    params.filter = JSON.stringify(filterParams);
                }
            }

            if(entityObject.dataSource.hasOwnProperty("parentField")){
                params = params || {};

                if(!params.hasOwnProperty("filter")){
                    params.root = true;
                }
            }

            if (entityObject.dataSource.hasOwnProperty("sortBy")
                && !params.hasOwnProperty(entityObject.dataSource.sortBy) && !params.sort) {
                params = params || {};
                angular.extend(params, {
                    sort: entityObject.dataSource.sortBy
                });
            }

            if(params.hasOwnProperty("filter")){
                delete params.root;
            }

            //if(Object.keys(params).length === 0){
            //   params = undefined;
            // }

            self.isProcessing = true;

            var expandFields = [];

            //angular.forEach(entityObject.tabs, function (tab) {
                angular.forEach(entityObject.dataSource.fields, function (field) {
                    if(field.hasOwnProperty("expandable") && field.expandable === true){
                        expandFields.push(field.name);
                    }
                });
            //});

            if (expandFields.length > 0){
                params.expand = expandFields.join(',');
            }

            var id = request.id;

            $http({
                method : _method,
                url : _url,
                params : params
            }).then(function (response) {
                self.isProcessing = false;
                //console.log("response list record:");
                //console.log(response);
                if(response.data[itemsKey].length === 0){
                    $rootScope.$broadcast("editor:parent_empty");
                    $rootScope.$broadcast('editor:items_list_' + id,response.data);
                    deferred.resolve();
                } else {
                    $rootScope.$broadcast('editor:items_list_' + id, response.data);
                    deferred.resolve();
                }
            }, function (reject) {
                self.isProcessing = false;
                deferred.reject();
            });

            return deferred.promise;
        };

        this.getItemsListWithParams = function (params, id) {

            if(self.isProcessing){
                return;
            }

            //if(mixEntity.existence){
            //    params = params || {};
            //    if(typeof params == 'object'){
            //        angular.extend(params,{
            //            mixed: mixEntity.entity
            //        });
            //    } else {
            //        params = params + '&mixed=' + mixEntity.entity;
            //    }
            //}

            if(entityObject.dataSource.fields.parent){
                params = params || {};

                if(!params.hasOwnProperty("filter")){
                    if(typeof params == 'object'){
                        angular.extend(params,{
                            root: true
                        });
                    } else {
                        params = params + '&root=true';
                    }

                }
            }

            if (typeof params == 'object'){
                params = $httpParamSerializer(params);
            }

            self.isProcessing = true;

            $http({
                method : 'GET',
                url : entityObject.dataSource.url + '?' + params
            }).then(function (response) {
                self.isProcessing = false;
                $rootScope.$broadcast('editor:items_list_' + id,response.data);
                //if($location.search().hasOwnProperty("id")){
                //    self.getItemById($location.search().id);
                //}
            }, function (reject) {
                self.isProcessing = false;
            });
        };

        this.getData = function(api, params) {
            return $http({
                method : 'GET',
                url : api,
                params: params
            });
        };

        this.addNewItem = function (arrItem) {
            var item = arrItem[0];
            var request = arrItem[1];

            if(self.isProcessing){
                return;
            }
            
            var parentField = entityObject.dataSource.fields.parent;
            if (parentField && $location.search().parent) {
                //-- проверяю редактируется ли поле parentField в форме. Если да, то его не нужно извлекать из адреса.
                var isNotEditableParentField = !$document[0].querySelector(".field-wrapper [name='" + parentField + "']");
                if (isNotEditableParentField) {
                    item[parentField] = $location.search().parent;
                }
            }

            self.isProcessing = true;
            var params = {};
            var _method = 'POST';
            var _url = entityObject.dataSource.url;
            var idField = 'id';

            if(entityObject.dataSource.hasOwnProperty('fields')){
                idField = entityObject.dataSource.fields.primaryKey || idField;
            }

            if(typeof request !== 'undefined'){
                params = typeof request.params !== 'undefined' ? request.params : params;
                _method = typeof request.method !== 'undefined' ? request.method : _method;
                _url = typeof request.url !== 'undefined' ? request.url : _url;
            }
            $http({
                method : _method,
                url : _url,
                data : item,
                params: params
            }).then(function (response) {
                $rootScope.$broadcast("editor:presave_entity_created",response.data[idField]);
                self.isProcessing = false;
                $rootScope.$broadcast("uploader:remove_session");
                $rootScope.$broadcast("editor:entity_success");
                var params = {};
                if ($location.search().parent) {
                    params.parent = $location.search().parent;
                }
                $state.go(entityType + '_index', params,{reload: true});
            }, function (reject) {
                if (reject.data.error && reject.data.hasOwnProperty("data") && reject.data.data.length > 0){
                    angular.forEach(reject.data.data, function (err) {
                        if(err.hasOwnProperty("field")){
                            $rootScope.$broadcast("editor:api_error_field_"+ err.field,err.message);
                            if(err.hasOwnProperty("fields")){
                                angular.forEach(err.fields, function (innerError,key) {
                                    $rootScope.$broadcast("editor:api_error_field_"+ err.field + "_" + key + "_" + innerError.field,innerError.message);
                                });
                            }
                        }
                    });
                }
                self.isProcessing = false;
            });
        };

        this.updateItem = function (arrItem) {
            var item = arrItem[0];
            var request = arrItem[1];
            var tmpUrl;


            if (self.isProcessing) {
                return;
            }

            self.isProcessing = true;
            var params = {};
            var _method = 'PUT';
            var _url  = entityObject.dataSource.url + '/' + self.editedEntityId;

            if (typeof request !== 'undefined') {
                params = typeof request.params !== 'undefined' ? request.params : params;
                _method = typeof request.method !== 'undefined' ? request.method : _method;
                _url = typeof request.url !== 'undefined' ? request.url : _url;
            }

            $http({
                method: _method,
                url: _url,
                data: item,
                params: params
            }).then(function (response) {
                self.isProcessing = false;
                $rootScope.$broadcast('uploader:remove_session');
                $rootScope.$broadcast('editor:entity_success');
                var params = {};
                if ($location.search().parent) {
                    params.parent = $location.search().parent;
                }
                if ($state.params.back) {
                    params.type = $state.params.back;
                }
                $state.go(entityType + '_index', params, {reload: true});
            }, function (reject) {
                if (reject.data.error && reject.data.hasOwnProperty('data') && reject.data.data.length > 0) {
                    angular.forEach(reject.data.data, function (err) {
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
                self.isProcessing = false;
            });
        };

        this.presaveItem = function (arrItem) {
            var item = arrItem[0];
            var request = arrItem[1];
            var _url;
            var params = {};
            var _method = 'POST';
            var idField = 'id';

            if (self.isProcessing) {
                return;
            }

            self.isProcessing = true;

            if (self.editedEntityId !== '') {
                _url = entityObject.dataSource.url + '/' + self.editedEntityId;
                _method = 'PUT';
            } else {
                _url = entityObject.dataSource.url;
            }

            if (entityObject.dataSource.hasOwnProperty('fields')) {
                idField = entityObject.dataSource.fields.primaryKey || idField;
            }
            if (typeof request !== 'undefined') {
                params = typeof request.params !== 'undefined' ? request.params : params;
                _method = typeof request.method !== 'undefined' ? request.method : _method;
                _url = typeof request.url !== 'undefined' ? request.url : _url;
            }

            $http({
                method: _method,
                url: _url,
                data: item,
                params: params
            }).then(function (response) {
                self.isProcessing = false;
                switch (response.statusText) {
                    case 'OK':
                        $rootScope.$broadcast('editor:presave_entity_updated', '');
                        break;
                    case 'Created':
                        $state.go($state.current.name, {
                            pk: response.data[idField]
                        }, {
                            notify: false
                        });
                        $rootScope.$broadcast('editor:presave_entity_created', response.data[idField]);
                        break;
                }
            }, function (reject) {
                if ((reject.status === 422 || reject.status === 400) && reject.data) {
                    var wrongFields = reject.data.hasOwnProperty('data') ? reject.data.data : reject.data;
                    
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
                self.isProcessing = false;
            });
        };

        this.getItemById = function (id,par) {

            var qParams = {};
            if(self.isProcessing){
                return;
            }

            self.isProcessing = true;

            var expandFields = [];
            var expandParam = "";

            angular.forEach(entityObject.dataSource.fields, function (field) {
                if(field.hasOwnProperty("expandable") && field.expandable === true){
                    expandFields.push(field.name);
                }
            });

            if (expandFields.length > 0){
                qParams.expand = expandFields.join(',');
            }

            $http({
                method : 'GET',
                url : entityObject.dataSource.url + '/' + id,
                params : qParams
            }).then(function (response) {
                self.isProcessing = false;
                EditEntityStorage.setSourceEntity(response.data);
            }, function (reject) {
                self.isProcessing = false;
            });
        };

        this.deleteItemById = function (id,request, type, setting) {

            var par =  {};

            if(self.isProcessing){
                return;
            }

            self.isProcessing = true;
            var _method = 'DELETE';

            var _url  = entityObject.dataSource.url + '/' + id;

            if (setting.buttonClass === 'edit') {
                _url = entityObject.dataSource.url.replace(':pk', id);
            }

            if (type === 'mix'){
                var config = configData.entities.filter(function (item) {
                    return item.name === mixEntity.entity;
                })[0];
                _url = config.dataSource.url + '/' + id;
            }

            if (typeof request !== 'undefined') {
                par = typeof request.params !== 'undefined' ? request.params : par;
                _method = typeof request.method !== 'undefined' ? request.method : _method;
                _url = typeof request.url !== 'undefined' ? request.url : _url;
            }
            return $http({
                method : _method,
                url : _url,
                params : par
            }).then(function (response) {
                self.isProcessing = false;
                self.setQueryParams({});
                self.setFilterParams({});
                $rootScope.$broadcast("editor:entity_success_deleted");
                var params = {};
                if ($location.search().parent) {
                    params.parent = $location.search().parent;
                }
                if($state.params.back){
                    params.type = $state.params.back;
                }
                $state.go(entityType + '_index', params, { reload: true });
            }, function (reject) {
                self.isProcessing = false;
            });
        };

        //-- read all pages
        this.getUrlResource = function getUrlResource(url, res, def , fromP, toP) {
            var defer = def || $q.defer();
            var result = res || [];
            var promiseStack = [];
            fromP = fromP || 1;
            toP = toP || 0;

            if(fromP === 12) {
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

            $q.all(promiseStack).then(function (allResp) {
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
                    defer.resolve({data: { items: result}});
                } else {
                    fromP = (fromP === 1 ? 2 : (fromP + 10));
                    toP += 10;
                    if(toP > countP) {
                        toP = countP;
                    }
                    return getUrlResource(url, result, defer, fromP, toP);
                }
            }, function (reject) { });
            return defer.promise;
        };

        this.actionRequest = function(request){
            var deferred = $q.defer();

            var reqParams = request.params || {};
            var url = request.url;
            if(request.id) {
                url = request.url.replace(":id", id);
            }
            self.isProcessing = true;

             $http({
                method : request.method,
                url : url,
                params : reqParams,
                beforeSend: request.beforeSend
            }).then(function (response) {
                 self.isProcessing = false;
                 deferred.resolve(response);
             }, function (reject) {
                 self.isProcessing = false;
                 deferred.reject(reject);
             });

            return deferred.promise;
        };

        this.loadChilds = function(entityId,request, url){
            $location.search("parent",entityId);
            var newRequest = angular.merge({}, request);
            newRequest.url = url;

            self.getItemsList(newRequest).then(function(response){
                $timeout(function () {
                    $location.search("parent",entityId);
                }, 0);
            });

        };

        this.loadParent = function(entityId){
            entityId = typeof entityId !== 'undefined' ? entityId : undefined;

            if(entityId){
                self.isProcessing = true;

                $http({
                    method : 'GET',
                    url : entityObject.backend.url + "/" + entityId
                }).then(function(response){
                    var parentId;
                    if(response.data[entityObject.backend.fields.parent] !== null){
                      self.isProcessing = false;
                      parentId = response.data[entityObject.backend.fields.parent];
                      $location.search("parent",parentId);
                      self.getItemsList();
                    } else {
                      self.isProcessing = false;
                      $location.search("parent",null);
                      self.getItemsList();
                    }
                },function(reject){
                  self.isProcessing = false;
                });
            } else {
                self.isProcessing = true;

                $location.search("parent",null);
                self.getItemsList();
            }
        };

        this.setEntityType = function (type) {
            entityType = type;
            //entityObject = configData.entities.filter(function (item) {
            //    return item.name === entityType;
            //})[0];
            //mixEntity = self.getMixModeByEntity();
        };

        this.getEntityType = function () {
            return entityType;
        };
        
        this.getEntityObject = function () {
            return entityObject;
        };

        this.getMixModeByEntity = function() {
            var mixMode = {};
            mixMode.existence = false;
            if(configData.hasOwnProperty("mixedMode")){
                angular.forEach(configData.mixedMode, function(item){
                    if(item.entities[0] == entityType) {
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
