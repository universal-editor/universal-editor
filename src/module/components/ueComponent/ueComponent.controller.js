(function () {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeComponentController', UeComponentController);

    UeComponentController.$inject = ['$scope', '$element', 'EditEntityStorage', 'FilterFieldsStorage', '$location', '$controller', '$timeout'];

    function UeComponentController($scope, $element, EditEntityStorage, FilterFieldsStorage, $location, $controller, $timeout) {
        /* jshint validthis: true */
        var vm = this,
            baseController;

        vm.$onInit = function() {
            baseController= $controller('BaseController', {$scope: $scope});
            angular.extend(vm, baseController);
        };
    }
})();