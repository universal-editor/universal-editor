(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeTimeController', UeTimeController);

    UeTimeController.$inject = ['$scope', 'EditEntityStorage', '$element', 'moment', 'ArrayFieldStorage'];

    function UeTimeController($scope, EditEntityStorage, $element, moment, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var regExpPattern = /^([01]\d|2[0-3]):([0-5]\d)$/i;
        var fieldErrorName;

        if (vm.parentField) {
            if (vm.parentFieldIndex) {
                fieldErrorName = vm.parentField + "_" + vm.parentFieldIndex + "_" + vm.fieldName;
            } else {
                fieldErrorName = vm.parentField + "_" + vm.fieldName;
            }
        } else {
            fieldErrorName = vm.field.name;
        }

        vm.fieldName = vm.field.name;
        vm.fieldValue = "";
        vm.readonly = vm.field.readonly || false;
        vm.sourceTime = moment();
        vm.setErrorEmpty();
        vm.parentFieldIndex = vm.parentFieldIndex || false;

        if (vm.field.hasOwnProperty("multiple") && vm.field.multiple === true) {
            vm.multiple = true;
            vm.fieldValue = [];
            if (vm.field.multiname || angular.isString(vm.field.multiname)) {
                vm.multiname = ('' + vm.field.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = "";
        }

        if (vm.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue(vm.parentField, vm.parentFieldIndex, vm.field.name), function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname] ? moment(item[vm.multiname], 'YYYY-MM-DD HH:mm:ss') : "");
                    } else {
                        vm.fieldValue.push(item ? moment(item, 'YYYY-MM-DD HH:mm:ss') : "");
                    }
                });
            } else {
                var timeValue = ArrayFieldStorage.getFieldValue(vm.parentField, vm.parentFieldIndex, vm.field.name);
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

        this.getInitialValue = function () {

            var field = {};

            if (vm.parentField) {
                if (vm.multiple) {
                    field[vm.parentField] = {};
                    field[vm.parentField][vm.fieldName] = [];
                } else {
                    field[vm.parentField] = {};
                    field[vm.parentField][vm.fieldName] = moment();
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
            vm.fieldValue = vm.field.hasOwnProperty("multiple") && vm.field.multiple === true ? [] : "";
        }

        $scope.$on('editor:entity_loaded', function (event, data) {

            //-- functional for required fields
            if (vm.field.requiredField) {
                $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField(vm.field.requiredField);
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
                        vm.readonly = vm.field.readonly || false;
                    }
                }, true);
            }


            if (data.editorEntityType === "new") {
                var defaultValue = moment();
                if(!!vm.field.defaultValue && moment(vm.field.defaultValue, 'HH:mm').isValid()){
                    defaultValue = moment(vm.field.defaultValue, 'HH:mm');
                }
                vm.fieldValue = vm.multiple ? [defaultValue] : defaultValue;
                return;
            }

            if (!vm.parentField) {
                if (!vm.multiple) {
                    vm.fieldValue = data[vm.field.name] ?
                        moment(data[vm.field.name], 'YYYY-MM-DD HH:mm:ss') : "";
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.field.name], function (item) {
                        vm.fieldValue.push(moment(item[vm.multiname], 'YYYY-MM-DD HH:mm:ss'));
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.field.name], function (item) {
                        vm.fieldValue.push(moment(item, 'YYYY-MM-DD HH:mm:ss'));
                    });
                }
            } else {
                if (!vm.multiple) {
                    vm.fieldValue = data[vm.parentField][vm.field.name] ?
                        moment(data[vm.parentField][vm.field.name], 'YYYY-MM-DD HH:mm:ss') :
                        "";
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.parentField][vm.field.name], function (item) {
                        vm.fieldValue.push(moment(item[vm.multiname], 'YYYY-MM-DD HH:mm:ss'));
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.parentField][vm.field.name], function (item) {
                        vm.fieldValue.push(moment(item, 'YYYY-MM-DD HH:mm:ss'));
                    });
                }
            }
        });

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            vm.setErrorEmpty();
        }, true);

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy(vm.parentField, vm.parentFieldIndex, vm.field.name, vm.fieldValue);
            }
        });

        $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
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
    }
})();