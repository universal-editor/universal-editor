(function () {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeComponentController', UeComponentController);

    function UeComponentController($scope, $element, EditEntityStorage, FilterFieldsStorage, $location, $controller, $timeout) {
        /* jshint validthis: true */
        'ngInject';
        var vm = this,
            baseController;

        vm.$onInit = function() {
            baseController= $controller('BaseController', {$scope: $scope});
            angular.extend(vm, baseController);
        };
    }
})();