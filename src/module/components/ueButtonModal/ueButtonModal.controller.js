(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonModalController',UeButtonModalController);

    UeButtonModalController.$inject = ['$rootScope','$scope','$element','RestApiService','configData', '$window','ModalService'];

    function UeButtonModalController($rootScope,$scope,$element,RestApiService,configData, $window, ModalService){
        var vm = this;

        vm.label = vm.setting.component.settings.label;
        vm.action = vm.setting.component.settings.action;

        $element.find('button').bind("click", function () {
          if(vm.action === 'close') {
            ModalService.close();
          }
        });

        vm.$postLink = function() {
            $scope.editor = RestApiService.getEntityType();
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }
}})();
