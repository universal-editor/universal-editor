(function () {
    'use strict';

    angular
        .module('universal.editor',
        [
            'universal.editor.templates',
            'minicolors',
            'datePicker',
            'checklist-model',
            'angularMoment',
            'ngCookies',
            'ngFileUpload',
            'ui.router',
            'ngRaven',
            'ui.mask',
            'toastr',
            'pascalprecht.translate'
        ]);

    angular
        .module('universal.editor')
        .factory('EditorHttpInterceptor',EditorHttpInterceptor);

    EditorHttpInterceptor.$inject = ['$q','$rootScope','toastr','$translate'];

    function EditorHttpInterceptor($q, $rootScope, toastr, $translate) {
        return {
            'request': function (config) {
                $rootScope.$broadcast('editor:request_start', '');

                // Заменяем пустые массивы на null так как при отправке такие массивы игнорируются
                if (config.data && typeof config.data === 'object') {
                    angular.forEach(config.data, function (value, key) {
                        if (angular.isArray(value) && value.length === 0) {
                            config.data[key] = null;
                        }
                    });
                }

                return config;
            },
            'responseError': function (rejection) {
                try {
                    var json = JSON.parse(JSON.stringify(rejection));

                    if (rejection.data !== null && rejection.data.hasOwnProperty('message') && rejection.data.message.length > 0) {
                        toastr.error(rejection.data.message);
                    } else if (rejection.status === 422 || rejection.status === 400) {
                        $translate('RESPONSE_ERROR.INVALID_DATA').then(function (translation) {
                            toastr.warning(translation);
                        });
                    } else if (rejection.status === 401) {
                        $translate('RESPONSE_ERROR.UNAUTHORIZED').then(function (translation) {
                            toastr.warning(translation);
                        });
                    } else if (rejection.status === 403) {
                        $translate('RESPONSE_ERROR.FORBIDDEN').then(function (translation) {
                            toastr.error(translation);
                        });
                    } else {
                        $translate('RESPONSE_ERROR.SERVICE_UNAVAILABLE').then(function (translation) {
                            toastr.error(translation);
                        });
                    }
                } catch (e) {
                    console.error(e);
                    $translate('RESPONSE_ERROR.UNEXPECTED_RESPONSE').then(function (translation) {
                        toastr.error(translation);
                    });
                }

                return $q.reject(rejection);
            }
        };
    }

    angular
        .module('universal.editor')
        .config(universalEditorConfig);

    universalEditorConfig.$inject = ['minicolorsProvider','$httpProvider','$stateProvider','$urlRouterProvider','$provide', 'ConfigDataProviderProvider', '$injector'];

    function universalEditorConfig(minicolorsProvider,$httpProvider,$stateProvider,$urlRouterProvider,$provide, ConfigDataProviderProvider, $injector){

        var dataResolver;

        angular.extend(minicolorsProvider.defaults, {
            control : 'hue',
            position : 'top left',
            letterCase : 'uppercase'
        });

        $httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';
        $httpProvider.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
        $httpProvider.defaults.headers.put["Content-Type"] = "application/x-www-form-urlencoded; charset=UTF-8";
        $httpProvider.defaults.transformRequest = function(data){


            if (data === undefined) {
                return data;
            }

            return $.param(data);
        };

        $httpProvider.interceptors.push('EditorHttpInterceptor');

        /* ROUTES */

        var defaultRoute = ConfigDataProviderProvider.getDefaultEntity();

        $urlRouterProvider.otherwise("/editor/" + defaultRoute +"/list");

        $stateProvider
            .state('editor',{
                url : "/editor",
                template : "<div data-ui-view></div>",
            })
            .state('editor.type',{
                url : "/:type",
                template : "<div data-ui-view></div>",
                resolve : {
                    configObject : configResolver
                },
                controller : "UniversalEditorController",
                controllerAs : "vm",
                onEnter : ["RestApiService", "$stateParams", function (RestApiService,$stateParams) {
                    RestApiService.setEntityType($stateParams.type);
                    RestApiService.setQueryParams({});
                }]
            })
            .state('editor.type.list',{
                url : "/list?parent",
                templateUrl : "module/directives/universalEditor/universalEditorList.html"
            })
            .state('editor.type.new',{
                url : '/new?back&parent&type',
                templateUrl : "module/directives/universalEditor/universalEditorForm.html",
                onEnter : ["EditEntityStorage", function (EditEntityStorage) {
                    EditEntityStorage.createNewEntity();
                }]
            })
            .state('editor.type.entity',{
                url : '/:uid?back&parent',
                templateUrl : "module/directives/universalEditor/universalEditorForm.html",
                onEnter : ["RestApiService", "$rootScope", "$stateParams", function (RestApiService,$rootScope,$stateParams) {
                    RestApiService.getItemById($stateParams.uid);
                }]
            });
        /* DATE INPUT DECORATOR*/

        $provide.decorator('mFormatFilter', function () {
            return function newFilter(m, format, tz)
            {
                if (!(moment.isMoment(m))) {
                    return '';
                }
                if(tz){
                    return moment.tz(m, tz).format(format);
                } else {
                    return m.format(format);
                }
            };
        });
    }

    angular
        .module('universal.editor')
        .run(universalEditorRun);

    universalEditorRun.$inject = ['$rootScope','$location','$state'];

    function universalEditorRun($rootScope,$location,$state){
        var itemsSelector = document.querySelectorAll(".nav.nav-tabs .item");
        $rootScope.$on('$stateChangeSuccess', function (event,toState,toParams) {
            var stateParamEntityId = toParams.type;
            angular.forEach(itemsSelector, function (item) {
                $(item).removeClass("active");
                if($(item).find("a")[0].hash.split("/")[2] == stateParamEntityId){
                    $(item).addClass("active");
                }
            });
        });

        if(itemsSelector.length == 1){
            angular.element(itemsSelector).css("display","none");
        }
    }

    configResolver.$inject = ['ConfigDataProvider'];

    function configResolver(ConfigDataProvider){
        return ConfigDataProvider;
    }
})();
(function () {
    'use strict';

    angular
        .module('universal.editor')
        .config(LocalizationMessage);

    LocalizationMessage.$inject = ['$translateProvider'];

    function LocalizationMessage($translateProvider) {

        var constantLang = {
            'RESPONSE_ERROR': {
                'INVALID_DATA': 'Неправильно заполнена форма',
                'SERVICE_UNAVAILABLE': 'Сервис временно недоступен',
                'UNEXPECTED_RESPONSE': 'Сервис вернул неожиданный ответ',
                'UNAUTHORIZED': 'Требуется авторизация',
                'RELOAD_PAGE': 'Требуется повторная авторизация, перезагрузите страницу',
                'FORBIDDEN': 'Нет доступа',
                'NOT_FOUND': 'Запись не найдена'
            },
            'CHANGE_RECORDS': {
                'CREATE': 'Запись создана',
                'UPDATE': 'Запись обновлена',
                'DELETE': 'Запись удалена'
            },
            'BUTTON': {
                'ADD': 'Добавить',
                'DELETE': 'Удалить',
                'DELETE_MARK': 'Удалить метку',
                'APPLY': 'Применить',
                'CLEAN': 'Очистить',
                'HIGHER_LEVEL': 'На уровень выше',
                'FILTER': 'Фильтр'
            },
            'LOADING': 'Загрузка',
            'SELECT_VALUE': 'Выберите значение',
            'PERFORMS_ACTIONS': 'Выполняется действие',
            'ELEMENT_NO': 'Нет элементов для отображения',
            'ELEMENTS': 'Элементы',
            'FROM': 'из',
            'SEARCH_ELEMENTS': 'Поиск по элементам'
        };
        $translateProvider.translations('ru', constantLang);


        $translateProvider.useStaticFilesLoader({
            prefix: '',
            suffix: ''
        });
        $translateProvider.preferredLanguage('ru');
    }

})();
/**
 * Constructor for create editor
 * @param {string} id - Id html element instead of which will be the editor
 * @param {Object} config - Configuration object
 * @constructor
 */
function UniversalEditor(id, config) {
    'use strict';

    var app = angular.module('universal.editor');
    var configData = config;
    var unEditor = $('#' + id);
    unEditor.append("<div data-ui-view=''></div>");
    app.constant('configData', config);
    angular.bootstrap(unEditor[0], ["unEditor"]);
}
(function () {
    'use strict';

    angular
        .module('universal.editor')
        .factory('FieldBuilder',FieldBuilder);

    FieldBuilder.$inject = ['$compile'];

    function FieldBuilder($compile){
        var Field = function (scope) {
            this.scope = scope.$new();
            this.scope.field = scope.field;
        };
        
        Field.prototype.build = function () {
            var element = '<div data-editor-field-' + this.scope.field.type + '=""></div>';

            return $compile(element)(this.scope);
        };

        return Field;
    }
})();
(function () {
    'use strict';

    angular
        .module('universal.editor')
        .factory('FilterBuilder',FilterBuilder);

    FilterBuilder.$inject = ['$compile'];

    function FilterBuilder($compile){
        var Filter = function (scope) {

            this.scope = scope.$new();
            this.scope.filter = scope.filter;
        };

        Filter.prototype.build = function () {
            var element = '<div data-editor-filter-' + this.scope.filter.type + '=""></div>';

            return $compile(element)(this.scope);
        };

        return Filter;
    }
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .provider('ConfigDataProvider', ConfigDataProvider);

    ConfigDataProvider.$inject = ['configData'];
    function ConfigDataProvider(configData){
        return {
            getDefaultEntity: function(){
                return configData.entities[0].name;
            },
            $get: ['$q',function($q) {
                var deferred = $q.defer();
                deferred.resolve(configData);
                return deferred;
            }]
        };
    }
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .service('ArrayFieldStorage',ArrayFieldStorage);

    ArrayFieldStorage.$inject = ['$rootScope'];

    function ArrayFieldStorage($rootScope){
        var ArrayFields = {};
        this.setArrayField = function (fieldName,fieldValue) {
            ArrayFields[fieldName] = fieldValue;
        };

        this.getFieldValue = function (parentField,fieldIndex,fieldName) {
            if( ArrayFields.hasOwnProperty(parentField) &&
                ArrayFields[parentField][fieldIndex] !== undefined &&
                ArrayFields[parentField][fieldIndex].hasOwnProperty(fieldName)){
                    return ArrayFields[parentField][fieldIndex][fieldName];
            } else {
                return false;
            }
        };

        this.removeFieldIndex = function (fieldName,fieldIndex) {
            ArrayFields[fieldName].splice(fieldIndex,1);
        };

        this.fieldDestroy = function (parentField,fieldIndex,fieldName,value) {
            if (ArrayFields[parentField][fieldIndex] === undefined) {
                ArrayFields[parentField][fieldIndex] = {};
                ArrayFields[parentField][fieldIndex][fieldName] = value;

            } else {
                ArrayFields[parentField][fieldIndex][fieldName] = value;
            }
        };

        $rootScope.$on('editor:set_entity_type',function (event,type) {
            ArrayFields = [];
        });
    }
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .service('EditEntityStorage',EditEntityStorage);

    EditEntityStorage.$inject = ['$rootScope','$timeout','configData','$location', "$state"];

    function EditEntityStorage($rootScope,$timeout,configData,$location, $state){
        var sourceEntity,
            configuredFields = {},
            fieldControllers = [],
            entityType,
            self = this;

        /* PUBLIC METHODS */

        this.actionType = "create";

        this.getValueField = function(fieldName) {
            for (var i = fieldControllers.length; i--;) {
                var controller = fieldControllers[i];
                if (controller.fieldName === fieldName) {
                    return controller.getFieldValue();
                }
            }
        };

        this.createNewEntity = function () {

            var entityObject = {};
            entityObject.editorEntityType = "new";
            var configObjectEntity = self.getEntity();
            angular.forEach(fieldControllers,function(fCtrl){
                angular.merge(entityObject,fCtrl.getInitialValue());
            });

            var search =  $location.search();       
            var type = search.type || $state.params.type;     
            if (search.hasOwnProperty("parent")) {
                var entity_conf = configData.entities.filter(function (item) {
                    return item.name === type;
                })[0];
                entityObject[entity_conf.backend.fields.parent] = search.parent;
            }

            $timeout(function () {
                $rootScope.$broadcast("editor:entity_loaded",entityObject);
            },0);
        };

        this.setSourceEntity = function (data) {
            data.editorEntityType = "exist";
            $rootScope.$broadcast("editor:entity_loaded",data);
        };

        this.getEntityType = function () {
            return entityType;
        };

        this.addFieldController = function (ctrl) {
            fieldControllers.push(ctrl);
            ctrl.$fieldHash = Math.random().toString(36).substr(2, 15);
        };

        this.deleteFieldController = function (ctrl) {
            angular.forEach(fieldControllers, function (fc, ind) {
                if (fc.$fieldHash === ctrl.$fieldHash){
                    fieldControllers.splice(ind,1);
                }
            });
        };

        this.setActionType = function (type) {
            this.actionType = type;
        };


        this.editEntityUpdate = function (type, request) {

            this.setActionType(type);

            var entityObject = {};

            angular.forEach(fieldControllers,function(fCtrl){
                if(!fCtrl.hasOwnProperty("readonly") || fCtrl.readonly === false){
                    angular.merge(entityObject,fCtrl.getFieldValue());
                }
            });

            switch (type) {
                case "create":
                    $rootScope.$emit('editor:create_entity',[entityObject, request]);
                    break;
                case "update":
                    $rootScope.$broadcast('editor:update_entity',[entityObject, request]);
                    break;
            }
        };

        this.getEntityValue = function() {
            var entityObject = {};

            angular.forEach(fieldControllers,function(fCtrl){
                if(!fCtrl.hasOwnProperty("readonly") || fCtrl.readonly === false){
                    angular.merge(entityObject,fCtrl.getFieldValue());
                }
            });

            return entityObject;
        };

        this.editEntityPresave = function (request) {
            var entityObject = {};

            angular.forEach(fieldControllers,function(fCtrl){
                if(!fCtrl.hasOwnProperty("readonly") || fCtrl.readonly === false){
                    angular.merge(entityObject,fCtrl.getFieldValue());
                }
            });
            $rootScope.$broadcast('editor:presave_entity',[entityObject, request]);
        };

        this.getEntity = function(){
            return configData.entities.filter(function (item) {
                return item.name === entityType;
            })[0];
        };

        /* !PUBLIC METHODS */

        /* EVENTS LISTENING */

        $rootScope.$on("editor:add_entity", function (event,data) {
            self.actionType = data;
        });

        $rootScope.$on('editor:set_entity_type',function (event,type) {
            entityType = type;
            fieldControllers = [];
        });

        /* !EVENTS LISTENING */

        /* PRIVATE METHODS */

        function validateEntityFields(){

            var valid = true;

            if (sourceEntity === undefined || entityType === undefined){
                console.log("EditEntityStorage: Сущность не доступна для проверки так как она не указана или не указан её тип");
                valid = false;
            }

            return valid;
        }

        /* !PRIVATE METHODS */
    }
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .service('FilterFieldsStorage',FilterFieldsStorage);

    FilterFieldsStorage.$inject = ['$rootScope','$timeout','configData'];

    function FilterFieldsStorage($rootScope,$timeout,configData){
        var filterControllers = [],
            entityType;

        this.addFilterController = function (ctrl) {
            filterControllers.push(ctrl);
            ctrl.$fieldHash = Math.random().toString(36).substr(2, 15);
        };

        this.deleteFilterController = function (ctrl) {
            angular.forEach(filterControllers, function (fc, ind) {
                if (fc.$fieldHash === ctrl.$fieldHash){
                    filterControllers.splice(ind,1);
                }
            });
        };

        this.getFilterValue = function(){

            var filterValue = {};

            angular.forEach(filterControllers, function (fc,ind){
                if(fc.getFilterValue()){
                    angular.extend(filterValue,fc.getFilterValue());
                }
            });

            return filterValue;
        };

        this.setInitialValues = function () {
            angular.forEach(filterControllers, function (fc,ind){
                fc.setInitialValue();
            });
        };

        $rootScope.$on('editor:set_entity_type',function (event,type) {
            entityType = type;
            filterControllers = [];
        });
    }
})();

