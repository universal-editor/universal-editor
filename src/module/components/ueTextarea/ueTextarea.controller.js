(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeTextareaController', UeTextareaController);

    UeTextareaController.$inject = ['$scope', '$element', 'EditEntityStorage', 'FilterFieldsStorage', '$controller'];

    function UeTextareaController($scope, $element, EditEntityStorage, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */
        var vm = this;
        var baseController = $controller('FieldsController', { $scope: $scope });
        angular.extend(vm, baseController);
        var componentSettings = vm.setting.component.settings;
        vm.rows = componentSettings.height || 7;
        vm.addItem = addItem;
        vm.removeItem = removeItem;
        vm.classComponent = (!vm.cols) ? '' : vm.classComponent;

        vm.listeners.push($scope.$on('editor:entity_loaded', function(e, data) {
            $scope.onLoadDataHandler(e, data);
            //-- for set preview value
            vm.equalPreviewValue();
        })); 

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
            vm.fieldValue.push("");
        } 
    }
})();