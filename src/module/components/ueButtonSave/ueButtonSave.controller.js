(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonSaveController',UeButtonSaveController);

    UeButtonSaveController.$inject = ['$rootScope','$scope','$element','EditEntityStorage','RestApiService'];

    function UeButtonSaveController($rootScope,$scope,$element,EditEntityStorage,RestApiService){
        var vm = this;

        vm.label = vm.buttonLabel;
        vm.processing = RestApiService.isProcessing;

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        vm.$onDestroy = function () {
            watchRest();
        };

        $element.bind("click", function () {
            if(vm.processing){
                return;
            }
            EditEntityStorage.editEntityUpdate("create");
        });

        vm.$postLink = function() {
            $scope.editor = RestApiService.getEntityType();
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }
    }
})();
