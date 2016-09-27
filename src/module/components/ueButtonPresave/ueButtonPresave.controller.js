(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonPresaveController',UeButtonPresaveController);

    UeButtonPresaveController.$inject = ['$scope','$element','$rootScope','EditEntityStorage','RestApiService'];

    function UeButtonPresaveController($scope,$element,$rootScope,EditEntityStorage,RestApiService){
        var vm = this;
        var params;
        var request;


        try {
            request = JSON.parse(vm.buttonRequest);
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
            RestApiService.editedEntityId = vm.entityId;
            //TODO Call another method
            EditEntityStorage.editEntityPresave(request);
        });

        vm.$postLink = function() {
            $scope.editor = RestApiService.getEntityType();
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }
    }
})();