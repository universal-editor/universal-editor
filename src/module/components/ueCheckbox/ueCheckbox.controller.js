(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeCheckboxController', UeCheckboxController)
        .directive('ngIndeterminate', function() {
            return {
                restrict: 'A',
                scope: {
                    'ngIndeterminate': '='
                },
                link: function(scope, element, attrs) {
                    element.prop('indeterminate', scope.ngIndeterminate);
                    scope.$watch('ngIndeterminate', function(n, o) {
                        element.prop('indeterminate', n);
                    });
                }
            };
        });

    function UeCheckboxController($scope, $element, EditEntityStorage, YiiSoftApiService, FilterFieldsStorage, $controller) {
        "ngInject";
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
            vm.indeterminate = false;

            if (!componentSettings.valuesRemote && !componentSettings.values) {
                componentSettings.templates = componentSettings.templates || {};
                componentSettings.templates.preview = 'module/components/ueCheckbox/previewTemplate.html';
            }

            baseController = $controller('FieldsController', { $scope: $scope });
            angular.extend(vm, baseController);

            vm.singleValue = !componentSettings.hasOwnProperty('values') && !componentSettings.hasOwnProperty('valuesRemote');

            if (vm.singleValue) {
                vm.checkBoxStyle = 'display: inline;';
                vm.getFieldValue = getFieldValue;
                vm.trueValue = componentSettings.trueValue;
                vm.falseValue = componentSettings.falseValue;
                vm.optionValues = [];
                if (vm.options.filter) {
                    vm.indeterminate = true;
                    vm.fieldValue = [];
                }
                var obj = {};
                obj[vm.fieldId] = componentSettings.trueValue;
                if (!vm.options.filter) {
                    obj[vm.fieldSearch] = componentSettings.label;
                } else {
                    obj[vm.fieldSearch] = '';
                }
                vm.label = '';
                vm.optionValues.push(obj);
            }

            vm.listeners.push($scope.$on('editor:entity_loaded', function(e, data) {
                if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId) {
                    $scope.onLoadDataHandler(e, data);
                    if (!vm.singleValue) {
                        componentSettings.$loadingPromise.then(function(optionValues) {
                            vm.optionValues = optionValues;
                            vm.equalPreviewValue();
                        }).finally(function() {
                            vm.loadingData = false;
                        });
                    } else {
                        var value = data[vm.fieldName];
                        if (vm.falseValue == value) {
                            vm.fieldValue = [vm.falseValue];
                        }
                        if (vm.trueValue == value) {
                            vm.fieldValue = [vm.trueValue];
                        }
                    }
                }
            }));

            function clear() {
                vm.defaultClear();
                vm.indeterminate = true;
                vm.fieldValue = [];
            }

            function isEmptyVar(n) {
                return n === null || n === undefined || (!angular.isArray(n) || n.length === 0);
            }
        };

        vm.switch = function(e) {
            if (vm.options.filter && vm.singleValue) {
                var input = $element.find('[type="checkbox"]');
                if (vm.fieldValue && vm.fieldValue.length > 0) {
                    if (vm.trueValue !== undefined && vm.trueValue !== null && vm.trueValue === vm.fieldValue[0]) {
                        vm.indeterminate = false;
                        vm.fieldValue = [vm.falseValue];
                    } else if (vm.falseValue !== undefined && vm.falseValue !== null && vm.falseValue === vm.fieldValue[0]) {
                        vm.indeterminate = true;
                        vm.fieldValue = [];
                    }
                }
            }
        };
        function dependUpdate(dependField, dependValue) {
            vm.optionValues = [];
            if (dependValue && dependValue !== '') {
                vm.loadingData = true;

                var url = YiiSoftApiService.getUrlDepend(componentSettings.valuesRemote.url, {}, dependField, dependValue);
                var config = {
                    method: 'GET',
                    url: url
                };
                config.standard = $scope.getParentDataSource().standard;
                YiiSoftApiService
                    .getUrlResource(config)
                    .then(function(response) {
                        angular.forEach(response.data.items, function(v) {
                            vm.optionValues.push(v);
                        });
                    }, function(reject) {
                        $translate('ERROR.FIELD.VALUES_REMOTE').then(function(translation) {
                            console.error('EditorFieldDropdownController: ' + translation.replace('%name_field', vm.fieldName));
                        });
                    })
                    .finally(function() {
                        vm.loadingData = false;
                    });
            }
        }

        function getFieldValue() {
            var field = {},
                wrappedFieldValue;
            wrappedFieldValue = vm.fieldValue;

            if (vm.singleValue && !vm.options.filter) {
                wrappedFieldValue = (!vm.fieldValue || vm.fieldValue.length === 0) ? componentSettings.falseValue : componentSettings.trueValue;
            }

            if (vm.options.filter && vm.fieldValue === null) {
                wrappedFieldValue = vm.fieldValue;
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