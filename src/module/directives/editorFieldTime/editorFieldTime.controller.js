(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldTimeController', EditorFieldTimeController);

    EditorFieldTimeController.$inject = ['$scope', 'EditEntityStorage', '$element', 'moment', 'ArrayFieldStorage'];

    function EditorFieldTimeController($scope, EditEntityStorage, $element, moment, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var regExpPattern = /^([01]\d|2[0-3]):([0-5]\d)$/i;
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

        vm.fieldName = $scope.field.name;
        vm.fieldDisplayName = $scope.field.label;
        vm.fieldValue = "";
        vm.readonly = $scope.field.readonly || false;
        vm.hint = $scope.field.hint || false;
        vm.required = $scope.field.required || false;
        vm.sourceTime = moment();
        vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;

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
                        vm.fieldValue.push(item[vm.multiname] ? moment(item[vm.multiname], 'YYYY-MM-DD HH:mm:ss') : "");
                    } else {
                        vm.fieldValue.push(item ? moment(item, 'YYYY-MM-DD HH:mm:ss') : "");
                    }
                });
            } else {
                var timeValue = ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name);
                vm.fieldValue = timeValue ? moment(timeValue, 'YYYY-MM-DD HH:mm:ss') : vm.fieldValue;
            }
        }

        EditEntityStorage.addFieldController(this);

        this.getFieldValue = function () {

            var field = {};
            var wrappedFieldValue;

            if (vm.multiname) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    if (!valueItem || valueItem === "" || !moment.isMoment(valueItem)) {
                        return;
                    }
                    var tempItem = {};
                    tempItem[vm.multiname] = moment(valueItem).format('YYYY-MM-DD HH:mm:ss');
                    wrappedFieldValue.push(tempItem);
                });
            } else if (vm.multiple) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    wrappedFieldValue.push(moment(valueItem).format('YYYY-MM-DD HH:mm:ss'));
                });
            } else {
                if (!vm.fieldValue || vm.fieldValue === "" || !moment.isMoment(vm.fieldValue)) {
                    wrappedFieldValue = "";
                } else {
                    wrappedFieldValue = moment(vm.fieldValue).format('YYYY-MM-DD HH:mm:ss');
                }
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
                    field[$scope.parentField][vm.fieldName] = [];
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = moment();
                }
            } else {
                if (vm.multiple) {
                    field[vm.fieldName] = [];
                } else {
                    field[vm.fieldName] = moment();
                }
            }

            return field;
        };

        vm.addItem = function () {
            vm.fieldValue.push(moment());
        };

        vm.removeItem = function (index) {
            angular.forEach(vm.fieldValue, function (value, key) {
                if (key == index) {
                    vm.fieldValue.splice(index, 1);
                }
            });
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
                vm.fieldValue = vm.multiple ? [] : moment();
                return;
            }

            if (!$scope.parentField) {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.field.name] ?
                        moment(data[$scope.field.name], 'YYYY-MM-DD HH:mm:ss') : "";
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(moment(item[vm.multiname], 'YYYY-MM-DD HH:mm:ss'));
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        vm.fieldValue.push(moment(item, 'YYYY-MM-DD HH:mm:ss'));
                    });
                }
            } else {
                if (!vm.multiple) {
                    vm.fieldValue = data[$scope.parentField][$scope.field.name] ?
                        moment(data[$scope.parentField][$scope.field.name], 'YYYY-MM-DD HH:mm:ss') :
                        "";
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(moment(item[vm.multiname], 'YYYY-MM-DD HH:mm:ss'));
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        vm.fieldValue.push(moment(item, 'YYYY-MM-DD HH:mm:ss'));
                    });
                }
            }
        });

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            vm.error = [];
        }, true);

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy($scope.parentField, $scope.parentFieldIndex, $scope.field.name, vm.fieldValue);
            }
        });

        $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
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
    }
})();