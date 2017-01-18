(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonModalController',UeButtonModalController);

    UeButtonModalController.$inject = ['$rootScope','$scope','$element','RestApiService','configData', '$window','ModalService','ButtonsService', '$controller'];

    function UeButtonModalController($rootScope,$scope,$element,RestApiService,configData, $window, ModalService, ButtonsService, $controller){
        $element.addClass('ue-button');

        var vm = this;

        angular.extend(vm, $controller('ButtonsController', { $scope: $scope }));

        $element.bind('click', function () {
          if(vm.action === 'close') {
            if(vm.beforeAction) {
                vm.beforeAction();
            }
            ModalService.close(true);
          }
        });      
}})();
