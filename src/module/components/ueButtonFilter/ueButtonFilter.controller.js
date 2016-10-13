(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonFilterController', UeButtonFilterController);

    UeButtonFilterController.$inject = ['$rootScope', '$scope', '$element', 'RestApiService', 'configData', '$window', 'ModalService', 'ButtonsService'];

    function UeButtonFilterController($rootScope, $scope, $element, RestApiService, configData, $window, ModalService, ButtonsService) {
        var vm = this;

        vm.label = vm.setting.component.settings.label;
        vm.action = vm.setting.component.settings.action;
        vm.beforeAction = vm.setting.component.settings.beforeAction;

        $element.find('button').bind("click", function() {
            var callback = ButtonsService.getCallback(vm.beforeAction);
            if (callback) {
                callback();
            }

            if (vm.action === 'send') {
                //* TODO */
            }

            if (vm.action === 'clear') {
                //* TODO */
            }
        });

        $element.on('$destroy', function() {
            $scope.$destroy();
        });
    }
})();
