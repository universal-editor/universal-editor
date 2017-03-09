(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeTextareaController', UeTextareaController);

    function UeTextareaController($scope, $element, EditEntityStorage, FilterFieldsStorage, $controller, $templateCache) {
        "ngInject";
        var vm = this,
            baseController,
            componentSettings;

        vm.$onInit = function() {            
            componentSettings = vm.setting.component.settings;
            if(!componentSettings.width) {
                componentSettings.width = 12;
            }
            baseController = $controller('FieldsController', { $scope: $scope });
            angular.extend(vm, baseController);
            vm.rows = componentSettings.height || 7;
            vm.addItem = addItem;
            vm.removeItem = removeItem;

            vm.listeners.push($scope.$on('editor:entity_loaded', function(e, data) {
                $scope.onLoadDataHandler(e, data);

                if (!data.$parentComponentId || vm.isParentComponent(data.$parentComponentId) && !vm.options.filter) {
                    vm.equalPreviewValue();
                }
            }));
        };

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
            vm.fieldValue.push('');
        } 
    }
})();