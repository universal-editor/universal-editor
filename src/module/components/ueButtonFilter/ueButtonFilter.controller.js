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
            if (vm.beforeAction) {
                vm.beforeAction();
            }
            var filterJSON = null, filters;

            var parentComponentId = vm.options.$parentComponentId;
            filters = $location.search().filter;
            if (filters) {
                filters = JSON.parse(filters);
            }

            if (vm.action === 'send') {
                var filterEntity = FilterFieldsStorage.calculate(parentComponentId);
                if (filterEntity) {
                    filters = filters || {};
                    filters[parentComponentId] = filterEntity;
                }
                filterJSON = filters ? JSON.stringify(filters) : null;
            }

            if (vm.action === 'clear') {
                FilterFieldsStorage.clearFiltersValue(parentComponentId);
                if (filters) {
                    delete filters[parentComponentId];
                    if (!$.isEmptyObject(filters)) {
                        filterJSON = JSON.stringify(filters);
                    }
                }
            }
            $location.search('filter', filterJSON);
            $rootScope.$broadcast('editor:read_entity', parentComponentId);
        });

        $element.on('$destroy', function() {
            $scope.$destroy();
        });
    }
})();
