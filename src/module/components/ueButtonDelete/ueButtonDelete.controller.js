(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonDeleteController',UeButtonDeleteController);

    UeButtonDeleteController.$inject = ['$scope','$element','RestApiService'];

    function UeButtonDeleteController($scope,$element,RestApiService){
        var vm = this;
        var params;
        var request;
        if(vm.setting.component.settings.request) {
            request = JSON.parse(vm.setting.component.settings.request);
        }

        vm.label = vm.setting.component.settings.label;
        vm.processing = RestApiService.isProcessing;

        //var watchEntityId = $scope.$watch('entityId', function (entityId) {
        //    vm.entityId = entityId;
        //});

        vm.entityId = vm.setting.entityId;

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        vm.$onDestroy = function () {
            //watchEntityId();
            watchRest();
        };

        $element.bind("click", function () {
            if(vm.processing){
                return;
            }
            if(confirm("Удалить запись «" + vm.entityId + "»?")){
                RestApiService.deleteItemById(vm.entityId, request, $scope.entityType, vm.setting);
            }
        });

        vm.$postLink = function() {
            $scope.editor = RestApiService.getEntityType();
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }
    }
})();