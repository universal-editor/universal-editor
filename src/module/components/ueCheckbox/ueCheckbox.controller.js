(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeCheckboxController', UeCheckboxController);

    UeCheckboxController.$inject = ['$scope', '$element', 'EditEntityStorage', 'RestApiService', 'ArrayFieldStorage', 'FilterFieldsStorage', '$controller'];

    function UeCheckboxController($scope, $element, EditEntityStorage, RestApiService, ArrayFieldStorage, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */
        var vm = this;
        var baseController = $controller('FieldsController', { $scope: $scope });
        angular.extend(vm, baseController);
        var fieldErrorName;
        var componentSettings = vm.setting.component.settings;        
        vm.parentEntityScopeId = componentSettings.$parentScopeId;
        componentSettings.$fieldType = 'array';

        if (vm.setting.parentField) {
            if (vm.setting.parentFieldIndex) {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.parentFieldIndex + "_" + vm.setting.name;
            } else {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.name;
            }
        } else {
            fieldErrorName = vm.setting.name;
        }
        var remote = componentSettings.valuesRemote;
        vm.field_id = "id";
        vm.field_search = "title";
        if (remote) {
            if (remote.fields) {
                if (remote.fields.value) {
                    vm.field_id = remote.fields.value;
                }
                if (remote.fields.label) {
                    vm.field_search = remote.fields.label;
                }
            }
        }
        vm.fieldName = vm.setting.name;
        vm.selectedValues = [];
        vm.inputValue = "";
        vm.readonly = componentSettings.readonly || false;
        vm.parentFieldIndex = vm.setting.parentFieldIndex || false;
        vm.fieldDisplayName = componentSettings.label;
        vm.hint = componentSettings.hint || false;
        vm.required = componentSettings.required || false;
        vm.error = [];

        if (componentSettings.multiname || angular.isString(componentSettings.multiname)) {
            vm.multiname = ('' + componentSettings.multiname) || "value";
        }

        if (vm.filter) {
            FilterFieldsStorage.addFilterController(this);
        } else {
            EditEntityStorage.addFieldController(this);
        }

        if (vm.parentFieldIndex) {
            vm.fieldValue = [];
            var value = ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.parentFieldIndex, vm.setting.name);

            if (value) {
                if (angular.isArray(value)) {
                    angular.forEach(value, function(item) {
                        if (vm.multiname) {
                            vm.fieldValue.push(item[vm.multiname]);
                        } else {
                            vm.fieldValue.push(item);
                        }
                    });
                } else {
                    if (vm.multiname) {
                        vm.fieldValue.push(value[vm.multiname]);
                    } else {
                        vm.fieldValue.push(value);
                    }
                }
            }
        }

        /*
         * Инициализация данных при загрузке поля. Необходимая часть для полей инициализирующие данные для которых
         * хранятся удалённо.
         */

        if (componentSettings.hasOwnProperty("values")) {
            angular.forEach(componentSettings.values, function(v, key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                vm.selectedValues.push(obj);
            });
        } else if (componentSettings.hasOwnProperty("valuesRemote")) {
            RestApiService
                .getUrlResource(componentSettings.valuesRemote.url)
                .then(function(response) {
                    angular.forEach(response.data.items, function(v) {
                        vm.selectedValues.push(v);
                    });
                }, function(reject) {
                    console.error('EditorFieldCheckboxController: Не удалось получить значения для поля \"' + vm.fieldName + '\" с удаленного ресурса');
                });
        } else {
            console.error('EditorFieldCheckboxController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
        }

        /* ------- */



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
                    vm.fieldValue = [];
                    angular.forEach(componentSettings.defaultValue, function(item) {
                        if (vm.multiname) {
                            vm.fieldValue.push(item[vm.multiname]);
                        } else {
                            vm.fieldValue.push(item);
                        }
                    });
                    return;
                }
                if (!vm.setting.parentField) {
                    vm.fieldValue = [];
                    if (data[vm.setting.name]) {
                        if (angular.isArray(data[vm.setting.name])) {
                            angular.forEach(data[vm.setting.name], function(item) {
                                if (vm.multiname) {
                                    vm.fieldValue.push(item[vm.multiname]);
                                } else {
                                    vm.fieldValue.push(item);
                                }
                            });
                        } else {
                            if (vm.multiname) {
                                vm.fieldValue.push(data[vm.setting.name][vm.multiname]);
                            } else {
                                vm.fieldValue.push(data[vm.setting.name]);
                            }
                        }
                    }
                } else {
                    vm.fieldValue = [];
                    if (data[vm.setting.name]) {
                        if (angular.isArray(data[vm.setting.parentField][vm.setting.name])) {
                            angular.forEach(data[vm.setting.parentField][vm.setting.name], function(item) {
                                if (vm.multiname) {
                                    vm.fieldValue.push(item[vm.multiname]);
                                } else {
                                    vm.fieldValue.push(item);
                                }
                            });
                        } else {
                            if (vm.multiname) {
                                vm.fieldValue.push(data[vm.setting.parentField][vm.setting.name][vm.multiname]);
                            } else {
                                vm.fieldValue.push(data[vm.setting.parentField][vm.setting.name]);
                            }
                        }
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

        if (vm.filter) {
            FilterFieldsStorage.addFilterController(this, vm.setting.component.settings.$parentScopeId);
        } else {
            EditEntityStorage.addFieldController(this, vm.setting.component.settings.$parentScopeId);
        }

        function clear() {
            vm.fieldValue = vm.setting.parentFieldIndex ? [] : (componentSettings.defaultValue || '');
        }

        function getFieldValue() {
            var field = {};
            var wrappedFieldValue;

            if (vm.selectedValues.length && vm.selectedValues.length === 1) {
                wrappedFieldValue = "";
                if (angular.isUndefined(vm.fieldValue)) {
                    vm.fieldValue = [];
                }
                if (vm.multiname) {
                    var tempItem = {};
                    tempItem[vm.multiname] = vm.fieldValue[0];
                    wrappedFieldValue = tempItem;
                } else {
                    wrappedFieldValue = vm.fieldValue[0];
                }
            } else if (vm.selectedValues.length && vm.selectedValues.length > 1) {
                wrappedFieldValue = [];
                if (vm.multiname) {
                    angular.forEach(vm.fieldValue, function(valueItem) {
                        var tempItem = {};
                        tempItem[vm.multiname] = valueItem;
                        wrappedFieldValue.push(tempItem);
                    });
                } else {
                    angular.forEach(vm.fieldValue, function(valueItem) {
                        wrappedFieldValue.push(valueItem);
                    });
                }
            }

            if (vm.setting.parentField) {
                if (vm.setting.parentFieldIndex) {
                    field[vm.setting.parentField] = [];
                    field[vm.setting.parentField][vm.setting.parentFieldIndex] = {};
                    field[vm.setting.parentField][vm.setting.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[vm.setting.parentField] = {};
                    field[vm.setting.parentField][vm.setting.fieldName] = wrappedFieldValue;
                }

            } else {
                field[vm.setting.name] = wrappedFieldValue;
            }

            return field;
        }
    }
})();