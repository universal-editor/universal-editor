(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeTextareaController', UeTextareaController);

    UeTextareaController.$inject = ['$scope', '$element', 'EditEntityStorage', 'ArrayFieldStorage', 'FilterFieldsStorage', '$controller'];

    function UeTextareaController($scope, $element, EditEntityStorage, ArrayFieldStorage, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */
        var vm = this;
        var baseController = $controller('FieldsController', { $scope: $scope });
        angular.extend(vm, baseController);
        var fieldErrorName;
        var componentSettings = vm.setting.component.settings;
        vm.parentEntityScopeId = vm.options.$parentScopeId || '';

        if (vm.setting.parentField) {
            if (vm.setting.parentFieldIndex) {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.parentFieldIndex + "_" + vm.setting.fieldName;
            } else {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.fieldName;
            }
        } else {
            fieldErrorName = vm.setting.name;
        }
        vm.rows = componentSettings.height;
        vm.cols = componentSettings.width;
        vm.classTextarea = '';
        vm.fieldName = vm.setting.name;
        vm.fieldValue = "";
        vm.readonly = componentSettings.readonly || false;
        vm.parentFieldIndex = vm.parentFieldIndex || false;
        vm.fieldDisplayName = componentSettings.label;
        vm.hint = componentSettings.hint || false;
        vm.required = componentSettings.required || false;
        vm.error = [];
        vm.clear = clear;
        vm.getFieldValue = getFieldValue;
        vm.multiple = componentSettings.multiple === true ? true : false;

        if (componentSettings.multiname || angular.isString(componentSettings.multiname)) {
            vm.multiname = ('' + componentSettings.multiname) || "value";
        }

        if (vm.options.filter) {
            vm.multiple = false;
            vm.readonly = false;
            vm.required = false;
        }
        vm.fieldValue = vm.multiple ? [] : '';

        if (!!vm.cols) {
            if (vm.cols > 6) {
                vm.cols = 6;
            }
            if (vm.cols < 1) {
                vm.cols = 1;
            }
            vm.classTextarea = 'col-lg-' + vm.cols + ' col-md-' + vm.cols + ' col-sm-' + vm.cols + ' col-xs-' + vm.cols;
        }


        if (vm.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue(vm.parentField, vm.parentFieldIndex, vm.fieldName), function(item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue(vm.parentField, vm.parentFieldIndex, vm.fieldName) || "";
            }
        }

        vm.addItem = function() {
            vm.fieldValue.push("");
        };

        vm.removeItem = function(index) {
            angular.forEach(vm.fieldValue, function(value, key) {
                if (key == index) {
                    vm.fieldValue.splice(index, 1);
                }
            });
        };

        vm.inputLeave = function(val) {
            if (!val) {
                return;
            }

            /*   if (componentSettings.hasOwnProperty("maxLength") && val.length > componentSettings.maxLength) {
                   var maxError = "Для поля превышено максимальное допустимое значение в " + componentSettings.maxLength + " символов. Сейчас введено " + val.length + " символов.";
                   if (vm.error.indexOf(maxError) < 0) {
                       vm.error.push(maxError);
                   }
               }
   
               if (componentSettings.hasOwnProperty("minLength") && val.length < componentSettings.minLength) {
                   var minError = "Минимальное значение поля не может быть меньше " + componentSettings.minLength + " символов. Сейчас введено " + val.length + " символов.";
                   if (vm.error.indexOf(minError) < 0) {
                       vm.error.push(minError);
                   }
               }*/
        };

        var destroyWatchEntityLoaded;
        var destroyEntityLoaded = $scope.$on('editor:entity_loaded' + vm.parentEntityScopeId, function(event, data) {
            if (!vm.options.filter) {

                //-- functional for required fields
                if (componentSettings.requiredField) {
                    destroyWatchEntityLoaded = $scope.$watch(function() {
                        var f_value = EditEntityStorage.getValueField(componentSettings.requiredField);
                        var result = false;
                        var endRecursion = false;
                        (function check(value) {
                            var keys = Object.keys(value);
                            for (var i = keys.length; i--;) {
                                var propValue = value[keys[i]];
                                if (propValue !== null && propValue !== undefined && propValue !== "") {
                                    if (angular.isObject(propValue) && !endRecursion) {
                                        check(propValue);
                                    }
                                    result = true;
                                    endRecursion = true;
                                }
                            }
                        })(f_value);
                        return result;
                    }, function(value) {
                        if (!value) {
                            clear();
                            vm.readonly = true;
                        } else {
                            vm.readonly = componentSettings.readonly || false;
                        }
                    }, true);
                }

                if (data.editorEntityType === "new") {
                    if (componentSettings.defaultValue) {
                        vm.fieldValue = vm.multiple ? [componentSettings.defaultValue] : componentSettings.defaultValue;
                    } else {
                        vm.fieldValue = vm.multiple ? [] : '';
                    }
                    return;
                }

                if (!vm.parentField) {
                    if (!vm.multiple) {
                        vm.fieldValue = data[vm.fieldName];
                    } else if (vm.multiname) {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.fieldName], function(item) {
                            vm.fieldValue.push(item[vm.multiname]);
                        });
                    } else {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.fieldName], function(item) {
                            vm.fieldValue.push(item);
                        });
                    }
                } else {
                    if (!vm.multiple) {
                        vm.fieldValue = data[vm.parentField][vm.fieldName];
                    } else if (vm.multiname) {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.parentField][vm.fieldName], function(item) {
                            vm.fieldValue.push(item[vm.multiname]);
                        });
                    } else {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.parentField][vm.fieldName], function(item) {
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
        }, true);

        this.$onDestroy = function() {
            if (angular.isFunction(destroyWatchEntityLoaded)) {
                destroyWatchEntityLoaded();
            }
            destroyEntityLoaded();
            destroyErrorField();
            destroyWatchFieldValue();
            EditEntityStorage.deleteFieldController(vm, vm.parentEntityScopeId);
            FilterFieldsStorage.deleteFilterController(vm, vm.parentEntityScopeId);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy(vm.parentField, vm.parentFieldIndex, vm.fieldName, vm.fieldValue);
            }
        };

        this.$postLink = function() {
            $element.on('$destroy', function() {
                $scope.$destroy();
            });
        };

        /** Filter logic */

        if (vm.options.filter) {
            FilterFieldsStorage.addFilterController(this, vm.parentEntityScopeId);
        } else {
            EditEntityStorage.addFieldController(this, vm.parentEntityScopeId);
        }

        function clear() {
            vm.fieldValue = vm.multiple === true ? [] : (componentSettings.defaultValue || '');
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

            if (vm.parentField) {
                if (vm.parentFieldIndex) {
                    field[vm.parentField] = [];
                    field[vm.parentField][vm.parentFieldIndex] = {};
                    field[vm.parentField][vm.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[vm.parentField] = {};
                    field[vm.parentField][vm.fieldName] = wrappedFieldValue;
                }

            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        }
    }
})();