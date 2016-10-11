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
        vm.label = vm.setting.component.settings.label;

        vm.processing = RestApiService.isProcessing;



        var watchRest = $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (val) {
            vm.processing = val;
        });

        var id = vm.setting.entityId;
        var scopeIdParent = vm.setting.scopeIdParent;

        vm.$onDestroy = function(){
            watchRest();
        };

        $element.bind("click", function () {
            if(vm.processing){
                return;
            }
            var url = RestApiService.getEntityObject().dataSource.url;
            RestApiService.loadChilds(id,request, url, scopeIdParent);
        });

        vm.$postLink = function() {
            $scope.editor = RestApiService.getEntityType();
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }
    }
})();
