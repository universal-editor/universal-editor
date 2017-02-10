(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('DropdownItemsController',DropdownItemsController);

    DropdownItemsController.$inject = ['$scope','YiiSoftApiService'];

    function DropdownItemsController($scope,YiiSoftApiService) {
    }
})();