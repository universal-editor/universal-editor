(function() {
    'use strict';

    angular
        .module('universal.editor')
        .provider('configData', ConfigDataProvider);

    function ConfigDataProvider() {
        "ngInject";
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