(function() {
    'use strict';

    angular
        .module('universal.editor')
        .service('RestApiService', RestApiService);

    RestApiService.$inject = ['$q', '$rootScope', '$http', 'configData', 'EditEntityStorage', '$location', '$timeout', '$state', '$httpParamSerializer', '$document'];

    function RestApiService($q, $rootScope, $http, configData, EditEntityStorage, $location, $timeout, $state, $httpParamSerializer, $document) {
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

        $rootScope.$on('editor:set_entity_type', function(event, type) {
            filterParams = undefined;
            entityType = type;
            itemsKey = "items";
            entityObject = configData.entities.filter(function(item) {
                return item.name === entityType;
            })[0];
            mixEntity = self.getMixModeByEntity();
            if (angular.isDefined(entityObject.backend.keys)) {
                itemsKey = entityObject.backend.keys.items || itemsKey;
            }
        });

        $rootScope.$on('editor:create_entity', function(event, entity) {
            self.addNewItem(entity);
        });

        $rootScope.$on('editor:update_entity', function(event, entity) {
            self.updateItem(entity);
        });

        $rootScope.$on('editor:presave_entity', function(event, entity) {
            self.presaveItem(entity);
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

        this.getItemsList = function(request) {

            var deferred = $q.defer();

            if (queryTempParams && queryTempParams.hasOwnProperty("filter")) {
                delete queryTempParams.filter;
            }

            var params = this.getQueryParams();
            var _method = 'GET';
            var _url = entityObject.backend.url;

            if (typeof request !== 'undefined') {
                params = typeof request.params !== 'undefined' ? request.params : params;
                _method = typeof request.method !== 'undefined' ? request.method : _method;
                _url = typeof request.url !== 'undefined' ? request.url : _url;
                if (request.sort !== undefined) {
                    params.sort = request.sort;
                }
            }
            queryTempParams = params;

            if (self.isProcessing) {
                return;
            }

            if ($location.search().hasOwnProperty("parent")) {
                var filterObject = {};
                filterObject[entityObject.backend.fields.parent] = $location.search().parent;
                angular.extend(params, { filter: JSON.stringify(filterObject) });
            }

            if (filterParams) {
                if (params.hasOwnProperty("filter")) {
                    var tempFilter = JSON.parse(params.filter);
                    angular.extend(tempFilter, filterParams);
                    params.filter = JSON.stringify(tempFilter);
                } else {
                    params.filter = JSON.stringify(filterParams);
                }
            }

            if (mixEntity.existence) {
                params = params || {};
                angular.extend(params, {
                    mixed: mixEntity.entity
                });
            }

            if (entityObject.backend.hasOwnProperty("parentField")) {
                params = params || {};

                if (!params.hasOwnProperty("filter")) {
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

            if (params.hasOwnProperty("filter")) {
                delete params.root;
            }

            //if(Object.keys(params).length === 0){
            //   params = undefined;
            // }

            self.isProcessing = true;

            var expandFields = [];

            angular.forEach(entityObject.tabs, function(tab) {
                angular.forEach(tab.fields, function(field) {
                    if (field.hasOwnProperty("expandable") && field.expandable === true) {
                        expandFields.push(field.name);
                    }
                });
            });

            if (expandFields.length > 0) {
                params.expand = expandFields.join(',');
            }

            $http({
                method: _method,
                url: _url,
                params: params
            }).then(function(response) {
                self.isProcessing = false;
                //console.log("response list record:");
                //console.log(response);
                if (response.data[itemsKey].length === 0) {
                    $rootScope.$broadcast("editor:parent_empty");
                    $rootScope.$broadcast('editor:items_list', response.data);
                    deferred.resolve();
                } else {
                    $rootScope.$broadcast('editor:items_list', response.data);
                    deferred.resolve();
                }
            }, function(reject) {
                self.isProcessing = false;
                deferred.reject();
            });

            return deferred.promise;
        };

        this.getItemsListWithParams = function(params) {

            if (self.isProcessing) {
                return;
            }

            if (mixEntity.existence) {
                params = params || {};
                if (typeof params == 'object') {
                    angular.extend(params, {
                        mixed: mixEntity.entity
                    });
                } else {
                    params = params + '&mixed=' + mixEntity.entity;
                }
            }

            if (entityObject.backend.fields.parent) {
                params = params || {};

                if (!params.hasOwnProperty("filter")) {
                    if (typeof params == 'object') {
                        angular.extend(params, {
                            root: true
                        });
                    } else {
                        params = params + '&root=true';
                    }

                }
            }

            if (typeof params == 'object') {
                params = $httpParamSerializer(params);
            }

            self.isProcessing = true;

            $http({
                method: 'GET',
                url: entityObject.backend.url + '?' + params
            }).then(function(response) {
                self.isProcessing = false;
                $rootScope.$broadcast('editor:items_list', response.data);
                if ($location.search().hasOwnProperty("id")) {
                    self.getItemById($location.search().id);
                }
            }, function(reject) {
                self.isProcessing = false;
            });
        };

        this.getData = function(api, params) {
            return $http({
                method: 'GET',
                url: api,
                params: params
            });
        };

        this.addNewItem = function(arrItem) {
            var item = arrItem[0];
            var request = arrItem[1];

            if (self.isProcessing) {
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
            }).then(function(response) {
                $rootScope.$broadcast("editor:presave_entity_created", response.data[idField]);
                self.isProcessing = false;
                $rootScope.$broadcast("uploader:remove_session");
                $rootScope.$broadcast("editor:entity_success");
                var params = {};
                if ($location.search().parent) {
                    params.parent = $location.search().parent;
                }
                if ($state.params.back) {
                    params.type = $state.params.back;
                }
                $state.go('editor.type.list', params, { reload: true });
            }, function(reject) {
                if (reject.data.error && reject.data.hasOwnProperty("data") && reject.data.data.length > 0) {
                    angular.forEach(reject.data.data, function(err) {
                        if (err.hasOwnProperty("field")) {
                            $rootScope.$broadcast("editor:api_error_field_" + err.field, err.message);
                            if (err.hasOwnProperty("fields")) {
                                angular.forEach(err.fields, function(innerError, key) {
                                    $rootScope.$broadcast("editor:api_error_field_" + err.field + "_" + key + "_" + innerError.field, innerError.message);
                                });
                            }
                        }
                    });
                }
                self.isProcessing = false;
            });
        };

        this.updateItem = function(arrItem) {
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
            }).then(function(response) {
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
                $state.go('editor.type.list', params, { reload: true });
            }, function(reject) {
                if (reject.data.error && reject.data.hasOwnProperty('data') && reject.data.data.length > 0) {
                    angular.forEach(reject.data.data, function(err) {
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
                self.isProcessing = false;
            });
        };

        this.presaveItem = function(arrItem) {
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
            }).then(function(response) {
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
                self.isProcessing = false;
            });
        };

        this.getItemById = function(id, par) {

            var qParams = typeof par !== "undefined" ? par : {};
            if (self.isProcessing) {
                return;
            }

            self.isProcessing = true;

            var expandFields = [];
            var expandParam = "";

            angular.forEach(entityObject.tabs, function(tab) {
                angular.forEach(tab.fields, function(field) {
                    if (field.hasOwnProperty("expandable") && field.expandable === true) {
                        expandFields.push(field.name);
                    }
                });
            });

            if (expandFields.length > 0) {
                qParams.expand = expandFields.join(',');
            }

            $http({
                method: 'GET',
                url: entityObject.backend.url + '/' + id,
                params: qParams
            }).then(function(response) {
                self.isProcessing = false;
                EditEntityStorage.setSourceEntity(response.data);
            }, function(reject) {
                self.isProcessing = false;
            });
        };

        this.deleteItemById = function(id, request, type) {

            var par = {};

            if (self.isProcessing) {
                return;
            }

            self.isProcessing = true;
            var _method = 'DELETE';
            var _url = entityObject.backend.url + '/' + id;

            if (type === 'mix') {
                var config = configData.entities.filter(function(item) {
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
                method: _method,
                url: _url,
                params: par
            }).then(function(response) {
                self.isProcessing = false;
                self.setQueryParams({});
                self.setFilterParams({});
                $rootScope.$broadcast("editor:entity_success_deleted");
                var params = {};
                if ($location.search().parent) {
                    params.parent = $location.search().parent;
                }
                if ($state.params.back) {
                    params.type = $state.params.back;
                }
                $state.go('editor.type.list', params, { reload: true });
            }, function(reject) {
                self.isProcessing = false;
            });
        };

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

        this.contextMenuAction = function(contextItem, id) {
            var reqParams = contextItem.request.params || {};
            var data = contextItem.request.data;
            var url = contextItem.request.url.replace(":id", id);

            self.isProcessing = true;

            $http({
                method: contextItem.request.method,
                url: url,
                params: reqParams,
                data: data
            }).then(function(response) {
                self.isProcessing = false;
                self.getItemsList();
            }, function(reject) {
                self.isProcessing = false;
            });
        };


        this.loadChilds = function(entityId, request) {
            $location.search("parent", entityId);

            self.getItemsList(request).then(function(response) {
                $timeout(function() {
                    $location.search("parent", entityId);
                }, 0);
            });

        };

        this.loadParent = function(entityId) {
            entityId = typeof entityId !== 'undefined' ? entityId : undefined;

            if (entityId) {
                self.isProcessing = true;

                $http({
                    method: 'GET',
                    url: entityObject.backend.url + "/" + entityId
                }).then(function(response) {
                    var parentId;
                    if (response.data[entityObject.backend.fields.parent] !== null) {
                        self.isProcessing = false;
                        parentId = response.data[entityObject.backend.fields.parent];
                        $location.search("parent", parentId);
                        self.getItemsList();
                    } else {
                        self.isProcessing = false;
                        $location.search("parent", null);
                        self.getItemsList();
                    }
                }, function(reject) {
                    self.isProcessing = false;
                });
            } else {
                self.isProcessing = true;

                $location.search("parent", null);
                self.getItemsList();
            }
        };

        this.setEntityType = function(type) {
            entityType = type;
            entityObject = configData.entities.filter(function(item) {
                return item.name === entityType;
            })[0];
            mixEntity = self.getMixModeByEntity();
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

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonAddController',EditorButtonAddController);

    EditorButtonAddController.$inject = ['$rootScope','$scope','$element','EditEntityStorage','RestApiService'];

    function EditorButtonAddController($rootScope,$scope,$element,EditEntityStorage,RestApiService){
        var vm = this;

        vm.label = $scope.buttonLabel;
        vm.processing = RestApiService.isProcessing;

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        $scope.$on('$destroy', function () {
            watchRest();
        });

        $element.bind("click", function () {
            if(vm.processing){
                return;
            }
            EditEntityStorage.editEntityUpdate("create");
        });
    }
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonAdd',editorButtonAdd);

    editorButtonAdd.$inject = ['$templateCache','RestApiService'];

    function editorButtonAdd($templateCache,RestApiService){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonAdd/editorButtonAdd.html'),
            scope : {
                entityId : "@",
                buttonLabel : "@",
                buttonParams : "@"
            },
            controller : 'EditorButtonAddController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            scope.editor = RestApiService.getEntityType();
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorButtonAdd/editorButtonAdd.html',
    '\n' +
    '<button data-ng-class="{ processing : vm.processing}" class="btn btn-md btn-success">{{vm.label}}\n' +
    '    <div data-ng-show="vm.processing" class="loader-search-wrapper">\n' +
    '        <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '    </div>\n' +
    '</button>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonCreateController',EditorButtonCreateController);

    EditorButtonCreateController.$inject = ['$scope','$element','EditEntityStorage','$location','$state'];

    function EditorButtonCreateController($scope,$element,EditEntityStorage,$location,$state){
        var vm = this;

        vm.label = $scope.buttonLabel;

        $element.bind("click", function () {
            if($location.search().hasOwnProperty("id")){
                $location.search("id",null);
            }

            var parentId = $location.search().parent !== '' ? $location.search().parent : undefined;

            var newPageType = $scope.type || $state.params.type;
            var newPageBack = $state.params.type || $scope.type;

            $state.go('editor.type.new',{
                parent: parentId,
                type: newPageType,
                back: newPageBack
            });
        });
    }
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonCreate',editorButtonCreate);

    editorButtonCreate.$inject = ['$templateCache','RestApiService'];

    function editorButtonCreate($templateCache,RestApiService){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonCreate/editorButtonCreate.html'),
            scope : {
                buttonLabel : "@",
                buttonParams : "@",
                type : '='
            },
            controller : 'EditorButtonCreateController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorButtonCreate/editorButtonCreate.html',
    '\n' +
    '<button class="btn btn-lg btn-success">{{vm.label}}</button>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonDeleteController',EditorButtonDeleteController);

    EditorButtonDeleteController.$inject = ['$scope','$element','RestApiService'];

    function EditorButtonDeleteController($scope,$element,RestApiService){
        var vm = this;
        var params;
        var request;
        try {
            request = JSON.parse($scope.buttonRequest);
            params = request.params;
        } catch(e){

        }
        vm.buttonClass = $scope.buttonClass;
        vm.label = $scope.buttonLabel;
        vm.entityId = $scope.entityId;
        vm.processing = RestApiService.isProcessing;

        var watchEntityId = $scope.$watch('entityId', function (entityId) {
            vm.entityId = entityId;
        });

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        $scope.$on('$destroy', function () {
            watchEntityId();
            watchRest();
        });

        $element.bind("click", function () {
            if(vm.processing){
                return;
            }
            if(confirm("Удалить запись «" + vm.entityId + "»?")){
                RestApiService.deleteItemById(vm.entityId,request, $scope.entityType);
            }
        });
    }
})();
(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonDelete',editorButtonDelete);

    editorButtonDelete.$inject = ['$templateCache','RestApiService'];

    function editorButtonDelete($templateCache,RestApiService){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonDelete/editorButtonDelete.html'),
            scope : {
                entityId : "@",
                buttonLabel : "@",
                buttonRequest : "@",
                entityName : "@",
                buttonClass: "@",
                entityType: "@"
            },
            controller : 'EditorButtonDeleteController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            scope.editor = RestApiService.getEntityType();
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorButtonDelete/editorButtonDelete.html',
    '\n' +
    '<div>\n' +
    '    <button data-ng-class="{ processing : vm.processing}" data-ng-if="vm.buttonClass == \'editor\'" class="btn btn-md btn-success">{{vm.label}}\n' +
    '        <div data-ng-show="vm.processing" class="loader-search-wrapper">\n' +
    '            <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '        </div>\n' +
    '    </button>\n' +
    '    <button data-ng-if="vm.buttonClass == \'context\'" class="editor-action-button">{{vm.label}}</button>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonDownloadController',EditorButtonDownloadController);

    EditorButtonDownloadController.$inject = ['$rootScope','$scope','$element','RestApiService','configData', '$window'];

    function EditorButtonDownloadController($rootScope,$scope,$element,RestApiService,configData, $window){
        var vm = this;
        var params;
        var request;
        try {
            request = JSON.parse($scope.buttonRequest);
        } catch(e){

        }
        vm.label = $scope.buttonLabel;
        vm.class = $scope.buttonClass;
        $element.bind("click", function () {
            var url = request.url;
            for (var key in $scope.itemValue) {
                if ($scope.itemValue[key]) {
                    url = url.replace(":" + key, $scope.itemValue[key]);
                }
            }            
            location.assign(url);
        });
}})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonDownload',editorButtonDownload);

    editorButtonDownload.$inject = ['$templateCache','RestApiService','configData'];

    function editorButtonDownload($templateCache,RestApiService,configData){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonDownload/editorButtonDownload.html'),
            scope : {
                itemValue : "=",
                buttonLabel : "@",
                buttonRequest : "@",
                index: "@",
                buttonClass: "@"
            },
            controller : 'EditorButtonDownloadController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            scope.editor = RestApiService.getEntityType();
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorButtonDownload/editorButtonDownload.html',
    '\n' +
    '<div>\n' +
    '    <button data-ng-if="vm.class == \'editor\'" class="btn btn-md btn-success">{{vm.label}}</button>\n' +
    '    <button data-ng-if="vm.class == \'header\'" class="btn btn-lg btn-success">{{vm.label}}</button>\n' +
    '    <button data-ng-if="vm.class == \'context\'" class="editor-action-button">{{vm.label}}</button>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonEditController',EditorButtonEditController);

    EditorButtonEditController.$inject = ['$scope','$element','RestApiService','$state', '$location'];

    function EditorButtonEditController($scope,$element,RestApiService,$state, $location){
        var vm = this;
        var params;
        var request;


        try {
            request = JSON.parse($scope.buttonRequest);
            params = request.params;
        } catch(e){

        }

        vm.processing = RestApiService.isProcessing;

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        $scope.$on('$destroy', function () {
            watchRest();
        });

        vm.label = $scope.buttonLabel;


        $element.bind("click", function () {
            if(vm.processing){
                return;
            }

            var stateParams = {
                uid : $scope.entityId
            };

            var stateOptions = {};
            
            if($scope.entitySubtype){
                stateParams.type = $scope.entitySubtype;
                stateParams.back = $state.params.type;
                stateOptions.reload = true;
            } else {
                stateParams.type = $state.params.type;
            }
            if ($location.search().parent) {
                stateParams.parent = $location.search().parent;
            }

            $state.go('editor.type.entity',stateParams, stateOptions);
        });
    }
})();
(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonEdit',editorButtonEdit);

    editorButtonEdit.$inject = ['$templateCache','RestApiService'];

    function editorButtonEdit($templateCache,RestApiService){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonEdit/editorButtonEdit.html'),
            scope : {
                entityId : "@",
                buttonLabel : "@",
                buttonRequest : "@",
                entitySubtype : "@"
            },
            controller : 'EditorButtonEditController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, editorCtrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorButtonEdit/editorButtonEdit.html',
    '\n' +
    '<button data-ng-class="{ processing : vm.processing}" class="editor-action-button">{{vm.label}}\n' +
    '    <div data-ng-show="vm.processing" class="loader-search-wrapper">\n' +
    '        <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '    </div>\n' +
    '</button>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonOpenController',EditorButtonOpenController);

    EditorButtonOpenController.$inject = ['$rootScope','$scope','$element','RestApiService'];

    function EditorButtonOpenController($rootScope,$scope,$element,RestApiService){
        var vm = this;
        var params;
        var request;

        try {
            request = JSON.parse($scope.buttonRequest);
            params = request.params;
        } catch(e){

        }

        vm.label = $scope.buttonLabel;

        vm.processing = RestApiService.isProcessing;

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        $scope.$on('$destroy', function () {
            watchRest();
        });

        $element.bind("click", function () {
            if(vm.processing){
                return;
            }
            RestApiService.loadChilds($scope.entityId,request);
        });
    }
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonOpen',editorButtonOpen);

    editorButtonOpen.$inject = ['$templateCache','RestApiService'];

    function editorButtonOpen($templateCache,RestApiService){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonOpen/editorButtonOpen.html'),
            scope : {
                entityId : "@",
                buttonLabel : "@",
                buttonRequest : "@"
            },
            controller : 'EditorButtonOpenController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            scope.editor = RestApiService.getEntityType();
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorButtonOpen/editorButtonOpen.html',
    '\n' +
    '<button data-ng-class="{ processing : vm.processing}" class="editor-action-button">{{vm.label}}\n' +
    '    <div data-ng-show="vm.processing" class="loader-search-wrapper">\n' +
    '        <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '    </div>\n' +
    '</button>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonPresaveController',EditorButtonPresaveController);

    EditorButtonPresaveController.$inject = ['$scope','$element','$rootScope','EditEntityStorage','RestApiService'];

    function EditorButtonPresaveController($scope,$element,$rootScope,EditEntityStorage,RestApiService){
        var vm = this;
        var params;
        var request;


        try {
            request = JSON.parse($scope.buttonRequest);
            params = request.params;
        } catch(e){

        }

        vm.label = $scope.buttonLabel;
        vm.entityId = $scope.entityId;
        vm.processing = RestApiService.isProcessing;

        var watchEntityId = $scope.$watch('entityId', function (entityId) {
            vm.entityId = entityId;
        });

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        $scope.$on('$destroy', function () {
            watchEntityId();
            watchRest();
        });

        $element.bind("click", function () {
            if(vm.processing){
                return;
            }
            RestApiService.editedEntityId = vm.entityId;
            //TODO Call another method
            EditEntityStorage.editEntityPresave(request);
        });
    }
})();
(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonPresave',editorButtonPresave);

    editorButtonPresave.$inject = ['$templateCache','RestApiService'];

    function editorButtonPresave($templateCache,RestApiService){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonPresave/editorButtonPresave.html'),
            scope : {
                entityId : "@",
                buttonLabel : "@",
                buttonRequest : "@"
            },
            controller : 'EditorButtonPresaveController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            scope.editor = RestApiService.getEntityType();
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorButtonPresave/editorButtonPresave.html',
    '\n' +
    '<button data-ng-class="{ processing : vm.processing}" class="btn btn-md btn-success">{{vm.label}}\n' +
    '    <div data-ng-show="vm.processing" class="loader-search-wrapper">\n' +
    '        <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '    </div>\n' +
    '</button>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonTargetBlankController',EditorButtonTargetBlankController);

    EditorButtonTargetBlankController.$inject = ['$rootScope','$scope','$element','RestApiService','configData', '$http'];

    function EditorButtonTargetBlankController($rootScope, $scope, $element, RestApiService, configData, $http) {
        var vm = this;
        var params;
        var request;
        try {
            request = JSON.parse($scope.buttonRequest);
        } catch(e){

        }
        vm.class = $scope.buttonClass;
        vm.label = $scope.buttonLabel;
        $element.bind("click", function () {
            var url = request.url;
            for (var key in $scope.itemValue) {
                if ($scope.itemValue[key]) {
                    url = url.replace(":" + key, $scope.itemValue[key]);
                }
            }
            window.open(url, '_blank');
            
        }); 
    }
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonTargetBlank',editorButtonTargetBlank);

    editorButtonTargetBlank.$inject = ['$templateCache','RestApiService','configData'];

    function editorButtonTargetBlank($templateCache,RestApiService,configData){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonTargetBlank/editorButtonTargetBlank.html'),
            scope : {
                itemValue : "=",
                buttonLabel : "@",
                buttonRequest : "@",
                index: "@",
                buttonClass: "@"
            },
            controller : 'EditorButtonTargetBlankController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            scope.editor = RestApiService.getEntityType();
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorButtonTargetBlank/editorButtonTargetBlank.html',
    '\n' +
    '<div>\n' +
    '    <button data-ng-if="vm.class == \'editor\'" class="btn btn-md btn-success">{{vm.label}}</button>\n' +
    '    <button data-ng-if="vm.class == \'header\'" class="btn btn-lg btn-success">{{vm.label}}</button>\n' +
    '    <button data-ng-if="vm.class == \'context\'" class="editor-action-button">{{vm.label}}</button>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonUpdateController',EditorButtonUpdateController);

    EditorButtonUpdateController.$inject = ['$scope','$element','$rootScope','EditEntityStorage','RestApiService'];

    function EditorButtonUpdateController($scope,$element,$rootScope,EditEntityStorage,RestApiService){
        var vm = this;

        vm.label = $scope.buttonLabel;
        vm.entityId = $scope.entityId;
        vm.processing = RestApiService.isProcessing;

        var watchEntityId = $scope.$watch('entityId', function (entityId) {
            vm.entityId = entityId;
        });

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        $scope.$on('$destroy', function () {
            watchEntityId();
            watchRest();
        });

        $element.bind("click", function () {
            if(vm.processing){
                return;
            }
            RestApiService.editedEntityId = vm.entityId;
            EditEntityStorage.editEntityUpdate("update");
        });
    }
})();
(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorButtonUpdate',editorButtonUpdate);

    editorButtonUpdate.$inject = ['$templateCache','RestApiService'];

    function editorButtonUpdate($templateCache,RestApiService){
        return {
            restrict : "A",
            replace : true,
            template : $templateCache.get('module/directives/editorButtonUpdate/editorButtonUpdate.html'),
            scope : {
                entityId : "@",
                buttonLabel : "@",
                buttonParams : "@"
            },
            controller : 'EditorButtonUpdateController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            scope.editor = RestApiService.getEntityType();
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorButtonUpdate/editorButtonUpdate.html',
    '\n' +
    '<button data-ng-class="{ processing : vm.processing}" class="btn btn-md btn-success">{{vm.label}}\n' +
    '    <div data-ng-show="vm.processing" class="loader-search-wrapper">\n' +
    '        <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '    </div>\n' +
    '</button>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldArrayController',EditorFieldArrayController);

    EditorFieldArrayController.$inject = ['$scope','$rootScope','configData','EditEntityStorage','$timeout','ArrayFieldStorage'];

    function EditorFieldArrayController($scope,$rootScope,configData,EditEntityStorage,$timeout,ArrayFieldStorage){
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;

        if($scope.parentField){
            if($scope.parentFieldIndex){
                fieldErrorName = $scope.parentField + "_" + $scope.parentFieldIndex + "_" + $scope.fieldName;
            } else {
                fieldErrorName = $scope.parentField + "_" + $scope.fieldName;
            }
        } else {
            fieldErrorName = $scope.fieldName;
        }

        vm.fieldName = $scope.field.name;
        vm.fieldDisplayName = $scope.field.label;
        vm.hint = $scope.field.hint || false;
        vm.innerFields = $scope.field.fields;
        vm.fieldsArray = [];

        vm.multiple = $scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true;

        EditEntityStorage.addFieldController(this);

        this.getFieldValue = function () {


            var field = {};

            field[vm.fieldName] = vm.fieldsArray.length  > 0 ? [] : "";

            return field;

        };

        this.getInitialValue = function () {

            var field = {};

            field[vm.fieldName] = [];

            return field;
        };

        $scope.$on('editor:entity_loaded', function (event, data) {

            if(vm.multiple){
                if(data.editorEntityType === "new"){
                    vm.fieldsArray = [];
                    ArrayFieldStorage.setArrayField(vm.fieldName,[]);
                } else {
                    ArrayFieldStorage.setArrayField(vm.fieldName,JSON.parse(JSON.stringify(data[$scope.field.name])));
                    vm.fieldsArray = data[$scope.field.name];
                }
            }
        });

        $scope.$on("editor:api_error_field_"+ fieldErrorName, function (event,data) {
            if(angular.isArray(data)){
                angular.forEach(data, function (error) {
                    if(vm.error.indexOf(error) < 0){
                        vm.error.push(error);
                    }
                });
            } else {
                if(vm.error.indexOf(data) < 0){
                    vm.error.push(data);
                }
            }
        });

        vm.removeItem = function (ind) {
            var tmpArray = vm.fieldsArray;
            vm.fieldsArray = [];
            $timeout(function () {
                ArrayFieldStorage.removeFieldIndex(vm.fieldName,ind);
                tmpArray.splice(ind,1);
                vm.fieldsArray = tmpArray;
            },0);
        };

        vm.addItem = function () {
            vm.fieldsArray.push("");
        };
    }
})();
(function () {
    'use strict';

    /**
     * @desc Array-type field.
     * @example <div editor-field-array=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldArray',editorFieldArray);

    editorFieldArray.$inject = ['$templateCache'];

    function editorFieldArray($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            transclude : true,
            template : $templateCache.get('module/directives/editorFieldArray/editorFieldArray.html'),
            controller: 'EditorFieldArrayController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldArray/editorFieldArray.html',
    '\n' +
    '<div class="editor-field-array">\n' +
    '    <div class="field-name-label label-array">\n' +
    '        <div data-ng-if="vm.hint" class="field-hint">\n' +
    '            <div class="hint-text">{{vm.hint}}</div>\n' +
    '        </div>{{vm.fieldDisplayName}}\n' +
    '    </div>\n' +
    '    <div class="field-array-wrapper">\n' +
    '        <div data-ng-if="vm.multiple">\n' +
    '            <div data-ng-repeat="array in vm.fieldsArray track by $index" data-ng-init="outerIndex = $index" class="item-array-wrapper">\n' +
    '                <div data-ng-repeat="field in vm.innerFields" data-field-wrapper="" data-field-name="{{field.name}}" data-parent-field="{{vm.fieldName}}" data-parent-field-index="{{outerIndex}}"></div>\n' +
    '                <div class="row">\n' +
    '                    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 col-lg-offset-6 col-md-offset-6 col-sm-offset-6 col-xs-offset-6">\n' +
    '                        <div data-ng-click="vm.removeItem(outerIndex)" data-ng-if="!vm.readonly" class="btn btn-primary btn-xs">{{\'BUTTON.DELETE\' | translate}}</div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="row">\n' +
    '                <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6 col-lg-offset-6 col-md-offset-6 col-sm-offset-6 col-xs-offset-6">\n' +
    '                    <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-if="!vm.multiple">\n' +
    '            <div data-ng-repeat="field in vm.innerFields" data-field-wrapper="" data-field-name="{{field.name}}" data-parent-field="{{vm.fieldName}}"></div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldAutocompleteController',EditorFieldAutocompleteController);

    EditorFieldAutocompleteController.$inject = ['$scope','$element','EditEntityStorage','RestApiService','$timeout','ArrayFieldStorage'];

    function EditorFieldAutocompleteController($scope,$element,EditEntityStorage,RestApiService,$timeout,ArrayFieldStorage){
        /* jshint validthis: true */
        var vm = this,
            inputTimeout;
        var fieldErrorName;

        if($scope.parentField){
            if($scope.parentFieldIndex){
                fieldErrorName = $scope.parentField + "_" + $scope.parentFieldIndex + "_" + $scope.fieldName;
            } else {
                fieldErrorName = $scope.parentField + "_" + $scope.fieldName;
            }
        } else {
            fieldErrorName = $scope.fieldName;
        }
        var possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);

        var remote = $scope.field.valuesRemote;
        vm.field_id = "id";
        vm.field_search = "title";
        if (remote) {
            if(remote.fields){
                if (remote.fields.value) {
                    vm.field_id = remote.fields.value;
                }
                if (remote.fields.label) {
                    vm.field_search = remote.fields.label;
                } else {
                    vm.field_search = vm.field_id;
                }
            }
        }

        vm.cols = $scope.field.width;
        vm.classWidth = 'col-lg-2 col-md-2 col-sm-3 col-xs-3';
        if (!!vm.cols) {
            if (vm.cols > 6) {
                vm.cols = 6;
            }
            if (vm.cols < 1) {
                vm.cols = 1;
            }
            vm.classWidth = 'col-lg-' + vm.cols + ' col-md-' + vm.cols + ' col-sm-' + vm.cols + ' col-xs-' + vm.cols;
        }

        vm.fieldName = $scope.field.name;
        vm.readonly = $scope.field.readonly || false;
        $scope.$parent.vm.error = [];
        vm.selectedValues = [];
        vm.inputValue = "";
        vm.possibleValues = [];
        vm.activeElement = 0;
        vm.preloadedData = false;
        vm.parentFieldIndex = $scope.parentFieldIndex || false;
        vm.searching = false;
        vm.maxItemsCount = $scope.field.maxItems || Number.POSITIVE_INFINITY;
        vm.minCount = $scope.field.minCount || 2;
        vm.sizeInput = 1;
        vm.classInput = {'width': '1px'};
        vm.showPossible = false;
        vm.placeholder = '';

        if ($scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true){
            vm.multiple = true;
            vm.fieldValue = [];
            if ($scope.field.multiname || angular.isString($scope.field.multiname)) {
                vm.multiname = ('' + $scope.field.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = undefined;
            vm.classInput.width = '99%';
            vm.classInput['padding-right'] = '25px';
        }

        if(vm.parentFieldIndex){
            if(vm.multiple){
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue($scope.parentField,$scope.parentFieldIndex,$scope.field.name), function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue($scope.parentField,$scope.parentFieldIndex,$scope.field.name) || vm.fieldValue;
            }
            vm.preloadedData = false;
            loadValues();
        }

        EditEntityStorage.addFieldController(this);

        $element.find("input").bind("keydown", function (event) {
            switch(event.which){
                case 13:
                    event.preventDefault();
                    if(vm.possibleValues.length < 1){
                        break;
                    }

                    $timeout(function () {
                        vm.addToSelected(event, vm.possibleValues[vm.activeElement]);
                    },0);

                    break;
                case 40:
                    event.preventDefault();
                    if(vm.possibleValues.length < 1){
                        break;
                    }

                    possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);

                    if(vm.activeElement < vm.possibleValues.length -1){
                        $timeout(function () {
                            vm.activeElement++;
                        },0);

                        $timeout(function () {
                            var activeTop  = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
                                activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
                                wrapperScroll = possibleValues[0].scrollTop,
                                wrapperHeight = possibleValues[0].clientHeight;

                            if (activeTop >= (wrapperHeight + wrapperScroll - activeHeight)) {
                                possibleValues[0].scrollTop += activeHeight + 1;
                            }
                        },1);
                    }
                    break;
                case 38:
                    event.preventDefault();
                    if(vm.possibleValues.length < 1){
                        break;
                    }

                    possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);

                    if(vm.activeElement > 0){
                        $timeout(function () {
                            vm.activeElement--;
                        },0);

                        $timeout(function () {
                            var activeTop  = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
                                activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
                                wrapperScroll = possibleValues[0].scrollTop,
                                wrapperHeight = possibleValues[0].clientHeight;

                            if (activeTop < wrapperScroll) {
                                possibleValues[0].scrollTop -= activeHeight + 1;
                            }
                        },1);
                    }
                    break;
            }
        });

        this.getFieldValue = function () {

            var field = {};
            var wrappedFieldValue;

              if(vm.multiname){
                  wrappedFieldValue = [];
                  angular.forEach(vm.selectedValues, function (valueItem) {
                      var tempItem = {};
                      tempItem[vm.multiname] = valueItem[vm.field_id];
                      wrappedFieldValue.push(tempItem);
                  });
              } else if (vm.multiple) {
                wrappedFieldValue = [];
                angular.forEach(vm.selectedValues, function (valueItem) {
                    wrappedFieldValue.push(valueItem[vm.field_id]);
                });
              } else {
                  wrappedFieldValue = vm.selectedValues.length > 0 ? vm.selectedValues[0][vm.field_id] : "";
              }
            if($scope.parentField){
                if(vm.parentFieldIndex){
                    field[$scope.parentField] = [];
                    field[$scope.parentField][vm.parentFieldIndex] = {};
                    field[$scope.parentField][vm.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = wrappedFieldValue;
                }
            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }
            return field;
        };

        this.getInitialValue = function () {

            var field = {};

            if($scope.parentField){
                if(vm.multiple){
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = [];
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = undefined;
                }
            } else {
                if(vm.multiple){
                    field[vm.fieldName] = [];
                } else {
                    field[vm.fieldName] = undefined;
                }
            }

            return field;
        };

        function clear() {
            if ($scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true) {
                vm.fieldValue = [];
            } else {
                vm.fieldValue = undefined;
            }
            $element.find('.autocomplete-field-search').removeClass('hidden');
            vm.inputValue = "";
            vm.sizeInput = 1;
            vm.selectedValues = [];
            vm.placeholder = '';

        }

        $scope.$on('editor:entity_loaded', function (event, data) {
            vm.preloadedData = false;
            $element.find('.autocomplete-field-search').removeClass('hidden');
            vm.inputValue = "";
            vm.selectedValues = [];
            vm.placeholder = '';

            //-- functional for required fields
            if ($scope.field.requiredField) {
                $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField($scope.field.requiredField);
                    var result = false;
                    var endRecursion = false;
                    (function (value) {
                        var keys = Object.keys(value);
                        for (var i = keys.length; i--;) {
                            var propValue = value[keys[i]];
                            if (propValue !== null && propValue !== undefined && propValue !== "") {
                                if (angular.isObject(propValue) && !endRecursion) {
                                    arguments.callee(propValue);
                                }
                                result = true;
                                endRecursion = true;
                            }
                        }
                    })(f_value);
                    return result;
                }, function (value) {
                    if (!value) {
                        clear();
                        vm.readonly = true;
                    } else {
                        vm.readonly = $scope.field.readonly || false;
                    }
                }, true);
            }



            if( data.editorEntityType === 'new' ){
                if(!!$scope.field.defaultValue){
                    vm.fieldValue = vm.multiple ? [$scope.field.defaultValue] : $scope.field.defaultValue;
                    loadValues();
                }else{
                    vm.fieldValue = vm.multiple ? [] : undefined;
                }
                if(data.hasOwnProperty($scope.fieldName)) {
                    vm.fieldValue = data[$scope.fieldName];
                    loadValues();                                        
                }
                vm.sizeInput = 1;
                vm.preloadedData = true;
                return;
            }


            if(!$scope.parentField){
                if(!vm.multiple){
                    vm.fieldValue = data[$scope.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            } else {
                if(!vm.multiple){
                    vm.fieldValue = data[$scope.parentField][$scope.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            }

            loadValues();
        });

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if(vm.parentFieldIndex){
                ArrayFieldStorage.fieldDestroy($scope.parentField,$scope.parentFieldIndex,$scope.field.name,vm.fieldValue);
            }
        });

        $scope.$on("editor:api_error_field_"+ fieldErrorName, function (event,data) {
            if(angular.isArray(data)){
                angular.forEach(data, function (error) {
                    if($scope.$parent.vm.error.indexOf(error) < 0){
                        $scope.$parent.vm.error.push(error);
                    }
                });
            } else {
                if($scope.$parent.vm.error.indexOf(data) < 0){
                    $scope.$parent.vm.error.push(data);
                }
            }
        });

        $scope.$watch(function () {
            return vm.inputValue;
        }, function (newValue) {

            if(inputTimeout) {
              $timeout.cancel(inputTimeout);
            }
            vm.showPossible = true;
            vm.possibleValues = [];
            if (vm.multiple) {
                vm.sizeInput = newValue.length || 1;
                if (vm.sizeInput === 1 && (newValue.length != 1)) {
                    vm.classInput.width = '1px';
                } else {
                    vm.classInput.width = 'initial';
                }
            }
            inputTimeout = $timeout(function(){
                autocompleteSearch(newValue);
            },300);
        },true);

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            $scope.$parent.vm.error = [];
        });

        /* PUBLIC METHODS */

        vm.addToSelected = function (event, obj) {
            if (!vm.multiple) {
                vm.selectedValues = [];
                vm.placeholder = obj[vm.field_search];
            }
            vm.selectedValues.push(obj);
            $element.find('.autocomplete-field-search').removeClass('hidden');
            vm.inputValue = "";
            vm.sizeInput = 1;
            vm.possibleValues = [];
            if (!vm.multiple) {
                event.stopPropagation();
            }
        };

        vm.removeFromSelected = function (event, obj) {
            angular.forEach(vm.selectedValues, function (val,key) {
                if(val[vm.field_id] == obj[vm.field_id]){
                    vm.selectedValues.splice(key,1);
                    if (!vm.multiple) {
                        vm.placeholder = '';
                    }
                }
            });
        };

        /* PRIVATE METHODS */

        function autocompleteSearch(searchString){

            $scope.$parent.vm.error = [];

            if(searchString === "" || searchString.length <= vm.minCount){
                return;
            }
            vm.searching = true;
            if ($scope.field.hasOwnProperty("values")) {
                angular.forEach($scope.field.values, function (v,key) {
                    var obj = {};
                    if (angular.isArray($scope.field.values)) {
                        obj[vm.field_id] = v;
                    } else {
                        obj[vm.field_id] = key;
                    }
                    obj[vm.field_search] = v;
                    if (containsString(v,searchString) && !alreadySelected(obj)) {
                        vm.possibleValues.push(obj);
                    }
                });
                vm.activeElement = 0;
                vm.searching = false;
            } else {
                var urlParam = {};
                urlParam[vm.field_search] = "%" + searchString + "%";

                RestApiService
                    .getUrlResource($scope.field.valuesRemote.url + "?filter=" + JSON.stringify(urlParam))
                    .then(function (response){
                        angular.forEach(response.data.items, function (v) {
                            if(!alreadySelected(v) && !alreadyInPossible(v)){
                                vm.possibleValues.push(v);
                            }
                        });
                        vm.activeElement = 0;
                        vm.searching = false;
                    }, function (reject) {
                        console.error('EditorFieldAutocompleteController: Не удалось получить значения для поля \"' + $scope.field.name + '\" с удаленного ресурса');
                        vm.searching = false;
                    });
            }
        }

        function containsString(str,search){
            return (str.toLowerCase().indexOf(search.toLowerCase()) >= 0);
        }

        function alreadyInPossible(obj){
          var inPossible = false;

          angular.forEach(vm.possibleValues,function (v) {
            if(v[vm.field_id] == obj[vm.field_id]){
              inPossible = true;
            }
          });

          return inPossible;
        }

        function alreadySelected(obj){

            var inSelected = false;

            angular.forEach(vm.selectedValues, function (v) {
                if(v[vm.field_id] == obj[vm.field_id]){
                    inSelected = true;
                }
            });

            return inSelected;
        }

        function loadValues() {
          if ($scope.field.hasOwnProperty("values")) {
              angular.forEach($scope.field.values, function (v,key) {
                  var obj = {};
                  if(Array.isArray(vm.fieldValue) && vm.fieldValue.indexOf(key) >= 0 && vm.multiple){
                      if (angular.isArray($scope.field.values)) {
                          obj[vm.field_id] = v;
                      } else {
                          obj[vm.field_id] = key;
                      }
                      obj[vm.field_search] = v;
                      vm.selectedValues.push(obj);
                  } else if (vm.fieldValue == key && !vm.multiple){
                      if (angular.isArray($scope.field.values)) {
                          obj[vm.field_id] = v;
                      } else {
                          obj[vm.field_id] = key;
                      }
                      obj[vm.field_search] = v;
                      vm.selectedValues.push(obj);
                      vm.placeholder = obj[vm.field_search];
                  }
              });
              vm.preloadedData = true;
          } else if ($scope.field.hasOwnProperty('valuesRemote')) {

              if (vm.fieldValue === undefined || vm.fieldValue === null) {
                  vm.preloadedData = true;
                  return;
              }

              var urlParam;

              if (vm.multiple && angular.isArray(vm.fieldValue) && vm.fieldValue.length > 0 ) {
                  urlParam = {};
                  urlParam[vm.field_id] = vm.fieldValue;
              } else if (!vm.multiple && vm.fieldValue !== '') {
                  urlParam = {};
                  urlParam[vm.field_id] = [];
                  urlParam[vm.field_id].push(vm.fieldValue);
              } else {
                  vm.preloadedData = true;
                  return;
              }

              RestApiService
                  .getUrlResource($scope.field.valuesRemote.url + '?filter=' + JSON.stringify(urlParam))
                  .then(function (response) {
                      angular.forEach(response.data.items, function (v) {
                          if ( Array.isArray(vm.fieldValue) &&
                              ( vm.fieldValue.indexOf(v[vm.field_id]) >= 0 || vm.fieldValue.indexOf(String(v[vm.field_id])) >= 0) &&
                              vm.multiple
                          ) {
                              vm.selectedValues.push(v);
                          } else if (vm.fieldValue == v[vm.field_id] && !vm.multiple) {
                              vm.selectedValues.push(v);
                              vm.placeholder = v[vm.field_search];
                          }
                      });
                      vm.preloadedData = true;
                  }, function (reject) {
                      vm.preloadedData = true;
                      console.error('EditorFieldAutocompleteController: Не удалось получить значения для поля \"' + $scope.field.name + '\" с удаленного ресурса');
                  });
          } else {
              vm.preloadedData = true;
              console.error('EditorFieldAutocompleteController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
          }
        }
        vm.focusPossible = function(isActive) {
            vm.isActivePossible = isActive;
            if (!vm.multiple) {
                if ($element.find('.autocomplete-item').length > 0) {
                    if (isActive){
                        $element.find('.autocomplete-field-search').removeClass('hidden');
                        $element.find('.autocomplete-item').addClass('opacity-item');
                    } else {
                        $element.find('.autocomplete-field-search').addClass('hidden');
                        $element.find('.autocomplete-item').removeClass('opacity-item');
                    }
                }
            }
        };

        vm.deleteToAutocomplete = function(event) {
            if (event.which == 8 &&
                !!vm.selectedValues &&
                !!vm.selectedValues.length &&
                !vm.inputValue &&
                vm.multiple
            ) {
                vm.removeFromSelected(event, vm.selectedValues[vm.selectedValues.length - 1]);
            }
        };
    }
})();

