(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonUpdateController',UeButtonUpdateController);

    UeButtonUpdateController.$inject = ['$scope','$element','$rootScope','EditEntityStorage','RestApiService'];

    function UeButtonUpdateController($scope,$element,$rootScope,EditEntityStorage,RestApiService){
        var vm = this;

        vm.label = vm.setting.component.settings.label;
        vm.processing = RestApiService.isProcessing;

        vm.entityId = vm.setting.entityId;

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
            RestApiService.editedEntityId = vm.entityId;
            EditEntityStorage.editEntityUpdate("update");
        });

        vm.$postLink = function(){
            $scope.editor = RestApiService.getEntityType();
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }
    }
})();