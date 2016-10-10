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

        $element.bind("click", function () {
            if (!!vm.setting.component.settings.target) {
                window.open(vm.setting.component.settings.url, vm.setting.component.settings.target);
            } else {
                var request = {
                    url: vm.setting.component.settings.url,
                    method: vm.setting.component.settings.method,
                    beforeSend: ButtonsService.getCallback(vm.setting.component.settings.beforeSend)
                };
                RestApiService.actionRequest(request).then(function(response){
                    var success = ButtonsService.getCallback(vm.setting.component.settings.success);
                    if (!!success) {
                        success(response);
                    }
                }, function(reject) {
                    var error = ButtonsService.getCallback(vm.setting.component.settings.error);
                    if (!!error) {
                        error(reject);
                    }
                }).finally(function() {
                    var complete = ButtonsService.getCallback(vm.setting.component.settings.complete);
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