(function () {
    'use strict';

    /**
     * @desc Autocomplete-type field.
     * @example <div editor-field-autocomplete=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldAutocomplete',editorFieldAutocomplete);

    editorFieldAutocomplete.$inject = ['$templateCache', '$document'];

    function editorFieldAutocomplete($templateCache, $document){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldAutocomplete/editorFieldAutocomplete.html'),
            controller: 'EditorFieldAutocompleteController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){

            $document.on('click', function(event) {
                if (!elem[0].contains(event.target)) {
                    scope.$apply(function() {
                        scope.vm.showPossible = false;
                    });

                }
            });

            scope.inputFocus = function() {
                if (!scope.vm.multiple) {
                    elem.find('.autocomplete-field-search').removeClass('hidden');
                    elem.find('.autocomplete-item').addClass('opacity-item');
                }
                scope.vm.showPossible = true;
                elem.find('input')[0].focus();
            };

            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldAutocomplete/editorFieldAutocomplete.html',
    '\n' +
    '<div>\n' +
    '    <div data-ng-class="vm.classWidth">\n' +
    '        <div data-ng-show="vm.preloadedData &amp;&amp; vm.selectedValues.length &lt; vm.maxItemsCount" data-ng-class="{&quot;active&quot; : vm.isActivePossible, &quot;disabled-input&quot;: vm.readonly}" data-ng-click="inputFocus()" class="autocomplete-input-wrapper form-control">\n' +
    '            <div data-ng-repeat="acItem in vm.selectedValues" data-ng-show="vm.preloadedData" data-ng-if="vm.multiple" class="autocomplete-item">{{acItem[vm.field_search]}}<span data-ng-click="vm.removeFromSelected($event, acItem)" data-ng-if="!vm.readonly" class="remove-from-selected">×</span></div>\n' +
    '            <input type="text" ng-disabled="vm.readonly" data-ng-model="vm.inputValue" data-ng-focus="vm.focusPossible(true)" data-ng-blur="vm.focusPossible(false)" size="{{vm.sizeInput}}" data-ng-style="vm.classInput" data-ng-keydown="vm.deleteToAutocomplete($event)" placeholder="{{vm.placeholder}}" data-ng-class="!vm.isActivePossible ? &quot;color-placeholder&quot; : &quot;&quot;" class="autocomplete-field-search"/><span data-ng-if="!vm.multiple &amp;&amp; !!vm.selectedValues.length &amp;&amp; !vm.readonly" data-ng-click="vm.removeFromSelected($event, vm.selectedValues[0])" class="selecte-delete selecte-delete-autocomplete">×</span>\n' +
    '            <div data-ng-show="vm.searching" class="loader-search-wrapper">\n' +
    '                <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '            </div>\n' +
    '            <div data-ng-if="!vm.readonly &amp;&amp; (vm.possibleValues.length &gt; 0) &amp;&amp; vm.showPossible" class="possible-values possible-autocomplete active possible-bottom">\n' +
    '                <div class="possible-scroll">\n' +
    '                    <div data-ng-repeat="possible in vm.possibleValues" data-ng-mouseover="vm.activeElement = $index" data-ng-click="vm.addToSelected($event, possible)" data-ng-class="vm.activeElement == $index ? \'active\' : \'\'" class="possible-value-item">{{possible[vm.field_search]}}</div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldCheckboxController', EditorFieldCheckboxController);

    EditorFieldCheckboxController.$inject = ['$scope', 'EditEntityStorage', 'RestApiService', 'ArrayFieldStorage'];

    function EditorFieldCheckboxController($scope, EditEntityStorage, RestApiService, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;

        if ($scope.parentField) {
            if ($scope.parentFieldIndex) {
                fieldErrorName = $scope.parentField + "_" + $scope.parentFieldIndex + "_" + $scope.fieldName;
            } else {
                fieldErrorName = $scope.parentField + "_" + $scope.fieldName;
            }
        } else {
            fieldErrorName = $scope.fieldName;
        }
        var remote = $scope.field.valuesRemote;
        vm.field_id = "id";
        vm.field_search = "title";
        if (remote) {
            if(remote.fields){
                if (remote.fields.value) {
                    vm.field_id = remote.fields.value;
                }
                if (remote.fields.label) {
                    vm.field_search = remote.fields.label;
                }
            }
        }
        vm.fieldName = $scope.field.name;
        vm.selectedValues = [];
        vm.inputValue = "";
        vm.readonly = $scope.field.readonly || false;
        $scope.$parent.vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;

        if ($scope.field.multiname || angular.isString($scope.field.multiname)) {
            vm.multiname = ('' + $scope.field.multiname) || "value";
        }

        EditEntityStorage.addFieldController(this);

        if (vm.parentFieldIndex) {
            vm.fieldValue = [];
            var value = ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name);

            if (value) {
                if (angular.isArray(value)) {
                    angular.forEach(value, function (item) {
                        if (vm.multiname) {
                            vm.fieldValue.push(item[vm.multiname]);
                        } else {
                            vm.fieldValue.push(item);
                        }
                    });
                } else {
                    if (vm.multiname) {
                        vm.fieldValue.push(value[vm.multiname]);
                    } else {
                        vm.fieldValue.push(value);
                    }
                }
            }
        }

        /*
         * Инициализация данных при загрузке поля. Необходимая часть для полей инициализирующие данные для которых
         * хранятся удалённо.
         */

        if ($scope.field.hasOwnProperty("values")) {
            angular.forEach($scope.field.values, function (v, key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                vm.selectedValues.push(obj);
            });
        } else if ($scope.field.hasOwnProperty("valuesRemote")){
            RestApiService
                .getUrlResource($scope.field.valuesRemote.url)
                .then(function (response) {
                    angular.forEach(response.data.items, function (v) {
                        vm.selectedValues.push(v);
                    });
                }, function (reject) {
                    console.error('EditorFieldCheckboxController: Не удалось получить значения для поля \"' + $scope.field.fieldName + '\" с удаленного ресурса');
                });
        } else {
            console.error('EditorFieldCheckboxController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
        }

        /* ------- */

        this.getFieldValue = function () {
            var field = {};
            var wrappedFieldValue;

            if (vm.selectedValues.length && vm.selectedValues.length === 1) {
                wrappedFieldValue = "";
                if(angular.isUndefined(vm.fieldValue)){
                    vm.fieldValue = [];
                }
                if (vm.multiname) {
                    var tempItem = {};
                    tempItem[vm.multiname] = vm.fieldValue[0];
                    wrappedFieldValue = tempItem;
                } else {
                    wrappedFieldValue = vm.fieldValue[0];
                }
            } else if (vm.selectedValues.length && vm.selectedValues.length > 1) {
                wrappedFieldValue = [];
                if (vm.multiname) {
                    angular.forEach(vm.fieldValue, function (valueItem) {
                        var tempItem = {};
                        tempItem[vm.multiname] = valueItem;
                        wrappedFieldValue.push(tempItem);
                    });
                } else {
                    angular.forEach(vm.fieldValue, function (valueItem) {
                        wrappedFieldValue.push(valueItem);
                    });
                }
            }

            if ($scope.parentField) {
                if (vm.parentFieldIndex) {
                    field[$scope.parentField] = [];
                    field[$scope.parentField][vm.parentFieldIndex] = {};
                    field[$scope.parentField][vm.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = wrappedFieldValue;
                }

            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        };

        this.getInitialValue = function () {

            var field = {};

            if ($scope.parentField) {
                field[$scope.parentField] = {};
                field[$scope.parentField][vm.fieldName] = [];
            } else {
                field[vm.fieldName] = [];
            }

            return field;
        };

        function clear() {
            vm.fieldValue = vm.parentFieldIndex ? [] : undefined;
        }

        $scope.$on('editor:entity_loaded', function (event, data) {

            //-- functional for required fields
            if ($scope.field.requiredField) {
                $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField($scope.field.requiredField);
                    var result = false;
                    var endRecursion = false;
                    (function (value) {
                        var keys = Object.keys(value);
                        for (var i = keys.length; i--;) {
                            var propValue = value[keys[i]];
                            if (propValue !== null && propValue !== undefined && propValue !== "") {
                                if (angular.isObject(propValue) && !endRecursion) {
                                    arguments.callee(propValue);
                                }
                                result = true;
                                endRecursion = true;
                            }
                        }
                    })(f_value);
                    return result;
                }, function (value) {
                    if (!value) {
                        clear();
                        vm.readonly = true;
                    } else {
                        vm.readonly = $scope.field.readonly || false;
                    }
                }, true);
            }
            if (data.editorEntityType === "new") {
                vm.fieldValue = [];
                angular.forEach($scope.field.defaultValue, function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
                return;
            }
            if (!$scope.parentField) {
                vm.fieldValue = [];
                if (data[$scope.field.name]) {
                    if (angular.isArray(data[$scope.field.name])) {
                        angular.forEach(data[$scope.field.name], function (item) {
                            if (vm.multiname) {
                                vm.fieldValue.push(item[vm.multiname]);
                            } else {
                                vm.fieldValue.push(item);
                            }
                        });
                    } else {
                        if (vm.multiname) {
                            vm.fieldValue.push(data[$scope.field.name][vm.multiname]);
                        } else {
                            vm.fieldValue.push(data[$scope.field.name]);
                        }
                    }
                }
            } else {
                vm.fieldValue = [];
                if (data[$scope.field.name]) {
                    if (angular.isArray(data[$scope.parentField][$scope.field.name])) {
                        angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                            if (vm.multiname) {
                                vm.fieldValue.push(item[vm.multiname]);
                            } else {
                                vm.fieldValue.push(item);
                            }
                        });
                    } else {
                        if (vm.multiname) {
                            vm.fieldValue.push(data[$scope.parentField][$scope.field.name][vm.multiname]);
                        } else {
                            vm.fieldValue.push(data[$scope.parentField][$scope.field.name]);
                        }
                    }
                }
            }
        });

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy($scope.parentField, $scope.parentFieldIndex, $scope.field.name, vm.fieldValue);
            }
        });

        $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function (error) {
                    if ($scope.$parent.vm.error.indexOf(error) < 0) {
                        $scope.$parent.vm.error.push(error);
                    }
                });
            } else {
                if ($scope.$parent.vm.error.indexOf(data) < 0) {
                    $scope.$parent.vm.error.push(data);
                }
            }
        });

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            $scope.$parent.vm.error = [];
        }, true);
    }
})();
(function () {
    'use strict';

    /**
     * @desc Checkbox-type field.
     * @example <div editor-field-checkbox=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldCheckbox',editorFieldCheckbox);

    editorFieldCheckbox.$inject = ['$templateCache'];

    function editorFieldCheckbox($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldCheckbox/editorFieldCheckbox.html'),
            controller: 'EditorFieldCheckboxController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldCheckbox/editorFieldCheckbox.html',
    '\n' +
    '<div>\n' +
    '    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">\n' +
    '        <div data-ng-repeat="item in vm.selectedValues" data-ng-class="vm.readonly ? \'disabled\' : \'\'" class="checkbox">\n' +
    '            <label>\n' +
    '                <input type="checkbox" data-ng-disabled="vm.readonly" data-checklist-model="vm.fieldValue" data-checklist-value="item[vm.field_id]"/>{{item[vm.field_search]}}\n' +
    '            </label>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldColorpickerController',EditorFieldColorpickerController);

    EditorFieldColorpickerController.$inject = ['$scope','EditEntityStorage','ArrayFieldStorage'];

    function EditorFieldColorpickerController($scope,EditEntityStorage,ArrayFieldStorage){
        /* jshint validthis: true */
        var vm = this;
        var regExpPattern = /^#[0-9a-f]{3,6}$/i;
        var defaultColor = '#000000';
        var fieldErrorName;

        if($scope.parentField){
            if($scope.parentFieldIndex){
                fieldErrorName = $scope.parentField + "_" + $scope.parentFieldIndex + "_" + $scope.fieldName;
            } else {
                fieldErrorName = $scope.parentField + "_" + $scope.fieldName;
            }
        } else {
            fieldErrorName = $scope.fieldName;
        }

        vm.fieldName = $scope.field.name;
        vm.readonly = $scope.field.readonly || false;
        $scope.$parent.vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;

        if ($scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true){
            vm.multiple = true;
            vm.fieldValue = [defaultColor];
            if ($scope.field.multiname || angular.isString($scope.field.multiname)) {
                vm.multiname = ('' + $scope.field.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = defaultColor;
        }

        if(vm.parentFieldIndex){
            if(vm.multiple){
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue($scope.parentField,$scope.parentFieldIndex,$scope.field.name), function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue($scope.parentField,$scope.parentFieldIndex,$scope.field.name) || "";
            }
        }

        EditEntityStorage.addFieldController(this);

        this.getFieldValue = function () {

            var field = {};
            var wrappedFieldValue;

            if(vm.multiname){
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    var tempItem = {};
                    tempItem[vm.multiname] = valueItem;
                    wrappedFieldValue.push(tempItem);
                });
            } else if(vm.multiple){
              wrappedFieldValue = [];
              angular.forEach(vm.fieldValue, function (valueItem) {
                  wrappedFieldValue.push(valueItem);
              });
            } else {
                wrappedFieldValue = vm.fieldValue;
            }

            if($scope.parentField){
                if(vm.parentFieldIndex){
                    field[$scope.parentField] = [];
                    field[$scope.parentField][vm.parentFieldIndex] = {};
                    field[$scope.parentField][vm.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = wrappedFieldValue;
                }
            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        };

        this.getInitialValue = function () {

            var field = {};

            if($scope.parentField){
                if(vm.multiple){
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = [defaultColor];
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = defaultColor;
                }
            } else {
                if(vm.multiple){
                    field[vm.fieldName] = [];
                } else {
                    field[vm.fieldName] = defaultColor;
                }
            }

            return field;
        };

        /*
         * Публичные методы множественного поля.
         * Добавление и удаление из массива елементов значения поля
         */

        vm.addItem = function () {
            vm.fieldValue.push(defaultColor);
        };

        vm.removeItem = function (index) {
            angular.forEach(vm.fieldValue, function (value,key) {
                if (key == index){
                    vm.fieldValue.splice(index,1);
                }
            });
        };

        $scope.$on('editor:entity_loaded', function (event, data) {
            if( data.editorEntityType === "new" ){
                vm.fieldValue = vm.multiple ? [($scope.field.defaultValue || defaultColor)] : ($scope.field.defaultValue || defaultColor);
                return;
            }

            if(!$scope.parentField){
                if(!vm.multiple){
                    vm.fieldValue = data[$scope.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            } else {
                if(!vm.multiple){
                    vm.fieldValue = data[$scope.parentField][$scope.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            }
        });

        $scope.$on("editor:api_error_field_"+ fieldErrorName, function (event,data) {
            if(angular.isArray(data)){
                angular.forEach(data, function (error) {
                    if($scope.$parent.vm.error.indexOf(error) < 0){
                        $scope.$parent.vm.error.push(error);
                    }
                });
            } else {
                if($scope.$parent.vm.error.indexOf(data) < 0){
                    $scope.$parent.vm.error.push(data);
                }
            }
        });

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if(vm.parentFieldIndex){
                ArrayFieldStorage.fieldDestroy($scope.parentField,$scope.parentFieldIndex,$scope.field.name,vm.fieldValue);
            }
        });

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            $scope.$parent.vm.error = [];
        });
    }
})();
(function () {
    'use strict';

    /**
     * @desc Colorpicker-type field.
     * @example <div editor-field-colorpicker=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldColorpicker',editorFieldColorpicker);

    editorFieldColorpicker.$inject = ['$templateCache'];

    function editorFieldColorpicker($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldColorpicker/editorFieldColorpicker.html'),
            controller: 'EditorFieldColorpickerController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldColorpicker/editorFieldColorpicker.html',
    '\n' +
    '<div>\n' +
    '    <div data-ng-if="vm.multiple" class="col-lg-2 col-md-2 col-sm-3 col-xs-3">\n' +
    '        <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-colorpicker-wrapper input-group">\n' +
    '            <input type="text" data-ng-disabled="vm.readonly" data-minicolors="" data-ng-model="vm.fieldValue[$index]" class="form-control input-sm"/><span class="input-group-btn">\n' +
    '                <button data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</button></span>\n' +
    '        </div>\n' +
    '        <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="!vm.multiple" class="col-lg-2 col-md-2 col-sm-3 col-xs-3">\n' +
    '        <input type="text" data-ng-disabled="vm.readonly" data-minicolors="" data-ng-model="vm.fieldValue" class="form-control input-sm"/>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldDateController', EditorFieldDateController);

    EditorFieldDateController.$inject = ['$scope', 'EditEntityStorage', 'moment', 'ArrayFieldStorage'];

    function EditorFieldDateController($scope, EditEntityStorage, moment, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;

        if ($scope.parentField) {
            if ($scope.parentFieldIndex) {
                fieldErrorName = $scope.parentField + "_" + $scope.parentFieldIndex + "_" + $scope.fieldName;
            } else {
                fieldErrorName = $scope.parentField + "_" + $scope.fieldName;
            }
        } else {
            fieldErrorName = $scope.fieldName;
        }

        vm.fieldName = $scope.field.name;
        vm.fieldValue = "";
        vm.readonly = $scope.field.readonly || false;
        $scope.$parent.vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;

        if ($scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true) {
            vm.multiple = true;
            vm.fieldValue = [];
            if ($scope.field.multiname || angular.isString($scope.field.multiname)) {
                vm.multiname = ('' + $scope.field.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = "";
        }

        if (vm.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name), function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname] ? moment(item[vm.multiname], 'YYYY-MM-DD HH:mm:ss') : "");
                    } else {
                        vm.fieldValue.push(item ? moment(item, 'YYYY-MM-DD HH:mm:ss') : "");
                    }
                });
            } else {
                var dateValue = ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name);
                vm.fieldValue = dateValue ? moment(dateValue, 'YYYY-MM-DD HH:mm:ss') : vm.fieldValue;
            }
        }

        EditEntityStorage.addFieldController(this);

        this.getFieldValue = function () {

            var field = {};

            var wrappedFieldValue;

            if (vm.multiname) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    if (!valueItem || valueItem === "" || !moment.isMoment(valueItem)) {
                        return;
                    }
                    var tempItem = {};
                    tempItem[vm.multiname] = moment(valueItem).set({ 'second': 0, 'minute': 0, 'hour': 0 }).format('YYYY-MM-DD HH:mm:ss');
                    wrappedFieldValue.push(tempItem);
                });
            } else if (vm.multiple) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    wrappedFieldValue.push(moment(valueItem).set({ 'second': 0, 'minute': 0, 'hour': 0 }).format('YYYY-MM-DD HH:mm:ss'));
                });
            } else {
                if (vm.fieldValue === undefined || vm.fieldValue === "" || !moment.isMoment(vm.fieldValue)) {
                    wrappedFieldValue = "";
                } else {
                    wrappedFieldValue = moment(vm.fieldValue).set({ 'second': 0, 'minute': 0, 'hour': 0 }).format('YYYY-MM-DD HH:mm:ss');
                }
            }

            if ($scope.parentField) {
                if (vm.parentFieldIndex) {
                    field[$scope.parentField] = [];
                    field[$scope.parentField][vm.parentFieldIndex] = {};
                    field[$scope.parentField][vm.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = wrappedFieldValue;
                }

            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        };

        this.getInitialValue = function () {

            var field = {};

            if ($scope.parentField) {
                if (vm.multiple) {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = [];
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = moment();
                }
            } else {
                if (vm.multiple) {
                    field[vm.fieldName] = [];
                } else {
                    field[vm.fieldName] = moment();
                }
            }

            return field;
        };

        vm.addItem = function () {
            vm.fieldValue.push(moment());
        };

        vm.removeItem = function (index) {
            angular.forEach(vm.fieldValue, function (value, key) {
                if (key == index) {
                    vm.fieldValue.splice(index, 1);
                }
            });
        };

        function clear() {
            vm.fieldValue = $scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true ? [] : "";
        }

        $scope.$on('editor:entity_loaded', function (event, data) {
            //-- functional for required fields
            if ($scope.field.requiredField) {
                $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField($scope.field.requiredField);
                    var result = false;
                    var endRecursion = false;
                    (function (value) {
                        var keys = Object.keys(value);
                        for (var i = keys.length; i--;) {
                            var propValue = value[keys[i]];
                            if (propValue !== null && propValue !== undefined && propValue !== "") {
                                if (angular.isObject(propValue) && !endRecursion) {
                                    arguments.callee(propValue);
                                }
                                result = true;
                                endRecursion = true;
                            }
                        }
                    })(f_value);
                    return result;
                }, function (value) {
                    if (!value) {
                        clear();
                        vm.readonly = true;
                    } else {
                        vm.readonly = $scope.field.readonly || false;
                    }
                }, true);
            }
            if (data.editorEntityType === "new") {
                var defaultValue = moment();
                if(!!$scope.field.defaultValue && moment($scope.field.defaultValue).isValid()){
                    defaultValue = moment($scope.field.defaultValue);
                }
                vm.fieldValue = vm.multiple ? [defaultValue] : defaultValue;
                return;
            }

            if (!$scope.parentField) {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.field.name] ?
                        moment(data[$scope.field.name], 'YYYY-MM-DD HH:mm:ss') : "";
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(moment(item[vm.multiname], 'YYYY-MM-DD HH:mm:ss'));
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(moment(item, 'YYYY-MM-DD HH:mm:ss'));
                    });
                }
            } else {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.parentField][$scope.field.name] ?
                        moment(data[$scope.parentField][$scope.field.name], 'YYYY-MM-DD HH:mm:ss') :
                        "";
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(moment(item[vm.multiname], 'YYYY-MM-DD HH:mm:ss'));
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(moment(item, 'YYYY-MM-DD HH:mm:ss'));
                    });
                }
            }
        });

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy($scope.parentField, $scope.parentFieldIndex, $scope.field.name, vm.fieldValue);
            }
        });

        $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function (error) {
                    if ($scope.$parent.vm.error.indexOf(error) < 0) {
                        $scope.$parent.vm.error.push(error);
                    }
                });
            } else {
                if ($scope.$parent.vm.error.indexOf(data) < 0) {
                    $scope.$parent.vm.error.push(data);
                }
            }
        });

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            $scope.$parent.vm.error = [];
        }, true);
    }
})();
(function () {
    'use strict';

    /**
     * @desc String-type field.
     * @example <div editor-field-date=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldDate',editorFieldDate);

    editorFieldDate.$inject = ['$templateCache'];

    function editorFieldDate($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldDate/editorFieldDate.html'),
            controller: 'EditorFieldDateController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldDate/editorFieldDate.html',
    '\n' +
    '<div>\n' +
    '    <div data-ng-if="vm.multiple" class="col-lg-2 col-md-2 col-sm-3 col-xs-3">\n' +
    '        <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-datepicker-wrapper input-group">\n' +
    '            <input data-date-time="" name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue[$index]" data-format="DD.MM.YYYY" data-max-view="year" data-min-view="date" data-view="date" class="form-control input-sm"/><span class="input-group-btn">\n' +
    '                <button data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</button></span>\n' +
    '        </div>\n' +
    '        <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly || !vm.emptyRequiredField" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="!vm.multiple" class="col-lg-2 col-md-2 col-sm-3 col-xs-3">\n' +
    '        <input data-date-time="" name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue" data-format="DD.MM.YYYY" data-max-view="year" data-min-view="date" data-view="date" class="form-control input-sm"/>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldDatetimeController', EditorFieldDatetimeController);

    EditorFieldDatetimeController.$inject = ['$scope', 'EditEntityStorage', 'moment', 'ArrayFieldStorage'];

    function EditorFieldDatetimeController($scope, EditEntityStorage, moment, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;

        if ($scope.parentField) {
            if ($scope.parentFieldIndex) {
                fieldErrorName = $scope.parentField + "_" + $scope.parentFieldIndex + "_" + $scope.fieldName;
            } else {
                fieldErrorName = $scope.parentField + "_" + $scope.fieldName;
            }
        } else {
            fieldErrorName = $scope.fieldName;
        }

        vm.fieldName = $scope.field.name;
        vm.fieldValue = "";
        vm.readonly = $scope.field.readonly || false;
        $scope.$parent.vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;
        vm.multiname = $scope.field.multiname || "value";

        if ($scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true) {
            vm.multiple = true;
            vm.fieldValue = [];
        } else {
            vm.multiple = false;
            vm.fieldValue = moment.utc();
        }

        if (vm.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name), function (item) {
                    vm.fieldValue.push(item[vm.multiname]);
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name) || vm.fieldValue;
            }
        }

        EditEntityStorage.addFieldController(this);

        this.getFieldValue = function () {

            var field = {};

            var wrappedFieldValue;

            if (vm.multiple && vm.multiname) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    if (!valueItem || valueItem === "" || !moment.isMoment(valueItem)) {
                        return;
                    }
                    var tempItem = {};
                    tempItem[vm.multiname] = moment.utc(valueItem).format('YYYY-MM-DD HH:mm:ss');
                    wrappedFieldValue.push(tempItem);
                });
            } else {
                if (vm.fieldValue === undefined || vm.fieldValue === "" || !moment.isMoment(vm.fieldValue)) {
                    wrappedFieldValue = "";
                } else {
                    wrappedFieldValue = moment.utc(vm.fieldValue).format('YYYY-MM-DD HH:mm:ss');
                }
            }

            if ($scope.parentField) {
                if (vm.parentFieldIndex) {
                    field[$scope.parentField] = [];
                    field[$scope.parentField][vm.parentFieldIndex] = {};
                    field[$scope.parentField][vm.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = wrappedFieldValue;
                }

            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        };

        this.getInitialValue = function () {

            var field = {};

            if ($scope.parentField) {
                if (vm.multiple) {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = [];
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = moment.utc();
                }
            } else {
                if (vm.multiple) {
                    field[vm.fieldName] = [];
                } else {
                    field[vm.fieldName] = moment.utc();
                }
            }

            return field;
        };

        vm.addItem = function () {
            vm.fieldValue.push(moment.utc());
        };

        vm.removeItem = function (index) {
            angular.forEach(vm.fieldValue, function (value, key) {
                if (key == index) {
                    vm.fieldValue.splice(index, 1);
                }
            });
        };

        function clear() {
            vm.fieldValue = $scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true ? [] : "";
        }

        $scope.$on('editor:entity_loaded', function (event, data) {
            //-- functional for required fields
            if ($scope.field.requiredField) {
                $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField($scope.field.requiredField);
                    var result = false;
                    var endRecursion = false;
                    (function (value) {
                        var keys = Object.keys(value);
                        for (var i = keys.length; i--;) {
                            var propValue = value[keys[i]];
                            if (propValue !== null && propValue !== undefined && propValue !== "") {
                                if (angular.isObject(propValue) && !endRecursion) {
                                    arguments.callee(propValue);
                                }
                                result = true;
                                endRecursion = true;
                            }
                        }
                    })(f_value);
                    return result;
                }, function (value) {
                    if (!value) {
                        clear();
                        vm.readonly = true;
                    } else {
                        vm.readonly = $scope.field.readonly || false;
                    }
                }, true);
            }
            if (data.editorEntityType === "new") {
                var defaultValue = moment().utc();
                if(!!$scope.field.defaultValue && moment($scope.field.defaultValue).isValid()){
                    defaultValue = moment($scope.field.defaultValue, 'YYYY-MM-DD HH:mm').utc();
                }
                vm.fieldValue = vm.multiple ? [defaultValue] : defaultValue;
                return;
            }

            if (!$scope.parentField) {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.field.name] !== null ? moment.utc(data[$scope.field.name]) : "";
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (timeItem) {
                        vm.fieldValue.push(moment.utc(timeItem[vm.multiname], 'YYYY-MM-DD HH:mm:ss'));
                    });
                }
            } else {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.parentField][$scope.field.name] !== null ? moment.utc(data[$scope.parentField][$scope.field.name], 'YYYY-MM-DD HH:mm:ss') : "";
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (timeItem) {
                        vm.fieldValue.push(moment.utc(timeItem[vm.multiname], 'YYYY-MM-DD HH:mm:ss'));
                    });
                }
            }
        });

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy($scope.parentField, $scope.parentFieldIndex, $scope.field.name, vm.fieldValue);
            }
        });

        $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function (error) {
                    if ($scope.$parent.vm.error.indexOf(error) < 0) {
                        $scope.$parent.vm.error.push(error);
                    }
                });
            } else {
                if ($scope.$parent.vm.error.indexOf(data) < 0) {
                    $scope.$parent.vm.error.push(data);
                }
            }
        });

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            $scope.$parent.vm.error = [];
        }, true);
    }
})();
(function () {
    'use strict';

    /**
     * @desc Datetime-type field.
     * @example <div editor-field-datetime=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldDatetime',editorFieldDatetime);

    editorFieldDatetime.$inject = ['$templateCache'];

    function editorFieldDatetime($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldDatetime/editorFieldDatetime.html'),
            controller: 'EditorFieldDatetimeController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldDatetime/editorFieldDatetime.html',
    '\n' +
    '<div>\n' +
    '    <div data-ng-if="vm.multiple" class="col-lg-2 col-md-2 col-sm-3 col-xs-3">\n' +
    '        <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-datepicker-wrapper input-group">\n' +
    '            <input date-time="" name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" ng-model="vm.fieldValue[$index]" view="date" timezone="UTC" format="YYYY-MM-DD HH:mm:ss" class="form-control input-sm"/><span class="input-group-btn">\n' +
    '                <button data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</button></span>\n' +
    '        </div>\n' +
    '        <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="!vm.multiple" class="col-lg-2 col-md-2 col-sm-3 col-xs-3">\n' +
    '        <input date-time="" name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" ng-model="vm.fieldValue" view="date" timezone="UTC" format="YYYY-MM-DD HH:mm:ss" class="form-control input-sm"/>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldNumberController', EditorFieldNumberController);

    EditorFieldNumberController.$inject = ['$scope', 'EditEntityStorage', 'ArrayFieldStorage'];

    function EditorFieldNumberController($scope, EditEntityStorage, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;

        if ($scope.parentField) {
            if ($scope.parentFieldIndex) {
                fieldErrorName = $scope.parentField + "_" + $scope.parentFieldIndex + "_" + $scope.fieldName;
            } else {
                fieldErrorName = $scope.parentField + "_" + $scope.fieldName;
            }
        } else {
            fieldErrorName = $scope.fieldName;
        }

        vm.cols = $scope.field.width;
        vm.classTextarea = 'col-lg-2 col-md-2 col-sm-3 col-xs-3';
        vm.fieldName = $scope.field.name;
        vm.fieldValue = undefined;
        vm.readonly = $scope.field.readonly || false;
        $scope.$parent.vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;
        vm.max = $scope.field.max;
        vm.min = $scope.field.min;
        vm.defaultValue = !isNaN(parseFloat($scope.field.defaultValue)) ? $scope.field.defaultValue : null;
        vm.inputLeave = function (val) {
            if (!val) {
                return;
            }

            if($scope.field.hasOwnProperty("max") && val > $scope.field.max){
                var maxError = "Для поля превышено максимальное допустимое значение " + $scope.field.max + ". Сейчас введено " + val + ".";
                if ($scope.$parent.vm.error.indexOf(maxError) < 0) {
                    $scope.$parent.vm.error.push(maxError);
                }
            }

            if($scope.field.hasOwnProperty("min") && val < $scope.field.min){
                var minError = "Минимальное значение поля не может быть меньше " + $scope.field.min + ". Сейчас введено " + val + ".";
                if($scope.$parent.vm.error.indexOf(minError) < 0){
                    $scope.$parent.vm.error.push(minError);
                }
            }
        };

        if (!!vm.cols) {
            if (vm.cols > 6) {
                vm.cols = 6;
            }
            if (vm.cols < 1) {
                vm.cols = 1;
            }
            vm.classTextarea = 'col-lg-' + vm.cols + ' col-md-' + vm.cols + ' col-sm-' + vm.cols + ' col-xs-' + vm.cols;
        }

        if ($scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true) {
            vm.multiple = true;
            vm.fieldValue = [];
            if ($scope.field.multiname || angular.isString($scope.field.multiname)) {
                vm.multiname = ('' + $scope.field.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = vm.defaultValue || null ;
        }

        if (vm.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name), function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name) || null;
            }
        }

        EditEntityStorage.addFieldController(this);

        this.getFieldValue = function () {
            var field = {},
                wrappedFieldValue;
            if (vm.multiname) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    var tempItem = {};
                    tempItem[vm.multiname] = valueItem;
                    wrappedFieldValue.push(tempItem);
                });
            } else if (vm.multiple) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    wrappedFieldValue.push(valueItem);
                });
            } else {
                wrappedFieldValue = vm.fieldValue;
            }

            if ($scope.parentField) {
                if (vm.parentFieldIndex) {
                    field[$scope.parentField] = [];
                    field[$scope.parentField][vm.parentFieldIndex] = {};
                    field[$scope.parentField][vm.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = wrappedFieldValue;
                }
            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        };

        /*
         * Field system method: Возврашает значение поля которое используется при создании
         * новой сущности, т.е. дефолтное значение поля
         */

        this.getInitialValue = function () {
            var field = {};
            if ($scope.parentField) {
                if (vm.multiple) {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = [];
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = null;
                }
            } else {
                if (vm.multiple) {
                    field[vm.fieldName] = [];
                } else {
                    field[vm.fieldName] = null;
                }
            }

            return field;
        };

        vm.addItem = function () {
          vm.fieldValue.push(vm.defaultValue);
        };

        vm.removeItem = function (index) {
            angular.forEach(vm.fieldValue, function (value, key) {
                if (key == index) {
                    vm.fieldValue.splice(index, 1);
                }
            });
        };

       

        function clear() {
            vm.fieldValue = $scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true ? [] : (vm.defaultValue || null);
        }

        $scope.$on('editor:entity_loaded', function (event, data) {
            if ($scope.field.requiredField) {
                $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField($scope.field.requiredField);
                    var result = false;
                    var endRecursion = false;
                    (function (value) {
                        var keys = Object.keys(value);
                        for (var i = keys.length; i--;) {
                            var propValue = value[keys[i]];
                            if (propValue !== null && propValue !== undefined && propValue !== null) {
                                if (angular.isObject(propValue) && !endRecursion) {
                                    arguments.callee(propValue);
                                }
                                result = true;
                                endRecursion = true;
                            }
                        }
                    })(f_value);
                    return result;
                }, function (value) {
                    if (!value) {
                        clear();
                        vm.readonly = true;
                    } else {
                        vm.readonly = $scope.field.readonly || false;
                    }
                }, true);
            }

            if (data.editorEntityType === "new") {
                if (vm.defaultValue) {
                    vm.fieldValue = vm.multiple ? [vm.defaultValue] : vm.defaultValue;
                } else {
                    vm.fieldValue = vm.multiple ? [] : null;
                }
                if (data.hasOwnProperty($scope.field.name)) {
                    vm.fieldValue = data[$scope.field.name];
                }
                return;
            }

            if (!$scope.parentField) {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            } else {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.parentField][$scope.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            }
        });

        $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if ($scope.$parent.vm.error.indexOf(data) < 0) {
                $scope.$parent.vm.error.push(data);
            }
        });

        $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function (error) {
                    if ($scope.$parent.vm.error.indexOf(error) < 0) {
                        $scope.$parent.vm.error.push(error);
                    }
                });
            } else {
                if ($scope.$parent.vm.error.indexOf(data) < 0) {
                    $scope.$parent.vm.error.push(data);
                }
            }
        });

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy($scope.parentField, $scope.parentFieldIndex, $scope.field.name, vm.fieldValue);
            }
        });

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            $scope.$parent.vm.error = [];
        }, true);

    }
})();
(function () {
    'use strict';

    /**
     * @desc number-type field.
     * @example <div editor-field-number=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldNumber',editorFieldNumber);

    editorFieldNumber.$inject = ['$templateCache'];

    function editorFieldNumber($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldNumber/editorFieldNumber.html'),
            controller: 'EditorFieldNumberController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldNumber/editorFieldNumber.html',
    '\n' +
    '<div>\n' +
    '    <div data-ng-if="vm.multiple" data-ng-class="vm.classTextarea">\n' +
    '        <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-string-wrapper input-group">\n' +
    '            <input type="number" data-ng-disabled="vm.readonly" name="{{vm.fieldName}}" data-ng-model="vm.fieldValue[$index]" data-ng-min="vm.min" data-ng-max="vm.max" data-ng-blur="vm.inputLeave(vm.fieldValue[$index])" class="form-control input-sm"/><span class="input-group-btn">\n' +
    '                <button data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</button></span>\n' +
    '        </div>\n' +
    '        <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="!vm.multiple" data-ng-class="vm.classTextarea">\n' +
    '        <input type="number" data-ng-disabled="vm.readonly" name="{{vm.fieldName}}" data-ng-model="vm.fieldValue" data-ng-min="vm.min" data-ng-max="vm.max" data-ng-blur="vm.inputLeave(vm.fieldValue)" class="form-control input-sm"/>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldRadiolistController', EditorFieldRadiolistController);

    EditorFieldRadiolistController.$inject = ['$scope', 'EditEntityStorage', 'RestApiService', 'ArrayFieldStorage'];

    function EditorFieldRadiolistController($scope, EditEntityStorage, RestApiService, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;

        if ($scope.parentField) {
            if ($scope.parentFieldIndex) {
                fieldErrorName = $scope.parentField + "_" + $scope.parentFieldIndex + "_" + $scope.fieldName;
            } else {
                fieldErrorName = $scope.parentField + "_" + $scope.fieldName;
            }
        } else {
            fieldErrorName = $scope.fieldName;
        }

        var remote = $scope.field.valuesRemote;
        vm.field_id = "id";
        vm.field_search = "title";
        if (remote) {
            if(remote.fields){
                if (remote.fields.value) {
                    vm.field_id = remote.fields.value;
                }
                if (remote.fields.label) {
                    vm.field_search = remote.fields.label;
                }
            }
        }
        vm.fieldName = $scope.field.name;
        vm.selectedValues = [];
        vm.inputValue = "";
        vm.readonly = $scope.field.readonly || false;
        $scope.$parent.vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;

        if ($scope.field.multiname || angular.isString($scope.field.multiname)) {
            vm.multiname = ('' + $scope.field.multiname) || "value";
        }

        EditEntityStorage.addFieldController(this);

        if (vm.parentFieldIndex) {
            vm.fieldValue = [];
            var value = ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name);
            if (value) {
                if (vm.multiname) {
                    vm.fieldValue = value[vm.multiname];
                } else {
                    vm.fieldValue = value;
                }
            }
        }

        /*
         * Инициализация данных при загрузке поля. Необходимая часть для полей инициализирующие данные для которых
         * хранятся удалённо.
         */

        if ($scope.field.hasOwnProperty("values")) {
            angular.forEach($scope.field.values, function (v, key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                if (key === $scope.field.defaultValue) {
                    vm.fieldValue = key;
                }
                vm.selectedValues.push(obj);
            });
        } else if ($scope.field.hasOwnProperty("valuesRemote")){
            RestApiService
                .getUrlResource($scope.field.valuesRemote.url)
                .then(function (response) {
                    angular.forEach(response.data.items, function (v) {
                        if ($scope.field.defaultValue && v[vm.field_id] === $scope.field.defaultValue) {
                            vm.fieldValue = v[vm.field_id];
                        }
                        vm.selectedValues.push(v);
                    });
                }, function (reject) {
                    console.error('EditorFieldRadiolistController: Не удалось получить значения для поля \"' + $scope.field.fieldName + '\" с удаленного ресурса');
                });
        } else {
            console.error('EditorFieldRadiolistController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
        }

        /* ------- */

        this.getFieldValue = function () {
            var field = {};
            var wrappedFieldValue;

            if (vm.multiname) {
                var tempItem = {};
                tempItem[vm.multiname] = vm.fieldValue;
                wrappedFieldValue = tempItem;
            } else {
                wrappedFieldValue = vm.fieldValue;
            }

            if ($scope.parentField) {
                if (vm.parentFieldIndex) {
                    field[$scope.parentField] = [];
                    field[$scope.parentField][vm.parentFieldIndex] = {};
                    field[$scope.parentField][vm.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = wrappedFieldValue;
                }

            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        };

        this.getInitialValue = function () {

            var field = {};

            if ($scope.parentField) {
                field[$scope.parentField] = {};
                field[$scope.parentField][vm.fieldName] = null;
            } else {
                field[vm.fieldName] = null;
            }

            return field;
        };

        function clear() {
            vm.fieldValue = vm.parentFieldIndex ? [] : ($scope.field.defaultValue || null);
        }

        $scope.$on('editor:entity_loaded', function (event, data) {
            //-- functional for required fields
            if ($scope.field.requiredField) {
                $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField($scope.field.requiredField);
                    var result = false;
                    var endRecursion = false;
                    (function (value) {
                        var keys = Object.keys(value);
                        for (var i = keys.length; i--;) {
                            var propValue = value[keys[i]];
                            if (propValue !== null && propValue !== undefined && propValue !== "") {
                                if (angular.isObject(propValue) && !endRecursion) {
                                    arguments.callee(propValue);
                                }
                                result = true;
                                endRecursion = true;
                            }
                        }
                    })(f_value);
                    return result;
                }, function (value) {
                    if (!value) {
                        clear();
                        vm.readonly = true;
                    } else {
                        vm.readonly = $scope.field.readonly || false;
                    }
                }, true);
            }
            if (data.editorEntityType === "new") {
                vm.fieldValue = $scope.field.defaultValue || null;
                return;
            }

            if (!$scope.parentField) {
                if (vm.multiname) {
                    vm.fieldValue = data[$scope.field.name][vm.multiname];
                } else {
                    vm.fieldValue = data[$scope.field.name];
                }
            } else {
                if (vm.multiname) {
                    vm.fieldValue = data[$scope.parentField][$scope.field.name][vm.multiname];
                } else {
                    vm.fieldValue = data[$scope.parentField][$scope.field.name];
                }
            }
        });

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy($scope.parentField, $scope.parentFieldIndex, $scope.field.name, vm.fieldValue);
            }
        });

        $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function (error) {
                    if ($scope.$parent.vm.error.indexOf(error) < 0) {
                        $scope.$parent.vm.error.push(error);
                    }
                });
            } else {
                if ($scope.$parent.vm.error.indexOf(data) < 0) {
                    $scope.$parent.vm.error.push(data);
                }
            }
        });

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            $scope.$parent.vm.error = [];
        }, true);
    }
})();
(function () {
    'use strict';

    /**
     * @desc Radiolist-type field.
     * @example <div editor-field-radiolist=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldRadiolist',editorFieldRadiolist);

    editorFieldRadiolist.$inject = ['$templateCache'];

    function editorFieldRadiolist($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldRadiolist/editorFieldRadiolist.html'),
            controller: 'EditorFieldRadiolistController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldRadiolist/editorFieldRadiolist.html',
    '\n' +
    '<div>\n' +
    '    <div class="col-lg-6 col-md-6 col-sm-6 col-xs-6">\n' +
    '        <div data-ng-repeat="item in vm.selectedValues" data-ng-class="vm.readonly ? \'disabled\' : \'\'" class="radio">\n' +
    '            <label>\n' +
    '                <input type="radio" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue" value="{{item[vm.field_id]}}"/>{{item[vm.field_search]}}\n' +
    '            </label>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('DropdownItemsController',DropdownItemsController);

    DropdownItemsController.$inject = ['$scope','RestApiService'];

    function DropdownItemsController($scope,RestApiService) {
    }
})();
(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('dropdownItems',dropdownItems);

    dropdownItems.$inject = ['$templateCache', '$document', '$compile'];

    function dropdownItems($templateCache, $document, $compile) {
        return {
            restrict : 'A',
            replace : true,
            scope : {
                options: '=',
                isOpen: '=',
                fieldSearch: '=',
                childCountField: '=',
                onToggle: '=',
                api: '=',
                selectBranches: '=',
                assetsPath: '=',
                multiple: '=',
                activeElement: '=',
                setActiveElement: '=',
                lvlDropdown: '='
            },
            template : $templateCache.get('module/directives/editorFieldSelect/dropdownItems.html'),
            controller: 'DropdownItemsController',
            controllerAs : 'vm',
            compile : compile
        };

        function compile(element, link) {
            // Normalize the link parameter
            if(angular.isFunction(link)){
                link = { post: link };
            }

            // Break the recursion loop by removing the contents
            var contents = element.contents().remove();
            var compiledContents;
            return {
                post: function(scope, element){
                    // Compile the contents
                    if(!compiledContents){
                        compiledContents = $compile(contents);
                    }
                    // Re-add the compiled contents to the element
                    compiledContents(scope, function(clone){
                        element.append(clone);
                    });

                    // Call the post-linking function, if any
                    if(link && link.post){
                        link.post.apply(null, arguments);
                    }
                }
            }
        }

        function link(scope, elem, attrs, ctrl){
            // elem.on('$destroy', function () {
            //     scope.$destroy();
            // });
            //
            // scope.isOpen = false;
            //
            // $document.on('click', function() {
            //     scope.isOpen = false;
            // });
            //
            // scope.toggleDropdown = function(e) {
            //     scope.isOpen = !scope.isOpen;
            //     e.stopPropagation();
            // };
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldSelect/dropdownItems.html',
    '\n' +
    '<div data-ng-show="isOpen">\n' +
    '    <div data-ng-class="{&quot;dropdown-scroll&quot; : (lvlDropdown == 1)}">\n' +
    '        <div data-ng-repeat="option in options track by $index" data-ng-class="activeElement == $index ? \'active\' : \'\'" data-ng-mouseover="setActiveElement($event, $index)" class="dropdown-items__item">\n' +
    '            <div class="option">\n' +
    '                <div data-ng-if="::selectBranches || !option[childCountField]" data-ng-mousedown="onToggle($event, option)" data-ng-class="{&quot;multi_radio&quot; : !multiple}" class="option__checkbox">\n' +
    '                    <div data-ng-style="{\'display\': option.checked ? \'block\' : \'\', \'background-image\':\'url(\'+ assetsPath + (!multiple ? \'/images/radio_green.png)\' : \'/images/checkbox_green.png)\')}" data-ng-class="{&quot;multi_radio&quot; : !multiple}" class="checkbox__check"></div>\n' +
    '                </div>\n' +
    '                <div data-ng-mousedown="onToggle($event, option, true)" class="option__label"><span data-ng-bind="option[fieldSearch]"></span> <span data-ng-if="option[childCountField]" data-ng-class="{\'option__child-count_open\': option.isOpen}" class="option__child-count">({{option[childCountField]}})</span>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div data-ng-if="option[childCountField]" data-ng-show="!!option.loadingData" class="processing-status-wrapper">\n' +
    '                <div class="processing-status">Выполняется действие</div>\n' +
    '            </div>\n' +
    '            <div data-ng-if="option.childOpts" data-dropdown-items="" data-options="option.childOpts" data-is-open="option.isOpen" data-field-search="fieldSearch" data-child-count-field="childCountField" data-on-toggle="onToggle" data-api="api" data-select-branches="selectBranches" data-assets-path="assetsPath" data-multiple="multiple" data-active-element="activeElement" data-set-active-element="setActiveElement" data-lvl-dropdown="lvlDropdown + 1" class="dropdown-items__children"></div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldSelectController', EditorFieldSelectController);

    EditorFieldSelectController.$inject = ['$rootScope', '$scope', 'EditEntityStorage', 'RestApiService', 'ArrayFieldStorage', '$timeout', 'configData', '$document', '$element', '$window'];

    function EditorFieldSelectController($rootScope, $scope, EditEntityStorage, RestApiService, ArrayFieldStorage, $timeout, configData, $document, $element, $window) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;

        if ($scope.parentField) {
            if ($scope.parentFieldIndex) {
                fieldErrorName = $scope.parentField + "_" + $scope.parentFieldIndex + "_" + $scope.fieldName;
            } else {
                fieldErrorName = $scope.parentField + "_" + $scope.fieldName;
            }
        } else {
            fieldErrorName = $scope.fieldName;
        }

        var tmpObject = {};

        var remote = $scope.field.valuesRemote;
        vm.field_id = "id";
        vm.field_search = "title";
        if (remote) {
            if (remote.fields) {
                if (remote.fields.value) {
                    vm.field_id = remote.fields.value;
                }
                if (remote.fields.label) {
                    vm.field_search = remote.fields.label;
                }
            }
        }

        var possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);

        vm.assetsPath = '/assets/universal-editor';
        if (!!configData.ui && !!configData.ui.assetsPath) {
            vm.assetsPath = configData.ui.assetsPath;
        }
        var _selectedIds = [];
        vm.fieldName = $scope.field.name;
        vm.options = [];
        vm.selectedValues = [];
        vm.inputValue = "";
        vm.readonly = $scope.field.readonly || false;
        $scope.$parent.vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;
        vm.depend = $scope.field.depend || false;
        vm.parentValue = !vm.depend;
        vm.search = $scope.field.search;
        vm.placeholder = $scope.field.placeholder || '';
        vm.showPossible = false;
        vm.activeElement = 0;
        vm.isSelection = false;
        vm.possibleLocation = true;
        vm.isSpanSelectDelete = false;

        vm.cols = $scope.field.width;
        vm.classWidth = 'col-lg-2 col-md-2 col-sm-3 col-xs-3';
        if (!!vm.cols) {
            if (vm.cols > 6) {
                vm.cols = 6;
            }
            if (vm.cols < 1) {
                vm.cols = 1;
            }
            vm.classWidth = 'col-lg-' + vm.cols + ' col-md-' + vm.cols + ' col-sm-' + vm.cols + ' col-xs-' + vm.cols;
        }

        if ($scope.field.hasOwnProperty('valuesRemote') &&
            $scope.field.valuesRemote.fields.parent && $scope.field.valuesRemote.fields.childCount) {
            vm.treeParentField = $scope.field.valuesRemote.fields.parent;
            vm.treeChildCountField = $scope.field.valuesRemote.fields.childCount;
            vm.treeSelectBranches = $scope.field.selectBranches;
            vm.isTree = vm.treeParentField && vm.treeChildCountField;
            vm.sizeInput = vm.placeholder.length;
        }

        if (vm.depend) {
            vm.dependField = vm.depend.fieldName;
            vm.dependFilter = vm.depend.filter;
        }

        if ($scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true) {
            vm.multiple = true;
            vm.fieldValue = [];
            if ($scope.field.multiname || angular.isString($scope.field.multiname)) {
                vm.multiname = ('' + $scope.field.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = "";
            vm.styleInput = { 'width': '99%' }
        }

        if (vm.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name), function(item) {
                    if (vm.multiname) {
                        _selectedIds.push(item[vm.multiname]);
                    } else {
                        _selectedIds.push(item);
                    }
                });
            } else {
                if (ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name)) {
                    if (vm.isTree) {
                        _selectedIds.push(ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name));
                    } else {
                        vm.fieldValue = {};
                        vm.fieldValue[vm.field_id] = ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name);
                    }
                }
            }
        }

        EditEntityStorage.addFieldController(this);

        /*
         * Инициализация данных при загрузке поля. Необходимая часть для полей инициализирующие данные для которых
         * хранятся удалённо.
         */
        var allOptions;

        if ($scope.field.hasOwnProperty("values")) {
            angular.forEach($scope.field.values, function(v, key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                vm.options.push(obj);
            });
            $scope.$evalAsync(function() {
                setSizeSelect();
            });
            allOptions = angular.copy(vm.options);
        } else if ($scope.field.hasOwnProperty("valuesRemote")) {
            if (vm.isTree) {
                if (_selectedIds.length && !vm.options.length) {
                    getRemoteSelectedValues();
                }
                else if (!_selectedIds.length) {
                    getRemoteValues();
                }
            } else {
                getRemoteValues();
            }
        } else {
            console.error('EditorFieldSelectController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
        }

        function getRemoteValues(isRemoteSelectedValues) {
            vm.loadingData = true;
            RestApiService
                .getUrlResource($scope.field.valuesRemote.url)
                .then(function(response) {
                    angular.forEach(response.data.items, function(v) {
                        vm.options.push(v);
                        if (!vm.multiple && !vm.isTree && v[vm.field_id] == vm.fieldValue[vm.field_id]) {
                            vm.fieldValue[vm.field_search] = v[vm.field_search];
                        }
                    });
                    setSizeSelect();
                    allOptions = angular.copy(vm.options);
                    if (isRemoteSelectedValues) {
                        setSelectedValuesFromRemote();
                    } else {
                        setSelectedValues();
                    }
                }, function(reject) {
                    console.error('EditorFieldSelectController: Не удалось получить значения для поля \"' + $scope.field.fieldName + '\" с удаленного ресурса');
                }).finally(function() { vm.loadingData = false; });
        }

        function getRemoteSelectedValues() {
            vm.loadingData = true;
            RestApiService
                .getUrlResource($scope.field.valuesRemote.url + '?filter={"id":["' + _selectedIds.join('","') + '"]}')
                .then(function(response) {
                    if (vm.multiple) {
                        angular.forEach(response.data.items, function(v) {
                            vm.fieldValue.push(v);
                        });
                    } else {
                        vm.fieldValue = [response.data.items[0]];
                    }
                    getRemoteValues(true);
                }, function(reject) {
                    console.error('EditorFieldSelectController: Не удалось получить значения для поля \"' + $scope.field.fieldName + '\" с удаленного ресурса');
                }).finally(function() { vm.loadingData = false; });
        }

        /* ---- */

        this.getFieldValue = function() {

            var field = {};
            var wrappedFieldValue;

            if ((!vm.multiple && vm.fieldValue) || (vm.multiple && vm.fieldValue.length)) {
                if (vm.multiname) {
                    wrappedFieldValue = [];
                    angular.forEach(vm.fieldValue, function(valueItem) {
                        var tempItem = {};
                        tempItem[vm.multiname] = vm.isTree ? valueItem[vm.field_id] : valueItem;
                        wrappedFieldValue.push(tempItem);
                    });
                } else if (vm.multiple) {
                    wrappedFieldValue = [];
                    angular.forEach(vm.fieldValue, function(valueItem) {
                        wrappedFieldValue.push(vm.isTree ? valueItem[vm.field_id] : valueItem);
                    });
                } else {
                    if (vm.isTree && vm.fieldValue.length) {
                        wrappedFieldValue = vm.fieldValue[0][vm.field_id];
                    } else {
                        wrappedFieldValue = vm.fieldValue[vm.field_id];
                    }
                }
            }

            if ($scope.parentField) {
                if (vm.parentFieldIndex) {
                    field[$scope.parentField] = [];
                    field[$scope.parentField][vm.parentFieldIndex] = {};
                    field[$scope.parentField][vm.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = wrappedFieldValue;
                }
            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        };

        this.getInitialValue = function() {

            var field = {};

            if ($scope.parentField) {
                if (vm.multiple) {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = [];
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = undefined;
                }
            } else {
                if (vm.multiple) {
                    field[vm.fieldName] = [];
                } else {
                    field[vm.fieldName] = undefined;
                }
            }

            return field;
        };

        function clear() {
            vm.fieldValue = $scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true ? [] : "";
            vm.selectedValues = [];
            vm.inputValue = "";
        }

        $scope.$on('editor:entity_loaded', function(event, data) {

            vm.fieldValue = {};
            //-- functional for required fields
            if ($scope.field.requiredField) {
                $scope.$watch(function() {
                    var f_value = EditEntityStorage.getValueField($scope.field.requiredField);
                    var result = false;
                    var endRecursion = false;
                    (function(value) {
                        var keys = Object.keys(value);
                        for (var i = keys.length; i--;) {
                            var propValue = value[keys[i]];
                            if (propValue !== null && propValue !== undefined && propValue !== "") {
                                if (angular.isObject(propValue) && !endRecursion) {
                                    arguments.callee(propValue);
                                }
                                result = true;
                                endRecursion = true;
                            }
                        }
                    })(f_value);
                    return result;
                }, function(value) {
                    if (!value) {
                        clear();
                        vm.readonly = true;
                    } else {
                        vm.readonly = $scope.field.readonly || false;
                    }
                }, true);
            }

            if (data.editorEntityType === "new") {
                vm.fieldValue = vm.multiple ? [] : {};
                if (data.hasOwnProperty($scope.field.name)) {
                    var obj = {};
                    obj[vm.field_id] = data[$scope.field.name];
                    if (!isNaN(+obj[vm.field_id])) {
                        obj[vm.field_id] = +obj[vm.field_id];
                    }
                    vm.fieldValue = obj;
                }

                if (vm.isTree) {
                    vm.fieldValue = [];
                }

                if (!!$scope.field.defaultValue && !vm.isTree) {
                    var obj = {};
                    obj[vm.field_id] = $scope.field.defaultValue;
                    vm.fieldValue = obj;
                }
                return;
            }

            vm.parentValue = !vm.dependField;

            if (!$scope.parentField) {
                if (!vm.multiple) {
                    if (vm.isTree && data[$scope.field.name]) {
                        _selectedIds.push(data[$scope.field.name]);
                    } else {
                        var obj = {};
                        obj[vm.field_id] = data[$scope.field.name];
                        vm.fieldValue = obj;
                    }
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function(item) {
                        _selectedIds.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function(item) {
                        _selectedIds.push(item);
                    });
                }
            } else {
                if (!vm.multiple) {
                    if (vm.isTree && data[$scope.parentField][$scope.field.name]) {
                        _selectedIds.push(data[$scope.parentField][$scope.field.name]);
                    } else {
                        var obj = {};
                        obj[vm.field_id] = data[$scope.parentField][$scope.field.name];
                        vm.fieldValue = obj;
                    }
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function(item) {
                        _selectedIds.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function(item) {
                        _selectedIds.push(item);
                    });
                }
            }
            //setSelectedValues();
        });

        $scope.$on("editor:api_error_field_" + fieldErrorName, function(event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function(error) {
                    if ($scope.$parent.vm.error.indexOf(error) < 0) {
                        $scope.$parent.vm.error.push(error);
                    }
                });
            } else {
                if ($scope.$parent.vm.error.indexOf(data) < 0) {
                    $scope.$parent.vm.error.push(data);
                }
            }
        });

        $scope.$on('$destroy', function() {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy($scope.parentField, $scope.parentFieldIndex, $scope.field.name, vm.fieldValue);
            }
        });

        $scope.$watch(function() {
            return vm.fieldValue;
        }, function(newVal) {
            if (!vm.multiple && !vm.isTree) {
                if (vm.search) {
                    vm.filterText = '';
                    change();
                }
                vm.placeholder = (!!newVal && !!newVal[vm.field_search]) ? newVal[vm.field_search] : $scope.field.placeholder;
                vm.isSelection = (!!newVal && !!newVal[vm.field_search]);
            }
            if (vm.isTree && !vm.search) {
                vm.placeholder = $scope.field.placeholder || '';
            }
            if (vm.isTree && !vm.multiple) {
                vm.placeholder = (!!newVal.length && !!newVal[0][vm.field_search]) ? newVal[0][vm.field_search] : $scope.field.placeholder;
            }
            vm.setColorPlaceholder();
            $scope.$parent.vm.error = [];
            $rootScope.$broadcast('select_field:select_name_' + vm.fieldName, newVal);
            if (newVal && !$.isEmptyObject(newVal)) {
                vm.isSpanSelectDelete = true;
            }
        }, true);

        if (vm.depend) {
            $scope.$on('select_field:select_name_' + vm.dependField, function(event, data) {
                if (data && data !== "") {
                    vm.parentValue = false;
                    vm.options = [];
                    RestApiService
                        .getUrlResource($scope.field.valuesRemote.url + '?filter={"' + vm.dependFilter + '":"' + data + '"}')
                        .then(function(response) {
                            angular.forEach(response.data.items, function(v) {
                                vm.options.push(v);
                            });
                            $timeout(function() {
                                setSizeSelect();
                            }, 0);
                            allOptions = angular.copy(vm.options);
                            vm.parentValue = true;
                        }, function(reject) {
                            console.error('EditorFieldSelectController: Не удалось получить значения для поля \"' + $scope.field.fieldName + '\" с удаленного ресурса');
                        });
                } else {
                    vm.parentValue = false;
                }
            });
        }

        // dropdown functions
        vm.toggle = toggle;
        vm.remove = remove;
        vm.focus = focus;
        vm.change = change;

        function toggle(e, item, loadChilds) {
            if (loadChilds && item[vm.treeChildCountField]) {
                item.isOpen = !item.isOpen;
                if (item[vm.treeChildCountField] && !item.childOpts) {
                    item.loadingData = true;
                    RestApiService
                        .getUrlResource($scope.field.valuesRemote.url + '?filter={"' + vm.treeParentField + '":"' + item[vm.field_id] + '"}')
                        .then(function(response) {
                            if (!item.childOpts) {
                                item.childOpts = [];
                            }
                            item.loadingData = false;
                            angular.forEach(response.data.items, function(v) {
                                item.childOpts.push(v);
                            });
                            if (!vm.filterText) {
                                allOptions = angular.copy(vm.options);
                            }
                            if (vm.fieldValue.length) {
                                setSelectedValuesFromRemote(item);
                            }
                        }, function(reject) {
                            console.error('EditorFieldSelectController: Не удалось получить значения для поля \"' + $scope.field.fieldName + '\" с удаленного ресурса');
                        });
                }
            } else {
                if (!angular.isArray(vm.fieldValue)) {
                    vm.fieldValue = [];
                }
                var idx = findById(item[vm.field_id]);
                if (vm.multiple) {
                    if (idx !== null) {
                        item.checked = false;
                        vm.fieldValue.splice(idx, 1);
                    } else {
                        item.checked = true;
                        vm.fieldValue.push(item);
                    }
                } else {
                    if (idx === null) {
                        vm.fieldValue.splice(0);
                        uncheckAll(vm.options);
                        item.checked = true;
                        vm.isSpanSelectDelete = true;
                        vm.fieldValue.push(item);
                    } else {
                        vm.fieldValue.splice(0);
                        item.checked = false;
                        vm.isSpanSelectDelete = false;
                    }
                }
                if (!vm.multiple) {
                    $timeout(function() {
                        vm.isBlur();
                        $element.find('input')[0].blur();
                    }, 0);
                }
            }
            if (vm.fieldValue.length === 0 && !vm.filterText) {
                vm.placeholder = $scope.field.placeholder || '';
                vm.sizeInput = vm.placeholder.length;
            } else {
                vm.placeholder = (vm.multiple) ? '' : vm.fieldValue[0][vm.field_search];
                vm.sizeInput = !!vm.filterText ? vm.filterText.length : 1;
            }
            if (!!e) {
                e.stopPropagation();
                e.preventDefault();
            }
        }

        function uncheckAll(arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                arr[i].checked = false;
                if (arr[i].childOpts) {
                    uncheckAll(arr[i].childOpts);
                }
            }
        }

        function remove(e, item) {
            if (vm.treeParentField && item[vm.treeParentField] && vm.multiple) {
                uncheckByParentId(vm.options, item[vm.treeParentField], item[vm.field_id]);
                var idx = findById(item[vm.field_id], item[vm.treeParentField]);
                if (idx !== null) {
                    vm.fieldValue.splice(idx, 1);
                }
            } else {
                var idx = findById(item[vm.field_id]);
                if (idx !== null) {
                    vm.fieldValue.splice(idx, 1);
                    for (var i = 0, len = vm.options.length; i < len; i++) {
                        if (vm.options[i][vm.field_id] === item[vm.field_id]) {
                            vm.options[i].checked = false;
                        }
                    }
                }
            }

            if (vm.fieldValue.length === 0 && !vm.filterText) {
                vm.placeholder = $scope.field.placeholder || '';
                vm.sizeInput = vm.placeholder.length;
            } else {
                vm.placeholder = '';
                vm.sizeInput = !!vm.filterText ? vm.filterText.length : 1;
            }
        }

        function focus(e) {
            $scope.toggleDropdown(e);
            $scope.isOpen = true;
        }

        function change() {
            vm.activeElement = 0;
            if (vm.fieldValue && vm.fieldValue.length === 0 && !vm.filterText) {
                vm.placeholder = $scope.field.placeholder || '';
                vm.sizeInput = vm.placeholder.length;
            } else {
                vm.placeholder = '';
                vm.sizeInput = !!vm.filterText ? vm.filterText.length : 1;
            }
            if (!vm.filterText) {
                if (!vm.multiple && !vm.isTree) {
                    if (vm.options && vm.options.length && vm.fieldValue) {
                        var finded = vm.options.filter(function(record) { return record[vm.field_id] === vm.fieldValue[vm.field_id]; });
                        if (finded) {
                            vm.fieldValue = finded[0];
                        }
                    }
                    vm.placeholder = (!!vm.fieldValue && !!vm.fieldValue[vm.field_search]) ? vm.fieldValue[vm.field_search] : $scope.field.placeholder;
                } else if (!vm.multiple && vm.isTree) {
                    vm.placeholder = (!!vm.fieldValue.length && !!vm.fieldValue[0][vm.field_search]) ? vm.fieldValue[0][vm.field_search] : $scope.field.placeholder;
                }
                vm.sizeInput = (vm.placeholder || '').length;


                if (allOptions) {
                    vm.options = allOptions;
                }
                if (angular.isArray(vm.fieldValue)) {
                    for (var j = 0; j < vm.fieldValue.length; j++) {
                        for (var i = 0, len = vm.options.length; i < len; i++) {
                            if (vm.options[i][vm.field_id] === vm.fieldValue[j][vm.field_id]) {
                                vm.options[i].checked = true;
                            }
                        }
                    }
                }
                return;
            }
            vm.sizeInput = !!vm.filterText ? vm.filterText.length : 1;
            if (!allOptions) {
                allOptions = angular.copy(vm.options);
            }
            vm.options = filter(angular.copy(allOptions), vm.filterText);
            if (angular.isArray(vm.fieldValue)) {
                for (var j = 0; j < vm.fieldValue.length; j++) {
                    for (var i = 0, len = vm.options.length; i < len; i++) {
                        if (vm.options[i][vm.field_id] === vm.fieldValue[j][vm.field_id]) {
                            vm.options[i].checked = true;
                        }
                    }
                }
            }
        }

        function filter(opts, filterText) {
            var result = [];
            result = opts.filter(function(opt) {
                if (opt.childOpts && opt.childOpts.length) {
                    opt.childOpts = filter(opt.childOpts, filterText);
                }
                return (opt[vm.field_search].toLowerCase()).indexOf(filterText.toLowerCase()) > -1 || (opt.childOpts && opt.childOpts.length);
            });

            return result;
        }

        function findById(id, parentId) {
            if (parentId) {
                for (var i = 0, len = vm.fieldValue.length; i < len; i++) {
                    if (vm.fieldValue[i][vm.field_id] === id && vm.fieldValue[i][vm.treeParentField] === parentId) {
                        return i;
                    }
                }
            } else {
                for (var i = 0, len = vm.fieldValue.length; i < len; i++) {
                    if (vm.fieldValue[i][vm.field_id] === id) {
                        return i;
                    }
                }
            }
            return null;
        }

        function uncheckByParentId(arr, parentId, id) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i][vm.field_id] === parentId && arr[i].childOpts) {
                    for (var j = 0, lenj = arr[i].childOpts.length; j < lenj; j++) {
                        if (arr[i].childOpts[j][vm.field_id] === id) {
                            arr[i].childOpts[j].checked = false;
                        }
                    }
                } else {
                    if (arr[i].childOpts && arr[i].childOpts.length) {
                        uncheckByParentId(arr[i].childOpts, parentId, id);
                    }
                }
            }
        }

        function setSelectedValues() {
            if (!_selectedIds.length || !vm.options.length) {
                return;
            }
            vm.fieldValue = vm.options.filter(function(opt) {
                for (var i = 0, len = _selectedIds.length; i < len; i++) {
                    if (opt[vm.field_id] === _selectedIds[i]) {
                        opt.checked = true;
                        return true;
                    }
                }
            });
            _selectedIds.splice(0);
        }

        function setSelectedValuesFromRemote(item) {
            if (item) {
                for (var i = 0, len = item.childOpts.length; i < len; i++) {
                    for (var j = 0, lenj = vm.fieldValue.length; j < lenj; j++) {
                        if (item[vm.field_id] === vm.fieldValue[j][vm.treeParentField] && item.childOpts[i][vm.field_id] === vm.fieldValue[j][vm.field_id]) {
                            item.childOpts[i].checked = true;
                        }
                    }
                }
            } else {
                for (var i = 0, len = vm.options.length; i < len; i++) {
                    for (var j = 0, lenj = vm.fieldValue.length; j < lenj; j++) {
                        if (vm.options[i][vm.field_id] === vm.fieldValue[j][vm.field_id] && !vm.fieldValue[j][vm.treeParentField]) {
                            vm.options[i].checked = true;
                        }
                    }
                }
            }
        }

        vm.addToSelected = function(val) {
            var obj = {};
            obj[vm.field_id] = val[vm.field_id];
            obj[vm.field_search] = val[vm.field_search];
            vm.fieldValue = obj;
            vm.filterText = '';
            $timeout(function() {
                vm.isSpanSelectDelete = true;
                vm.showPossible = false;
                vm.setColorPlaceholder();
            }, 0);
        };

        vm.isShowPossible = function() {
            vm.activeElement = 0;
            vm.showPossible = !vm.showPossible;
            var formControl = $element.find('.select-input');
            if (vm.showPossible) {
                formControl.addClass('active');
            }
            var dHeight = $window.innerHeight;
            var dropdownHost = $element.find('.select-input-wrapper');
            var dropdownHeight = dropdownHost.height();
            var dropdownOffset = dropdownHost.offset();
            var dropdownBottom = dropdownOffset.top + dropdownHeight;
            $scope.$evalAsync(function() {
                vm.possibleLocation = !(dHeight - dropdownBottom < 162);
            });
            vm.setColorPlaceholder();
        };


        $document.bind("keydown", function(event) {
            if (vm.showPossible || $scope.isOpen) {
                switch (event.which) {
                    case 27:
                        event.preventDefault();
                        $timeout(function() {
                            vm.showPossible = false;
                            $scope.isOpen = false;
                        }, 0);
                        break;
                    case 13:
                        event.preventDefault();
                        if ((!vm.multiple && !vm.isTree) || vm.isTree) {
                            if (vm.options.length < 1) {
                                break;
                            }
                        }
                        $timeout(function() {
                            if ((!vm.multiple && !vm.isTree)) {
                                vm.addToSelected(vm.options[vm.activeElement]);
                            } else if (vm.isTree) {
                                vm.toggle(undefined, vm.options[vm.activeElement], true);
                            }

                        }, 0);

                        break;
                    case 40:
                        event.preventDefault();
                        if ((!vm.multiple && !vm.isTree) || (vm.isTree)) {
                            if (vm.options.length < 1) {
                                break;
                            }

                            if (!vm.multiple && !vm.isTree) {
                                possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);
                            } else if (vm.isTree) {
                                possibleValues = angular.element($element[0].getElementsByClassName("dropdown__items")[0]);
                            }

                            if (vm.activeElement < vm.options.length - 1) {
                                $timeout(function() {
                                    vm.activeElement++;
                                }, 0);

                                $timeout(function() {
                                    var activeTop = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
                                        activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
                                        wrapperScroll = possibleValues[0].scrollTop,
                                        wrapperHeight = possibleValues[0].clientHeight;

                                    if (activeTop >= (wrapperHeight + wrapperScroll - activeHeight)) {
                                        possibleValues[0].scrollTop += activeHeight + 1;
                                    }
                                }, 1);
                            }
                        }
                        break;
                    case 38:
                        event.preventDefault();
                        if ((!vm.multiple && !vm.isTree) || (vm.isTree)) {
                            if (vm.options.length < 1) {
                                break;
                            }

                            if (!vm.multiple && !vm.isTree) {
                                possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);
                            } else if (vm.isTree) {
                                possibleValues = angular.element($element[0].getElementsByClassName("dropdown__items")[0]);
                            }

                            if (vm.activeElement > 0) {
                                $timeout(function() {
                                    vm.activeElement--;
                                }, 0);

                                $timeout(function() {
                                    var activeTop = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
                                        activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
                                        wrapperScroll = possibleValues[0].scrollTop,
                                        wrapperHeight = possibleValues[0].clientHeight;

                                    if (activeTop < wrapperScroll) {
                                        possibleValues[0].scrollTop -= activeHeight + 1;
                                    }
                                }, 1);
                            }
                        }
                        break;
                }
            }
        });

        vm.setActiveElement = function(event, index) {
            event.stopPropagation();
            $timeout(function() {
                vm.activeElement = index;
            }, 0);
        };

        vm.setColorPlaceholder = function() {
            if (!vm.search && !vm.isTree) {
                vm.colorPlaceholder = !(vm.placeholder === $scope.field.placeholder) && !vm.showPossible;
            } else {
                vm.colorPlaceholder = !(vm.placeholder === $scope.field.placeholder) && !$scope.isOpen;
            }
        };

        vm.isBlur = function() {
            vm.showPossible = false;
            $scope.isOpen = false;
            var formControl = $element.find('.select-input');
            formControl.removeClass('active');
            vm.setColorPlaceholder();
        };

        vm.clickSelect = function() {
            $element.find('input')[0].focus();
        };

        vm.deleteToSelected = function(event, isKeydown) {
            if (isKeydown &&
                event.which == 8 &&
                !!vm.fieldValue &&
                !!vm.fieldValue.length &&
                !vm.filterText &&
                vm.multiple
            ) {
                remove(null, vm.fieldValue[vm.fieldValue.length - 1]);
            } else if (!vm.isTree && !isKeydown) {
                vm.isSpanSelectDelete = false;
                vm.fieldValue = {};
                event.stopPropagation();
            } else if (vm.isTree && !isKeydown) {
                vm.isSpanSelectDelete = false;
                remove(null, vm.fieldValue[0]);
                event.stopPropagation();
            }
        };

        function setSizeSelect() {
            var size = vm.options.length;
            var select = $element.find('select');
            if (!!select.length) {
                if (size <= 3) {
                    select[0].size = 3;
                } else if (size >= 7) {
                    select[0].size = 7;
                } else {
                    select[0].size = size;
                }
            }
        }

        vm.getDistanceByClass = function(className) {
            var elem = angular.element($element.find(className)[0]);
            return $window.innerHeight - elem.offset().top;
        };
    }

    angular
        .module('universal.editor')
        .filter('selectedValues', function() {
            return function(arr, fieldSearch) {
                var titles = arr.map(function(item) {
                    return item[fieldSearch];
                });
                return titles.join(', ');
            };
        });
})();
(function () {
    'use strict';

    /**
     * @desc Select-type field.
     * @example <div editor-field-select=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldSelect',editorFieldSelect);

    editorFieldSelect.$inject = ['$templateCache', '$document'];

    function editorFieldSelect($templateCache, $document){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldSelect/editorFieldSelect.html'),
            controller: 'EditorFieldSelectController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });

            scope.isOpen = false;

            $document.on('click', function(event) {
                if (!elem[0].contains(event.target)) {
                    scope.$apply(function() {
                        scope.vm.isBlur();
                    });

                }
            });

            scope.toggleDropdown = function() {
                elem.find('input')[0].focus();
                var dHeight = $(document).height();
                var dropdownHost = $(elem).find('.dropdown__host');
                var dropdownHeight = dropdownHost.height();
                var dropdownOffset = dropdownHost.offset();
                var dropdownBottom = dropdownOffset.top + dropdownHeight;
                elem.find('.dropdown__items').removeClass('dropdown-top');
                elem.find('.dropdown__items').removeClass('dropdown-bottom');
                if (dHeight - dropdownBottom < 300) {
                    elem.find('.dropdown__items').addClass('dropdown-top');
                } else {
                    elem.find('.dropdown__items').addClass('dropdown-bottom');
                }
                scope.isOpen = !scope.isOpen;
                if (scope.isOpen) {
                    var formControl = elem.find('.select-input');
                    formControl.addClass('active');
                }
                scope.vm.setColorPlaceholder();
            };
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldSelect/editorFieldSelect.html',
    '\n' +
    '<div>\n' +
    '    <div data-ng-if="vm.multiple &amp;&amp; !vm.isTree" data-ng-class="vm.classWidth">\n' +
    '        <div class="select-border">\n' +
    '            <select name="{{vm.fieldName}}" data-ng-disabled="vm.readonly || !vm.parentValue" data-ng-model="vm.fieldValue" multiple="multiple" size="3" class="form-control">\n' +
    '                <option data-ng-repeat="option in vm.options" value="{{option[vm.field_id]}}">{{option[vm.field_search]}}</option>\n' +
    '            </select>\n' +
    '        </div>\n' +
    '        <div data-ng-show="!!vm.loadingData" class="processing-status-wrapper">\n' +
    '            <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="!vm.multiple &amp;&amp; !vm.isTree" data-ng-class="vm.classWidth">\n' +
    '        <div data-ng-click="vm.clickSelect()" data-ng-class="{&quot;but-for-search&quot;: !vm.search, &quot;disabled-input&quot;: vm.readonly}" class="select-input-wrapper">\n' +
    '            <input type="text" data-ng-if="vm.search" placeholder="{{vm.placeholder}}" data-ng-class="vm.isSelection ? &quot;color-placeholder&quot; : &quot;&quot;" data-ng-model="vm.filterText" data-ng-change="vm.change()" data-ng-focus="vm.isShowPossible()" data-ng-blur="vm.isBlur()" ng-disabled="vm.readonly" class="form-control select-input"/>\n' +
    '            <input data-ng-if="!vm.search" data-ng-focus="vm.isShowPossible()" data-ng-blur="vm.isBlur()" class="focus-input"/>\n' +
    '            <div data-ng-if="!vm.search" class="form-control select-input">\n' +
    '                <div data-ng-class="vm.colorPlaceholder ? &quot;color-placeholder-div&quot; : &quot;&quot;" class="dropdown__selected-items">{{vm.placeholder}}</div>\n' +
    '            </div><span data-ng-if="vm.isSpanSelectDelete &amp;&amp; !vm.readonly" data-ng-click="vm.deleteToSelected($event, false)" class="selecte-delete">×</span>\n' +
    '            <div data-ng-if="!vm.readonly &amp;&amp; (vm.options.length &gt; 0) &amp;&amp; vm.showPossible" data-ng-class="vm.possibleLocation ? &quot;possible-bottom&quot; : &quot;possible-top&quot;" class="possible-values active">\n' +
    '                <div class="possible-scroll">\n' +
    '                    <div data-ng-repeat="option in vm.options" data-ng-mouseover="vm.activeElement = $index" data-ng-mousedown="vm.addToSelected(option)" data-ng-class="vm.activeElement == $index ? \'active\' : \'\'" class="possible-value-item">{{option[vm.field_search]}}</div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-show="!!vm.loadingData" class="processing-status-wrapper">\n' +
    '            <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="vm.isTree" data-ng-class="vm.classWidth" class="dropdown">\n' +
    '        <div class="dropdown__host">\n' +
    '            <div data-ng-class="{\'dropdown__title_open\': isOpen}" data-ng-click="vm.clickSelect()" data-ng-style="{&quot;cursor&quot; : vm.search ? &quot;text&quot; : &quot;pointer&quot;}" class="dropdown__title form-control select-input">\n' +
    '                <div data-ng-repeat="value in vm.fieldValue" data-ng-if="vm.fieldValue.length &amp;&amp; (vm.multiple || vm.treeParentField &amp;&amp; vm.treeChildCountField) &amp;&amp; vm.multiple" class="selected-items__item">\n' +
    '                    <div class="selected-item">{{value[vm.field_search]}}<span data-ng-click="vm.remove($event, value)" class="selected-item__btn_delete">×</span></div>\n' +
    '                </div>\n' +
    '                <input data-ng-if="vm.search" data-ng-model="vm.filterText" data-ng-change="vm.change()" placeholder="{{vm.placeholder}}" data-ng-style="vm.styleInput" size="{{vm.sizeInput}}" data-ng-focus="toggleDropdown()" data-ng-blur="vm.isBlur()" data-ng-keydown="vm.deleteToSelected($event, true)" data-ng-class="vm.colorPlaceholder ? &quot;color-placeholder&quot; : &quot;&quot;" class="dropdown__search-field"/>\n' +
    '                <input data-ng-if="!vm.search" data-ng-focus="toggleDropdown()" data-ng-blur="vm.isBlur()" class="focus-input"/>\n' +
    '                <div data-ng-if="!vm.search" class="dropdown__selected">\n' +
    '                    <div data-ng-class="vm.colorPlaceholder ? &quot;color-placeholder-div&quot; : &quot;&quot;" data-ng-if="!vm.loadingData" class="dropdown__selected-items dropdown-tree">{{vm.placeholder}}</div>\n' +
    '                </div><span data-ng-if="vm.isSpanSelectDelete" data-ng-click="vm.deleteToSelected($event, false)" class="selecte-delete">×</span>\n' +
    '                <div data-ng-if="::(vm.treeParentField &amp;&amp; vm.treeChildCountField)" data-ng-class="{\'dropdown__items_with-selected\': vm.fieldValue.length &gt; 2 || (vm.search &amp;&amp; vm.fieldValue.length)}" data-dropdown-items="" data-options="vm.options" data-is-open="isOpen &amp;&amp; vm.options.length" data-field-search="vm.field_search" data-child-count-field="vm.treeChildCountField" data-on-toggle="vm.toggle" data-api="field.values_remote.api" data-select-branches="vm.treeSelectBranches" data-assets-path="vm.assetsPath" data-multiple="vm.multiple" data-active-element="vm.activeElement" data-set-active-element="vm.setActiveElement" data-lvl-dropdown="1" class="dropdown__items dropdown__items_with-padding active dropdown-bottom"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-show="!!vm.loadingData" class="processing-status-wrapper">\n' +
    '            <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldStringController', EditorFieldStringController);

    EditorFieldStringController.$inject = ['$scope', 'EditEntityStorage', 'ArrayFieldStorage'];

    function EditorFieldStringController($scope, EditEntityStorage, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;

        if ($scope.parentField) {
            if ($scope.parentFieldIndex) {
                fieldErrorName = $scope.parentField + "_" + $scope.parentFieldIndex + "_" + $scope.fieldName;
            } else {
                fieldErrorName = $scope.parentField + "_" + $scope.fieldName;
            }
        } else {
            fieldErrorName = $scope.fieldName;
        }

        vm.cols = $scope.field.width;
        vm.classTextarea = 'col-lg-2 col-md-2 col-sm-3 col-xs-3';
        vm.fieldName = $scope.field.name;
        vm.fieldValue = undefined;
        vm.readonly = $scope.field.readonly || false;
        $scope.$parent.vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;
        vm.mask = $scope.field.mask || false;

        if (!!vm.cols) {
            if (vm.cols > 6) {
                vm.cols = 6;
            }
            if (vm.cols < 1) {
                vm.cols = 1;
            }
            vm.classTextarea = 'col-lg-' + vm.cols + ' col-md-' + vm.cols + ' col-sm-' + vm.cols + ' col-xs-' + vm.cols;
        }

        if ($scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true) {
            vm.multiple = true;
            vm.fieldValue = [];
            if ($scope.field.multiname || angular.isString($scope.field.multiname)) {
                vm.multiname = ('' + $scope.field.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = $scope.field.defaultValue || "" ;
        }

        /*
         * Если поле является частью двумерного массива - оно не сможет получить значение при загрузке сущности
         * поэтому оно всегда берёт значение поля из хранилища для полей-массивов.
         */

        if (vm.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name), function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name) || "";
            }
        }

        /* Initial method : Регистрация экземпляра поля в EditEntityStorage */
        EditEntityStorage.addFieldController(this);

        /*
         * Field system method: Возвращает текущее значение поля с учетом
         * наличия у поля родителя ( поля типа "массив" )
         */

        this.getFieldValue = function () {

            var field = {},
                wrappedFieldValue;

            if (vm.multiname) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    var tempItem = {};
                    tempItem[vm.multiname] = valueItem;
                    wrappedFieldValue.push(tempItem);
                });
            } else if (vm.multiple) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    wrappedFieldValue.push(valueItem);
                });
            } else {
                wrappedFieldValue = vm.fieldValue;
            }

            if ($scope.parentField) {
                if (vm.parentFieldIndex) {
                    field[$scope.parentField] = [];
                    field[$scope.parentField][vm.parentFieldIndex] = {};
                    field[$scope.parentField][vm.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = wrappedFieldValue;
                }
            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        };

        /*
         * Field system method: Возврашает значение поля которое используется при создании
         * новой сущности, т.е. дефолтное значение поля
         */

        this.getInitialValue = function () {

            var field = {};

            if ($scope.parentField) {
                if (vm.multiple) {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = [""];
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = "";
                }
            } else {
                if (vm.multiple) {
                    field[vm.fieldName] = [""];
                } else {
                    field[vm.fieldName] = "";
                }
            }

            return field;
        };
        /*
         * Публичные методы для представления
         * Добавление нового итема и удаление. Необходимы для multiple-полей
         */

        vm.addItem = function () {
            vm.fieldValue.push("");
        };

        vm.removeItem = function (index) {
            angular.forEach(vm.fieldValue, function (value, key) {
                if (key == index) {
                    vm.fieldValue.splice(index, 1);
                }
            });
        };

        /* Слушатель события на покидание инпута. Необходим для превалидации поля на минимальное и максимальное значение */

        vm.inputLeave = function (val) {

            if (!val) {
                return;
            }

            if($scope.field.hasOwnProperty("maxLength") && val.length > $scope.field.maxLength){
                var maxError = "Для поля превышено максимальное допустимое значение в " + $scope.field.maxLength + " символов. Сейчас введено " + val.length + " символов.";
                if ($scope.$parent.vm.error.indexOf(maxError) < 0) {
                    $scope.$parent.vm.error.push(maxError);
                }
            }

            if($scope.field.hasOwnProperty("minLength") && val.length < $scope.field.minLength){
                var minError = "Минимальное значение поля не может быть меньше " + $scope.field.minLength + " символов. Сейчас введено " + val.length + " символов.";
                if($scope.$parent.vm.error.indexOf(minError) < 0){
                    $scope.$parent.vm.error.push(minError);
                }
            }
        };

        function clear() {
            vm.fieldValue = $scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true ? [] : ($scope.field.defaultValue || "");
        }

        /* Слушатели событий бродкаста. */

        /*
         * Событие загрузки сущности ( созданной или пустой, т.е. создаваемой ).
         * Поле забирает данные из объекта сущности с учетом наличия родительского поля.
         */

        $scope.$on('editor:entity_loaded', function (event, data) {

            //-- functional for required fields
            if ($scope.field.requiredField) {
                $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField($scope.field.requiredField);
                    var result = false;
                    var endRecursion = false;
                    (function (value) {
                        var keys = Object.keys(value);
                        for (var i = keys.length; i--;) {
                            var propValue = value[keys[i]];
                            if (propValue !== null && propValue !== undefined && propValue !== "") {
                                if (angular.isObject(propValue) && !endRecursion) {
                                    arguments.callee(propValue);
                                }
                                result = true;
                                endRecursion = true;
                            }
                        }
                    })(f_value);
                    return result;
                }, function (value) {
                    if (!value) {
                        clear();
                        vm.readonly = true;
                    } else {
                        vm.readonly = $scope.field.readonly || false;
                    }
                }, true);
            }

            if (data.editorEntityType === "new") {
                if ($scope.field.defaultValue) {
                    vm.fieldValue = vm.multiple ? [$scope.field.defaultValue] : $scope.field.defaultValue;
                } else {
                    vm.fieldValue = vm.multiple ? [] : '';
                }
                if (data.hasOwnProperty($scope.field.name)) {
                    vm.fieldValue = data[$scope.field.name];
                }
                return;
            }

            if (!$scope.parentField) {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            } else {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.parentField][$scope.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            }
        });

        /*
         * При обновлении / создании сущности может быть получена ошибка.
         * В таком случае происходит броадкаст следующего события.
         * Название события генерируется сервисом RestApiService.
         */

        $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if ($scope.$parent.vm.error.indexOf(data) < 0) {
                $scope.$parent.vm.error.push(data);
            }
        });

        /*
         * При удалении директивы она должна отправлять запрос в EditEntityStorage
         * чтобы последний удалил её из списка отслеживаемых полей.
         */

        $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function (error) {
                    if ($scope.$parent.vm.error.indexOf(error) < 0) {
                        $scope.$parent.vm.error.push(error);
                    }
                });
            } else {
                if ($scope.$parent.vm.error.indexOf(data) < 0) {
                    $scope.$parent.vm.error.push(data);
                }
            }
        });

        /* Удаление контроллера поля из сервиса управления данными полей. Происходит при исчезании поля */

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy($scope.parentField, $scope.parentFieldIndex, $scope.field.name, vm.fieldValue);
            }
        });

        /* Очистка массива ошибок при внесении пользователем изменений в поле */

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            $scope.$parent.vm.error = [];
        }, true);

    }
})();
(function () {
    'use strict';

    /**
     * @desc String-type field.
     * @example <div editor-field-string=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldString',editorFieldString);

    editorFieldString.$inject = ['$templateCache'];

    function editorFieldString($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldString/editorFieldString.html'),
            controller: 'EditorFieldStringController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldString/editorFieldString.html',
    '\n' +
    '<div>\n' +
    '    <div data-ng-if="vm.multiple" data-ng-class="vm.classTextarea">\n' +
    '        <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-string-wrapper input-group">\n' +
    '            <input type="text" data-ui-mask="{{vm.mask}}" data-ng-disabled="vm.readonly" name="{{vm.fieldName}}" data-ng-model="vm.fieldValue[$index]" data-ng-blur="vm.inputLeave(vm.fieldValue[$index])" class="form-control input-sm"/><span class="input-group-btn">\n' +
    '                <button data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</button></span>\n' +
    '        </div>\n' +
    '        <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="!vm.multiple" data-ng-class="vm.classTextarea">\n' +
    '        <input type="text" data-ui-mask="{{vm.mask}}" data-ng-disabled="vm.readonly" name="{{vm.fieldName}}" data-ng-model="vm.fieldValue" data-ng-blur="vm.inputLeave(vm.fieldValue)" size="{{vm.size}}" class="form-control input-sm"/>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldTextareaController', EditorFieldTextareaController);

    EditorFieldTextareaController.$inject = ['$scope', 'EditEntityStorage', 'ArrayFieldStorage'];

    function EditorFieldTextareaController($scope, EditEntityStorage, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;

        if ($scope.parentField) {
            if ($scope.parentFieldIndex) {
                fieldErrorName = $scope.parentField + "_" + $scope.parentFieldIndex + "_" + $scope.fieldName;
            } else {
                fieldErrorName = $scope.parentField + "_" + $scope.fieldName;
            }
        } else {
            fieldErrorName = $scope.fieldName;
        }
        vm.rows = $scope.field.height;
        vm.cols = $scope.field.width;
        vm.classTextarea = 'col-lg-6 col-md-6 col-sm-7 col-xs-8';
        vm.fieldName = $scope.field.name;
        vm.fieldValue = "";
        vm.readonly = $scope.field.readonly || false;
        $scope.$parent.vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;

        if (!!vm.cols) {
            if (vm.cols > 6) {
                vm.cols = 6;
            }
            if (vm.cols < 1) {
                vm.cols = 1;
            }
            vm.classTextarea = 'col-lg-' + vm.cols + ' col-md-' + vm.cols + ' col-sm-' + vm.cols + ' col-xs-' + vm.cols;
        }

        if ($scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true) {
            vm.multiple = true;
            vm.fieldValue = [];
            if ($scope.field.multiname || angular.isString($scope.field.multiname)) {
                vm.multiname = ('' + $scope.field.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = "";
        }

        if (vm.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name), function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name) || "";
            }
        }

        EditEntityStorage.addFieldController(this);

        this.getFieldValue = function () {

            var field = {};
            var wrappedFieldValue;

            if (vm.multiname) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    var tempItem = {};
                    tempItem[vm.multiname] = valueItem;
                    wrappedFieldValue.push(tempItem);
                });
            } else if (vm.multiple) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    wrappedFieldValue.push(valueItem);
                });
            } else {
                wrappedFieldValue = vm.fieldValue;
            }

            if ($scope.parentField) {
                if (vm.parentFieldIndex) {
                    field[$scope.parentField] = [];
                    field[$scope.parentField][vm.parentFieldIndex] = {};
                    field[$scope.parentField][vm.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = wrappedFieldValue;
                }

            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        };

        this.getInitialValue = function () {

            var field = {};

            if ($scope.parentField) {
                if (vm.multiple) {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = [""];
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = "";
                }
            } else {
                if (vm.multiple) {
                    field[vm.fieldName] = [""];
                } else {
                    field[vm.fieldName] = "";
                }
            }

            return field;
        };

        vm.addItem = function () {
            vm.fieldValue.push("");
        };

        vm.removeItem = function (index) {
            angular.forEach(vm.fieldValue, function (value, key) {
                if (key == index) {
                    vm.fieldValue.splice(index, 1);
                }
            });
        };

        vm.inputLeave = function (val) {
            if (!val) {
                return;
            }

            if($scope.field.hasOwnProperty("maxLength") && val.length > $scope.field.maxLength){
                var maxError = "Для поля превышено максимальное допустимое значение в " + $scope.field.maxLength + " символов. Сейчас введено " + val.length + " символов.";
                if ($scope.$parent.vm.error.indexOf(maxError) < 0) {
                    $scope.$parent.vm.error.push(maxError);
                }
            }

            if($scope.field.hasOwnProperty("minLength") && val.length < $scope.field.minLength){
                var minError = "Минимальное значение поля не может быть меньше " + $scope.field.minLength + " символов. Сейчас введено " + val.length + " символов.";
                if($scope.$parent.vm.error.indexOf(minError) < 0){
                    $scope.$parent.vm.error.push(minError);
                }
            }
        };

        function clear() {
            vm.fieldValue = $scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true ? [] : "";
        }

        $scope.$on('editor:entity_loaded', function (event, data) {

            //-- functional for required fields
            if ($scope.field.requiredField) {
                $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField($scope.field.requiredField);
                    var result = false;
                    var endRecursion = false;
                    (function (value) {
                        var keys = Object.keys(value);
                        for (var i = keys.length; i--;) {
                            var propValue = value[keys[i]];
                            if (propValue !== null && propValue !== undefined && propValue !== "") {
                                if (angular.isObject(propValue) && !endRecursion) {
                                    arguments.callee(propValue);
                                }
                                result = true;
                                endRecursion = true;
                            }
                        }
                    })(f_value);
                    return result;
                }, function (value) {
                    if (!value) {
                        clear();
                        vm.readonly = true;
                    } else {
                        vm.readonly = $scope.field.readonly || false;
                    }
                }, true);
            }

            if (data.editorEntityType === "new") {
                if ($scope.field.defaultValue) {
                    vm.fieldValue = vm.multiple ? [$scope.field.defaultValue] : $scope.field.defaultValue;
                } else {
                    vm.fieldValue = vm.multiple ? [] : '';
                }
                return;
            }

            if (!$scope.parentField) {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            } else {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.parentField][$scope.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            }
        });

        $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function (error) {
                    if ($scope.$parent.vm.error.indexOf(error) < 0) {
                        $scope.$parent.vm.error.push(error);
                    }
                });
            } else {
                if ($scope.$parent.vm.error.indexOf(data) < 0) {
                    $scope.$parent.vm.error.push(data);
                }
            }
        });

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy($scope.parentField, $scope.parentFieldIndex, $scope.field.name, vm.fieldValue);
            }
        });

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            $scope.$parent.vm.error = [];
        }, true);
    }
})();
(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('editorFieldTextarea',editorFieldTextarea);

    editorFieldTextarea.$inject = ['$templateCache'];

    function editorFieldTextarea($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldTextarea/editorFieldTextarea.html'),
            controller: 'EditorFieldTextareaController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldTextarea/editorFieldTextarea.html',
    '\n' +
    '<div>\n' +
    '    <div data-ng-if="vm.multiple" data-ng-class="vm.classTextarea">\n' +
    '        <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-textarea-wrapper">\n' +
    '            <div>\n' +
    '                <textarea name="{{vm.fieldName}}" rows="{{vm.rows}}" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue[$index]" data-ng-blur="vm.inputLeave(vm.fieldValue[$index])" class="form-control editor-textarea"></textarea>\n' +
    '                <div data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="!vm.multiple" data-ng-class="vm.classTextarea">\n' +
    '        <div>\n' +
    '            <textarea name="{{vm.fieldName}}" rows="{{vm.rows}}" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue" data-ng-blur="vm.inputLeave(vm.fieldValue)" class="form-control editor-textarea"></textarea>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldTimeController', EditorFieldTimeController);

    EditorFieldTimeController.$inject = ['$scope', 'EditEntityStorage', '$element', 'moment', 'ArrayFieldStorage'];

    function EditorFieldTimeController($scope, EditEntityStorage, $element, moment, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var regExpPattern = /^([01]\d|2[0-3]):([0-5]\d)$/i;
        var fieldErrorName;

        if ($scope.parentField) {
            if ($scope.parentFieldIndex) {
                fieldErrorName = $scope.parentField + "_" + $scope.parentFieldIndex + "_" + $scope.fieldName;
            } else {
                fieldErrorName = $scope.parentField + "_" + $scope.fieldName;
            }
        } else {
            fieldErrorName = $scope.fieldName;
        }

        vm.fieldName = $scope.field.name;
        vm.fieldValue = "";
        vm.readonly = $scope.field.readonly || false;
        vm.sourceTime = moment();
        $scope.$parent.vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;

        if ($scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true) {
            vm.multiple = true;
            vm.fieldValue = [];
            if ($scope.field.multiname || angular.isString($scope.field.multiname)) {
                vm.multiname = ('' + $scope.field.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = "";
        }

        if (vm.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name), function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname] ? moment(item[vm.multiname], 'YYYY-MM-DD HH:mm:ss') : "");
                    } else {
                        vm.fieldValue.push(item ? moment(item, 'YYYY-MM-DD HH:mm:ss') : "");
                    }
                });
            } else {
                var timeValue = ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name);
                vm.fieldValue = timeValue ? moment(timeValue, 'YYYY-MM-DD HH:mm:ss') : vm.fieldValue;
            }
        }

        EditEntityStorage.addFieldController(this);

        this.getFieldValue = function () {

            var field = {};
            var wrappedFieldValue;

            if (vm.multiname) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    if (!valueItem || valueItem === "" || !moment.isMoment(valueItem)) {
                        return;
                    }
                    var tempItem = {};
                    tempItem[vm.multiname] = moment(valueItem).format('YYYY-MM-DD HH:mm:ss');
                    wrappedFieldValue.push(tempItem);
                });
            } else if (vm.multiple) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    wrappedFieldValue.push(moment(valueItem).format('YYYY-MM-DD HH:mm:ss'));
                });
            } else {
                if (!vm.fieldValue || vm.fieldValue === "" || !moment.isMoment(vm.fieldValue)) {
                    wrappedFieldValue = "";
                } else {
                    wrappedFieldValue = moment(vm.fieldValue).format('YYYY-MM-DD HH:mm:ss');
                }
            }

            if ($scope.parentField) {
                if (vm.parentFieldIndex) {
                    field[$scope.parentField] = [];
                    field[$scope.parentField][vm.parentFieldIndex] = {};
                    field[$scope.parentField][vm.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = wrappedFieldValue;
                }
            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        };

        this.getInitialValue = function () {

            var field = {};

            if ($scope.parentField) {
                if (vm.multiple) {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = [];
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = moment();
                }
            } else {
                if (vm.multiple) {
                    field[vm.fieldName] = [];
                } else {
                    field[vm.fieldName] = moment();
                }
            }

            return field;
        };

        vm.addItem = function () {
            vm.fieldValue.push(moment());
        };

        vm.removeItem = function (index) {
            angular.forEach(vm.fieldValue, function (value, key) {
                if (key == index) {
                    vm.fieldValue.splice(index, 1);
                }
            });
        };

        function clear() {
            vm.fieldValue = $scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true ? [] : "";
        }

        $scope.$on('editor:entity_loaded', function (event, data) {

            //-- functional for required fields
            if ($scope.field.requiredField) {
                $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField($scope.field.requiredField);
                    var result = false;
                    var endRecursion = false;
                    (function (value) {
                        var keys = Object.keys(value);
                        for (var i = keys.length; i--;) {
                            var propValue = value[keys[i]];
                            if (propValue !== null && propValue !== undefined && propValue !== "") {
                                if (angular.isObject(propValue) && !endRecursion) {
                                    arguments.callee(propValue);
                                }
                                result = true;
                                endRecursion = true;
                            }
                        }
                    })(f_value);
                    return result;
                }, function (value) {
                    if (!value) {
                        clear();
                        vm.readonly = true;
                    } else {
                        vm.readonly = $scope.field.readonly || false;
                    }
                }, true);
            }


            if (data.editorEntityType === "new") {
                var defaultValue = moment();
                if(!!$scope.field.defaultValue && moment($scope.field.defaultValue, 'HH:mm').isValid()){
                    defaultValue = moment($scope.field.defaultValue, 'HH:mm');
                }
                vm.fieldValue = vm.multiple ? [defaultValue] : defaultValue;
                return;
            }

            if (!$scope.parentField) {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.field.name] ?
                        moment(data[$scope.field.name], 'YYYY-MM-DD HH:mm:ss') : "";
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(moment(item[vm.multiname], 'YYYY-MM-DD HH:mm:ss'));
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(moment(item, 'YYYY-MM-DD HH:mm:ss'));
                    });
                }
            } else {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.parentField][$scope.field.name] ?
                        moment(data[$scope.parentField][$scope.field.name], 'YYYY-MM-DD HH:mm:ss') :
                        "";
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(moment(item[vm.multiname], 'YYYY-MM-DD HH:mm:ss'));
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(moment(item, 'YYYY-MM-DD HH:mm:ss'));
                    });
                }
            }
        });

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            $scope.$parent.vm.error = [];
        }, true);

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy($scope.parentField, $scope.parentFieldIndex, $scope.field.name, vm.fieldValue);
            }
        });

        $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function (error) {
                    if ($scope.$parent.vm.error.indexOf(error) < 0) {
                        $scope.$parent.vm.error.push(error);
                    }
                });
            } else {
                if ($scope.$parent.vm.error.indexOf(data) < 0) {
                    $scope.$parent.vm.error.push(data);
                }
            }
        });
    }
})();
(function () {
    'use strict';

    /**
     * @desc String-type field.
     * @example <div editor-field-time=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFieldTime',editorFieldTime);

    editorFieldTime.$inject = ['$templateCache'];

    function editorFieldTime($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFieldTime/editorFieldTime.html'),
            controller: 'EditorFieldTimeController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFieldTime/editorFieldTime.html',
    '\n' +
    '<div>\n' +
    '    <div data-ng-if="vm.multiple" class="col-lg-2 col-md-2 col-sm-3 col-xs-3">\n' +
    '        <div data-ng-repeat="field_item in vm.fieldValue track by $index" class="item-timepicker-wrapper input-group">\n' +
    '            <input name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue[$index]" data-date-time="" data-format="HH:mm" data-max-view="hours" data-min-view="minutes" data-view="hours" class="form-control input-sm timepicker"/><span class="input-group-btn">\n' +
    '                <button data-ng-click="vm.removeItem($index)" data-ng-if="!vm.readonly" class="btn btn-default btn-sm">x</button></span>\n' +
    '        </div>\n' +
    '        <div data-ng-click="vm.addItem()" data-ng-if="!vm.readonly" class="btn btn-primary btn-sm">{{\'BUTTON.ADD\' | translate}}</div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="!vm.multiple" class="col-lg-2 col-md-2 col-sm-3 col-xs-3">\n' +
    '        <input name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" data-ng-model="vm.fieldValue" data-date-time="" data-format="HH:mm" data-max-view="hours" data-min-view="minutes" data-view="hours" class="form-control input-sm timepicker"/>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterAutocompleteController', EditorFilterAutocompleteController);

    EditorFilterAutocompleteController.$inject = ['$scope', '$element', 'FilterFieldsStorage', '$location', 'RestApiService', '$timeout', 'ArrayFieldStorage'];

    function EditorFilterAutocompleteController($scope, $element, FilterFieldsStorage, $location, RestApiService, $timeout, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var filterErrorName = $scope.filterName;
        var inputTimeout;
        var possibleValues = angular.element($element[0].getElementsByClassName('possible-scroll')[0]);

        var remote = $scope.filter.valuesRemote;
        vm.filter_id = "id";
        vm.filter_search = "title";
        if (remote) {
            if (remote.fields) {
                if (remote.fields.value) {
                    vm.filter_id = remote.fields.value;
                }
                if (remote.fields.label) {
                    vm.filter_search = remote.fields.label;
                } else {
                    vm.filter_search = vm.filter_id;
                }
            }
        }
        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.selectedValues = [];
        vm.activeElement = 0;
        vm.preloadedData = false;
        vm.searching = false;
        vm.minCount = $scope.filter.minCount || 2;

        vm.filterValue = $location.search()[vm.filterName] || '';
        vm.inputValue = '';
        vm.classInput = {
            'width': '99%',
            'padding-right': '25px'
        };
        vm.showPossible = false;
        vm.placeholder = '';

        loadValues();

        /* Initial method : Регистрация экземпляра поля в FilterFieldsStorage */
        FilterFieldsStorage.addFilterController(this);

        $element.find("input").bind("keydown", function (event) {
            switch (event.which) {
                case 13:
                    event.preventDefault();
                    if (vm.possibleValues.length < 1) {
                        break;
                    }

                    $timeout(function () {
                        vm.addToSelected(event, vm.possibleValues[vm.activeElement]);
                    }, 0);

                    break;
                case 40:
                    event.preventDefault();
                    if (vm.possibleValues.length < 1) {
                        break;
                    }

                    possibleValues = angular.element($element[0].getElementsByClassName('possible-scroll')[0]);

                    if (vm.activeElement < vm.possibleValues.length - 1) {
                        $timeout(function () {
                            vm.activeElement++;
                        }, 0);

                        $timeout(function () {
                            var activeTop = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
                                activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
                                wrapperScroll = possibleValues[0].scrollTop,
                                wrapperHeight = possibleValues[0].clientHeight;

                            if (activeTop >= (wrapperHeight + wrapperScroll - activeHeight)) {
                                possibleValues[0].scrollTop += activeHeight + 1;
                            }
                        }, 1);
                    }
                    break;
                case 38:
                    event.preventDefault();
                    if (vm.possibleValues.length < 1) {
                        break;
                    }

                    possibleValues = angular.element($element[0].getElementsByClassName('possible-scroll')[0]);

                    if (vm.activeElement > 0) {
                        $timeout(function () {
                            vm.activeElement--;
                        }, 0);

                        $timeout(function () {
                            var activeTop = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
                                activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
                                wrapperScroll = possibleValues[0].scrollTop,
                                wrapperHeight = possibleValues[0].clientHeight;

                            if (activeTop < wrapperScroll) {
                                possibleValues[0].scrollTop -= activeHeight + 1;
                            }
                        }, 1);
                    }
                    break;
            }
        });

        /*
         * Filter system method: Возвращает текущее значение поля
         */

        this.getFilterValue = function () {
            var field = {};
            if (vm.filterValue !== "") {
                field[vm.filterName] = vm.filterValue;
                return field;
            } else {
                return false;
            }
        };

        /*
         * Filter system method: Возврашает значение поля которое используется при создании
         * новой сущности, т.е. дефолтное значение поля
         */

        this.getInitialValue = function () {
            var filter = {};
            filter[vm.filterName] = '';
            return filter;
        };

        this.setInitialValue = function () {
            vm.filterValue = '';
            vm.selectedValues = [];
            vm.inputValue = '';
            vm.placeholder = '';
        };

        /*
         * При удалении директивы она должна отправлять запрос в FilterFieldsStorage
         * чтобы последний удалил её из списка отслеживаемых фильтров.
         */

        $scope.$on('$destroy', function () {
            FilterFieldsStorage.deleteFilterController(vm);
        });

        /*
         * При изменении значения поля - меняется параметр url.
         * При инициализации поля - текущее значение поля берется соответствующее значению параметра url
         */

        $scope.$watch(function () {
            return vm.inputValue;
        }, function (newVal) {
            if (inputTimeout) {
                $timeout.cancel(inputTimeout);
            }
            vm.possibleValues = [];
            inputTimeout = $timeout(function () {
                autocompleteSearch(newVal);
            }, 300);
        });

        $scope.$watch(function () {
            return vm.filterValue;
        }, function (newVal) {
            if (newVal !== "") {
                $location.search(vm.filterName, newVal);
            } else {
                $location.search(vm.filterName, null);
            }
        });

        /* PUBLIC METHODS */

        vm.addToSelected = function (event, obj) {
            vm.selectedValues = [];
            vm.selectedValues.push(obj);
            vm.filterValue = obj['id'];
            vm.inputValue = '';
            vm.possibleValues = [];
            vm.placeholder = obj[vm.filter_search];
            event.stopPropagation();
        };

        vm.removeFromSelected = function (event) {
            vm.selectedValues = [];
            vm.filterValue = '';
            vm.placeholder = '';
        };

        /* PRIVATE METHODS */

        function autocompleteSearch(searchString) {
            if (searchString === "" || searchString.length <= vm.minCount) {
                return;
            }

            vm.searching = true;

            if ($scope.filter.hasOwnProperty("values")) {
                angular.forEach($scope.filter.values, function (v, key) {
                    var obj = {};
                    obj[vm.filter_id] = key;
                    obj[vm.filter_search] = v;
                    if (containsString(v, searchString) && !alreadySelected(obj)) {
                        vm.possibleValues.push(obj);
                    }
                });
                vm.activeElement = 0;
                vm.searching = false;
            } else {
                var urlParam = {};
                urlParam[vm.filter_search] = "%" + searchString + "%";
                RestApiService
                    .getUrlResource($scope.filter.valuesRemote.url + "?filter=" + JSON.stringify(urlParam))
                    .then(function (response) {
                        angular.forEach(response.data.items, function (v) {
                            if (!alreadySelected(v) && !alreadyInPossible(v)) {
                                vm.possibleValues.push(v);
                            }
                        });
                        vm.activeElement = 0;
                        vm.searching = false;
                    }, function (reject) {
                        console.error('EditorFieldAutocompleteController: Не удалось получить значения для поля \"' + $scope.filter.name + '\" с удаленного ресурса');
                        vm.searching = false;
                    });
            }
        }

        function containsString(str, search) {
            return (str.toLowerCase().indexOf(search.toLowerCase()) >= 0);
        }

        function alreadyInPossible(obj) {
            var inPossible = false;

            angular.forEach(vm.possibleValues, function (v) {
                if (v[vm.filter_id] == obj[vm.filter_id]) {
                    inPossible = true;
                }
            });

            return inPossible;
        }

        function alreadySelected(obj) {
            var inSelected = false;
            angular.forEach(vm.selectedValues, function (v) {
                if (v[vm.filter_id] == obj[vm.filter_id]) {
                    inSelected = true;
                }
            });
            return inSelected;
        }

        function loadValues() {
            var search = $location.search();
            if ($scope.filter.hasOwnProperty("values")) {
                angular.forEach($scope.filter.values, function (v, key) {
                    var obj = {};
                    if (angular.isArray($scope.filter.values)) {
                        obj[vm.filter_id] = v;
                    } else {
                        obj[vm.filter_id] = key;
                    }
                    obj[vm.filter_search] = v;
                    if (!!search && search.hasOwnProperty(vm.filterName) && search[vm.filterName] == obj[vm.filter_id]) {
                        vm.selectedValues.push(obj);
                        vm.placeholder = obj[vm.filter_search];
                    }
                });
                vm.preloadedData = true;
            } else if ($scope.filter.hasOwnProperty("valuesRemote")) {
                if (vm.filterValue === undefined || vm.filterValue === '') {
                    vm.preloadedData = true;
                    return;
                }

                var urlParam;
                urlParam = {};
                urlParam[vm.filter_id] = [];
                urlParam[vm.filter_id].push(vm.filterValue);
                RestApiService
                    .getUrlResource($scope.filter.valuesRemote.url + "?filter=" + JSON.stringify(urlParam))
                    .then(function (response) {
                        if (!!search && search.hasOwnProperty(vm.filterName)) {
                            angular.forEach(response.data.items, function (v) {
                                if (search[vm.filterName] == v[vm.filter_id]) {
                                    vm.selectedValues.push(v);
                                    vm.placeholder = v[vm.filter_search];
                                }
                            });
                        }
                        vm.preloadedData = true;
                    }, function (reject) {
                        vm.preloadedData = true;
                        console.error('EditorFieldAutocompleteController: Не удалось получить значения для поля \"' + $scope.filter.name + '\" с удаленного ресурса');
                    });
            } else {
                vm.preloadedData = true;
                console.error('EditorFieldAutocompleteController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
            }
        }

        vm.focusPossible = function (isActive) {
            vm.isActivePossible = isActive;
            if (!vm.multiple) {
                if ($element.find('.autocomplete-item').length > 0) {
                    if (isActive) {
                        $element.find('.autocomplete-field-search').removeClass('hidden');
                        $element.find('.autocomplete-item').addClass('opacity-item');
                    } else {
                        $element.find('.autocomplete-field-search').addClass('hidden');
                        $element.find('.autocomplete-item').removeClass('opacity-item');
                    }
                }
            }
        }
    }
})();

