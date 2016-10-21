(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeColorpickerController', UeColorpickerController);

    UeColorpickerController.$inject = ['$scope', '$element', 'EditEntityStorage', 'ArrayFieldStorage', 'FilterFieldsStorage', '$state', '$controller'];

    function UeColorpickerController($scope, $element, EditEntityStorage, ArrayFieldStorage, FilterFieldsStorage, $state, $controller) {
        /* jshint validthis: true */
        var vm = this;
        var baseController = $controller('FieldsController', { $scope: $scope });
        angular.extend(vm, baseController);
        var regExpPattern = /^#[0-9a-f]{3,6}$/i;
        var componentSettings = vm.setting.component.settings;                
        vm.parentEntityScopeId = vm.options.$parentScopeId || '';
        var defaultColor = (componentSettings.defaultValue || defaultColor);
        var fieldErrorName;
       

        vm.fieldName = vm.setting.name;
        if (vm.setting.parentField) {
            if (vm.setting.parentFieldIndex) {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.parentFieldIndex + "_" + vm.fieldName;
            } else {
                fieldErrorName = vm.setting.parentField + "_" + vm.fieldName;
            }
        } else {
            fieldErrorName = vm.setting.name;
        }
        vm.readonly = componentSettings.readonly || false;
        vm.parentFieldIndex = vm.setting.parentFieldIndex || false;
        vm.fieldDisplayName = componentSettings.label;
        vm.hint = componentSettings.hint || false;
        vm.required = componentSettings.required || false;
        vm.error = [];
        vm.multiple = componentSettings.multiple === true;

        if(vm.options.filter) {
            vm.multiple = false;
            vm.readonly = false;
            vm.required = false;
            defaultColor = null;
        }

        vm.fieldValue = vm.multiple && !vm.options.filter ? [] : defaultColor;

        if (componentSettings.multiname) {
            vm.multiname = ('' + componentSettings.multiname) || "value";
        }       

        if (vm.setting.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.setting.name), function(item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.setting.name) || "";
            }
        }

        vm.addItem = function() {
            vm.fieldValue.push(defaultColor);
        };

        vm.removeItem = function(index) {
            angular.forEach(vm.fieldValue, function(value, key) {
                if (key == index) {
                    vm.fieldValue.splice(index, 1);
                }
            });
        };

        var destroyEntityLoaded = $scope.$on('editor:entity_loaded' + vm.parentEntityScopeId, function(event, data) {
            if (!vm.options.filter) {
                if (data.editorEntityType === "new") {
                    return;
                }

                if (!vm.setting.parentField) {
                    if (!vm.multiple) {
                        vm.fieldValue = data[vm.setting.name];
                    } else if (vm.multiname) {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.setting.name], function(item) {
                            vm.fieldValue.push(item[vm.multiname]);
                        });
                    } else {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.setting.name], function(item) {
                            vm.fieldValue.push(item);
                        });
                    }
                } else {
                    if (!vm.multiple) {
                        vm.fieldValue = data[vm.setting.parentField][vm.setting.name];
                    } else if (vm.multiname) {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.setting.parentField][vm.setting.name], function(item) {
                            vm.fieldValue.push(item[vm.multiname]);
                        });
                    } else {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.setting.parentField][vm.setting.name], function(item) {
                            vm.fieldValue.push(item);
                        });
                    }
                }
            }
        });

        var destroyErrorField = $scope.$on("editor:api_error_field_" + fieldErrorName, function(event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function(error) {
                    if (vm.error.indexOf(error) < 0) {
                        vm.error.push(error);
                    }
                });
            } else {
                if (vm.error.indexOf(data) < 0) {
                    vm.error.push(data);
                }
            }
        });

        var destroyWatchFieldValue = $scope.$watch(function() {
            return vm.fieldValue;
        }, function() {
            vm.error = [];
        });

        this.$onDestroy = function() {
            destroyEntityLoaded();
            destroyErrorField();
            destroyWatchFieldValue();
            EditEntityStorage.deleteFieldController(vm, vm.parentEntityScopeId);
            FilterFieldsStorage.deleteFilterController(vm, vm.parentEntityScopeId);
            if (vm.setting.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy(vm.setting.parentField, vm.setting.parentFieldIndex, vm.setting.name, vm.fieldValue);
            }
        };

        this.$postLink = function() {
            $element.on('$destroy', function() {
                $scope.$destroy();
            });
        };

        vm.clear = clear;
        vm.getFieldValue = getFieldValue;

        if (vm.options.filter) {
            FilterFieldsStorage.addFilterController(this, vm.parentEntityScopeId);
        } else {
            EditEntityStorage.addFieldController(this, vm.parentEntityScopeId);
        }

        function clear() {
            vm.fieldValue = vm.multiple === true ? [] : null;
        }

        function getFieldValue() {
            var field = {};
            var wrappedFieldValue;

            if (vm.multiname) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function(valueItem) {
                    var tempItem = {};
                    tempItem[vm.multiname] = valueItem;
                    wrappedFieldValue.push(tempItem);
                });
            } else if (vm.multiple) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function(valueItem) {
                    wrappedFieldValue.push(valueItem);
                });
            } else {
                wrappedFieldValue = vm.fieldValue;
            }

            if (vm.setting.parentField) {
                if (vm.setting.parentFieldIndex) {
                    field[vm.setting.parentField] = [];
                    field[vm.setting.parentField][vm.setting.parentFieldIndex] = {};
                    field[vm.setting.parentField][vm.setting.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[vm.setting.parentField] = {};
                    field[vm.setting.parentField][vm.fieldName] = wrappedFieldValue;
                }
            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        }
    }
})();