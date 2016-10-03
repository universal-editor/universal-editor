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

        vm.label = vm.setting.component.settings.label;
        vm.entityId = vm.setting.entityId;

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
            RestApiService.editedEntityId = vm.entityId;
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