(function () {
    'use strict';

    /**
     * @desc Autocomplete-type filter.
     * @example <div editor-filter-autocomplete=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterAutocomplete',editorFilterAutocomplete);

    editorFilterAutocomplete.$inject = ['$templateCache', '$document'];

    function editorFilterAutocomplete($templateCache, $document){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFilterAutocomplete/editorFilterAutocomplete.html'),
            controller: 'EditorFilterAutocompleteController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){

            $document.on('click', function(event) {
                if (!elem.find('.filter-inner-wrapper')[0].contains(event.target)) {
                    scope.$apply(function() {
                        scope.vm.showPossible = false;
                    });

                }
            });

            scope.inputFocus = function() {
                if (!scope.vm.multiple) {
                    elem.find('.autocomplete-field-search').removeClass('hidden');
                    elem.find('.autocomplete-item').addClass('opacity-item');
                }
                scope.vm.showPossible = true;
                elem.find('input')[0].focus();
            };

            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterAutocomplete/editorFilterAutocomplete.html',
    '\n' +
    '<div class="editor-autocomplete-wrapper">\n' +
    '    <div title="{{vm.filterDisplayName}}" class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <div data-ng-show="vm.preloadedData" data-ng-class="{&quot;active&quot; : vm.isActivePossible}" data-ng-click="inputFocus()" class="autocomplete-input-wrapper form-control">\n' +
    '            <input type="text" name="{{vm.filterName}}" data-ng-model="vm.inputValue" data-ng-focus="vm.focusPossible(true)" data-ng-blur="vm.focusPossible(false)" data-ng-style="vm.classInput" placeholder="{{vm.placeholder}}" data-ng-class="!vm.isActivePossible ? &quot;color-placeholder&quot; : &quot;&quot;" class="autocomplete-field-search"/><span data-ng-if="!vm.multiple &amp;&amp; !!vm.selectedValues.length" data-ng-click="vm.removeFromSelected($event)" class="selecte-delete selecte-delete-autocomplete">×</span>\n' +
    '            <div data-ng-show="vm.searching" class="loader-search-wrapper">\n' +
    '                <div class="loader-search">{{\'LOADING\' | translate}}</div>\n' +
    '            </div>\n' +
    '            <div data-ng-if="vm.possibleValues.length &gt; 0 &amp;&amp; vm.showPossible" class="possible-values possible-autocomplete active possible-bottom">\n' +
    '                <div class="possible-scroll">\n' +
    '                    <div data-ng-repeat="possible in vm.possibleValues" data-ng-mouseover="vm.activeElement = $index" data-ng-click="vm.addToSelected($event,possible)" data-ng-class="vm.activeElement == $index ? \'active\' : \'\'" class="possible-value-item">{{possible[vm.filter_search]}}</div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterCheckboxController',EditorFilterCheckboxController);

    EditorFilterCheckboxController.$inject = ['$scope','FilterFieldsStorage','RestApiService'];

    function EditorFilterCheckboxController($scope,FilterFieldsStorage,RestApiService){
        /* jshint validthis: true */
        var vm = this;

        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.filterValue = [];
        vm.selectedValues = [];
        var remote = $scope.filter.valuesRemote;
        vm.field_id = "id";
        vm.field_search = "title";
        if (remote) {
            if(remote.fields){
                if (remote.fields.value) {
                    vm.field_id = remote.fields.value;
                }
                if (remote.fields.label) {
                    vm.field_search = remote.fields.label;
                }
            }
        }
        FilterFieldsStorage.addFilterController(this);

        if($scope.filter.hasOwnProperty("values")){
            angular.forEach($scope.filter.values, function (v,key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                vm.selectedValues.push(obj);
            });
        } else if ($scope.filter.hasOwnProperty("valuesRemote")){
            RestApiService
                .getUrlResource($scope.filter.valuesRemote.url)
                .then(function (response) {
                    angular.forEach(response.data.items, function (v) {
                        vm.selectedValues.push(v);
                    });
                }, function (reject) {
                    console.error('EditorFilterCheckboxController: Не удалось получить значения для поля \"' + $scope.filter.fieldName + '\" с удаленного ресурса');
                });
        } else {
            console.error('EditorFilterCheckboxController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
        }

        this.getFilterValue = function () {

            var field = {};

            if(vm.filterValue.length !== 0){
                field[vm.filterName] = vm.filterValue;
                return field;
            } else {
                return false;
            }
        };

        this.getInitialValue = function () {

            var filter = {};

            filter[vm.filterValue] = [];

            return filter;
        };

        this.setInitialValue = function () {
            vm.filterValue = [];
        };

        /*
         * При удалении директивы она должна отправлять запрос в FilterFieldsStorage
         * чтобы последний удалил её из списка отслеживаемых фильтров.
         */

        $scope.$on('$destroy', function () {
            FilterFieldsStorage.deleteFilterController(vm);
        });
    }
})();

