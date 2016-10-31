(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeDatetimeController', UeDatetimeController);

    UeDatetimeController.$inject = ['$scope', '$element', 'EditEntityStorage', 'moment', 'ArrayFieldStorage', 'FilterFieldsStorage', '$controller'];

    function UeDatetimeController($scope, $element, EditEntityStorage, moment, ArrayFieldStorage, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */
        var vm = this;
        var componentSettings = vm.setting.component.settings;
        componentSettings.$fieldType = 'date';
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
            vm.fieldValue.push(moment());
        }
    }
})();