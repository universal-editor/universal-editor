(function() {
    'use strict';

    angular
        .module('universal-editor')
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

    function UeCheckboxController($scope, $element, EditEntityStorage, ApiService, FilterFieldsStorage, $controller, $q) {
        'ngInject';
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
            vm.initDataSource = true;

            if (!componentSettings.valuesRemote && !componentSettings.values) {
                componentSettings.templates = componentSettings.templates || {};
                componentSettings.templates.preview = 'module/components/ueCheckbox/previewTemplate.html';
            }

            baseController = $controller('FieldsController', { $scope: $scope, $element: $element });
            angular.extend(vm, baseController);
            delete vm.inputLeave;

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

            vm.listeners.push($scope.$on('ue:componentDataLoaded', function(e, data) {
                if (vm.isParentComponent(data) && !e.defaultPrevented) {
                    $scope.onLoadDataHandler(e, data);
                    if (!vm.singleValue) {
                        if (componentSettings.$loadingPromise) {
                            componentSettings.$loadingPromise.then(function(optionValues) {
                                vm.optionValues = optionValues;
                                vm.equalPreviewValue();
                            }).finally(function() {
                                vm.loadingData = false;
                            });
                        }
                    } else {
                        if (vm.trueValue == vm.fieldValue) {
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
            if (dependValue && dependValue !== '') {
                vm.loadingData = true;
                if (!componentSettings.$loadingPromise || componentSettings.$loadingPromise.$$state !== 0) {
                    componentSettings.$loadingPromise = depend();
                } else {
                    componentSettings.$loadingPromise.then(depend);
                }

                function depend() {
                    var defer = $q.defer();
                    let candidates = ApiService.getFromStorage(vm.setting, null, { dependValue: dependValue });
                    if (!candidates) {
                        var url = ApiService.getUrlDepend(componentSettings.valuesRemote.url, {}, dependField, dependValue);
                        var config = {
                            url: url,
                            method: 'GET',
                            $id: vm.setting.component.$id,
                            serverPagination: vm.serverPagination,
                            standard: $scope.getParentDataSource().standard
                        };

                        ApiService
                            .getUrlResource(config)
                            .then(function(response) {
                                vm.optionValues = [];
                                angular.forEach(response.data.items, function(v) {
                                    vm.optionValues.push(v);
                                });
                                if (vm.optionValues.length === 0) {
                                    vm.clear();
                                }
                                ApiService.saveToStorage(vm.setting, response.data.items, { dependValue: dependValue });
                                defer.resolve(response.data.items);
                            }, function(reject) {
                                $translate('ERROR.FIELD.VALUES_REMOTE').then(function(translation) {
                                    console.error('EditorFieldDropdownController: ' + translation.replace('%name_field', vm.fieldName));
                                });
                                defer.reject(reject);
                            })
                            .finally(function() {
                                vm.loadingData = false;
                            });
                    } else {
                        vm.optionValues = [];
                        angular.forEach(candidates, function(v) {
                            vm.optionValues.push(v);
                        });
                        if (vm.optionValues.length === 0) {
                            vm.clear();
                        }
                        vm.loadingData = false;
                        defer.resolve(candidates);
                    }
                    return defer.promise;
                }
            } else {
                vm.optionValues = [];
                vm.fieldValue = [];
            }
        }

        function getFieldValue() {
            var field = {},
                wrappedFieldValue;
            wrappedFieldValue = vm.fieldValue;
            if (vm.singleValue && !vm.options.filter) {
                wrappedFieldValue = (angular.isArray(vm.fieldValue) && vm.fieldValue[0] === componentSettings.trueValue) ? componentSettings.trueValue : componentSettings.falseValue;
            }

            if (vm.options.filter && vm.fieldValue === null) {
                wrappedFieldValue = vm.fieldValue;
            }
            field[vm.fieldName] = wrappedFieldValue;

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