(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeTableController', UeTableController);

    UeTableController.$inject = ['$scope', '$element', 'EditEntityStorage', 'ArrayFieldStorage'];

    function UeTableController($scope) {
    }
})();