(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldRadiolistController', EditorFieldRadiolistController);

    EditorFieldRadiolistController.$inject = ['$scope', 'EditEntityStorage', 'RestApiService', 'ArrayFieldStorage'];

    function EditorFieldRadiolistController($scope, EditEntityStorage, RestApiService, ArrayFieldStorage) {
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
        vm.fieldDisplayName = $scope.field.label;
        vm.selectedValues = [];
        vm.inputValue = "";
        vm.readonly = $scope.field.readonly || false;
        vm.hint = $scope.field.hint || false;
        vm.required = $scope.field.required || false;
        vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;

        if ($scope.field.multiname || angular.isString($scope.field.multiname)) {
            vm.multiname = ('' + $scope.field.multiname) || "value";
        }

        EditEntityStorage.addFieldController(this);

        vm.fieldValue = $scope.field.defaultValue || null;

        if (vm.parentFieldIndex) {
            vm.fieldValue = [];
            var value = ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name);
            if (value) {
                if (vm.multiname) {
                    vm.fieldValue = value[vm.multiname];
                } else {
                    vm.fieldValue = value;
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
                if (key === $scope.field.defaultValue) {
                    vm.fieldValue = key;
                }
                vm.selectedValues.push(obj);
            });
        } else if ($scope.field.hasOwnProperty("valuesRemote")){
            RestApiService
                .getUrlResource($scope.field.valuesRemote.url)
                .then(function (response) {
                    angular.forEach(response.data.items, function (v) {
                        if ($scope.field.defaultValue && v[vm.field_id] === $scope.field.defaultValue) {
                            vm.fieldValue = v[vm.field_id];
                        }
                        vm.selectedValues.push(v);
                    });
                }, function (reject) {
                    console.error('EditorFieldRadiolistController: Не удалось получить значения для поля \"' + $scope.field.fieldName + '\" с удаленного ресурса');
                });
        } else {
            console.error('EditorFieldRadiolistController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
        }

        /* ------- */

        this.getFieldValue = function () {
            var field = {};
            var wrappedFieldValue;

            if (vm.multiname) {
                var tempItem = {};
                tempItem[vm.multiname] = vm.fieldValue;
                wrappedFieldValue = tempItem;
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
                field[$scope.parentField] = {};
                field[$scope.parentField][vm.fieldName] = null;
            } else {
                field[vm.fieldName] = null;
            }

            return field;
        };

        function clear() {
            vm.fieldValue = vm.parentFieldIndex ? [] : ($scope.field.defaultValue || null);
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
                return;
            }

            if (!$scope.parentField) {
                if (vm.multiname) {
                    vm.fieldValue = data[$scope.field.name][vm.multiname];
                } else {
                    vm.fieldValue = data[$scope.field.name];
                }
            } else {
                if (vm.multiname) {
                    vm.fieldValue = data[$scope.parentField][$scope.field.name][vm.multiname];
                } else {
                    vm.fieldValue = data[$scope.parentField][$scope.field.name];
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

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            vm.error = [];
        }, true);
    }
})();