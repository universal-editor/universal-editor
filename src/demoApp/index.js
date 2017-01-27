(function() {
    'use strict';

    angular.module('demoApp', ['ui.router', 'universal.editor']);


    angular
        .module('demoApp')
        .config(routerConfig);

    routerConfig.$inject = ['$stateProvider', '$urlRouterProvider'];

    function routerConfig($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('components', {
                url: '/components',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'ComponentsController'
            })
            .state('staff', {
                url: '/staff',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'StaffGridController'
            })
            .state('staff_edit', {
                url: '/staff/:pk?back',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'StaffFormController'
            })
            .state('news', {
                url: '/news',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'NewsGridController'
            })
            .state('news_edit', {
                url: '/news/:pk?back',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'NewsFormController'
            });

        $urlRouterProvider.otherwise('/components');
    }
})();

angular
    .module('demoApp')
    .run(demoAppRun);

demoAppRun.$inject = ['$rootScope'];

function demoAppRun($rootScope) {
    var itemsSelector = document.querySelectorAll(".nav.nav-tabs li");
    $rootScope.$on('$stateChangeSuccess', function (event,toState) {
        var stateParamEntityId = toState.name;
        angular.forEach(itemsSelector, function (item) {
            $(item).removeClass("active");
            if(~stateParamEntityId.indexOf($(item).find("a")[0].hash.split("/")[1])){
                $(item).addClass("active");
            }
        });
    });
}