(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeColorpickerController', UeColorpickerController);

    UeColorpickerController.$inject = ['$scope', '$element', 'EditEntityStorage', 'FilterFieldsStorage', '$state', '$controller'];

    function UeColorpickerController($scope, $element, EditEntityStorage, FilterFieldsStorage, $state, $controller) {
        /* jshint validthis: true */
        var vm = this;
        var componentSettings = vm.setting.component.settings;

        componentSettings.defaultValue = componentSettings.multiple ? (componentSettings.defaultValue || ['#000000']) : (componentSettings.defaultValue || '#000000');
        var baseController = $controller('FieldsController', { $scope: $scope });
        angular.extend(vm, baseController);

        vm.addItem = addItem;
        vm.removeItem = removeItem; 

        vm.listeners.push($scope.$on('editor:entity_loaded', $scope.onLoadDataHandler));
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