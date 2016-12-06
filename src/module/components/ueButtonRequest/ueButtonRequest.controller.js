(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonRequestController',UeButtonRequestController);

    UeButtonRequestController.$inject = ['$rootScope','$scope','$element','RestApiService','configData', 'ButtonsService', '$controller'];

    function UeButtonRequestController($rootScope,$scope,$element,RestApiService,configData, ButtonsService, $controller){
        var vm = this;

        angular.extend(vm, $controller('ButtonsController', { $scope: $scope }));

        vm.classButton = 'btn btn-md btn-success button-footer';

        switch (vm.setting.buttonClass){
            case 'header':
                vm.classButton = 'btn btn-lg btn-success';
                break;
            case 'context':
                vm.classButton = 'editor-action-button';
                break;
        }

        vm.buttonClick = function () {
            if (!!vm.setting.component.settings.target) {
                window.open(vm.setting.component.settings.url, vm.setting.component.settings.target);
            } else {
                var request = {
                    url: vm.setting.component.settings.url,
                    method: vm.setting.component.settings.method,
                    beforeSend: vm.beforeSend
                };
                RestApiService.actionRequest(request).then(function(response){
                    if (!!vm.success) {
                        vm.success(response);
                    }
                }, function(reject) {
                    if (!!vm.error) {
                        vm.error(reject);
                    }
                }).finally(function() {
                    if (!!vm.complete) {
                        vm.complete();
                    }
                    vm.options.isLoading = false;
                });
            }
        };

        vm.$postLink = function() {
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        };
}})();
