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
            },

            $get: ['$q', '$rootScope', function($q, $root) {
                return configData;
            }]
        };
    }
})();
