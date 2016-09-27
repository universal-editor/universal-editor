(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeNumberController', UeNumberController);

    UeNumberController.$inject = ['$scope', '$element', 'EditEntityStorage', 'ArrayFieldStorage'];

    function UeNumberController($scope, $element, EditEntityStorage, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;

        if (vm.parentField) {
            if (vm.parentFieldIndex) {
                fieldErrorName = vm.parentField + "_" + vm.parentFieldIndex + "_" + vm.fieldName;
            } else {
                fieldErrorName = vm.parentField + "_" + vm.fieldName;
            }
        } else {
            fieldErrorName = vm.fieldName;
        }

        vm.cols = vm.field.width;
        vm.classTextarea = 'col-lg-2 col-md-2 col-sm-3 col-xs-3';
        vm.fieldName = vm.field.name;
        vm.fieldValue = undefined;
        vm.readonly = vm.field.readonly || false;
        vm.setErrorEmpty();
        vm.parentFieldIndex = vm.parentFieldIndex || false;
        vm.max = vm.field.max;
        vm.min = vm.field.min;
        vm.defaultValue = !isNaN(parseFloat(vm.field.defaultValue)) ? vm.field.defaultValue : null;
        vm.inputLeave = function (val) {
            if (!val) {
                return;
            }

            if(vm.field.hasOwnProperty("max") && val > vm.field.max){
                var maxError = "Для поля превышено максимальное допустимое значение " + vm.field.max + ". Сейчас введено " + val + ".";
                if (vm.errorIndexOf(maxError) < 0) {
                    vm.setError(maxError);
                }
            }

            if(vm.field.hasOwnProperty("min") && val < vm.field.min){
                var minError = "Минимальное значение поля не может быть меньше " + vm.field.min + ". Сейчас введено " + val + ".";
                if(vm.errorIndexOf(minError) < 0){
                    vm.setError(minError);
                }
            }
        };

        if (!!vm.cols) {
            if (vm.cols > 6) {
                vm.cols = 6;
            }
            if (vm.cols < 1) {
                vm.cols = 1;
            }
            vm.classTextarea = 'col-lg-' + vm.cols + ' col-md-' + vm.cols + ' col-sm-' + vm.cols + ' col-xs-' + vm.cols;
        }

        if (vm.field.hasOwnProperty("multiple") && vm.field.multiple === true) {
            vm.multiple = true;
            vm.fieldValue = [];
            if (vm.field.multiname || angular.isString(vm.field.multiname)) {
                vm.multiname = ('' + vm.field.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = vm.defaultValue || null ;
        }

        if (vm.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue(vm.parentField, vm.parentFieldIndex, vm.field.name), function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue(vm.parentField, vm.parentFieldIndex, vm.field.name) || null;
            }
        }

        EditEntityStorage.addFieldController(this);

        this.getFieldValue = function () {
            var field = {},
                wrappedFieldValue;
            if (vm.multiname) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    var tempItem = {};
                    tempItem[vm.multiname] = valueItem;
                    wrappedFieldValue.push(tempItem);
                });
            } else if (vm.multiple) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
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
        };

        /*
         * Field system method: Возврашает значение поля которое используется при создании
         * новой сущности, т.е. дефолтное значение поля
         */

        this.getInitialValue = function () {
            var field = {};
            if (vm.parentField) {
                if (vm.multiple) {
                    field[vm.parentField] = {};
                    field[vm.parentField][vm.fieldName] = [];
                } else {
                    field[vm.parentField] = {};
                    field[vm.parentField][vm.fieldName] = null;
                }
            } else {
                if (vm.multiple) {
                    field[vm.fieldName] = [];
                } else {
                    field[vm.fieldName] = null;
                }
            }

            return field;
        };

        vm.addItem = function () {
          vm.fieldValue.push(vm.defaultValue);
        };

        vm.removeItem = function (index) {
            angular.forEach(vm.fieldValue, function (value, key) {
                if (key == index) {
                    vm.fieldValue.splice(index, 1);
                }
            });
        };

       

        function clear() {
            vm.fieldValue = vm.field.hasOwnProperty("multiple") && vm.field.multiple === true ? [] : (vm.defaultValue || null);
        }
        var destroyWatchEntityLoaded;
        var destroyEntityLoaded = $scope.$on('editor:entity_loaded', function (event, data) {
            if (vm.field.requiredField) {
                destroyWatchEntityLoaded = $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField(vm.field.requiredField);
                    var result = false;
                    var endRecursion = false;
                    (function check(value) {
                        var keys = Object.keys(value);
                        for (var i = keys.length; i--;) {
                            var propValue = value[keys[i]];
                            if (propValue !== null && propValue !== undefined && propValue !== null) {
                                if (angular.isObject(propValue) && !endRecursion) {
                                    check(propValue);
                                }
                                result = true;
                                endRecursion = true;
                            }
                        }
                    })(f_value);
                    return result;
                }, function (value) {
                    if (!value) {
                        clear();
                        vm.readonly = true;
                    } else {
                        vm.readonly = vm.field.readonly || false;
                    }
                }, true);
            }

            if (data.editorEntityType === "new") {
                if (vm.defaultValue) {
                    vm.fieldValue = vm.multiple ? [vm.defaultValue] : vm.defaultValue;
                } else {
                    vm.fieldValue = vm.multiple ? [] : null;
                }
                if (data.hasOwnProperty(vm.field.name)) {
                    vm.fieldValue = data[vm.field.name];
                }
                return;
            }

            if (!vm.parentField) {
                if (!vm.multiple) {
                    vm.fieldValue = data[vm.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.field.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            } else {
                if (!vm.multiple) {
                    vm.fieldValue = data[vm.parentField][vm.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.parentField][vm.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.parentField][vm.field.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            }
        });

        var destroyErrorField = $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function (error) {
                    if (vm.errorIndexOf(error) < 0) {
                        vm.setError(error);
                    }
                });
            } else {
                if (vm.errorIndexOf(data) < 0) {
                    vm.setError(data);
                }
            }
        });

        var destroyWatchFieldValue = $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            vm.setErrorEmpty();
        }, true);

        this.$onDestroy = function() {
            if (angular.isFunction(destroyWatchEntityLoaded)) {
                destroyWatchEntityLoaded();
            }
            destroyEntityLoaded();
            destroyErrorField();
            destroyWatchFieldValue();
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy(vm.parentField, vm.parentFieldIndex, vm.field.name, vm.fieldValue);
            }
        };

        this.$postLink = function() {
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }
    }
})();