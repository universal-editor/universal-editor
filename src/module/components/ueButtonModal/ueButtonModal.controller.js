(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonModalController',UeButtonModalController);

    UeButtonModalController.$inject = ['$rootScope','$scope','$element','RestApiService','configData', '$window','ModalService','ButtonsService'];

    function UeButtonModalController($rootScope,$scope,$element,RestApiService,configData, $window, ModalService, ButtonsService){
        var vm = this;

        vm.label = vm.setting.component.settings.label;
        vm.action = vm.setting.component.settings.action;
        vm.beforeAction = vm.setting.component.settings.beforeAction;

        $element.find('button').bind("click", function () {
            var callback = ButtonsService.getCallback(vm.beforeAction);
          if(vm.action === 'close') {
            if(callback) {
                callback();
            }
            ModalService.close();
          }
        });

        $element.on('$destroy', function () {
           $scope.$destroy();
        });
}})();
