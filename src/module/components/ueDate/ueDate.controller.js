(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeDateController', UeDateController);

    UeDateController.$inject = ['$scope', '$element', 'EditEntityStorage', 'moment', 'ArrayFieldStorage', 'FilterFieldsStorage', '$controller'];

    function UeDateController($scope, $element, EditEntityStorage, moment, ArrayFieldStorage, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;
        var baseController = $controller('FieldsController', { $scope: $scope });
        angular.extend(vm, baseController);
        var componentSettings = vm.setting.component.settings;
        vm.fieldName = vm.setting.name;
        componentSettings.$fieldType = 'date';

        if (vm.setting.parentField) {
            if (vm.setting.parentFieldIndex) {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.parentFieldIndex + "_" + vm.fieldName;
            } else {
                fieldErrorName = vm.setting.parentField + "_" + vm.fieldName;
            }
        } else {
            fieldErrorName = vm.fieldName;
        }

        vm.readonly = componentSettings.readonly || false;
        vm.parentFieldIndex = vm.setting.parentFieldIndex || false;
        vm.fieldDisplayName = vm.setting.component.settings.label;
        vm.hint = vm.setting.hint || false;
        vm.required = vm.setting.required || false;
        vm.error = [];
        vm.multiple = componentSettings.multiple === true;
        vm.fieldValue = getInitValue();

        if (vm.filter) {
            vm.multiple = false;
            vm.readonly = false;
            vm.required = false;
        }

        vm.multiname = componentSettings.multiname;

        if (vm.setting.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.fieldName), function(item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname] ? moment(item[vm.multiname], 'YYYY-MM-DD HH:mm:ss') : "");
                    } else {
                        vm.fieldValue.push(item ? moment(item, 'YYYY-MM-DD HH:mm:ss') : "");
                    }
                });
            } else {
                var dateValue = ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.fieldName);
                vm.fieldValue = dateValue ? moment(dateValue, 'YYYY-MM-DD HH:mm:ss') : vm.fieldValue;
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
            if (!vm.filter) {
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
                        vm.fieldValue = data[vm.fieldName] ?
                            moment(data[vm.fieldName], 'YYYY-MM-DD HH:mm:ss') : "";
                    } else if (vm.multiname) {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.fieldName], function(item) {
                            vm.fieldValue.push(moment(item[vm.multiname], 'YYYY-MM-DD HH:mm:ss'));
                        });
                    } else {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.fieldName], function(item) {
                            vm.fieldValue.push(moment(item, 'YYYY-MM-DD HH:mm:ss'));
                        });
                    }
                } else {
                    if (!vm.multiple) {
                        vm.fieldValue = data[vm.setting.parentField][vm.fieldName] ?
                            moment(data[vm.setting.parentField][vm.fieldName], 'YYYY-MM-DD HH:mm:ss') :
                            "";
                    } else if (vm.multiname) {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.setting.parentField][vm.fieldName], function(item) {
                            vm.fieldValue.push(moment(item[vm.multiname], 'YYYY-MM-DD HH:mm:ss'));
                        });
                    } else {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.setting.parentField][vm.fieldName], function(item) {
                            vm.fieldValue.push(moment(item, 'YYYY-MM-DD HH:mm:ss'));
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
            EditEntityStorage.deleteFieldController(vm, vm.setting.component.settings.$parentScopeId);
            FilterFieldsStorage.deleteFilterController(vm, vm.setting.component.settings.$parentScopeId);
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
            if (!!componentSettings.defaultValue && moment(componentSettings.defaultValue).isValid()) {
                defaultValue = moment(componentSettings.defaultValue);
            }
            return vm.multiple ? [] : defaultValue;
        }

        function clear() {
            vm.fieldValue = componentSettings.multiple === true ? [] : "";
        }

        function getFieldValue() {
            var field = {};
            var wrappedFieldValue;

            if (vm.multiname) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function(valueItem) {
                    if (!valueItem || valueItem === "" || !moment.isMoment(valueItem)) {
                        return;
                    }
                    var tempItem = {};
                    tempItem[vm.multiname] = moment(valueItem).set({ 'second': 0, 'minute': 0, 'hour': 0 }).format('YYYY-MM-DD HH:mm:ss');
                    wrappedFieldValue.push(tempItem);
                });
            } else if (vm.multiple) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function(valueItem) {
                    wrappedFieldValue.push(moment(valueItem).set({ 'second': 0, 'minute': 0, 'hour': 0 }).format('YYYY-MM-DD HH:mm:ss'));
                });
            } else {
                if (vm.fieldValue === undefined || vm.fieldValue === "" || !moment.isMoment(vm.fieldValue)) {
                    wrappedFieldValue = "";
                } else {
                    wrappedFieldValue = moment(vm.fieldValue).set({ 'second': 0, 'minute': 0, 'hour': 0 }).format('YYYY-MM-DD HH:mm:ss');
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
    }
})();