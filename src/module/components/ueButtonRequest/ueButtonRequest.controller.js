(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonRequestController',UeButtonRequestController);

    UeButtonRequestController.$inject = ['$rootScope','$scope','$element','RestApiService','configData', 'ButtonsService'];

    function UeButtonRequestController($rootScope,$scope,$element,RestApiService,configData, ButtonsService){
        var vm = this;
        //console.log(vm);
        vm.label = vm.setting.component.settings.label;
        var beforeSend = vm.setting.component.settings.beforeSend;
        var success = vm.setting.component.settings.success;
        var error = vm.setting.component.settings.error;
        var complete = vm.setting.component.settings.complete;

        $element.bind("click", function () {
            if (!!vm.setting.component.settings.target) {
                window.open(vm.setting.component.settings.url, vm.setting.component.settings.target);
            } else {
                var request = {
                    url: vm.setting.component.settings.url,
                    method: vm.setting.component.settings.method,
                    beforeSend: beforeSend
                };
                RestApiService.actionRequest(request).then(function(response){
                    if (!!success) {
                        success(response);
                    }
                }, function(reject) {
                    if (!!error) {
                        error(reject);
                    }
                }).finally(function() {
                    if (!!complete) {
                        complete();
                    }
                    RestApiService.isProcessing = false;
                });
            }
        });

        vm.$postLink = function() {
            $scope.editor = RestApiService.getEntityType();
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        };
}})();
