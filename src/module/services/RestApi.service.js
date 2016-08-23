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
            filterParams = undefined;
            entityType = type;
            itemsKey = "items";
            entityObject = configData.entities.filter(function (item) {
                return item.name === entityType;
            })[0];
            mixEntity = self.getMixModeByEntity();
            if (angular.isDefined(entityObject.backend.keys)) {
                itemsKey = entityObject.backend.keys.items || itemsKey;
            }
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
            var _url = entityObject.backend.url;

            if(typeof request !== 'undefined'){
                params = typeof request.params !== 'undefined' ? request.params : params;
                _method = typeof request.method !== 'undefined' ? request.method : _method;
                _url = typeof request.url !== 'undefined' ? request.url : _url;
                if(request.sort !== undefined){
                    params.sort = request.sort;
                }
            }
            queryTempParams = params;

            if(self.isProcessing){
                return;
            }

            if($location.search().hasOwnProperty("parent")){
                var filterObject = {};
                filterObject[entityObject.backend.fields.parent] = $location.search().parent;
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

            if(mixEntity.existence){
                params = params || {};
                angular.extend(params,{
                    mixed: mixEntity.entity
                });
            }

            if(entityObject.backend.hasOwnProperty("parentField")){
                params = params || {};

                if(!params.hasOwnProperty("filter")){
                    params.root = true;
                }
            }

            if (entityObject.backend.hasOwnProperty("sortBy")
                && !params.hasOwnProperty(entityObject.backend.sortBy) && !params.sort) {
                params = params || {};
                angular.extend(params, {
                    sort: entityObject.backend.sortBy
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

            angular.forEach(entityObject.tabs, function (tab) {
                angular.forEach(tab.fields, function (field) {
                    if(field.hasOwnProperty("expandable") && field.expandable === true){
                        expandFields.push(field.name);
                    }
                });
            });

            if (expandFields.length > 0){
                params.expand = expandFields.join(',');
            }
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
                    $rootScope.$broadcast('editor:items_list',response.data);
                    deferred.resolve();
                } else {
                    $rootScope.$broadcast('editor:items_list', response.data);
                    deferred.resolve();
                }
            }, function (reject) {
                self.isProcessing = false;
                deferred.reject();
            });

            return deferred.promise;
        };

        this.getItemsListWithParams = function (params) {

            if(self.isProcessing){
                return;
            }

            if(mixEntity.existence){
                params = params || {};
                if(typeof params == 'object'){
                    angular.extend(params,{
                        mixed: mixEntity.entity
                    });
                } else {
                    params = params + '&mixed=' + mixEntity.entity;
                }
            }

            if(entityObject.backend.fields.parent){
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
                url : entityObject.backend.url + '?' + params,
            }).then(function (response) {
                self.isProcessing = false;
                $rootScope.$broadcast('editor:items_list',response.data);
                if($location.search().hasOwnProperty("id")){
                    self.getItemById($location.search().id);
                }
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
            
            var parentField = entityObject.backend.fields.parent;
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
            var _url = entityObject.backend.url;
            var idField = 'id';

            if(entityObject.backend.hasOwnProperty('fields')){
                idField = entityObject.backend.fields.primaryKey || idField;
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
                $state.go('editor.type.list', params,{reload: true});
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
            var _url = entityObject.backend.url + '/' + self.editedEntityId;

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
                $state.go('editor.type.list', params, {reload: true});
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
            var tmpUrl;

            if (self.isProcessing) {
                return;
            }

            self.isProcessing = true;

            if (self.editedEntityId !== '') {
                tmpUrl = entityObject.backend.url + '/' + self.editedEntityId;
            } else {
                tmpUrl = entityObject.backend.url;
            }
            var params = {};
            var _method = 'POST';
            var _url = tmpUrl;
            var idField = 'id';

            if ($state.is('editor.type.entity')) {
                _method = 'PUT';
            }
            if (entityObject.backend.hasOwnProperty('fields')) {
                idField = entityObject.backend.fields.primaryKey || idField;
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
                        $state.go('editor.type.entity', {
                            uid: response.data[idField]
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

            var qParams = typeof par !== "undefined" ? par : {};
            if(self.isProcessing){
                return;
            }

            self.isProcessing = true;

            var expandFields = [];
            var expandParam = "";

            angular.forEach(entityObject.tabs, function (tab) {
                angular.forEach(tab.fields, function (field) {
                    if(field.hasOwnProperty("expandable") && field.expandable === true){
                        expandFields.push(field.name);
                    }
                });
            });

            if (expandFields.length > 0){
                qParams.expand = expandFields.join(',');
            }

            $http({
                method : 'GET',
                url : entityObject.backend.url + '/' + id,
                params : qParams
            }).then(function (response) {
                self.isProcessing = false;
                EditEntityStorage.setSourceEntity(response.data);
            }, function (reject) {
                self.isProcessing = false;
            });
        };

        this.deleteItemById = function (id,request, type) {

            var par =  {};

            if(self.isProcessing){
                return;
            }

            self.isProcessing = true;
            var _method = 'DELETE';
            var _url  = entityObject.backend.url + '/' + id;

            if (type === 'mix'){
                var config = configData.entities.filter(function (item) {
                    return item.name === mixEntity.entity;
                })[0];
                _url = config.backend.url + '/' + id;
            }

            if (typeof request !== 'undefined') {
                par = typeof request.params !== 'undefined' ? request.params : par;
                _method = typeof request.method !== 'undefined' ? request.method : _method;
                _url = typeof request.url !== 'undefined' ? request.url : _url;
            }

            $http({
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
                $state.go('editor.type.list', params, { reload: true });   
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

        this.contextMenuAction = function(contextItem,id){
            var reqParams = contextItem.request.params || {};
            var url = contextItem.request.url.replace(":id",id);

            self.isProcessing = true;

            $http({
                method : contextItem.request.method,
                url : url,
                params : reqParams
            }).then(function (response) {
                self.isProcessing = false;
                self.getItemsList();
            }, function (reject) {
                self.isProcessing = false;
            });
        };

        this.loadChilds = function(entityId,request){
            $location.search("parent",entityId);

            self.getItemsList(request).then(function(response){
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
            entityObject = configData.entities.filter(function (item) {
                return item.name === entityType;
            })[0];
            mixEntity = self.getMixModeByEntity();
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
                        mixMode.entityTypeName = item.fieldType;
                    }
                });
            }
            return mixMode;
        };
    }
})();
