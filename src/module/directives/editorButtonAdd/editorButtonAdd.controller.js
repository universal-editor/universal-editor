(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonAddController',EditorButtonAddController);

    EditorButtonAddController.$inject = ['$rootScope','$scope','$element','EditEntityStorage','RestApiService'];

    function EditorButtonAddController($rootScope,$scope,$element,EditEntityStorage,RestApiService){
        var vm = this;

        vm.label = $scope.buttonLabel;
        vm.processing = RestApiService.isProcessing;

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        $scope.$on('$destroy', function () {
            watchRest();
        });

        $element.bind("click", function () {
            if(vm.processing){
                return;
            }
            EditEntityStorage.editEntityUpdate("create");
        });
    }
})();
