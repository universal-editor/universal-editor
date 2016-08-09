(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('DropdownItemsController',DropdownItemsController);

    DropdownItemsController.$inject = ['$scope','RestApiService'];

    function DropdownItemsController($scope,RestApiService) {
    }
})();