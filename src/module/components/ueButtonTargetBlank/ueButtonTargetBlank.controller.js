(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonTargetBlankController',UeButtonTargetBlankController);

    UeButtonTargetBlankController.$inject = ['$rootScope','$scope','$element','RestApiService','configData', '$http'];

    function UeButtonTargetBlankController($rootScope, $scope, $element, RestApiService, configData, $http) {
        var vm = this;
        var params;
        var request;
        try {
            request = JSON.parse(vm.buttonRequest);
        } catch(e){

        }
        vm.class = vm.buttonClass;
        vm.label = vm.buttonLabel;
        $element.bind("click", function () {
            var url = request.url;
            for (var key in vm.itemValue) {
                if (vm.itemValue[key]) {
                    url = url.replace(":" + key, vm.itemValue[key]);
                }
            }
            window.open(url, '_blank');
            
        });

        vm.$postLink = function() {
            $scope.editor = RestApiService.getEntityType();
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }
    }
})();
