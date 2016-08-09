(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('FieldWrapperController',FieldWrapperController);

    FieldWrapperController.$inject = ['$scope'];

    function FieldWrapperController($scope){
        var vm = this;
    }
})();