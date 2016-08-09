(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorButtonOpenController',EditorButtonOpenController);

    EditorButtonOpenController.$inject = ['$rootScope','$scope','$element','RestApiService'];

    function EditorButtonOpenController($rootScope,$scope,$element,RestApiService){
        var vm = this;
        var params;
        var request;

        try {
            request = JSON.parse($scope.buttonRequest);
            params = request.params;
        } catch(e){

        }

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
            RestApiService.loadChilds($scope.entityId,request);
        });
    }
})();