(function () {
    'use strict';

    /**
     * @desc Checkbox-type filter.
     * @example <div editor-filter-checkbox=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterCheckbox',editorFilterCheckbox);

    editorFilterCheckbox.$inject = ['$templateCache'];

    function editorFilterCheckbox($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFilterCheckbox/editorFilterCheckbox.html'),
            controller: 'EditorFilterCheckboxController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterCheckbox/editorFilterCheckbox.html',
    '\n' +
    '<div>\n' +
    '    <div title="{{vm.filterDisplayName}}" class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <label data-ng-repeat="item in vm.selectedValues" class="checkbox-inline">\n' +
    '            <input type="checkbox" data-checklist-model="vm.filterValue" data-checklist-value="item[vm.field_id]"/>{{item[vm.field_search]}}\n' +
    '        </label>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterDateController',EditorFilterDateController);

    EditorFilterDateController.$inject = ['$scope','FilterFieldsStorage','moment'];

    function EditorFilterDateController($scope,FilterFieldsStorage,moment){
        /* jshint validthis: true */
        var vm = this;

        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.filterValueStartDate = "";
        vm.filterValueStartTime = "";
        vm.filterValueEndDate = "";
        vm.filterValueEndTime = "";
        
        FilterFieldsStorage.addFilterController(this);

        this.getFilterValue = function () {

            var field = {};

            if(
                vm.filterValueStartDate === "" &&
                vm.filterValueEndDate === "" &&
                vm.filterValueStartTime === "" &&
                vm.filterValueEndTime === ""
            ){
                return false;
            } else {

                var st = moment.isMoment(vm.filterValueStartTime) ? " " + moment(vm.filterValueStartTime).format("HH:mm:ss") : "";
                var et = moment.isMoment(vm.filterValueEndTime) ? " " + moment(vm.filterValueEndTime).format("HH:mm:ss") : "";

                if(vm.filterValueStartDate !== "" && vm.filterValueEndDate === ""){
                    field[">=" + vm.filterName] = moment(vm.filterValueStartDate).format("YYYY-MM-DD") + st;
                } else if (vm.filterValueStartDate === "" && vm.filterValueEndDate !== ""){
                    field["<=" + vm.filterName] = moment(vm.filterValueEndDate).format("YYYY-MM-DD") + et;
                } else {
                    field[">=" + vm.filterName] = moment(vm.filterValueStartDate).format("YYYY-MM-DD") + st;
                    field["<=" + vm.filterName] = moment(vm.filterValueEndDate).format("YYYY-MM-DD") + et;
                }
                return field;
            }
        };

        this.getInitialValue = function () {

            var filter = {};

            filter[vm.filterName] = "";

            return filter;
        };

        this.setInitialValue = function () {
            vm.filterValueStartDate = "";
            vm.filterValueStartTime = "";
            vm.filterValueEndDate = "";
            vm.filterValueEndTime = "";
        };

        $scope.$on('$destroy', function () {
            FilterFieldsStorage.deleteFilterController(vm);
        });
    }
})();

