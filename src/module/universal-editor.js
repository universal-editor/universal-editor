/**
 * Constructor for create editor
 * @param {string} id - Id html element instead of which will be the editor
 * @param {Object} config - Configuration object
 * @constructor
 */
var UniversalEditor = function(id, config) {
        'use strict';
        var moduleName = 'unEditor-' + id,
            unEditor = $('#' + id),
            app, modules = ['universal.editor'];
        if(config.modules && angular.isArray(config.modules)) {
            modules = modules.concat(config.modules);
        }
        
        if (unEditor[0]) {
            app = angular.module(moduleName, modules).config(['$stateProvider', '$urlRouterProvider', '$injector', 'configDataProvider', function($stateProvider, $urlRouterProvider, $injector, configDataProvider) {
                configDataProvider.setConfig(id, config);
            }]);
            unEditor.append('<div class="u-editors" data-ui-view="' + id + '"></div>');
            angular.bootstrap(unEditor[0], [moduleName]);
        }
        return {
            module: app,
            angular: angular
        };
};


