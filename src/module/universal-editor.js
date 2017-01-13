/**
 * Constructor for create editor
 * @param {string} id - Id html element instead of which will be the editor
 * @param {Object} config - Configuration object
 * @param {Function} callbackInject - Function for extend application
 * @constructor
 */
var UniversalEditor = function(id, config, callbackInject) {
        'use strict';
        var moduleName = 'unEditor-' + id;
        var unEditor = $('#' + id);
        var app;
        if (unEditor[0]) {
            app = angular.module(moduleName, ['universal.editor']).config(['$stateProvider', '$urlRouterProvider', '$injector', 'configDataProvider', function($stateProvider, $urlRouterProvider, $injector, configDataProvider) {
                configDataProvider.setConfig(id, config);
            }]);
            if (angular.isFunction(callbackInject)) {
                callbackInject(app);
            }
            unEditor.append('<div class="u-editors" data-ui-view="' + id + '"></div>');
            angular.bootstrap(unEditor[0], [moduleName]);

        }
        return {
            module: app,
            angular: angular
        };
};


