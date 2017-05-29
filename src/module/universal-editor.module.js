(function() {
    'use strict';

    angular
        .module('universal-editor',
        [
            'universal-editor.templates',
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
            'ui.bootstrap',
            'dndLists'
        ]);

    angular
        .module('universal-editor')
        .factory('EditorHttpInterceptor', EditorHttpInterceptor);

    function EditorHttpInterceptor($q, $rootScope, toastr, $translate) {
        'ngInject';
        return {
            'request': function(config) {
                if (config.beforeSend) {
                    var defer = $q.defer();
                    config.timeout = defer.promise;
                    var success = config.beforeSend(config);
                    if(success === false) {
                        defer.resolve();
                    }
                }
                return config;
            }
        };
    }

    angular
        .module('universal-editor')
        .config(universalEditorConfig);

    function universalEditorConfig(minicolorsProvider, $httpProvider, $stateProvider, $urlRouterProvider, $provide, $injector, moment) {
        'ngInject';
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
        .module('universal-editor')
        .run(universalEditorRun);

    function universalEditorRun($rootScope, $location, $state, EditEntityStorage, FilterFieldsStorage) {
        'ngInject';
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