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
                if (config.beforeSend) {
                    config.beforeSend(config);
                }

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

    universalEditorConfig.$inject = ['minicolorsProvider','$httpProvider','$stateProvider','$urlRouterProvider','$provide', 'ConfigDataProviderProvider', '$injector', 'configData'];

    function universalEditorConfig(minicolorsProvider,$httpProvider,$stateProvider,$urlRouterProvider,$provide, ConfigDataProviderProvider, $injector, configData){

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

        var defaultState = {
            'index': {
                'url': '/type?parent&back'
            },
            'edit': {
                'url': '/type/:pk?parent&back'
            }
        };

        /* GENERATION MENU*/

        var menu = [];

        angular.forEach(configData.entities, function(entity) {
            var item = {};
            item.name = entity.name;
            item.label = entity.label;
            var changIndex = false;
            angular.forEach(entity.states, function(state) {
                if (state.name === 'index') {
                    changIndex = true;
                }
            });
            if (changIndex) {
                item.sref = item.name + '_index';
            } else {
                item.sref = item.name + '_' + entity.states[0].name;
            }
            menu.push(item);
        });

        /* END GENERATION MENU*/


        $urlRouterProvider.otherwise(configData.entities[0].states[0].url ? configData.entities[0].states[0].url : ('/' + configData.entities[0].name));



        $urlRouterProvider.rule(function($injector, $location) {

            var path = $location.path();
            var hasTrailingSlash = path[path.length-1] === '/';

            if(hasTrailingSlash) {
                return path.substr(0, path.length - 1);
            }

        });

        angular.forEach(configData.entities, function(entity) {
            var name = entity.name;
            angular.forEach(entity.states, function(state) {
                var nameState = name + '_' + state.name;
                state.name = name + '_' + state.name;
                var urlState = state.url;
                if (defaultState[state.name]) {
                    urlState = (!!state.url) ? state.url : defaultState[state.name].url.replace('type', name);
                }
                $stateProvider.state(nameState, {
                    url: urlState,
                    templateUrl : "module/components/universalEditor/universalEditor.html",
                    controller : "UniversalEditorController",
                    controllerAs : "vm",
                    resolve : {
                        component: function() {
                            return state.component;
                        },
                        menu: function() {
                            return menu;
                        },
                        type: function() {
                            return name;
                        }
                    }
                });
            });
        });

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

    universalEditorRun.$inject = ['$rootScope','$location','$state', 'EditEntityStorage', 'ModalService'];

    function universalEditorRun($rootScope, $location, $state, EditEntityStorage, ModalService){
        var itemsSelector = document.querySelectorAll(".nav.nav-tabs .item");
        $rootScope.$on('$stateChangeSuccess', function (event,toState,toParams,fromState,fromParams) {
            var stateParamEntityId = toParams.type;
            angular.forEach(itemsSelector, function (item) {
                $(item).removeClass("active");
                if($(item).find("a")[0].hash.split("/")[2] == stateParamEntityId){
                    $(item).addClass("active");
                }
            });
            var toStateConfig = EditEntityStorage.getStateConfig(toState.name);
            if (toStateConfig && toStateConfig.component.name === 'ue-modal') {
                if (fromParams.pk) {
                    $state.params.pk = fromParams.pk;
                }
                angular.extend(toStateConfig.component.settings, {
                    fromState: fromState,
                    fromParams: fromParams
                });
                ModalService.open(toStateConfig.component);
            }
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