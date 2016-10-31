(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeRadiolistController', UeRadiolistController);

    UeRadiolistController.$inject = ['$scope', '$element', 'EditEntityStorage', 'RestApiService', 'ArrayFieldStorage', 'FilterFieldsStorage', '$controller'];

    function UeRadiolistController($scope, $element, EditEntityStorage, RestApiService, ArrayFieldStorage, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */
        var vm = this;
        vm.optionValues = [];
        vm.inputValue = "";
        
        var baseController = $controller('FieldsController', { $scope: $scope });
        angular.extend(vm, baseController);
        var componentSettings = vm.setting.component.settings;

        vm.addItem = addItem;
        vm.removeItem = removeItem;

        vm.listeners.push($scope.$on('editor:entity_loaded', $scope.onLoadDataHandler));

        //-- private methods

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
            vm.fieldValue.push(null);
        }
    }
})();