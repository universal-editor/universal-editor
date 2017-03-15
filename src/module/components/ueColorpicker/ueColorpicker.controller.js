(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeColorpickerController', UeColorpickerController);

    function UeColorpickerController($scope, $element, EditEntityStorage, FilterFieldsStorage, $state, $controller) {
        /* jshint validthis: true */
        "ngInject";
        var vm = this,
            componentSettings,
            baseController;

        vm.$onInit = function() {
            componentSettings = vm.setting.component.settings;
            componentSettings.defaultValue = componentSettings.multiple ? (componentSettings.defaultValue || ['#000000']) : (componentSettings.defaultValue || '#000000');
            baseController = $controller('FieldsController', { $scope: $scope });
            angular.extend(vm, baseController);

            vm.addItem = addItem;
            vm.removeItem = removeItem;

            vm.listeners.push($scope.$on('ue:componentDataLoaded', function(e, data) {
                if (vm.isParentComponent(data) && !vm.options.filter) {
                    $scope.onLoadDataHandler(e, data);
                    vm.equalPreviewValue();
                }
            }));
        };



        //-- private functions
        function removeItem(index) {
            if (angular.isArray(vm.fieldValue)) {
                vm.fieldValue.forEach(function(value, key) {
                    if (key == index) {
                        vm.fieldValue.splice(index, 1);
                    }
                });
            }
        }

        function addItem() {
            vm.fieldValue.push('#000000');
        }
    }
})();