(function () {
    'use strict';

    /**
     * @desc Date-type filter.
     * @example <div editor-filter-date=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterDate',editorFilterDate);

    editorFilterDate.$inject = ['$templateCache'];

    function editorFilterDate($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFilterDate/editorFilterDate.html'),
            controller: 'EditorFilterDateController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterDate/editorFilterDate.html',
    '\n' +
    '<div class="filter-date-wrapper">\n' +
    '    <div title="{{vm.filterDisplayName}}" class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <div class="filter-start">\n' +
    '            <div class="editor-date">\n' +
    '                <input data-date-time="" data-ng-model="vm.filterValueStartDate" data-format="YYYY-MM-DD" data-max-view="year" data-min-view="date" data-view="date" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '            <div class="editor-time">\n' +
    '                <input data-ng-disabled="!vm.filterValueStartDate" data-date-time="" data-ng-model="vm.filterValueStartTime" data-format="HH:mm:ss" data-max-view="hours" data-min-view="minutes" data-view="hours" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '        </div><span class="divider">-</span>\n' +
    '        <div class="filter-end">\n' +
    '            <div class="editor-date">\n' +
    '                <input data-date-time="" data-ng-model="vm.filterValueEndDate" data-format="YYYY-MM-DD" data-max-view="year" data-min-view="date" data-view="date" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '            <div class="editor-time">\n' +
    '                <input data-ng-disabled="!vm.filterValueEndDate" data-date-time="" data-ng-model="vm.filterValueEndTime" data-format="HH:mm:ss" data-max-view="hours" data-min-view="minutes" data-view="hours" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterDateTimeController',EditorFilterDateTimeController);

    EditorFilterDateTimeController.$inject = ['$scope','FilterFieldsStorage','moment'];

    function EditorFilterDateTimeController($scope,FilterFieldsStorage,moment){
        /* jshint validthis: true */
        var vm = this;

        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.filterValueStartDateTime = "";
        vm.filterValueEndDateTime = "";

        FilterFieldsStorage.addFilterController(this);

        this.getFilterValue = function () {

            var field = {};

            if(vm.filterValueStartDateTime === "" && vm.filterValueEndDateTime === ""){
                return false;
            } else {
                if(vm.filterValueStartDateTime !== "" && vm.filterValueEndDateTime === ""){
                    field[">=" + vm.filterName] = moment.utc(vm.filterValueStartDateTime).format("YYYY-MM-DD HH:mm:ss");
                } else if (vm.filterValueStartDateTime === "" && vm.filterValueEndDateTime !== ""){
                    field["<=" + vm.filterName] = moment.utc(vm.filterValueEndDateTime).format("YYYY-MM-DD HH:mm:ss");
                } else {
                    field[">=" + vm.filterName] = moment.utc(vm.filterValueStartDateTime).format("YYYY-MM-DD HH:mm:ss");
                    field["<=" + vm.filterName] = moment.utc(vm.filterValueEndDateTime).format("YYYY-MM-DD HH:mm:ss");
                }
                return field;
            }
        };

        this.getInitialValue = function () {
            var filter = {};
            filter[vm.filterName] = "";
            return filter;
        };

        this.setInitialValue = function () {
            vm.filterValueStartDateTime = "";
            vm.filterValueEndDateTime = "";
        };

        $scope.$on('$destroy', function () {
            FilterFieldsStorage.deleteFilterController(vm);
        });
    }
})();

(function () {
    'use strict';

    /**
     * @desc DateTime-type filter.
     * @example <div editor-filter-datetime=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterDatetime',editorFilterDatetime);

    editorFilterDatetime.$inject = ['$templateCache'];

    function editorFilterDatetime($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFilterDatetime/editorFilterDatetime.html'),
            controller: 'EditorFilterDateTimeController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterDatetime/editorFilterDatetime.html',
    '\n' +
    '<div class="filter-datetime-wrapper">\n' +
    '    <div title="{{vm.filterDisplayName}}" class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <div class="filter-start">\n' +
    '            <div class="editor-datetime">\n' +
    '                <input date-time="" name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" ng-model="vm.filterValueStartDateTime" view="date" timezone="UTC" format="YYYY-MM-DD HH:mm:ss" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '        </div><span class="divider">-</span>\n' +
    '        <div class="filter-end">\n' +
    '            <div class="editor-datetime">\n' +
    '                <input date-time="" name="{{vm.fieldName}}" data-ng-disabled="vm.readonly" ng-model="vm.filterValueEndDateTime" view="date" timezone="UTC" format="YYYY-MM-DD HH:mm:ss" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterNumberController',EditorFilterNumberController);

    EditorFilterNumberController.$inject = ['$scope','FilterFieldsStorage','$location','RestApiService'];

    function EditorFilterNumberController($scope,FilterFieldsStorage,$location,RestApiService){
        /* jshint validthis: true */
        var vm = this;

        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.filterValue = $location.search()[vm.filterName] || null;

        FilterFieldsStorage.addFilterController(this);
        this.getFilterValue = function () {
            var field = {};
            if(vm.filterValue !== null){
                field[vm.filterName] = vm.filterValue;
                return field;
            } else {
                return false;
            }
        };

        this.getInitialValue = function () {
            var filter = {};
            filter[vm.filterName] = null;
            return filter;
        };

        this.setInitialValue = function () {
            vm.filterValue = null;
        };

        $scope.$on('$destroy', function () {
            FilterFieldsStorage.deleteFilterController(vm);
        });

        $scope.$watch(function () {
            return vm.filterValue;
        }, function (newVal) {
            if(newVal !== null){
                $location.search(vm.filterName,newVal);
            } else {
                $location.search(vm.filterName,null);
            }
        });
    }
})();

(function () {
    'use strict';

    /**
     * @desc String-type filter.
     * @example <div editor-filter-number=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterNumber',editorFilterNumber);

    editorFilterNumber.$inject = ['$templateCache'];

    function editorFilterNumber($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFilterNumber/editorFilterNumber.html'),
            controller: 'EditorFilterNumberController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterNumber/editorFilterNumber.html',
    '\n' +
    '<div>\n' +
    '    <div title="{{vm.filterDisplayName}}" class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <input type="number" name="{{vm.filterName}}" data-ng-model="vm.filterValue" class="form-control input-sm"/>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterRadiolistController',EditorFilterRadiolistController);

    EditorFilterRadiolistController.$inject = ['$scope','FilterFieldsStorage','RestApiService'];

    function EditorFilterRadiolistController($scope,FilterFieldsStorage,RestApiService){
        /* jshint validthis: true */
        var vm = this;

        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.filterValue = null;
        vm.selectedValues = [];
        var remote = $scope.filter.valuesRemote;
        vm.field_id = "id";
        vm.field_search = "title";
        if (remote) {
            if(remote.fields){
                if (remote.fields.value) {
                    vm.field_id = remote.fields.value;
                }
                if (remote.fields.label) {
                    vm.field_search = remote.fields.label;
                }
            }
        }

        FilterFieldsStorage.addFilterController(this);

        if($scope.filter.hasOwnProperty("values")){
            angular.forEach($scope.filter.values, function (v,key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                vm.selectedValues.push(obj);
            });
        } else if ($scope.filter.hasOwnProperty("valuesRemote")){
            RestApiService
                .getUrlResource($scope.filter.valuesRemote.url)
                .then(function (response) {
                    angular.forEach(response.data.items, function (v) {
                        vm.selectedValues.push(v);
                    });
                }, function (reject) {
                    console.error('EditorFilterRadiolistController: Не удалось получить значения для поля \"' + $scope.filter.fieldName + '\" с удаленного ресурса');
                });
        } else {
            console.error('EditorFilterRadiolistController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
        }

        this.getFilterValue = function () {

            var field = {};

            if(vm.filterValue){
                field[vm.filterName] = vm.filterValue;
                return field;
            } else {
                return false;
            }
        };

        this.getInitialValue = function () {

            var filter = {};

            filter[vm.filterValue] = null;

            return filter;
        };

        this.setInitialValue = function () {
            vm.filterValue = null;
        };

        /*
         * При удалении директивы она должна отправлять запрос в FilterFieldsStorage
         * чтобы последний удалил её из списка отслеживаемых фильтров.
         */

        $scope.$on('$destroy', function () {
            FilterFieldsStorage.deleteFilterController(vm);
        });
    }
})();

