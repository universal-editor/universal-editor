(function() {
    'use strict';

    angular.module('demoApp', ['ui.router', 'universal-editor'])
        .config(routerConfig);

    function routerConfig($stateProvider, $urlRouterProvider) {
        'ngInject';
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
                url: '/staff/:pk',
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
                url: '/news/:pk',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'NewsFormController'
            })
            .state('articles', {
                url: '/articles',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'ArticlesGridController'
            })
            .state('articles_edit', {
                url: '/articles/:pk',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'ArticlesFormController'
            })
            .state('country', {
                url: '/country',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'CountryGridController'
            })
            .state('country_edit', {
                url: '/country/:pk',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'CountryFormController'
            })
            .state('tags', {
                url: '/tags',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'TagsGridController'
            })
            .state('tags_edit', {
                url: '/tags/:pk',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'TagsFormController'
            })
            .state('category', {
                url: '/category',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'CategoryGridController'
            })
            .state('category_edit', {
                url: '/category/:pk',
                template: '<universal-editor ue-config="vm.ueConfig"></universal-editor>',
                controllerAs: 'vm',
                controller: 'CategoryFormController'
            });
        $urlRouterProvider.otherwise('/components');
    }
})();

angular
    .module('demoApp')
    .run(demoAppRun);

function demoAppRun($rootScope) {
    'ngInject';
    var itemsSelector = document.querySelectorAll('.nav.nav-tabs li');
    $rootScope.$on('$stateChangeSuccess', function(event, toState) {
        var stateParamEntityId = toState.name;
        angular.forEach(itemsSelector, function(item) {
            $(item).removeClass('active');
            if (~stateParamEntityId.indexOf($(item).find('a')[0].hash.split('/')[1])) {
                $(item).addClass('active');
            }
        });
    });
}