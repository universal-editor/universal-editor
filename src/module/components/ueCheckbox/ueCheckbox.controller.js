(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeCheckboxController', UeCheckboxController);

    UeCheckboxController.$inject = ['$scope', '$element', 'EditEntityStorage', 'YiiSoftApiService', 'FilterFieldsStorage', '$controller'];

    function UeCheckboxController($scope, $element, EditEntityStorage, YiiSoftApiService, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */

        var vm = this,
            componentSettings,
            baseController;

        vm.$onInit = function() {
            componentSettings = vm.setting.component.settings;
            componentSettings.$fieldType = 'array';
            vm.optionValues = [];
            vm.inputValue = '';
            vm.newEntityLoaded = newEntityLoaded;
            vm.dependUpdate = dependUpdate;
            vm.fieldId = 'id';
            vm.fieldSearch = 'title';
            baseController = $controller('FieldsController', { $scope: $scope });
            angular.extend(vm, baseController);

            vm.singleValue = !componentSettings.hasOwnProperty('values') && !componentSettings.hasOwnProperty('valuesRemote');

            if (vm.singleValue) {
                vm.checkBoxStyle = 'display: inline;';
                vm.getFieldValue = getFieldValue;
            }

            vm.listeners.push($scope.$on('editor:entity_loaded', function(e, data) {
                $scope.onLoadDataHandler(e, data);
                if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId) {
                    if (vm.singleValue) {
                        vm.optionValues = [];
                        vm.fieldValue = vm.fieldValue == componentSettings.trueValue ? [componentSettings.trueValue] : [];
                        var obj = {};
                        obj[vm.fieldId] = componentSettings.trueValue;
                        if (!vm.options.filter) {
                            obj[vm.fieldSearch] = componentSettings.label;
                        } else {
                            obj[vm.fieldSearch] = '';
                        }
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
        };

        function dependUpdate(dependField, dependValue) {
            vm.optionValues = [];
            if (dependValue && dependValue !== '') {
                vm.loadingData = true;

                var url = YiiSoftApiService.getUrlDepend(componentSettings.valuesRemote.url, {}, dependField, dependValue);
                YiiSoftApiService
                    .getUrlResource(url)
                    .then(function (response) {
                        angular.forEach(response.data.items, function (v) {
                            vm.optionValues.push(v);
                        });
                    }, function (reject) {
                        $translate('ERROR.FIELD.VALUES_REMOTE').then(function (translation) {
                            console.error('EditorFieldDropdownController: ' + translation.replace('%name_field', vm.fieldName));
                        });
                    })
                    .finally(function () {
                        vm.loadingData = false;
                    });
            }
        }

        function getFieldValue() {
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
        }


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