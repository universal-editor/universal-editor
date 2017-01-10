(function() {
    'use strict';

    angular
        .module('universal.editor')
        .provider('configData', ConfigDataProvider);

    ConfigDataProvider.$inject = ['$stateProvider', '$urlRouterProvider', '$injector', 'moment'];
    function ConfigDataProvider($stateProvider, $urlRouterProvider, $injector, moment) {
        var configData = {};
        return {
            setConfig: function(moduleName, config) {
                configData = config;
                var defaultState = {
                    'index': {
                        'url': '/type?parent&back'
                    },
                    'edit': {
                        'url': '/type/:pk?parent&back'
                    }
                };

                //-- for deleting slash in the end of address
                $urlRouterProvider.rule(function($injector, $location) {
                    var path = $location.path(),
                        hasTrailingSlash = path[path.length - 1] === '/';
                    if (hasTrailingSlash) {
                        return path.substr(0, path.length - 1);
                    }
                });

                var id = 0;
                var prefix = (function(str) {
                    var hash = 5381, char;
                    for (var i = 0; i < str.length; i++) {
                        char = str.charCodeAt(i);
                        hash = ((hash << 5) + hash) + char; /* hash * 33 + c */
                    }
                    return hash;
                })(moduleName);
                angular.forEach(config.states, function(state) {
                    var nameState = state.name,
                        urlState = state.url,
                        levelState = state.name.split('.').length;
                    if (defaultState[state.name]) {
                        urlState = (!!state.url) ? state.url : defaultState[state.name].url.replace('type', '');
                    }
                    urlState = urlState.replace(':pk', ':pk' + levelState);

                    //-- indentifier components. Set id for components.
                    (function check(value) {
                        var keys = Object.keys(value);
                        for (var i = keys.length; i--;) {
                            var propValue = value[keys[i]];
                            if (keys[i] === 'component') {
                                propValue.$id = propValue.$id || (prefix + (++id));
                            }
                            if (angular.isObject(propValue)) {
                                check(propValue);
                            }
                        }
                    })(state);

                    //-- options for the state of ui-router
                    var stateOptions = {
                        url: urlState,
                        reloadOnSearch: false,
                        resolve: {
                            moduleName: function() {
                                return moduleName;
                            }
                        },
                        params: {
                            pk: null
                        }
                    };
                    stateOptions.views = {};
                    stateOptions.views[moduleName] = {
                        templateUrl: 'module/components/universalEditor/universalEditor.html',
                        controller: 'UniversalEditorController',
                        controllerAs: 'vm',
                        resolve: {
                            component: function() {
                                return state.component;
                            }
                        }
                    };
                    $stateProvider.state(nameState, stateOptions);
                });

                if (!window.universal_editor_is_load) {
                    window.universal_editor_is_load = true;
                    $urlRouterProvider.otherwise(config.states[0].url || '/');
                }
            },

            $get: ['$q', '$rootScope', function($q, $root) {
                return configData;
            }]
        };
    }
})();
