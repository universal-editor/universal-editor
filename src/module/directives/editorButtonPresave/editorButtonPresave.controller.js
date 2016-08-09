(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonPresaveController',EditorButtonPresaveController);

    EditorButtonPresaveController.$inject = ['$scope','$element','$rootScope','EditEntityStorage','RestApiService'];

    function EditorButtonPresaveController($scope,$element,$rootScope,EditEntityStorage,RestApiService){
        var vm = this;
        var params;
        var request;


        try {
            request = JSON.parse($scope.buttonRequest);
            params = request.params;
        } catch(e){

        }

        vm.label = $scope.buttonLabel;
        vm.entityId = $scope.entityId;
        vm.processing = RestApiService.isProcessing;

        var watchEntityId = $scope.$watch('entityId', function (entityId) {
            vm.entityId = entityId;
        });

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        $scope.$on('$destroy', function () {
            watchEntityId();
            watchRest();
        });

        $element.bind("click", function () {
            if(vm.processing){
                return;
            }
            RestApiService.editedEntityId = vm.entityId;
            //TODO Call another method
            EditEntityStorage.editEntityPresave(request);
        });
    }
})();