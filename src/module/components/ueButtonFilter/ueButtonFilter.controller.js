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

                if (filterEntity === false) {
                    filters = filters || {};
                    delete filters[parentComponentId];
                }
                filterJSON = filters && !$.isEmptyObject(filters) ? JSON.stringify(filters) : null;
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
            $rootScope.$broadcast('editor:read_entity', vm.options);
        });

        $element.on('$destroy', function() {
            $scope.$destroy();
        });
    }
})();
