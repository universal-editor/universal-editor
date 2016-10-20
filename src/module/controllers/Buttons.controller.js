(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('ButtonsController', ButtonsController);

    ButtonsController.$inject = ['$scope','$controller'];

    function ButtonsController($scope,$controller){
        /* jshint validthis: true */
        var vm = this;
        var baseController = $controller('BaseController', {$scope: $scope});
        angular.extend(vm, baseController);  
    }
})();
