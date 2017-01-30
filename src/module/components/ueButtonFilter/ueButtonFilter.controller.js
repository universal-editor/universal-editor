(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeButtonFilterController', UeButtonFilterController);

    UeButtonFilterController.$inject = ['$rootScope', '$scope', '$element', 'FilterFieldsStorage', '$location', '$controller'];

    function UeButtonFilterController($rootScope, $scope, $element, FilterFieldsStorage, $location, $controller) {
        $element.addClass('ue-button');
        $element.addClass('grey');

        var vm = this,
            parentComponentId;

        vm.$onInit = function() {
            angular.extend(vm, $controller('ButtonsController', { $scope: $scope }));
            parentComponentId = vm.options.$parentComponentId;
        };

        $element.bind('click', function() {
            var filterJSON = null, filters;

            var parentComponentId = vm.options.$parentComponentId;

            if (vm.beforeSend) {
                FilterFieldsStorage.callbackBeforeSend = vm.beforeSend;
            }
            var filterName = vm.options.prefixGrid ? vm.options.prefixGrid + '-filter' : 'filter';
            filters = $location.search()[filterName];
            if (filters) {
                filters = JSON.parse(filters);
            }

            if (vm.action === 'send') {
                var filterEntity = FilterFieldsStorage.calculate(parentComponentId, filterName);

                if (filterEntity) {
                    filters = filters || {};
                    filters = angular.merge(filters, filterEntity);
                }
            }
            filters = JSON.stringify(filters);
            if (vm.action === 'clear') {
                FilterFieldsStorage.clearFiltersValue(parentComponentId, filterName);
                if (filters) {
                    filters = null;
                }
            }
            $location.search(filterName, filters);
            $rootScope.$broadcast('editor:read_entity', vm.options);
        });

        $element.on('$destroy', function() {
            $scope.$destroy();
        });
    }
})();
