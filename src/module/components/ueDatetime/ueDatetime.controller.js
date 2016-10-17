(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeDatetimeController', UeDatetimeController);

    UeDatetimeController.$inject = ['$scope', '$element', 'EditEntityStorage', 'moment', 'ArrayFieldStorage', 'FilterFieldsStorage'];

    function UeDatetimeController($scope, $element, EditEntityStorage, moment, ArrayFieldStorage, FilterFieldsStorage) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;
        var componentSettings = vm.setting.component.settings;
        vm.fieldName = vm.setting.name;

        if (vm.setting.parentField) {
            if (vm.setting.parentFieldIndex) {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.parentFieldIndex + "_" + vm.fieldName;
            } else {
                fieldErrorName = vm.setting.parentField + "_" + vm.fieldName;
            }
        } else {
            fieldErrorName = vm.fieldName;
        }

        vm.fieldValue = "";
        vm.readonly = componentSettings.readonly || false;
        vm.parentFieldIndex = vm.setting.parentFieldIndex || false;
        vm.multiname = componentSettings.multiname || "value";
        vm.fieldDisplayName = vm.setting.component.settings.label;
        vm.hint = vm.setting.hint || false;
        vm.required = vm.setting.required || false;
        vm.error = [];
        vm.multiple = componentSettings.multiple === true;
        vm.fieldValue = getInitValue();

        if(vm.filter) {
            vm.multiple = false;
            vm.readonly = false;
            vm.required = false;
        }

        if (vm.setting.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.fieldName), function(item) {
                    vm.fieldValue.push(item[vm.multiname]);
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.fieldName) || vm.fieldValue;
            }
        }

        vm.addItem = function() {
            vm.fieldValue.push(moment());
        };

        vm.removeItem = function(index) {
            angular.forEach(vm.fieldValue, function(value, key) {
                if (key == index) {
                    vm.fieldValue.splice(index, 1);
                }
            });
        };

        var destroyWatchEntityLoaded;

        var destroyEntityLoaded = $scope.$on('editor:entity_loaded', function(event, data) {
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
                return;
            }

            if (!vm.setting.parentField) {
                if (!vm.multiple) {
                    vm.fieldValue = data[vm.fieldName] !== null ? moment.utc(data[vm.fieldName]) : "";
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.fieldName], function(timeItem) {
                        vm.fieldValue.push(moment.utc(timeItem[vm.multiname], 'YYYY-MM-DD HH:mm:ss'));
                    });
                }
            } else {
                if (!vm.multiple) {
                    vm.fieldValue = data[vm.setting.parentField][vm.fieldName] !== null ? moment.utc(data[vm.setting.parentField][vm.fieldName], 'YYYY-MM-DD HH:mm:ss') : "";
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.setting.parentField][vm.fieldName], function(timeItem) {
                        vm.fieldValue.push(moment.utc(timeItem[vm.multiname], 'YYYY-MM-DD HH:mm:ss'));
                    });
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
            EditEntityStorage.deleteFieldController(vm);
            if (vm.setting.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy(vm.setting.parentField, vm.setting.parentFieldIndex, vm.fieldName, vm.fieldValue);
            }
        };

        this.$postLink = function() {
            $element.on('$destroy', function() {
                $scope.$destroy();
            });
        };


        vm.clear = clear;
        vm.getFieldValue = getFieldValue;

        if (vm.filter) {
            FilterFieldsStorage.addFilterController(this, vm.setting.component.settings.$parentScopeId);
        } else {
            EditEntityStorage.addFieldController(this, vm.setting.component.settings.$parentScopeId);
        }

        function getInitValue() {
            var defaultValue = moment();
            if (componentSettings.defaultValue && moment(componentSettings.defaultValue).isValid()) {
                defaultValue = moment(componentSettings.defaultValue, 'YYYY-MM-DD HH:mm');
            }
            return componentSettings.multiple === true ? [] : defaultValue;
        }

        function clear() {
            vm.fieldValue = componentSettings.multiple === true ? [] : "";
        }

        function getFieldValue() {

            var field = {};

            var wrappedFieldValue;

            if (vm.multiple && vm.multiname) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function(valueItem) {
                    if (!valueItem || valueItem === "" || !moment.isMoment(valueItem)) {
                        return;
                    }
                    var tempItem = {};
                    tempItem[vm.multiname] = moment.utc(valueItem).format('YYYY-MM-DD HH:mm:ss');
                    wrappedFieldValue.push(tempItem);
                });
            } else {
                if (vm.fieldValue === undefined || vm.fieldValue === "" || !moment.isMoment(vm.fieldValue)) {
                    wrappedFieldValue = "";
                } else {
                    wrappedFieldValue = moment.utc(vm.fieldValue).format('YYYY-MM-DD HH:mm:ss');
                }
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

        function getFilterValue() {

            var field = {};

            if (vm.filterValueStartDateTime === "" && vm.filterValueEndDateTime === "") {
                return false;
            } else {
                if (vm.filterValueStartDateTime !== "" && vm.filterValueEndDateTime === "") {
                    field[">=" + vm.filterName] = moment.utc(vm.filterValueStartDateTime).format("YYYY-MM-DD HH:mm:ss");
                } else if (vm.filterValueStartDateTime === "" && vm.filterValueEndDateTime !== "") {
                    field["<=" + vm.filterName] = moment.utc(vm.filterValueEndDateTime).format("YYYY-MM-DD HH:mm:ss");
                } else {
                    field[">=" + vm.filterName] = moment.utc(vm.filterValueStartDateTime).format("YYYY-MM-DD HH:mm:ss");
                    field["<=" + vm.filterName] = moment.utc(vm.filterValueEndDateTime).format("YYYY-MM-DD HH:mm:ss");
                }
                return field;
            }
        }
    }
})();