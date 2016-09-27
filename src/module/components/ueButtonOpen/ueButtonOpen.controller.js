(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonOpenController',UeButtonOpenController);

    UeButtonOpenController.$inject = ['$rootScope','$scope','$element','RestApiService'];

    function UeButtonOpenController($rootScope,$scope,$element,RestApiService){
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

        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        vm.$onDestroy = function(){
            watchRest();
        };

        $element.bind("click", function () {
            if(vm.processing){
                return;
            }
            RestApiService.loadChilds(vm.entityId,request);
        });

        vm.$postLink = function() {
            $scope.editor = RestApiService.getEntityType();
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }
    }
})();
