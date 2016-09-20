(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeRadiolistController', UeRadiolistController);

    UeRadiolistController.$inject = ['$scope', 'EditEntityStorage', 'RestApiService', 'ArrayFieldStorage'];

    function UeRadiolistController($scope, EditEntityStorage, RestApiService, ArrayFieldStorage) {
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
            fieldErrorName = vm.fieldName;
        }

        var remote = vm.field.valuesRemote;
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
        vm.fieldName = vm.field.name;
        vm.selectedValues = [];
        vm.inputValue = "";
        vm.readonly = vm.field.readonly || false;
        vm.setErrorEmpty();
        vm.parentFieldIndex = vm.parentFieldIndex || false;

        if (vm.field.multiname || angular.isString(vm.field.multiname)) {
            vm.multiname = ('' + vm.field.multiname) || "value";
        }

        EditEntityStorage.addFieldController(this);

        if (vm.parentFieldIndex) {
            vm.fieldValue = [];
            var value = ArrayFieldStorage.getFieldValue(vm.parentField, vm.parentFieldIndex, vm.field.name);
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

        if (vm.field.hasOwnProperty("values")) {
            angular.forEach(vm.field.values, function (v, key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                if (key === vm.field.defaultValue) {
                    vm.fieldValue = key;
                }
                vm.selectedValues.push(obj);
            });
        } else if (vm.field.hasOwnProperty("valuesRemote")){
            RestApiService
                .getUrlResource(vm.field.valuesRemote.url)
                .then(function (response) {
                    angular.forEach(response.data.items, function (v) {
                        if (vm.field.defaultValue && v[vm.field_id] === vm.field.defaultValue) {
                            vm.fieldValue = v[vm.field_id];
                        }
                        vm.selectedValues.push(v);
                    });
                }, function (reject) {
                    console.error('EditorFieldRadiolistController: Не удалось получить значения для поля \"' + vm.field.fieldName + '\" с удаленного ресурса');
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
                field[vm.parentField] = {};
                field[vm.parentField][vm.fieldName] = null;
            } else {
                field[vm.fieldName] = null;
            }

            return field;
        };

        function clear() {
            vm.fieldValue = vm.parentFieldIndex ? [] : (vm.field.defaultValue || null);
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
                vm.fieldValue = vm.field.defaultValue || null;
                return;
            }

            if (!vm.parentField) {
                if (vm.multiname) {
                    vm.fieldValue = data[vm.field.name][vm.multiname];
                } else {
                    vm.fieldValue = data[vm.field.name];
                }
            } else {
                if (vm.multiname) {
                    vm.fieldValue = data[vm.parentField][vm.field.name][vm.multiname];
                } else {
                    vm.fieldValue = data[vm.parentField][vm.field.name];
                }
            }
        });

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

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            vm.setErrorEmpty();
        }, true);
    }
})();