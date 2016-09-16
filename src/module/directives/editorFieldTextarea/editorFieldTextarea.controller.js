(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldTextareaController', EditorFieldTextareaController);

    EditorFieldTextareaController.$inject = ['$scope', 'EditEntityStorage', 'ArrayFieldStorage'];

    function EditorFieldTextareaController($scope, EditEntityStorage, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;

        if ($scope.parentField) {
            if ($scope.parentFieldIndex) {
                fieldErrorName = $scope.parentField + "_" + $scope.parentFieldIndex + "_" + $scope.fieldName;
            } else {
                fieldErrorName = $scope.parentField + "_" + $scope.fieldName;
            }
        } else {
            fieldErrorName = $scope.fieldName;
        }
        vm.rows = $scope.field.height;
        vm.cols = $scope.field.width;
        vm.classTextarea = 'col-lg-6 col-md-6 col-sm-7 col-xs-8';
        vm.fieldName = $scope.field.name;
        vm.fieldValue = "";
        vm.readonly = $scope.field.readonly || false;
        $scope.$parent.vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;

        if (!!vm.cols) {
            if (vm.cols > 6) {
                vm.cols = 6;
            }
            if (vm.cols < 1) {
                vm.cols = 1;
            }
            vm.classTextarea = 'col-lg-' + vm.cols + ' col-md-' + vm.cols + ' col-sm-' + vm.cols + ' col-xs-' + vm.cols;
        }

        if ($scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true) {
            vm.multiple = true;
            vm.fieldValue = [];
            if ($scope.field.multiname || angular.isString($scope.field.multiname)) {
                vm.multiname = ('' + $scope.field.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = "";
        }

        if (vm.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name), function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name) || "";
            }
        }

        EditEntityStorage.addFieldController(this);

        this.getFieldValue = function () {

            var field = {};
            var wrappedFieldValue;

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

            if ($scope.parentField) {
                if (vm.parentFieldIndex) {
                    field[$scope.parentField] = [];
                    field[$scope.parentField][vm.parentFieldIndex] = {};
                    field[$scope.parentField][vm.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = wrappedFieldValue;
                }

            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        };

        this.getInitialValue = function () {

            var field = {};

            if ($scope.parentField) {
                if (vm.multiple) {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = [""];
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = "";
                }
            } else {
                if (vm.multiple) {
                    field[vm.fieldName] = [""];
                } else {
                    field[vm.fieldName] = "";
                }
            }

            return field;
        };

        vm.addItem = function () {
            vm.fieldValue.push("");
        };

        vm.removeItem = function (index) {
            angular.forEach(vm.fieldValue, function (value, key) {
                if (key == index) {
                    vm.fieldValue.splice(index, 1);
                }
            });
        };

        vm.inputLeave = function (val) {
            if (!val) {
                return;
            }

            if($scope.field.hasOwnProperty("maxLength") && val.length > $scope.field.maxLength){
                var maxError = "Для поля превышено максимальное допустимое значение в " + $scope.field.maxLength + " символов. Сейчас введено " + val.length + " символов.";
                if ($scope.$parent.vm.error.indexOf(maxError) < 0) {
                    $scope.$parent.vm.error.push(maxError);
                }
            }

            if($scope.field.hasOwnProperty("minLength") && val.length < $scope.field.minLength){
                var minError = "Минимальное значение поля не может быть меньше " + $scope.field.minLength + " символов. Сейчас введено " + val.length + " символов.";
                if($scope.$parent.vm.error.indexOf(minError) < 0){
                    $scope.$parent.vm.error.push(minError);
                }
            }
        };

        function clear() {
            vm.fieldValue = $scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true ? [] : "";
        }

        $scope.$on('editor:entity_loaded', function (event, data) {

            //-- functional for required fields
            if ($scope.field.requiredField) {
                $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField($scope.field.requiredField);
                    var result = false;
                    var endRecursion = false;
                    (function (value) {
                        var keys = Object.keys(value);
                        for (var i = keys.length; i--;) {
                            var propValue = value[keys[i]];
                            if (propValue !== null && propValue !== undefined && propValue !== "") {
                                if (angular.isObject(propValue) && !endRecursion) {
                                    arguments.callee(propValue);
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
                        vm.readonly = $scope.field.readonly || false;
                    }
                }, true);
            }

            if (data.editorEntityType === "new") {
                if ($scope.field.defaultValue) {
                    vm.fieldValue = vm.multiple ? [$scope.field.defaultValue] : $scope.field.defaultValue;
                } else {
                    vm.fieldValue = vm.multiple ? [] : '';
                }
                return;
            }

            if (!$scope.parentField) {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            } else {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.parentField][$scope.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            }
        });

        $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function (error) {
                    if ($scope.$parent.vm.error.indexOf(error) < 0) {
                        $scope.$parent.vm.error.push(error);
                    }
                });
            } else {
                if ($scope.$parent.vm.error.indexOf(data) < 0) {
                    $scope.$parent.vm.error.push(data);
                }
            }
        });

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy($scope.parentField, $scope.parentFieldIndex, $scope.field.name, vm.fieldValue);
            }
        });

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            $scope.$parent.vm.error = [];
        }, true);
    }
})();