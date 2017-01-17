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
        vm.inputValue = '';
        vm.newEntityLoaded = newEntityLoaded;
        vm.fieldId = 'id';
        vm.fieldSearch = 'title';
        var baseController = $controller('FieldsController', { $scope: $scope });
        angular.extend(vm, baseController);
        vm.singleValue = !componentSettings.hasOwnProperty('values') && !componentSettings.hasOwnProperty('valuesRemote');

        if (vm.singleValue) {
            vm.checkBoxStyle = 'display: inline;';
            vm.getFieldValue = function() {
                var field = {},
                    wrappedFieldValue;
                if (angular.isArray(vm.fieldValue)) {
                    wrappedFieldValue = (vm.fieldValue.length == 0) ? componentSettings.falseValue : componentSettings.trueValue;
                } else {
                    wrappedFieldValue = vm.fieldValue || componentSettings.falseValue;
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
            if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {
                $scope.onLoadDataHandler(e, data);
                if (vm.singleValue) {
                    vm.optionValues = [];
                    vm.fieldValue = vm.fieldValue == componentSettings.trueValue ? [componentSettings.trueValue] : [];
                    var obj = {};
                    obj[vm.fieldId] = componentSettings.trueValue;
                    obj[vm.fieldSearch] = componentSettings.label;
                    vm.label = '';
                    vm.optionValues.push(obj);
                } else {
                    componentSettings.$loadingPromise.then(function(optionValues) {
                        vm.optionValues = optionValues;
                        vm.equalPreviewValue();
                    }).finally(function() {
                        vm.loadingData = false;
                    });
                }
            }
        }));

        function newEntityLoaded() {
            vm.fieldValue = [];
            angular.forEach(vm.setting.component.settings.defaultValue, function(item) {
                if (vm.setting.component.settings.multiname) {
                    vm.fieldValue.push(item[vm.setting.component.settings.multiname]);
                } else {
                    vm.fieldValue.push(item);
                }
            });
        }
    }
})();