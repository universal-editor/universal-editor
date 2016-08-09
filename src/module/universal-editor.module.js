(function () {
    'use strict';

    angular
        .module('universal.editor',
        [
            'universal.editor.templates',
            'minicolors',
            'ui.tinymce',
            'datePicker',
            'checklist-model',
            'angularMoment',
            'ngCookies',
            'ngFileUpload',
            'ui.router',
            'yaMap',
            'ngRaven',
            'ui.mask',
            'toastr',
            'pascalprecht.translate'
        ]);

    angular
        .module('universal.editor')
        .factory('EditorHttpInterceptor',EditorHttpInterceptor);

    EditorHttpInterceptor.$inject = ['$q','$rootScope','toastr','$translate'];

    function EditorHttpInterceptor($q,$rootScope,toastr, $translate){
        return {
            'request' : function (config) {
                $rootScope.$broadcast('editor:request_start','');

                // Заменяем пустые массивы на null так как при отправке такие массивы игнорируются

                if (config.data && typeof config.data === 'object') {
                    angular.forEach(config.data,function (value,key) {
                        if(angular.isArray(value) && value.length === 0){
                            config.data[key] = null;
                        }
                    });
                }

                return config;
            },

            //TODO Handle errors

            'responseError' : function(rejection) {
                if(rejection.status === -1){
                    Raven.captureMessage('Сервис временно недоступен.');
                    // OLDER VERSION OF ERROR - $rootScope.$broadcast('editor:server_error','Сервер вернул невалидные данные. Обработка данных невозможна.');
                    $translate('RESPONSE_ERROR.SERVICE_UNAVAILABLE').then(function (translation) {
                        toastr.error(translation);
                    });
                    return $q.reject(rejection);
                }

                try {
                    var json = JSON.parse(JSON.stringify(rejection));
                } catch(e) {
                    Raven.captureException(e);
                    $translate('RESPONSE_ERROR.SERVICE_UNAVAILABLE').then(function (translation) {
                        toastr.error(translation);
                    });
                    return;
                }

                if(!angular.isObject(rejection)){
                    Raven.captureMessage('Сервис временно недоступен.');
                    $translate('RESPONSE_ERROR.SERVICE_UNAVAILABLE').then(function (translation) {
                        toastr.error(translation);
                    });
                    return $q.reject(rejection);
                }

                if(rejection.data.hasOwnProperty("code") && rejection.data.hasOwnProperty("type")){
                    if(rejection.data.type == "error" && rejection.data.code == "auth_needed"){
                        Raven.captureMessage('Требуется повторная авторизация, перезагрузите страницу.');
                        $translate('RESPONSE_ERROR.RELOAD_PAGE').then(function (translation) {
                            toastr.error(translation);
                        });
                    }

                    if(rejection.data.type == "error" && rejection.data.code == "auth_incorrect"){
                        Raven.captureMessage('Требуется повторная авторизация, перезагрузите страницу.');
                        $translate('RESPONSE_ERROR.RELOAD_PAGE').then(function (translation) {
                            toastr.error(translation);
                        });
                    }

                    if(rejection.data.type == "error" && rejection.data.code == "not_found"){
                        Raven.captureMessage('Запись не найдена.');
                        $translate('RESPONSE_ERROR.NOT_FOUND').then(function (translation) {
                            toastr.error(translation);
                        });
                    }

                    if(rejection.data.type == "error" && rejection.data.code == "wrong_entity"){
                        Raven.captureMessage('Сервис временно недоступен.');
                        $translate('RESPONSE_ERROR.SERVICE_UNAVAILABLE').then(function (translation) {
                            toastr.error(translation);
                        });
                    }

                    if(rejection.data.type == "error" && rejection.data.code == "invalid_data"){
                        $translate('RESPONSE_ERROR.INVALID_DATA').then(function (translation) {
                            toastr.error(translation);
                        });
                    }

                    if(rejection.data.type == "critical"){
                        Raven.captureMessage('Сервис временно недоступен.');
                        $translate('RESPONSE_ERROR.SERVICE_UNAVAILABLE').then(function (translation) {
                            toastr.error(translation);
                        });
                    }
                } else {
                    Raven.captureMessage('Сервис временно недоступен.');
                    $translate('RESPONSE_ERROR.SERVICE_UNAVAILABLE').then(function (translation) {
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
                }]
            })
            .state('editor.type.list',{
                url : "/list?parent",
                templateUrl : "module/directives/universalEditor/universalEditorList.html",
                onEnter : ["RestApiService", function (RestApiService) {
                    RestApiService.getItemsList();
                }]
            })
            .state('editor.type.new',{
                url : '/new?parent&type',
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