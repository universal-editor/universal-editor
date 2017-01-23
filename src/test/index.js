(function() {
    'use strict';

    angular.module('testApp', ['ui.router', 'universal.editor']);


    angular
        .module('testApp')
        .config(routerConfig);

    routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('components', {
                url: '/components',
                template: '<universal-editor data-ue-Config="vm.config"></universal-editor>',
                controllerAs: 'vm',
                controller: function() {
                    var vm = this;
                    vm.config = window.ue;
                }
            });

        $urlRouterProvider.otherwise('/components');
    }
})();
