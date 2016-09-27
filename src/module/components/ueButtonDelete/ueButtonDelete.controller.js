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
        try {
            request = JSON.parse($scope.buttonRequest);
            params = request.params;
        } catch(e){

        }

        vm.label = vm.buttonLabel;
        vm.processing = RestApiService.isProcessing;

        var watchEntityId = $scope.$watch('entityId', function (entityId) {
            vm.entityId = entityId;
        });

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        vm.$onDestroy = function () {
            watchEntityId();
            watchRest();
        };

        $element.bind("click", function () {
            if(vm.processing){
                return;
            }
            if(confirm("Удалить запись «" + vm.entityId + "»?")){
                RestApiService.deleteItemById(vm.entityId,request, $scope.entityType);
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