(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonRequestController',UeButtonRequestController);

    UeButtonRequestController.$inject = ['$rootScope','$scope','$element','RestApiService','configData', '$window'];

    function UeButtonRequestController($rootScope,$scope,$element,RestApiService,configData, $window){
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
                    beforeSend: getCallback(vm.setting.component.settings.beforeSend)
                };
                RestApiService.actionRequest(request).then(function(response){
                    var success = getCallback(vm.setting.component.settings.success);
                    if (!!success) {
                        success(response);
                    }
                }, function(reject) {
                    var error = getCallback(vm.setting.component.settings.error);
                    if (!!error) {
                        error(reject);
                    }
                }).finally(function() {
                    var complete = getCallback(vm.setting.component.settings.complete);
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

        function getCallback(name) {
            if (!name) {
                return name;
            }
            var callback = name.split('.');
            return $window[callback[0]][callback[1]];
        }
}})();
