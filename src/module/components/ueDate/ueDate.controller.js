(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeDateController', UeDateController);

    UeDateController.$inject = ['$scope', '$element', 'EditEntityStorage', 'moment', 'ArrayFieldStorage'];

    function UeDateController($scope, $element, EditEntityStorage, moment, ArrayFieldStorage) {
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
            fieldErrorName = vm.field.name;
        }

        vm.fieldName = vm.field.name;
        vm.fieldValue = "";
        vm.readonly = vm.field.readonly || false;
        vm.parentFieldIndex = vm.parentFieldIndex || false;
        vm.fieldDisplayName = vm.setting.component.settings.label;
        vm.hint = vm.setting.hint || false;
        vm.required = vm.setting.required || false;
        vm.error = [];

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
                var dateValue = ArrayFieldStorage.getFieldValue(vm.parentField, vm.parentFieldIndex, vm.field.name);
                vm.fieldValue = dateValue ? moment(dateValue, 'YYYY-MM-DD HH:mm:ss') : vm.fieldValue;
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
                    tempItem[vm.multiname] = moment(valueItem).set({ 'second': 0, 'minute': 0, 'hour': 0 }).format('YYYY-MM-DD HH:mm:ss');
                    wrappedFieldValue.push(tempItem);
                });
            } else if (vm.multiple) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    wrappedFieldValue.push(moment(valueItem).set({ 'second': 0, 'minute': 0, 'hour': 0 }).format('YYYY-MM-DD HH:mm:ss'));
                });
            } else {
                if (vm.fieldValue === undefined || vm.fieldValue === "" || !moment.isMoment(vm.fieldValue)) {
                    wrappedFieldValue = "";
                } else {
                    wrappedFieldValue = moment(vm.fieldValue).set({ 'second': 0, 'minute': 0, 'hour': 0 }).format('YYYY-MM-DD HH:mm:ss');
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

        var destroyWatchEntityLoaded;

        var destroyEntityLoaded = $scope.$on('editor:entity_loaded', function (event, data) {
            //-- functional for required fields
            if (vm.field.requiredField) {
                destroyWatchEntityLoaded = $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField(vm.field.requiredField);
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
                if(!!vm.field.defaultValue && moment(vm.field.defaultValue).isValid()){
                    defaultValue = moment(vm.field.defaultValue);
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

        this.$onDestroy = function(){
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

        this.$postLink = function(){
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        }
    }
})();