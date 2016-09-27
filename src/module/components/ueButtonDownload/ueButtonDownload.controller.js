(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonDownloadController',UeButtonDownloadController);

    UeButtonDownloadController.$inject = ['$rootScope','$scope','$element','RestApiService','configData', '$window'];

    function UeButtonDownloadController($rootScope,$scope,$element,RestApiService,configData, $window){
        var vm = this;
        var params;
        var request;
        try {
            request = JSON.parse(vm.buttonRequest);
        } catch(e){

        }
        vm.label = vm.buttonLabel;
        vm.class = vm.buttonClass;

        $element.bind("click", function () {
            var url = request.url;
            for (var key in vm.itemValue) {
                if (vm.itemValue[key]) {
                    url = url.replace(":" + key, vm.itemValue[key]);
                }
            }            
            location.assign(url);
        });

        vm.$postLink = function() {
            scope.editor = RestApiService.getEntityType();
            elem.on('$destroy', function () {
                scope.$destroy();
            });
        }
}})();
