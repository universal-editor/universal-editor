(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonFilterController', UeButtonFilterController);

    UeButtonFilterController.$inject = ['$rootScope', '$scope', '$element', 'RestApiService', 'configData', '$window', 'ModalService', 'ButtonsService', 'FilterFieldsStorage', '$state', '$location'];

    function UeButtonFilterController($rootScope, $scope, $element, RestApiService, configData, $window, ModalService, ButtonsService, FilterFieldsStorage, $state, $location) {
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
            var filterJSON = null, filters;

            if (vm.action === 'send') {
                filters = FilterFieldsStorage.calculate(settings.$parentScopeId);                
                filterJSON = filters ? JSON.stringify(filters) : null;
            }

            if (vm.action === 'clear') {
                FilterFieldsStorage.clearFiltersValue(settings.$parentScopeId);
            }
            $location.search('filter' + settings.$parentScopeId, filterJSON);                
            $rootScope.$broadcast('editor:read_entity_' + settings.$parentScopeId);
        });

        $element.on('$destroy', function() {
            $scope.$destroy();
        });
    }
})();
