(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldCheckboxController', EditorFieldCheckboxController);

    EditorFieldCheckboxController.$inject = ['$scope', 'EditEntityStorage', 'RestApiService', 'ArrayFieldStorage'];

    function EditorFieldCheckboxController($scope, EditEntityStorage, RestApiService, ArrayFieldStorage) {
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
        var remote = $scope.field.valuesRemote;
        vm.field_id = "id";
        vm.field_search = "title";
        if (remote) {
            if(remote.fields){
                if (remote.fields.value) {
                    vm.field_id = remote.fields.value;
                }
                if (remote.fields.label) {
                    vm.field_search = remote.fields.label;
                }
            }
        }
        vm.fieldName = $scope.field.name;
        vm.selectedValues = [];
        vm.inputValue = "";
        vm.readonly = $scope.field.readonly || false;
        $scope.$parent.vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;

        if ($scope.field.multiname || angular.isString($scope.field.multiname)) {
            vm.multiname = ('' + $scope.field.multiname) || "value";
        }

        EditEntityStorage.addFieldController(this);

        if (vm.parentFieldIndex) {
            vm.fieldValue = [];
            var value = ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name);

            if (value) {
                if (angular.isArray(value)) {
                    angular.forEach(value, function (item) {
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

        if ($scope.field.hasOwnProperty("values")) {
            angular.forEach($scope.field.values, function (v, key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                vm.selectedValues.push(obj);
            });
        } else if ($scope.field.hasOwnProperty("valuesRemote")){
            RestApiService
                .getUrlResource($scope.field.valuesRemote.url)
                .then(function (response) {
                    angular.forEach(response.data.items, function (v) {
                        vm.selectedValues.push(v);
                    });
                }, function (reject) {
                    console.error('EditorFieldCheckboxController: Не удалось получить значения для поля \"' + $scope.field.fieldName + '\" с удаленного ресурса');
                });
        } else {
            console.error('EditorFieldCheckboxController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
        }

        /* ------- */

        this.getFieldValue = function () {
            var field = {};
            var wrappedFieldValue;

            if (vm.selectedValues.length && vm.selectedValues.length === 1) {
                wrappedFieldValue = "";
                if(angular.isUndefined(vm.fieldValue)){
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
                    angular.forEach(vm.fieldValue, function (valueItem) {
                        var tempItem = {};
                        tempItem[vm.multiname] = valueItem;
                        wrappedFieldValue.push(tempItem);
                    });
                } else {
                    angular.forEach(vm.fieldValue, function (valueItem) {
                        wrappedFieldValue.push(valueItem);
                    });
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
                field[$scope.parentField] = {};
                field[$scope.parentField][vm.fieldName] = [];
            } else {
                field[vm.fieldName] = [];
            }

            return field;
        };

        function clear() {
            vm.fieldValue = vm.parentFieldIndex ? [] : undefined;
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
                vm.fieldValue = [];
                angular.forEach($scope.field.defaultValue, function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
                return;
            }
            if (!$scope.parentField) {
                vm.fieldValue = [];
                if (data[$scope.field.name]) {
                    if (angular.isArray(data[$scope.field.name])) {
                        angular.forEach(data[$scope.field.name], function (item) {
                            if (vm.multiname) {
                                vm.fieldValue.push(item[vm.multiname]);
                            } else {
                                vm.fieldValue.push(item);
                            }
                        });
                    } else {
                        if (vm.multiname) {
                            vm.fieldValue.push(data[$scope.field.name][vm.multiname]);
                        } else {
                            vm.fieldValue.push(data[$scope.field.name]);
                        }
                    }
                }
            } else {
                vm.fieldValue = [];
                if (data[$scope.field.name]) {
                    if (angular.isArray(data[$scope.parentField][$scope.field.name])) {
                        angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                            if (vm.multiname) {
                                vm.fieldValue.push(item[vm.multiname]);
                            } else {
                                vm.fieldValue.push(item);
                            }
                        });
                    } else {
                        if (vm.multiname) {
                            vm.fieldValue.push(data[$scope.parentField][$scope.field.name][vm.multiname]);
                        } else {
                            vm.fieldValue.push(data[$scope.parentField][$scope.field.name]);
                        }
                    }
                }
            }
        });

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy($scope.parentField, $scope.parentFieldIndex, $scope.field.name, vm.fieldValue);
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

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            $scope.$parent.vm.error = [];
        }, true);
    }
})();