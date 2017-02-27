(function() {
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
            'ui.mask',
            'toastr',
            'pascalprecht.translate',
            'ui.bootstrap'
        ]);

    angular
        .module('universal.editor')
        .factory('EditorHttpInterceptor', EditorHttpInterceptor);

    function EditorHttpInterceptor($q, $rootScope, toastr, $translate) {
        "ngInject";
        return {
            'request': function(config) {
                if (config.beforeSend) {
                    config.beforeSend(config);
                }

                $rootScope.$broadcast('editor:request_start', '');

                // Заменяем пустые массивы на null так как при отправке такие массивы игнорируются
                if (config.data && typeof config.data === 'object') {
                    angular.forEach(config.data, function(value, key) {
                        if (angular.isArray(value) && value.length === 0) {
                            config.data[key] = null;
                        }
                    });
                }

                return config;
            },
            'responseError': function(rejection) {
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

                return $q.reject(rejection);
            }
        };
    }

    angular
        .module('universal.editor')
        .config(universalEditorConfig);

    function universalEditorConfig(minicolorsProvider, $httpProvider, $stateProvider, $urlRouterProvider, $provide, $injector, moment) {
        "ngInject";
        var dataResolver;

        angular.extend(minicolorsProvider.defaults, {
            control: 'hue',
            position: 'top left',
            letterCase: 'uppercase'
        });

        $httpProvider.defaults.paramSerializer = '$httpParamSerializerJQLike';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        $httpProvider.defaults.transformRequest = function(data) {


            if (data === undefined) {
                return data;
            }

            return $.param(data);
        };

        $httpProvider.interceptors.push('EditorHttpInterceptor');

        $provide.decorator('mFormatFilter', function() {
            return function newFilter(m, format, tz) {
                if (!(moment.isMoment(m))) {
                    return '';
                }
                if (tz) {
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

    function universalEditorRun($rootScope, $location, $state, EditEntityStorage, ModalService, FilterFieldsStorage, YiiSoftApiService) {
        "ngInject";
        var itemsSelector = document.querySelectorAll('.nav.nav-tabs .item');

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams, options) {
                FilterFieldsStorage.filterSearchString = !options.reload ? $location.search() : {};
            });
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
            var stateParamEntityId = toParams.type;
            angular.forEach(itemsSelector, function(item) {
                $(item).removeClass('active');
                if ($(item).find('a')[0].hash.split('/')[2] == stateParamEntityId) {
                    $(item).addClass('active');
                }
            });

            if (FilterFieldsStorage.filterSearchString) {
                $location.search(FilterFieldsStorage.filterSearchString);
            }

            var toStateConfig = EditEntityStorage.getStateConfig(toState.name);
            if (toStateConfig && toStateConfig.component.name === 'ue-modal') {

                /** if fromstate is empty, try get parent state */
                if (!fromState.name) {
                    var temp = toState.name.split('.');
                    if (temp.length) {
                        temp.splice(temp.length - 1, 1);
                        fromState = {
                            name: temp.join('.')
                        };
                    }
                }
                angular.extend(toStateConfig.component.settings, {
                    fromState: fromState,
                    fromParams: fromParams
                });
                ModalService.open(toStateConfig.component);
            }
        });
        if (itemsSelector.length == 1) {
            angular.element(itemsSelector).css('display', 'none');
        }
        angular.element(document).ready(function() {
            var pk = $state.params['pk' + EditEntityStorage.getLevelChild($state.current.name)];
            if (pk === 'new') {
                EditEntityStorage.newSourceEntity();
            }
        });
    }
})();