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

        if (vm.setting.parentField) {
            if (vm.setting.parentFieldIndex) {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.parentFieldIndex + "_" + vm.setting.name;
            } else {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.name;
            }
        } else {
            fieldErrorName = vm.setting.name;
        }
        //vm.cols = vm.setting.width;
        vm.classTextarea = '';//'col-lg-2 col-md-2 col-sm-3 col-xs-3';
        vm.fieldValue = undefined;
        vm.readonly = vm.setting.readonly || false;
        vm.max = vm.setting.max;
        vm.min = vm.setting.min;
        vm.defaultValue = !isNaN(parseFloat(vm.setting.defaultValue)) ? vm.setting.defaultValue : null;
        vm.fieldDisplayName = vm.setting.component.settings.label;
        vm.hint = vm.setting.hint || false;
        vm.required = vm.setting.required || false;
        vm.error = [];

        vm.inputLeave = function (val) {
            if (!val) {
                return;
            }

            if(vm.setting.hasOwnProperty("max") && val > vm.setting.max){
                var maxError = "Для поля превышено максимальное допустимое значение " + vm.setting.max + ". Сейчас введено " + val + ".";
                if (vm.error.indexOf(maxError) < 0) {
                    vm.error.push(maxError);
                }
            }

            if(vm.setting.hasOwnProperty("min") && val < vm.setting.min){
                var minError = "Минимальное значение поля не может быть меньше " + vm.setting.min + ". Сейчас введено " + val + ".";
                if(vm.error.indexOf(minError) < 0){
                    vm.error.push(minError);
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
            //vm.classTextarea = 'col-lg-' + vm.cols + ' col-md-' + vm.cols + ' col-sm-' + vm.cols + ' col-xs-' + vm.cols;
        }

        if (vm.setting.hasOwnProperty("multiple") && vm.setting.multiple === true) {
            vm.multiple = true;
            vm.fieldValue = [];
            if (vm.setting.multiname || angular.isString(vm.setting.multiname)) {
                vm.multiname = ('' + vm.setting.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = vm.defaultValue || null ;
        }

        if (vm.setting.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.setting.name), function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.setting.name) || null;
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

            if (vm.setting.parentField) {
                if (vm.setting.parentFieldIndex) {
                    field[vm.setting.parentField] = [];
                    field[vm.setting.parentField][vm.setting.parentFieldIndex] = {};
                    field[vm.setting.parentField][vm.setting.parentFieldIndex][vm.setting.name] = wrappedFieldValue;
                } else {
                    field[vm.setting.parentField] = {};
                    field[vm.setting.parentField][vm.setting.name] = wrappedFieldValue;
                }
            } else {
                field[vm.setting.name] = wrappedFieldValue;
            }

            return field;
        };

        /*
         * Field system method: Возврашает значение поля которое используется при создании
         * новой сущности, т.е. дефолтное значение поля
         */

        this.getInitialValue = function () {
            var field = {};
            if (vm.setting.parentField) {
                if (vm.multiple) {
                    field[vm.setting.parentField] = {};
                    field[vm.setting.parentField][vm.setting.name] = [];
                } else {
                    field[vm.setting.parentField] = {};
                    field[vm.setting.parentField][vm.setting.name] = null;
                }
            } else {
                if (vm.multiple) {
                    field[vm.setting.name] = [];
                } else {
                    field[vm.setting.name] = null;
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
            vm.fieldValue = vm.setting.hasOwnProperty("multiple") && vm.setting.multiple === true ? [] : (vm.defaultValue || null);
        }
        var destroyWatchEntityLoaded;
        var destroyEntityLoaded = $scope.$on('editor:entity_loaded', function (event, data) {
            if (vm.setting.requiredField) {
                destroyWatchEntityLoaded = $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField(vm.setting.requiredField);
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
                        vm.readonly = vm.setting.readonly || false;
                    }
                }, true);
            }

            if (data.editorEntityType === "new") {
                if (vm.defaultValue) {
                    vm.fieldValue = vm.multiple ? [vm.defaultValue] : vm.defaultValue;
                } else {
                    vm.fieldValue = vm.multiple ? [] : null;
                }
                if (data.hasOwnProperty(vm.setting.name)) {
                    vm.fieldValue = data[vm.setting.name];
                }
                return;
            }

            if (!vm.setting.parentField) {
                if (!vm.multiple) {
                    vm.fieldValue = data[vm.setting.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.setting.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.setting.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            } else {
                if (!vm.multiple) {
                    vm.fieldValue = data[vm.setting.parentField][vm.setting.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.setting.parentField][vm.setting.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.setting.parentField][vm.setting.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            }
        });

        var destroyErrorField = $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function (error) {
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

        var destroyWatchFieldValue = $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            vm.error = [];
        }, true);

        this.$onDestroy = function() {
            if (angular.isFunction(destroyWatchEntityLoaded)) {
                destroyWatchEntityLoaded();
            }
            destroyEntityLoaded();
            destroyErrorField();
            destroyWatchFieldValue();
            EditEntityStorage.deleteFieldController(vm);
            if (vm.setting.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy(vm.setting.parentField, vm.setting.parentFieldIndex, vm.setting.name, vm.fieldValue);
            }
        };

        this.$postLink = function() {
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }
    }
})();