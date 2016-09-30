(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonRequestController',UeButtonRequestController);

    UeButtonRequestController.$inject = ['$rootScope','$scope','$element','RestApiService','configData', '$window'];

    function UeButtonRequestController($rootScope,$scope,$element,RestApiService,configData, $window){
        var vm = this;

        vm.label = vm.setting.component.settings.label;

        $element.bind("click", function () {
            RestApiService.contextMenuAction(vm.setting.component.settings.request);
        });

        vm.$postLink = function() {
            $scope.editor = RestApiService.getEntityType();
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }
}})();
