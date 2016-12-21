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
        vm.singleValue = angular.isArray(vm.optionValues) && vm.optionValues.length === 1 && !vm.optionValues[0][vm.field_search];

        if(vm.singleValue) {
            vm.checkBoxStyle = 'display: inline; margin-left: 10px;';
            vm.getFieldValue = function () {
                var field = {},
                    wrappedFieldValue;
                    if(angular.isArray(vm.fieldValue)) {
                      wrappedFieldValue = vm.fieldValue.length;
                    } else {
                        wrappedFieldValue = vm.fieldValue || 0;
                    }

                if (vm.parentField) {
                    field[vm.parentField] = {};
                    field[vm.parentField][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[vm.fieldName] = wrappedFieldValue;
                }

                return field;
            };
        }

         vm.listeners.push($scope.$on('editor:entity_loaded', function(e, data) {
            $scope.onLoadDataHandler(e, data);
             componentSettings.$loadingPromise.then(function(optionValues) {
                vm.optionValues = optionValues;
                vm.equalPreviewValue();
                if(vm.singleValue) {                 
                    vm.fieldValue = vm.fieldValue == 1 ? [vm.optionValues[0][vm.field_id]] : [];
                }  
            }).finally(function() {
                vm.loadingData = false;
            });                 
        }));

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