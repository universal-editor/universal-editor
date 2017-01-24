(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonModalController',UeButtonModalController);

    UeButtonModalController.$inject = ['$rootScope','$scope','$element', '$window','ModalService','ButtonsService', '$controller'];

    function UeButtonModalController($rootScope,$scope,$element, $window, ModalService, ButtonsService, $controller){
        $element.addClass('ue-button');

        var vm = this;

        vm.$onInit = function() {
            angular.extend(vm, $controller('ButtonsController', { $scope: $scope }));
        };

        $element.bind('click', function () {
          if(vm.action === 'close') {
            if(vm.beforeAction) {
                vm.beforeAction();
            }
            ModalService.close(true);
          }
        });      
}})();
