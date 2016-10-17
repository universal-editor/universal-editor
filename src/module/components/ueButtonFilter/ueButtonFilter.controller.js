(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonFilterController', UeButtonFilterController);

    UeButtonFilterController.$inject = ['$rootScope', '$scope', '$element', 'RestApiService', 'configData', '$window', 'ModalService', 'ButtonsService', 'FilterFieldsStorage'];

    function UeButtonFilterController($rootScope, $scope, $element, RestApiService, configData, $window, ModalService, ButtonsService, FilterFieldsStorage) {
        var vm = this;
        var settings = vm.setting.component.settings;

        vm.label = settings.label;
        vm.action = settings.action;
        vm.beforeAction = settings.beforeAction;

        $element.find('button').bind("click", function() {
            var callback = ButtonsService.getCallback(vm.beforeAction);
            if (callback) {
                callback();
            }

            if (vm.action === 'send') {
                debugger;
                var values = FilterFieldsStorage.calculate(settings.$parentScopeId);
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
