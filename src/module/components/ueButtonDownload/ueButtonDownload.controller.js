(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonDownloadController',UeButtonDownloadController);

    UeButtonDownloadController.$inject = ['$rootScope','$scope','$element','RestApiService','configData', '$window'];

    function UeButtonDownloadController($rootScope,$scope,$element,RestApiService,configData, $window){
        var vm = this;

        vm.label = vm.setting.label;

        $element.bind("click", function () {
            var url = vm.setting.url;
            for (var key in vm.itemValue) {
                if (vm.setting.itemValue[key]) {
                    url = url.replace(":" + key, vm.setting.itemValue[key]);
                }
            }            
            location.assign(url);
        });

        vm.$postLink = function() {
            $scope.editor = RestApiService.getEntityType();
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }
}})();
