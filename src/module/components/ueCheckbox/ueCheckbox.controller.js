(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeCheckboxController', UeCheckboxController);

    UeCheckboxController.$inject = ['$scope', '$element', 'EditEntityStorage', 'RestApiService', 'FilterFieldsStorage', '$controller'];

    function UeCheckboxController($scope, $element, EditEntityStorage, RestApiService, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */
        var vm = this;
        var componentSettings = vm.setting.component.settings;
        componentSettings.$fieldType = 'array';
        vm.optionValues = [];
        vm.inputValue = "";
        vm.newEntityLoaded = newEntityLoaded;

        var baseController = $controller('FieldsController', { $scope: $scope });
        angular.extend(vm, baseController);

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

        function newEntityLoaded(){
            vm.fieldValue = [];
            angular.forEach(vm.setting.component.settings.defaultValue, function (item) {
                if (vm.setting.component.settings.multiname) {
                    vm.fieldValue.push(item[vm.setting.component.settings.multiname]);
                } else {
                    vm.fieldValue.push(item);
                }
            });
        }
    }
})();