(function () {
    'use strict';

    /**
     * @desc Radiolist-type filter.
     * @example <div editor-filter-radiolist=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterRadiolist',editorFilterRadiolist);

    editorFilterRadiolist.$inject = ['$templateCache'];

    function editorFilterRadiolist($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFilterRadiolist/editorFilterRadiolist.html'),
            controller: 'EditorFilterRadiolistController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterRadiolist/editorFilterRadiolist.html',
    '\n' +
    '<div>\n' +
    '    <div title="{{vm.filterDisplayName}}" class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <label data-ng-repeat="item in vm.selectedValues" class="radio-inline">\n' +
    '            <input type="radio" data-ng-model="vm.filterValue" value="{{item[vm.field_id]}}"/>{{item[vm.field_search]}}\n' +
    '        </label>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterSelectController', EditorFilterSelectController);

    EditorFilterSelectController.$inject = ['$scope', 'FilterFieldsStorage', 'RestApiService', '$location', '$timeout', '$element', '$document'];

    function EditorFilterSelectController($scope, FilterFieldsStorage, RestApiService, $location, $timeout, $element, $document) {
        /* jshint validthis: true */
        var vm = this;

        var remote = $scope.filter.valuesRemote;
        vm.field_id = "id";
        vm.field_search = "title";
        if (remote) {
            if (remote.fields) {
                if (remote.fields.value) {
                    vm.field_id = remote.fields.value;
                }
                if (remote.fields.label) {
                    vm.field_search = remote.fields.label;
                }
            }
        }

        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.selectedValues = [];
        vm.placeholder = $scope.filter.placeholder || '';
        vm.activeElement = 0;
        vm.search = $scope.filter.search;
        var possibleValues = angular.element($element[0].getElementsByClassName("possible-values")[0]);
        vm.change = change;
        vm.isSelection = false;
        vm.isSpanSelectDelete = false;

        FilterFieldsStorage.addFilterController(this);
        var allOptions;

        if ($scope.filter.hasOwnProperty("values")) {
            if ($location.search()[vm.filterName]) {
                vm.filterValue = parseInt($location.search()[vm.filterName]);
                vm.isSpanSelectDelete = true;
            }
            angular.forEach($scope.filter.values, function (v, key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                vm.selectedValues.push(obj);
                if ($location.search()[vm.filterName] && key == vm.filterValue) {
                    vm.placeholder = v;
                    vm.isSelection = true;
                }
            });
            allOptions = angular.copy(vm.selectedValues);
        } else if ($scope.filter.hasOwnProperty("valuesRemote")) {
            RestApiService
                .getUrlResource($scope.filter.valuesRemote.url)
                .then(function (response) {
                    if ($location.search()[vm.filterName]) {
                        vm.filterValue = parseInt($location.search()[vm.filterName]);
                        vm.isSpanSelectDelete = true;
                    }
                    angular.forEach(response.data.items, function (v) {
                        vm.selectedValues.push(v);
                        if ($location.search()[vm.filterName] && v[vm.field_id] == vm.filterValue) {
                            $timeout(function () {
                                vm.placeholder = v[vm.field_search];
                                vm.isSelection = true;
                                setColorPlaceholder();
                            }, 0);
                        }
                    });
                    allOptions = angular.copy(vm.selectedValues);
                }, function (reject) {
                    console.error('EditorFilterSelectController: Не удалось получить значения для поля \"' + $scope.filter.fieldName + '\" с удаленного ресурса');
                });
        } else {
            console.error('EditorFilterSelectController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
        }
        this.getFilterValue = function () {

            var field = {};

            if (vm.filterValue !== null) {
                field[vm.filterName] = vm.filterValue;
                return field;
            } else {
                return false;
            }
        };

        this.getInitialValue = function () {

            var filter = {};

            filter[vm.filterValue] = [];

            return filter;
        };

        this.setInitialValue = function () {
            vm.filterValue = null;
        };

        /*
         * При удалении директивы она должна отправлять запрос в FilterFieldsStorage
         * чтобы последний удалил её из списка отслеживаемых фильтров.
         */

        $scope.$on('$destroy', function () {
            FilterFieldsStorage.deleteFilterController(vm);
        });

        /*
         * При изменении значения поля - меняется параметр url.
         * При инициализации поля - текущее значение селекта берется соответствующее значению параметра url
         */

        $scope.$watch(function () {
            return vm.filterValue;
        }, function (newVal) {
            vm.isSelection = false;
            if (newVal !== undefined) {
                vm.isSelection = vm.showPossible;
                $location.search(vm.filterName, newVal);
            }
        });

        vm.addToSelected = function (val) {
            vm.filterValue = val[vm.field_id];
            vm.filterText = '';
            $timeout(function () {
                vm.placeholder = (!!val && !!val[vm.field_search]) ? val[vm.field_search] : $scope.filter.placeholder;
                vm.showPossible = false;
                vm.isSpanSelectDelete = true;
                setColorPlaceholder();
            }, 0);
        };

        vm.isShowPossible = function (event) {
            vm.activeElement = 0;
            change();
            vm.showPossible = !vm.showPossible;
            var formControl = $element.find('.select-input');
            if (vm.showPossible) {
                formControl.addClass('active');
            }
            setColorPlaceholder();
        };

        $document.bind("keydown", function (event) {
            if (event.which === 9) {
                vm.isBlur();
            }
            if (vm.showPossible) {
                switch (event.which) {
                    case 27:
                        event.preventDefault();
                        $timeout(function () {
                            vm.showPossible = false;
                        }, 0);
                        break;
                    case 13:
                        event.preventDefault();
                        if (vm.selectedValues.length < 1) {
                            break;
                        }

                        $timeout(function () {
                            vm.addToSelected(vm.selectedValues[vm.activeElement]);
                        }, 0);

                        break;
                    case 40:
                        event.preventDefault();
                        if (vm.selectedValues.length < 1) {
                            break;
                        }

                        possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);

                        if (vm.activeElement < vm.selectedValues.length - 1) {
                            $timeout(function () {
                                vm.activeElement++;
                            }, 0);

                            $timeout(function () {
                                var activeTop = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
                                    activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
                                    wrapperScroll = possibleValues[0].scrollTop,
                                    wrapperHeight = possibleValues[0].clientHeight;

                                if (activeTop >= (wrapperHeight + wrapperScroll - activeHeight)) {
                                    possibleValues[0].scrollTop += activeHeight + 1;
                                }
                            }, 1);
                        }
                        break;
                    case 38:
                        event.preventDefault();
                        if (vm.selectedValues.length < 1) {
                            break;
                        }

                        possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);

                        if (vm.activeElement > 0) {
                            $timeout(function () {
                                vm.activeElement--;
                            }, 0);

                            $timeout(function () {
                                var activeTop = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
                                    activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
                                    wrapperScroll = possibleValues[0].scrollTop,
                                    wrapperHeight = possibleValues[0].clientHeight;

                                if (activeTop < wrapperScroll) {
                                    possibleValues[0].scrollTop -= activeHeight + 1;
                                }
                            }, 1);
                        }
                        break;
                }
            }
        });

        function change() {
            vm.activeElement = 0;
            var filterName =  allOptions.filter(function (opt) {
                return opt[vm.field_id] == vm.filterValue;
            });
            if (!!vm.filterValue && !vm.filterText) {
                vm.isSelection = false;
                vm.placeholder = $scope.filter.placeholder || '';
            } else {
                vm.placeholder = '';
            }
            if (!vm.filterText) {
                vm.placeholder = $scope.filter.placeholder;
                if (!!vm.filterValue && filterName.length > 0) {
                    vm.placeholder = filterName[0][vm.field_search];
                    vm.isSelection = true;
                }

                if (allOptions) {
                    vm.selectedValues = allOptions;
                }
                return;
            }
            if (!allOptions) {
                allOptions = angular.copy(vm.selectedValues);
            }
            vm.selectedValues = filter(angular.copy(allOptions), vm.filterText);
        }

        function filter(opts, filterText) {
            var result = [];
            result = opts.filter(function (opt) {
                if (opt.childOpts && opt.childOpts.length) {
                    opt.childOpts = filter(opt.childOpts, filterText);
                }
                return (opt[vm.field_search].toLowerCase()).indexOf(filterText.toLowerCase()) > -1 || (opt.childOpts && opt.childOpts.length);
            });

            return result;
        }

        function setColorPlaceholder() {
            if (!vm.search) {
                vm.colorPlaceholder = !(vm.placeholder === $scope.filter.placeholder) && !vm.showPossible;
            }
        }

        vm.isBlur = function() {
            vm.showPossible = false;
            var formControl = $element.find('.select-input');
            formControl.removeClass('active');
            setColorPlaceholder();
        };

        vm.clickSelect = function() {
            $element.find('input')[0].focus();
        };

        vm.deleteToSelected = function(event, isKeydown) {
            vm.isSpanSelectDelete = false;
            vm.filterValue = null;
            vm.placeholder = $scope.filter.placeholder || '';
            setColorPlaceholder();
            event.stopPropagation();
        };
    }
})();

(function () {
    'use strict';

    /**
     * @desc Checkbox-type filter.
     * @example <div editor-filter-checkbox=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterSelect',editorFilterSelect);

    editorFilterSelect.$inject = ['$templateCache', '$document'];

    function editorFilterSelect($templateCache, $document){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFilterSelect/editorFilterSelect.html'),
            controller: 'EditorFilterSelectController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){

            $document.on('click', function() {
                if (!elem.find('.filter-inner-wrapper')[0].contains(event.target) ) {
                    scope.$apply(function() {
                        scope.vm.isBlur()
                    });
                }
            });

            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterSelect/editorFilterSelect.html',
    '\n' +
    '<div>\n' +
    '    <div title="{{vm.filterDisplayName}}" class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <div data-ng-click="vm.clickSelect()" data-ng-class="!vm.search ? &quot;but-for-search&quot; : &quot;&quot;" class="select-input-wrapper">\n' +
    '            <input data-ng-if="vm.search" placeholder="{{vm.placeholder}}" data-ng-class="vm.isSelection ? &quot;color-placeholder&quot; : &quot;&quot;" data-ng-model="vm.filterText" data-ng-change="vm.change()" data-ng-focus="vm.isShowPossible()" class="form-control"/>\n' +
    '            <input data-ng-if="!vm.search" data-ng-focus="vm.isShowPossible()" class="focus-input"/>\n' +
    '            <div data-ng-if="!vm.search" class="form-control select-input">\n' +
    '                <div data-ng-class="vm.colorPlaceholder ? &quot;color-placeholder-div&quot; : &quot;&quot;" class="dropdown__selected-items">{{vm.placeholder}}</div>\n' +
    '            </div><span data-ng-if="vm.isSpanSelectDelete" data-ng-click="vm.deleteToSelected($event, false)" class="selecte-delete">×</span>\n' +
    '            <div data-ng-if="!vm.readonly &amp;&amp; (vm.selectedValues.length &gt; 0) &amp;&amp; vm.showPossible" class="possible-values active possible-bottom">\n' +
    '                <div class="possible-scroll">\n' +
    '                    <div data-ng-repeat="option in vm.selectedValues" data-ng-mouseover="vm.activeElement = $index" data-ng-click="vm.addToSelected(option)" data-ng-class="vm.activeElement == $index ? \'active\' : \'\'" class="possible-value-item">{{option[vm.field_search]}}</div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterStringController',EditorFilterStringController);

    EditorFilterStringController.$inject = ['$scope','FilterFieldsStorage','$location','RestApiService'];

    function EditorFilterStringController($scope,FilterFieldsStorage,$location,RestApiService){
        /* jshint validthis: true */
        var vm = this;

        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.filterValue = $location.search()[vm.filterName] || "";

        /* Initial method : Регистрация экземпляра поля в FilterFieldsStorage */
        FilterFieldsStorage.addFilterController(this);

        /*
         * Filter system method: Возвращает текущее значение поля
         */

        this.getFilterValue = function () {

            var field = {};

            if(vm.filterValue.trim() !== ""){
                field[vm.filterName] = '%' + vm.filterValue + '%';
                return field;
            } else {
                return false;
            }
        };

        /*
         * Filter system method: Возврашает значение поля которое используется при создании
         * новой сущности, т.е. дефолтное значение поля
         */

        this.getInitialValue = function () {

            var filter = {};

            filter[vm.filterName] = "";

            return filter;
        };

        this.setInitialValue = function () {
            vm.filterValue = "";
        };


        /*
         * При удалении директивы она должна отправлять запрос в FilterFieldsStorage
         * чтобы последний удалил её из списка отслеживаемых фильтров.
         */

        $scope.$on('$destroy', function () {
            FilterFieldsStorage.deleteFilterController(vm);
        });

        /*
         * При изменении значения поля - меняется параметр url.
         * При инициализации поля - текущее значение поля берется соответствующее значению параметра url
         */

        $scope.$watch(function () {
            return vm.filterValue;
        }, function (newVal) {
            if(newVal !== ""){
                $location.search(vm.filterName,newVal);
            } else {
                $location.search(vm.filterName,null);
            }
        });


    }
})();

(function () {
    'use strict';

    /**
     * @desc String-type filter.
     * @example <div editor-filter-string=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterString',editorFilterString);

    editorFilterString.$inject = ['$templateCache'];

    function editorFilterString($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFilterString/editorFilterString.html'),
            controller: 'EditorFilterStringController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterString/editorFilterString.html',
    '\n' +
    '<div>\n' +
    '    <div title="{{vm.filterDisplayName}}" class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <input type="text" name="{{vm.filterName}}" data-ng-model="vm.filterValue" class="form-control input-sm"/>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterTimeController',EditorFilterTimeController);

    EditorFilterTimeController.$inject = ['$scope','FilterFieldsStorage','moment'];

    function EditorFilterTimeController($scope,FilterFieldsStorage,moment){
        /* jshint validthis: true */
        var vm = this;

        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.filterValueStartTime = "";
        vm.filterValueEndTime = "";

        FilterFieldsStorage.addFilterController(this);

        this.getFilterValue = function () {

            var field = {};

            if(
                vm.filterValueStartTime === "" &&
                vm.filterValueEndTime === ""
            ){
                return false;
            } else {
                if(vm.filterValueStartTime !== "" && vm.filterValueEndTime === ""){
                    field[">=" + vm.filterName] = moment(vm.filterValueStartTime).format("HH:mm:ss");
                } else if (vm.filterValueStartTime === "" && vm.filterValueEndTime !== ""){
                    field["<=" + vm.filterName] = moment(vm.filterValueEndTime).format("HH:mm:ss");
                } else {
                    field[">=" + vm.filterName] = moment(vm.filterValueStartTime).format("HH:mm:ss");
                    field["<=" + vm.filterName] = moment(vm.filterValueEndTime).format("HH:mm:ss");
                }
                return field;
            }
        };

        this.getInitialValue = function () {

            var filter = {};

            filter[vm.filterName] = "";

            return filter;
        };

        this.setInitialValue = function () {
            vm.filterValueStartTime = "";
            vm.filterValueEndTime = "";
        };

        $scope.$on('$destroy', function () {
            FilterFieldsStorage.deleteFilterController(vm);
        });
    }
})();

(function () {
    'use strict';

    /**
     * @desc Date-type filter.
     * @example <div editor-filter-date=""></div>
     */
    angular
        .module('universal.editor')
        .directive('editorFilterTime',editorFilterTime);

    editorFilterTime.$inject = ['$templateCache'];

    function editorFilterTime($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : true,
            template : $templateCache.get('module/directives/editorFilterTime/editorFilterTime.html'),
            controller: 'EditorFilterTimeController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/editorFilterTime/editorFilterTime.html',
    '\n' +
    '<div class="filter-time-wrapper">\n' +
    '    <div title="{{vm.filterDisplayName}}" class="filter-name-label"><span>{{vm.filterDisplayName}}</span></div>\n' +
    '    <div class="filter-inner-wrapper">\n' +
    '        <div class="filter-start">\n' +
    '            <div class="editor-time">\n' +
    '                <input data-date-time="" data-ng-model="vm.filterValueStartTime" data-format="HH:mm:ss" data-max-view="hours" data-min-view="minutes" data-view="hours" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '        </div><span class="divider">-</span>\n' +
    '        <div class="filter-end">\n' +
    '            <div class="editor-time">\n' +
    '                <input data-date-time="" data-ng-model="vm.filterValueEndTime" data-format="HH:mm:ss" data-max-view="hours" data-min-view="minutes" data-view="hours" class="form-control input-sm"/>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('FieldWrapperController',FieldWrapperController);

    FieldWrapperController.$inject = ['$scope', 'RestApiService'];

    function FieldWrapperController($scope, RestApiService){
        var vm = this;
        vm.error = [];
        var entityObject = RestApiService.getEntityObject();
        $scope.className = {};
        if(angular.isString($scope.fieldName)) {
          $scope.className['field-element-' + $scope.fieldName] = $scope.fieldName;
        }

        if($scope.parentField){
            angular.forEach(entityObject.tabs, function (tab) {
                angular.forEach(tab.fields, function (field) {
                    if(field.name == $scope.parentField){
                        angular.forEach(field.fields, function (innerField) {
                            if(innerField.name == $scope.fieldName){
                                $scope.field = innerField;
                                return;
                            }
                        });
                    }
                });
            });
        } else {
            angular.forEach(entityObject.tabs, function (tab) {
                angular.forEach(tab.fields, function (field) {
                    if(field.name == $scope.fieldName){
                        $scope.field = field;
                        return;
                    }
                });
            });
        }

        vm.fieldDisplayName = $scope.field.label;
        vm.hint = $scope.field.hint || false;
        vm.required = $scope.field.required || false;
        vm.isArray = ($scope.field.type == 'array');
    }
})();
(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('fieldWrapper',fieldWrapper);

    fieldWrapper.$inject = ['$templateCache','FieldBuilder','configData','$timeout'];

    function fieldWrapper($templateCache,FieldBuilder,configData,$timeout){
        return {
            restrict : 'A',
            replace : true,
            scope : {
                fieldName : '@',
                parentField : '@',
                parentFieldIndex : '@'
            },
            template : $templateCache.get('module/directives/fieldWrapper/fieldWrapper.html'),
            controller: 'FieldWrapperController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            var element = elem.find('.field-element');
            elem.on('$destroy', function () {
                scope.$destroy();
            });

            $timeout(function () {
                element.addClass("field-wrapper-" + scope.field.type);
            },0);

            element.append(new FieldBuilder(scope).build());
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/fieldWrapper/fieldWrapper.html',
    '\n' +
    '<div data-ng-class="className" class="field-wrapper">\n' +
    '    <div data-ng-class="!vm.isArray ? \'row\' : \'\' ">\n' +
    '        <div data-ng-if="!vm.isArray" class="field-name-label col-lg-6 col-md-6 col-sm-5 col-xs-4">\n' +
    '            <div data-ng-if="vm.hint" class="field-hint">\n' +
    '                <div class="hint-text">{{vm.hint}}</div>\n' +
    '            </div><span data-ng-class="vm.required ? \'editor-required\' : \'\' ">{{vm.fieldDisplayName}}:</span>\n' +
    '        </div>\n' +
    '        <div class="field-element"></div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="!vm.isArray" class="field-error-wrapper">\n' +
    '        <div data-ng-repeat="err in vm.error track by $index" class="error-item alert alert-danger">{{err}}</div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('FilterWrapperController',FilterWrapperController);

    FilterWrapperController.$inject = [];

    function FilterWrapperController(){

    }
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .directive('filterWrapper',filterWrapper);

    filterWrapper.$inject = ['$templateCache','FilterBuilder','configData','RestApiService'];

    function filterWrapper($templateCache,FilterBuilder,configData,RestApiService){
        return {
            restrict : 'A',
            replace : true,
            scope : {
                filterName : '@',
            },
            template : $templateCache.get('module/directives/filterWrapper/filterWrapper.html'),
            controller: 'FilterWrapperController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });

            elem.ready(function () {
                elem.find("input").bind("keydown", function (event) {
                    if(event.which == 13){
                        event.preventDefault();
                        //TODO
                        //editorController.applyFilter();
                    }
                });
            });

            var entityObject = RestApiService.getEntityObject();

            angular.forEach(entityObject.tabs, function (tab) {
                angular.forEach(tab.fields, function (field) {
                    if(field.name == scope.filterName){
                        scope.filter = field;
                        return;
                    }
                });
            });

            elem.append(new FilterBuilder(scope).build());
        }
    }
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/filterWrapper/filterWrapper.html',
    '\n' +
    '<div class="filter-wrapper"></div>');
}]);
})();

(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UniversalEditorController',UniversalEditorController);

    UniversalEditorController.$inject = ['$scope','$rootScope','configData','RestApiService','FilterFieldsStorage','$location','$document','$timeout','$httpParamSerializer','$state','configObject','toastr', '$translate', 'ConfigDataProvider', 'EditEntityStorage', '$window'];

    function UniversalEditorController($scope,$rootScope,configData,RestApiService,FilterFieldsStorage,$location,$document,$timeout,$httpParamSerializer,$state,configObject,toastr, $translate, ConfigDataProvider, EditEntityStorage, $window){
        $scope.entity = RestApiService.getEntityType();
        var entityObject = RestApiService.getEntityObject();
        /* jshint validthis: true */
        var vm = this,
            pageItems = 3,
            metaKey,
            itemsKey,
            mixEntityObject,
            alertNotSaved;

        vm.assetsPath = '/assets/universal-editor';

        if ($scope.entity === undefined || angular.isUndefined(entityObject)){
            console.error("Editor: Сущность с типом \"" + $scope.entity + "\" не описана в конфигурационном файле");
            return;
        }
        vm.configData = configData;
        vm.correctEntityType = true;
        vm.entityLoaded = false;
        vm.listLoaded = false;
        vm.loadingData = true;
        vm.tabs = entityObject.tabs;
        vm.tableFields = [];
        vm.items = [];
        vm.links = [];
        vm.errors = [];
        vm.notifys = [];
        vm.tabsVisibility = [];
        vm.currentTab = vm.tabs[0].label;
        vm.entityId = "";
        vm.editorEntityType = "new";
        vm.sortField = "";
        vm.sortingDirection = true;
        vm.pageItemsArray = [];
        vm.contextLinks = entityObject.contextMenu;
        vm.listHeaderBar = entityObject.listHeaderBar;
        vm.editFooterBarNew = [];
        vm.editFooterBarExist = [];
        vm.contextId = undefined;
        vm.idField = 'id';
        vm.parentButton = false;
        vm.filterFields = [];
        vm.visibleFilter = true;
        vm.pagination = entityObject.backend.hasOwnProperty("pagination") ? entityObject.backend.pagination : true;
        vm.autoCompleteFields = [];
        vm.entityType = $scope.entity;

        if (!!vm.configData.ui && !!vm.configData.ui.assetsPath) {
            vm.assetsPath = vm.configData.ui.assetsPath;
        }

        if(entityObject.backend.hasOwnProperty('fields')){
            vm.idField = entityObject.backend.fields.primaryKey || vm.idField;
        }

        var mixEntity = RestApiService.getMixModeByEntity();
        vm.isMixMode = mixEntity.existence;
        if(mixEntity.existence){
            vm.prependIcon = mixEntity.prependIcon || 'title';
            vm.subType = mixEntity.entityTypeName || "type";
            vm.mixEntityType = mixEntity.entity;
            mixEntityObject = configData.entities.filter(function (item) {
                return item.name === vm.mixEntityType;
            })[0];
            vm.mixedListHeaderBar = mixEntityObject.listHeaderBar;
            vm.mixContextLinks = mixEntityObject.contextMenu;
        }
        vm.metaKey = false;
        metaKey = "_meta";
        itemsKey = "items";

        angular.forEach(entityObject.tabs, function (tab) {
            angular.forEach(tab.fields, function (field) {
                if (field.list === true && (field.valuesRemote || field.values)) {
                    vm.autoCompleteFields.push(field);
                }

                if(field.hasOwnProperty("list") && field.list === true){
                    vm.tableFields.push({
                        field : field.name,
                        displayName : field.label || field.name
                    });
                }
            });
        });
        angular.forEach(entityObject.editFooterBar, function (editFooterBar) {
            switch (editFooterBar.type){
                case 'add':
                    vm.editFooterBarNew.push(editFooterBar);
                    break;
                case 'presave':
                    vm.editFooterBarNew.push(editFooterBar);
                    vm.editFooterBarExist.push(editFooterBar);
                    break;
                case 'update':
                    vm.editFooterBarExist.push(editFooterBar);
                    break;
                case 'delete':
                    vm.editFooterBarExist.push(editFooterBar);
                    break;
                case 'request':
                    vm.editFooterBarNew.push(editFooterBar);
                    vm.editFooterBarExist.push(editFooterBar);
                    break;
                case 'targetBlank':
                    vm.editFooterBarNew.push(editFooterBar);
                    vm.editFooterBarExist.push(editFooterBar);
                    break;
                case 'download':
                    vm.editFooterBarNew.push(editFooterBar);
                    vm.editFooterBarExist.push(editFooterBar);
                    break;
            }
        });

        if(mixEntity.existence){
          angular.forEach(mixEntityObject.tabs, function (tab) {
              angular.forEach(tab.fields, function (field) {
                  if(field.hasOwnProperty("list") && field.list === true && !isInTableFields(field.name) ){
                      vm.tableFields.push({
                          field : field.name,
                          displayName : field.label || field.name
                      });
                  }
              });
          });
        }

        vm.sortField = entityObject.backend.sortBy || vm.tableFields[0].field;

        angular.forEach(vm.tabs, function (tab,ind) {
            if(tab.fields.length > 0){
                vm.tabsVisibility.push(tab.fields[0].name);
                angular.forEach(tab.fields,function(field){
                    if(field.hasOwnProperty("filterable") && field.filterable === false) {
                        // ;)
                    } else {
                        vm.filterFields.push(field);
                    }
                });
            } else {
                vm.tabsVisibility.push("");
            }
        });


        vm.getScope = function(){
            return $scope;
        };

        vm.setTabVisible = function (index,value) {
            vm.tabsVisibility[index] = value;
        };

        vm.closeEditor = function () {
            $scope.$apply(function () {
                vm.entityLoaded = false;
            });
        };

        vm.closeButton = function () {

            vm.entityLoaded = false;
            vm.listLoaded = false;

            var params = {};
            var isReload = false;
            if($state.params.back){
                params.back = $state.params.back;
            }
            if($state.params.parent){
                params.parent = $state.params.parent;
                isReload = false;
            }
            RestApiService.getItemsList();
            $state.go('editor.type.list', params, {reload: isReload});
        };

        vm.applyFilter = function () {
            RestApiService.setFilterParams(FilterFieldsStorage.getFilterValue());
            RestApiService.getItemsList();
        };

        vm.clearFilter = function () {
            FilterFieldsStorage.setInitialValues();
            RestApiService.setFilterParams({});
            if ($state.is('editor.type.list')) {
                RestApiService.getItemsList();
            }
        };


        if (!RestApiService.isProcessing) {
            vm.clearFilter();
        }

        vm.changePage = function (event, linkHref) {
            event.preventDefault();
            vm.listLoaded = false;
            var params = linkHref.split("?")[1];
            RestApiService.getItemsListWithParams(params);
        };

        vm.changeSortField = function (field) {
            vm.listLoaded = false;
            if(vm.sortField == field){
                vm.sortingDirection = !vm.sortingDirection;
            } else {
                vm.sortField = field;
            }

            var sortingParam = {
                sort : vm.sortingDirection ? field : "-" + field
            };

            RestApiService.getItemsList({
                sort : vm.sortingDirection ? field : "-" + field
            });
        };

        vm.contextAction = function (button,id) {
            RestApiService.contextMenuAction(button,id);
        };

        vm.toggleContextView = function (id) {
            if(vm.contextId == id){
                vm.contextId = undefined;
            } else {
                vm.contextId = id;
            }
        };

        vm.getParent = function () {
            RestApiService.loadParent($location.search().parent);
        };

        vm.toggleFilterVisibility = function () {
            if(!vm.entityLoaded){
                vm.visibleFilter = !vm.visibleFilter;
            }
        };

        $rootScope.$broadcast('editor:set_entity_type',$scope.entity);


        $scope.$on('editor:items_list', function (event, data) {
            if ($state.is('editor.type.new')) {
                return;
            }

            vm.metaKey = true;
            vm.listLoaded = true;
            vm.items = data[itemsKey];

            if (angular.isDefined(entityObject.backend.keys)) {
                metaKey = entityObject.backend.keys.meta || metaKey;
                itemsKey = entityObject.backend.keys.items || itemsKey;
                vm.metaKey = (entityObject.backend.keys.meta != false);
            }

            vm.autoCompleteFields.forEach(function (field) {

                if (vm.autoCompleteFields.length === 0) {
                    return;
                }

                var fieldForEdit = field.name, // ключ для замены
                    ids = [], // массив айдишников
                    paramStr = ""; // стpока json c params,
                if (fieldForEdit && field.valuesRemote && field.valuesRemote.fields.label) {
                    vm.items.forEach(function (item) {
                        var val = item[fieldForEdit];
                        item[fieldForEdit + "_copy"] = val;
                        item[fieldForEdit] = "";
                        if (val && ids.indexOf(val) === -1) { ids.push(val); }
                    });

                    if (ids.length) {
                        paramStr = '?filter={"' + field.valuesRemote.fields.key + '":[' + ids.join(',') + ']}';
                    }
                    RestApiService.getData(field.valuesRemote.url + paramStr).then(function (res) {
                        if (res.data.items && res.data.items.length) {
                            vm.linkedNames = res.data.items;
                            for (var i = vm.linkedNames.length; i--;) {
                                var linkItem = vm.linkedNames[i];
                                if (linkItem) {
                                    vm.items.forEach(function (item) {
                                        if (item[fieldForEdit + "_copy"] == linkItem.id) {
                                            item[fieldForEdit] = linkItem[field.valuesRemote.fields.label];
                                        }
                                    });
                                }
                            }
                        }
                    }, function (error) {
                        console.log(error);
                    });
                }
                if (field.values) {
                    for (var i = vm.items.length; i--;) {
                        var temp = vm.items[i][fieldForEdit];
                        vm.items[i][fieldForEdit] = field.values[temp] || temp;
                    }
                }
            });

            vm.entityLoaded = false;
            vm.parentButton = !!$location.search().hasOwnProperty("parent");

            vm.pageItemsArray = [];

            var startIndex;
            var endIndex;
            var qParams = RestApiService.getQueryParams();

            // PAGINATION
            if(vm.items.length === 0){
                vm.metaKey = false;
            }
            if(vm.pagination && vm.metaKey){

                vm.metaData = data[metaKey];
                vm.metaData.fromItem = ((data[metaKey].currentPage - 1) * data[metaKey].perPage ) + 1;
                vm.metaData.toItem = ((data[metaKey].currentPage - 1) * data[metaKey].perPage ) + data[itemsKey].length;

                if(data[metaKey].currentPage > 1){
                    qParams.page = 1;
                    vm.pageItemsArray.push({
                        label : "<<",
                        href : entityObject.backend.url + "?" + $httpParamSerializer(qParams)
                    });

                    qParams.page = data[metaKey].currentPage - 1;
                    vm.pageItemsArray.push({
                        label : "<",
                        href : entityObject.backend.url + "?" + $httpParamSerializer(qParams)
                    });
                }

                if(data[metaKey].currentPage > pageItems + 1){
                    qParams.page = data[metaKey].currentPage - pageItems - 1;
                    vm.pageItemsArray.push({
                        label : "...",
                        href : entityObject.backend.url + "?" + $httpParamSerializer(qParams)
                    });
                }

                if( data[metaKey].currentPage - pageItems > 0){
                    startIndex = data[metaKey].currentPage - pageItems;
                } else {
                    startIndex = 1;
                }

                while(startIndex < data[metaKey].currentPage){
                    qParams.page = startIndex;
                    vm.pageItemsArray.push({
                        label : startIndex,
                        href : entityObject.backend.url + "?" + $httpParamSerializer(qParams)
                    });

                    startIndex++;
                }

                vm.pageItemsArray.push({
                    label : data[metaKey].currentPage,
                    self : true
                });

                if( data[metaKey].currentPage + pageItems < data[metaKey].pageCount){
                    endIndex = data[metaKey].currentPage + pageItems;
                } else {
                    endIndex = data[metaKey].pageCount;
                }

                var tempCurrentPage = data[metaKey].currentPage + 1;

                while(tempCurrentPage <= endIndex){
                    qParams.page = tempCurrentPage;
                    vm.pageItemsArray.push({
                        label : tempCurrentPage,
                        href : entityObject.backend.url + "?" + $httpParamSerializer(qParams)
                    });

                    tempCurrentPage++;
                }

                if(data[metaKey].currentPage + pageItems < data[metaKey].pageCount){
                    qParams.page = data[metaKey].currentPage + pageItems + 1;
                    vm.pageItemsArray.push({
                        label : "...",
                        href : entityObject.backend.url + "?" + $httpParamSerializer(qParams)
                    });
                }

                if(data[metaKey].currentPage < data[metaKey].pageCount){
                    qParams.page = data[metaKey].currentPage + 1;
                    vm.pageItemsArray.push({
                        label : ">",
                        href : entityObject.backend.url + "?" + $httpParamSerializer(qParams)
                    });

                    qParams.page = data[metaKey].pageCount;
                    vm.pageItemsArray.push({
                        label : ">>",
                        href : entityObject.backend.url + "?" + $httpParamSerializer(qParams)
                    });
                }
            }
            //END PAGINATION
        });

        $scope.$on('editor:entity_loaded', function (event,data) {
            if (configData.hasOwnProperty('ui') && configData.ui.alertNotSaved && $state.is('editor.type.entity')) {
                var dataEntity = data;

                $rootScope.$on('editor:update_entity',function(event,data) {
                    dataEntity = data[0];
                });

                $rootScope.$on('editor:presave_entity',function(event,data) {
                    dataEntity = data[0];
                });

                alertNotSaved = $rootScope.$on('$stateChangeStart', function(event) {
                    var save = isSave(dataEntity);
                    if(!save && !confirm('Внесенные изменения не сохранятся. Перейти на другу страницу?')) {
                        event.preventDefault();
                        return;
                    }
                    alertNotSaved();
                });
                $window.onbeforeunload = function() {
                    var save = isSave(dataEntity);
                    if(!save) {
                        return 'Внесенные изменения не сохранятся.';
                    }
                }
            }
            vm.editorEntityType = data.editorEntityType;
            vm.entityId = data[vm.idField];
            vm.entityLoaded = true;
        });

        $scope.$on('editor:server_error', function (event,data) {
            vm.errors.push(data);
        });

        $scope.$on('editor:presave_entity_created', function (event,data) {
            $translate('CHANGE_RECORDS.CREATE').then(function (translation) {
                toastr.success(translation);
            });
            vm.entityId = data;
            vm.editorEntityType = "exist";
        });

        $scope.$on('editor:presave_entity_updated', function (event,data) {
            $translate('CHANGE_RECORDS.UPDATE').then(function (translation) {
                toastr.success(translation);
            });
        });

        $scope.$on('editor:parent_childs', function (event,data) {
            angular.forEach(vm.items,function (item,ind){

              var startInd = 1;
                if(item[vm.idField] === data.id){
                    if(item.isExpand === true){
                        item.isExpand = false;
                        vm.items.splice(ind + 1,data.childs.length);
                    } else {
                        item.isExpand = true;
                        angular.forEach(data.childs,function (newItem) {
                            if(vm.items[ind].hasOwnProperty.parentPadding){
                                newItem.parentPadding = vm.items[ind].parentPadding + 1;
                            } else {
                                newItem.parentPadding = 1;
                            }
                            vm.items.splice(ind + startInd, 0, newItem);
                        });
                    }

                }
            });
        });

        $scope.$on('editor:entity_success_deleted', function (event,data) {
            $translate('CHANGE_RECORDS.DELETE').then(function (translation) {
                toastr.success(translation);
            });
        });

        $scope.$on('editor:field_error', function (event,data) {
            vm.errors.push(data);
        });

        $scope.$on('editor:request_start', function (event,data) {
            vm.errors = [];
            vm.notifys = [];
        });

        $document.on('click', function (evt) {
            if(!angular.element(evt.target).hasClass("context-toggle")){
                $timeout(function () {
                    vm.contextId = undefined;
                },0);
            }
        });

        $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (processingStatus) {
            vm.loadingData = processingStatus;
        });
        function isInTableFields(name) {
          var index = vm.tableFields.findIndex(function(field) {
            return field.field === name;
          });

          return (index !== -1) ? true : false;
        }

        //локализация
        if(configData.hasOwnProperty("ui") &&  configData.ui.hasOwnProperty("language")) {
            if(configData.ui.language.search(".json") !== (-1)){
                $translate.use(configData.ui.language);
            } else if(configData.ui.language !== 'ru') {
                $translate.use('assets/json/language/' + configData.ui.language + '.json');
            }
        }

        vm.clickEnter = function(event){
            if(event.keyCode === 13){
                vm.applyFilter();
            }
        };

        function isSave(data){
            var dataEntity = EditEntityStorage.getEntityValue();
            var dataEdit = {};
            for(var key in dataEntity){
                dataEdit[key] = data[key];
            }
            return angular.equals(dataEntity, dataEdit);
        }

    }
})();

