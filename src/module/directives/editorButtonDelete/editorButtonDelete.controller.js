(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonDeleteController',EditorButtonDeleteController);

    EditorButtonDeleteController.$inject = ['$scope','$element','RestApiService'];

    function EditorButtonDeleteController($scope,$element,RestApiService){
        var vm = this;
        var params;
        var request;
        try {
            request = JSON.parse($scope.buttonRequest);
            params = request.params;
        } catch(e){

        }
        vm.buttonClass = $scope.buttonClass;
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
            if(confirm("Удалить запись «" + vm.entityId + "»?")){
                RestApiService.deleteItemById(vm.entityId,request);
            }
        });
    }
})();