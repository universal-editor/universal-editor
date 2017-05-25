(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeTextareaController', UeTextareaController);

    function UeTextareaController($scope, $element, EditEntityStorage, FilterFieldsStorage, $controller, $templateCache) {
        'ngInject';
        var vm = this,
            baseController,
            componentSettings;

        vm.$onInit = function() {            
            componentSettings = vm.setting.component.settings;
            if(!componentSettings.width) {
                componentSettings.width = 12;
            }
            baseController = $controller('FieldsController', { $scope: $scope, $element: $element });
            angular.extend(vm, baseController);
            vm.rows = componentSettings.height || 7;
            vm.addItem = addItem;
            vm.removeItem = removeItem;            

            vm.listeners.push($scope.$on('ue:componentDataLoaded', function(e, data) {  
                if (vm.isParentComponent(data) && !vm.options.filter && !e.defaultPrevented) {
                    $scope.onLoadDataHandler(e, data);
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