(function () {
    'use strict';

    /**
     * @desc Main directive used for initiate universal editor.
     * @example <div data-universal-editor></div>
     */
    angular
        .module('universal.editor')
        .directive('universalEditor',universalEditor);

    universalEditor.$inject = ['$templateCache'];

    function universalEditor($templateCache){
        return {
            restrict : 'A',
            replace : true,
            scope : {
                entity : '@'
            },
            template : $templateCache.get('module/directives/universalEditor/universalEditor.html'),
            controller: 'UniversalEditorController',
            controllerAs : 'vm',
            link : link
        };

        function link(scope, elem, attrs, ctrl){
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
    }
})();
(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/universalEditor/universalEditor.html',
    '\n' +
    '<div class="universal-editor">\n' +
    '    <div class="field-error-wrapper">\n' +
    '        <div data-ng-repeat="err in vm.errors" class="error-item">{{err}}</div>\n' +
    '    </div>\n' +
    '    <div class="field-notify-wrapper">\n' +
    '        <div data-ng-repeat="notify in vm.notifys" class="notify-item">{{notify}}</div>\n' +
    '    </div>\n' +
    '    <div data-ng-if="vm.correctEntityType">\n' +
    '        <div class="editor-header">\n' +
    '            <button data-ng-click="vm.toggleFilterVisibility()" data-ng-class="{ disabled : vm.entityLoaded }" class="header-action-button gray">{{ \'BUTTON.FILTER\' | translate}} {{ vm.visibleFilter ? "+" : "-" }}</button>\n' +
    '            <div ng-repeat="button in vm.listHeaderBar track by $index" class="header-action-button">\n' +
    '                <div data-editor-button-create="" data-button-label="{{button.label}}" ng-if="button.type === \'create\'" data-type="entity"></div>\n' +
    '                <div data-ng-if="button.type == \'custom\'" data-ng-click="vm.headerAction(button)">{{button.label}}</div>\n' +
    '            </div>\n' +
    '            <div ng-repeat="button in vm.mixedListHeaderBar track by $index" class="header-action-button">\n' +
    '                <div data-editor-button-create="" data-button-label="{{button.label}}" ng-if="button.type === \'create\'" data-type="vm.mixEntityType"></div>\n' +
    '                <div data-ng-if="button.type == \'custom\'" data-ng-click="vm.headerAction(button)">{{button.label}}</div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-hide="vm.visibleFilter || (vm.entityLoaded || vm.loadingData)" class="editor-filter">\n' +
    '            <div class="editor-filter-wrapper">\n' +
    '                <div data-ng-repeat="filter in vm.filterFields" data-filter-wrapper="" data-filter-name="{{filter.name}}"></div>\n' +
    '                <div class="buttons-wrapper">\n' +
    '                    <button data-ng-click="vm.applyFilter()" class="editor-action-button gray">{{\'BUTTON.APPLY\' | translate}}</button>\n' +
    '                    <button data-ng-click="vm.clearFilter()" class="editor-action-button gray">{{\'BUTTON.CLEAN\' | translate}}</button>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="groups-action">\n' +
    '            <button data-ng-if="vm.parentButton &amp;&amp; !vm.entityLoaded &amp;&amp; !vm.loadingData" data-ng-click="vm.getParent()" class="editor-action-button gray">{{\'BUTTON.HIGHER_LEVEL\' | translate}}</button>\n' +
    '        </div>\n' +
    '        <div data-ng-show="vm.loadingData" class="processing-status-wrapper">\n' +
    '            <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '        </div>\n' +
    '        <table data-ng-hide="vm.entityLoaded || vm.loadingData" class="items-list">\n' +
    '            <thead>\n' +
    '                <tr>\n' +
    '                    <td class="actions-header context-column"></td>\n' +
    '                    <td data-ng-repeat="fieldItem in vm.tableFields" data-ng-class="{ \'active\' : fieldItem.field == vm.sortField, \'asc\' : vm.sortingDirection, \'desc\' : !vm.sortingDirection}" data-ng-click="vm.changeSortField(fieldItem.field)">{{fieldItem.displayName}}</td>\n' +
    '                </tr>\n' +
    '            </thead>\n' +
    '            <tbody data-ng-if="vm.listLoaded">\n' +
    '                <tr data-ng-repeat="item in vm.items">\n' +
    '                    <td class="context-column"><span data-ng-click="vm.toggleContextView(item[vm.idField])" data-ng-show="vm.contextLinks.length" class="context-toggle">Toggle buttons</span>\n' +
    '                        <div data-ng-show="vm.contextId == item[vm.idField]" class="context-menu-wrapper">\n' +
    '                            <div data-ng-repeat="link in vm.contextLinks track by $index" class="context-menu-item">\n' +
    '                                <div data-ng-if="link.type == \'custom\'" data-ng-click="vm.contextAction($index,item[vm.idField])">{{link.label}}</div>\n' +
    '                                <div data-ng-if="link.type == \'edit\'" data-editor-button-edit="" data-entity-id="{{item[vm.idField]}}" data-button-label="{{link.label}}" data-button-params="{{link.params}}"></div>\n' +
    '                                <div data-ng-if="link.type == \'delete\'" data-editor-button-delete="" data-entity-id="{{item[vm.idField]}}" data-button-label="{{link.label}}" data-button-params="{{link.params}}"></div>\n' +
    '                                <div data-ng-if="link.type == \'open\'" data-editor-button-open="" data-entity-id="{{item[vm.idField]}}" data-entity-type="" data-button-label="{{link.label}}" data-button-params="{{link.params}}"></div>\n' +
    '                                <div data-ng-if="link.type == \'download\'" data-editor-button-download="" data-item-value="{{item}}" data-button-label="{{link.label}}" data-button-params="{{link.params}}" data-index="{{$index}}"></div>\n' +
    '                                <div data-ng-if="link.type == \'targetBlank\'" data-editor-button-target-blank="" data-item-value="{{item}}" data-button-label="{{link.label}}" data-button-params="link.request" data-index="{{$index}}"></div>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </td>\n' +
    '                    <td data-ng-repeat="fieldItem in vm.tableFields"><span style="padding-left: {{ item.parentPadding ? item.parentPadding * 10 : 0 }}px">{{item[fieldItem.field]}}</span></td>\n' +
    '                </tr>\n' +
    '                <tr data-ng-if="vm.items.length == 0">\n' +
    '                    <td colspan="{{vm.tableFields.length + 1}}">{{\'ELEMENT_NO\' | translate}}</td>\n' +
    '                </tr>\n' +
    '            </tbody>\n' +
    '            <tfoot data-ng-if="vm.pagination">\n' +
    '                <tr>\n' +
    '                    <td colspan="{{vm.tableFields.length + 1}}">\n' +
    '                        <div class="meta-info">{{\'ELEMENTS\' | translate}} {{vm.metaData.fromItem}} - {{vm.metaData.toItem}} {{\'FROM\' | translate}} {{vm.metaData.totalCount}}</div>\n' +
    '                    </td>\n' +
    '                </tr>\n' +
    '                <tr>\n' +
    '                    <td colspan="{{vm.tableFields.length + 1}}">\n' +
    '                        <div class="links-wrapper">\n' +
    '                            <div data-ng-repeat="pageItem in vm.pageItemsArray"><a data-ng-if="!pageItem.self" href="{{pageItem.href}}" data-ng-click="vm.changePage(pageItem.href)">{{pageItem.label}}</a><span data-ng-if="pageItem.self">{{pageItem.label}}</span></div>\n' +
    '                        </div>\n' +
    '                    </td>\n' +
    '                </tr>\n' +
    '            </tfoot>\n' +
    '        </table>\n' +
    '        <div data-ng-show="vm.entityLoaded" class="editor-body">\n' +
    '            <div data-ng-click="vm.closeButton()" ng-style="{\'background-image\':\'url(\'+ vm.assetsPath +\'/images/close.jpg)\'}" class="close-editor"></div>\n' +
    '            <div class="tab-label-wrapper">\n' +
    '                <div data-ng-repeat="(tkey,tab) in vm.tabs" data-ng-class="vm.currentTab == tab.label ? \'active\' : \'\'" data-ng-click="vm.currentTab = tab.label" class="tab-item-label">\n' +
    '                    <div>{{tab.label}}</div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="tab-content-wrapper">\n' +
    '                <div data-ng-repeat="(tkey,tab) in vm.tabs" data-ng-show="vm.currentTab == tab.label" class="tab-item-content">\n' +
    '                    <div class="field-content-wrapper">\n' +
    '                        <div data-ng-repeat="field in tab.fields" data-field-wrapper="" data-field-name="{{field.name}}"></div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="field-error-bottom-wrapper">\n' +
    '                <div data-ng-repeat="err in vm.errors" class="error-item">{{err}}</div>\n' +
    '            </div>\n' +
    '            <div class="field-notify-bottom-wrapper">\n' +
    '                <div data-ng-repeat="notify in vm.notifys" class="notify-item">{{notify}}</div>\n' +
    '            </div>\n' +
    '            <div class="editor-entity-actions">\n' +
    '                <div data-ng-if="vm.getButton(\'add\') &amp;&amp; vm.editorEntityType == \'new\'" data-editor-button-add="" data-button-label="{{vm.getButton(\'add\').label}}"></div>\n' +
    '                <div data-ng-if="vm.getButton(\'presave\')" data-editor-button-presave="" data-entity-id="{{vm.entityId}}" data-button-label="{{vm.getButton(\'presave\').label}}"></div>\n' +
    '                <div data-ng-if="vm.getButton(\'update\') &amp;&amp; vm.editorEntityType == \'exist\'" data-editor-button-update="" data-entity-id="{{vm.entityId}}" data-button-label="{{vm.getButton(\'update\').label}}"></div>\n' +
    '                <div data-ng-if="vm.getButton(\'delete\') &amp;&amp; vm.editorEntityType == \'exist\'" data-editor-button-delete="" data-entity-id="{{vm.entityId}}" data-button-label="{{vm.getButton(\'delete\').label}}"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/universalEditor/universalEditorForm.html',
    '\n' +
    '<ul data-ng-if="vm.configData.entities.length &gt; 1" class="nav nav-tabs">\n' +
    '    <li data-ng-repeat="entityItem in vm.configData.entities track by $index" data-ng-class="(entityItem.name === entity) ? \'active\' : \'\'" class="item"><a data-ui-sref="editor.type.list({type: entityItem.name})" ui-sref-opts="{reload: true, inherit: false}">{{entityItem.label}}</a></li>\n' +
    '</ul>\n' +
    '<div class="universal-editor">\n' +
    '    <div>\n' +
    '        <div data-ng-show="vm.entityLoaded" class="editor-body">\n' +
    '            <div data-ng-click="vm.closeButton()" ng-style="{\'background-image\':\'url(\'+ vm.assetsPath +\'/images/close.jpg)\'}" class="close-editor"></div>\n' +
    '            <div class="nav nav-tabs">\n' +
    '                <li data-ng-repeat="(tkey,tab) in vm.tabs" data-ng-class="vm.currentTab == tab.label ? \'active\' : \'\'" data-ng-click="vm.currentTab = tab.label"><a href="">{{tab.label}}</a></li>\n' +
    '            </div>\n' +
    '            <div class="tab-content-wrapper">\n' +
    '                <div data-ng-repeat="(tkey,tab) in vm.tabs" data-ng-show="vm.currentTab == tab.label" class="tab-item-content">\n' +
    '                    <div class="field-content-wrapper">\n' +
    '                        <div data-ng-repeat="field in tab.fields" data-field-wrapper="" data-field-name="{{field.name}}" data-ng-if="(vm.editorEntityType == \'new\' &amp;&amp; field.showOnly == \'create\') || (vm.editorEntityType == \'exist\' &amp;&amp; field.showOnly == \'edit\') || !field.showOnly"></div>\n' +
    '                    </div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '            <div class="field-error-bottom-wrapper">\n' +
    '                <div data-ng-repeat="err in vm.errors" class="error-item alert alert-danger">{{err}}</div>\n' +
    '            </div>\n' +
    '            <div class="field-notify-bottom-wrapper">\n' +
    '                <div data-ng-repeat="notify in vm.notifys" class="notify-item">{{notify}}</div>\n' +
    '            </div>\n' +
    '            <div class="editor-entity-actions">\n' +
    '                <div ng-repeat="button in (vm.editorEntityType == \'new\' ? vm.editFooterBarNew : vm.editFooterBarExist) track by $index" class="editor-action-button">\n' +
    '                    <div data-ng-if="(button.type == \'add\') &amp;&amp; vm.editorEntityType == \'new\'" data-editor-button-add="" data-button-label="{{button.label}}"></div>\n' +
    '                    <div data-ng-if="(button.type == \'presave\')" data-editor-button-presave="" data-entity-id="{{vm.entityId}}" data-button-request="{{button.request}}" data-button-label="{{button.label}}"></div>\n' +
    '                    <div data-ng-if="(button.type == \'update\') &amp;&amp; vm.editorEntityType == \'exist\'" data-editor-button-update="" data-entity-id="{{vm.entityId}}" data-button-label="{{button.label}}"></div>\n' +
    '                    <div data-ng-if="(button.type == \'delete\') &amp;&amp; vm.editorEntityType == \'exist\'" data-editor-button-delete="" data-entity-id="{{vm.entityId}}" data-button-label="{{button.label}}" data-button-class="editor"></div>\n' +
    '                    <div data-ng-if="button.type == \'request\'" data-ng-click="vm.contextAction(button, vm.entityId)" class="btn btn-md btn-success">{{button.label}}</div>\n' +
    '                    <div data-ng-if="button.type == \'targetBlank\'" data-editor-button-target-blank="" data-item-value="item" data-button-label="{{button.label}}" data-button-request="{{button.request}}" data-index="{{$index}}" data-button-class="editor"></div>\n' +
    '                    <div data-ng-if="button.type == \'download\'" data-editor-button-download="" data-item-value="item" data-button-label="{{button.label}}" data-button-request="{{button.request}}" data-index="{{$index}}" data-button-class="editor"></div>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();

(function(module) {
try {
  module = angular.module('universal.editor.templates');
} catch (e) {
  module = angular.module('universal.editor.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('module/directives/universalEditor/universalEditorList.html',
    '\n' +
    '<ul data-ng-if="vm.configData.entities.length &gt; 1" class="nav nav-tabs">\n' +
    '    <li data-ng-repeat="entityItem in vm.configData.entities track by $index" data-ng-class="(entityItem.name === entity) ? \'active\' : \'\'" class="item"><a data-ui-sref="editor.type.list({type: entityItem.name})" ui-sref-opts="{reload: true, inherit: false}">{{entityItem.label}}</a></li>\n' +
    '</ul>\n' +
    '<div class="universal-editor">\n' +
    '    <div>\n' +
    '        <div class="editor-header">\n' +
    '            <button data-ng-click="vm.toggleFilterVisibility()" data-ng-class="{ disabled : vm.entityLoaded }" class="btn btn-lg btn-default filter-button">{{ \'BUTTON.FILTER\' | translate}} {{ vm.visibleFilter ? "+" : "-" }}</button>\n' +
    '            <div ng-repeat="button in vm.listHeaderBar track by $index" class="header-action-button">\n' +
    '                <div data-ng-if="button.type == \'create\'" data-editor-button-create="" data-button-label="{{button.label}}" data-type="entity"></div>\n' +
    '                <div data-ng-if="button.type == \'request\'" data-ng-click="vm.contextAction(button)" class="btn btn-lg btn-success">{{button.label}}</div>\n' +
    '                <div data-ng-if="button.type == \'targetBlank\'" data-editor-button-target-blank="" data-item-value="item" data-button-label="{{button.label}}" data-button-request="{{button.request}}" data-index="{{$index}}" data-button-class="header"></div>\n' +
    '                <div data-ng-if="button.type == \'download\'" data-editor-button-download="" data-item-value="item" data-button-label="{{button.label}}" data-button-request="{{button.request}}" data-index="{{$index}}" data-button-class="header"></div>\n' +
    '            </div>\n' +
    '            <div ng-repeat="button in vm.mixedListHeaderBar track by $index" class="header-action-button">\n' +
    '                <div data-ng-if="button.type == \'create\'" data-editor-button-create="" data-button-label="{{button.label}}" data-type="vm.mixEntityType"></div>\n' +
    '                <div data-ng-if="button.type == \'request\'" data-ng-click="vm.contextAction(button)" class="btn btn-lg btn-success">{{button.label}}</div>\n' +
    '                <div data-ng-if="button.type == \'targetBlank\'" data-editor-button-target-blank="" data-item-value="item" data-button-label="{{button.label}}" data-button-request="{{button.request}}" data-index="{{$index}}" data-button-class="header"></div>\n' +
    '                <div data-ng-if="button.type == \'download\'" data-editor-button-download="" data-item-value="item" data-button-label="{{button.label}}" data-button-request="{{button.request}}" data-index="{{$index}}" data-button-class="header"></div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div data-ng-hide="vm.visibleFilter || (vm.entityLoaded || vm.loadingData)" class="editor-filter">\n' +
    '            <div ng-keyup="vm.clickEnter($event)" class="editor-filter-wrapper">\n' +
    '                <div data-ng-repeat="filter in vm.filterFields" data-filter-wrapper="" data-filter-name="{{filter.name}}"></div>\n' +
    '                <div class="buttons-wrapper">\n' +
    '                    <button data-ng-click="vm.applyFilter()" class="btn btn-sm btn-success">{{\'BUTTON.APPLY\' | translate}}</button>\n' +
    '                    <button data-ng-click="vm.clearFilter()" class="btn btn-sm btn-default">{{\'BUTTON.CLEAN\' | translate}}</button>\n' +
    '                </div>\n' +
    '            </div>\n' +
    '        </div>\n' +
    '        <div class="groups-action">\n' +
    '            <button data-ng-if="vm.parentButton &amp;&amp; !vm.entityLoaded &amp;&amp; !vm.loadingData" data-ng-click="vm.getParent()" class="btn btn-sm btn-default">{{\'BUTTON.HIGHER_LEVEL\' | translate}}</button>\n' +
    '        </div>\n' +
    '        <div data-ng-show="vm.loadingData" class="processing-status-wrapper">\n' +
    '            <div class="processing-status">{{\'PERFORMS_ACTIONS\' | translate}}</div>\n' +
    '        </div>\n' +
    '        <table data-ng-hide="vm.entityLoaded || vm.loadingData" class="table table-bordered items-list">\n' +
    '            <thead>\n' +
    '                <tr>\n' +
    '                    <td class="actions-header context-column"></td>\n' +
    '                    <td data-ng-repeat="fieldItem in vm.tableFields" data-ng-class="{ \'active\' : fieldItem.field == vm.sortField, \'asc\' : vm.sortingDirection, \'desc\' : !vm.sortingDirection}" data-ng-click="vm.changeSortField(fieldItem.field)">{{fieldItem.displayName}}</td>\n' +
    '                </tr>\n' +
    '            </thead>\n' +
    '            <tbody data-ng-if="vm.listLoaded">\n' +
    '                <tr data-ng-repeat="item in vm.items" data-ng-class="{\'zhs-item\' : (vm.entityType !== item[vm.subType]) &amp;&amp; item[vm.subType] !== undefined}">\n' +
    '                    <td class="context-column"><span data-ng-click="vm.toggleContextView(item[vm.idField])" data-ng-show="vm.contextLinks.length" class="context-toggle">Toggle buttons</span>\n' +
    '                        <div data-ng-show="vm.contextId == item[vm.idField]" class="context-menu-wrapper">\n' +
    '                            <div data-ng-repeat="link in vm.contextLinks track by $index" data-ng-if="(item[vm.subType] == vm.entityType || item[vm.subType] == undefined)" class="context-menu-item">\n' +
    '                                <div data-ng-if="link.type == \'request\'" data-ng-click="vm.contextAction(link,item[vm.idField])">{{link.label}}</div>\n' +
    '                                <div data-ng-if="link.type == \'edit\'" data-editor-button-edit="" data-entity-subtype="{{item[vm.subType]}}" data-entity-id="{{item[vm.idField]}}" data-button-label="{{link.label}}" data-button-request="{{link.request}}"></div>\n' +
    '                                <div data-ng-if="link.type == \'delete\'" data-editor-button-delete="" data-entity-id="{{item[vm.idField]}}" data-button-label="{{link.label}}" data-button-request="{{link.request}}" data-button-class="context"></div>\n' +
    '                                <div data-ng-if="link.type == \'open\'" data-editor-button-open="" data-entity-id="{{item[vm.idField]}}" data-button-label="{{link.label}}" data-button-request="{{link.request}}"></div>\n' +
    '                                <div data-ng-if="link.type == \'download\'" data-editor-button-download="" data-item-value="item" data-button-label="{{link.label}}" data-button-request="{{link.request}}" data-index="{{$index}}" data-button-class="context"></div>\n' +
    '                                <div data-ng-if="link.type == \'targetBlank\'" data-editor-button-target-blank="" data-item-value="item" data-button-label="{{link.label}}" data-button-request="{{link.request}}" data-index="{{$index}}" data-button-class="context"></div>\n' +
    '                            </div>\n' +
    '                            <div data-ng-repeat="link in vm.mixContextLinks track by $index" data-ng-if="vm.mixEntityType &amp;&amp; item[vm.subType] === vm.mixEntityType" class="context-menu-item">\n' +
    '                                <div data-ng-if="link.type == \'request\'" data-ng-click="vm.contextAction(link,item[vm.idField])">{{link.label}}</div>\n' +
    '                                <div data-ng-if="link.type == \'edit\'" data-editor-button-edit="" data-entity-subtype="{{item[vm.subType]}}" data-entity-id="{{item[vm.idField]}}" data-button-label="{{link.label}}" data-button-request="{{link.request}}"></div>\n' +
    '                                <div data-ng-if="link.type == \'delete\'" data-entity-type="mix" data-editor-button-delete="" data-entity-id="{{item[vm.idField]}}" data-button-label="{{link.label}}" data-button-request="{{link.request}}" data-button-class="context"></div>\n' +
    '                                <div data-ng-if="link.type == \'download\'" data-editor-button-download="" data-item-value="item" data-button-label="{{link.label}}" data-button-request="{{link.request}}" data-index="{{$index}}" data-button-class="context"></div>\n' +
    '                                <div data-ng-if="link.type == \'targetBlank\'" data-editor-button-target-blank="" data-item-value="item" data-button-label="{{link.label}}" data-button-request="{{link.request}}" data-index="{{$index}}" data-button-class="context"></div>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                    </td>\n' +
    '                    <td data-ng-repeat="fieldItem in vm.tableFields track by $index"><span data-ng-class="{\'glyphicon-folder-open icon-mix-mode\' : (vm.isMixMode &amp;&amp; !((vm.entityType !== item[vm.subType]) &amp;&amp; item[vm.subType] !== undefined))}" data-ng-if="vm.prependIcon === fieldItem.field" class="glyphicon"></span><span style="padding-left: {{ item.parentPadding ? item.parentPadding * 10 : 0 }}px;">{{item[fieldItem.field]}}</span></td>\n' +
    '                </tr>\n' +
    '                <tr data-ng-if="vm.items.length == 0">\n' +
    '                    <td colspan="{{vm.tableFields.length + 1}}">{{\'ELEMENT_NO\' | translate}}</td>\n' +
    '                </tr>\n' +
    '            </tbody>\n' +
    '            <tfoot>\n' +
    '                <tr data-ng-if="vm.metaKey">\n' +
    '                    <td colspan="{{vm.tableFields.length + 1}}">\n' +
    '                        <div class="meta-info">{{\'ELEMENTS\' | translate}} {{vm.metaData.fromItem}} - {{vm.metaData.toItem}} {{\'FROM\' | translate}} {{vm.metaData.totalCount}}</div>\n' +
    '                    </td>\n' +
    '                </tr>\n' +
    '                <tr>\n' +
    '                    <td colspan="{{vm.tableFields.length + 1}}" data-ng-if="vm.pagination &amp;&amp; vm.metaKey">\n' +
    '                        <ul class="pagination">\n' +
    '                            <li data-ng-repeat="pageItem in vm.pageItemsArray" data-ng-class="pageItem.self ? \'active\' : \'\'"><a data-ng-if="!pageItem.self" href="{{pageItem.href}}" data-ng-click="vm.changePage($event,pageItem.href)">{{pageItem.label}}</a><span data-ng-if="pageItem.self">{{pageItem.label}}</span></li>\n' +
    '                        </ul>\n' +
    '                    </td>\n' +
    '                </tr>\n' +
    '            </tfoot>\n' +
    '        </table>\n' +
    '    </div>\n' +
    '</div>');
}]);
})();
