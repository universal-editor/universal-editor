(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldStringController', EditorFieldStringController);

    EditorFieldStringController.$inject = ['$scope', 'EditEntityStorage', 'ArrayFieldStorage'];

    function EditorFieldStringController($scope, EditEntityStorage, ArrayFieldStorage) {
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

        vm.fieldName = $scope.field.name;
        vm.fieldValue = undefined;
        vm.readonly = $scope.field.readonly || false;
        $scope.$parent.vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;
        vm.mask = $scope.field.mask || false;

        if ($scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true) {
            vm.multiple = true;
            vm.fieldValue = [];
            if ($scope.field.multiname || angular.isString($scope.field.multiname)) {
                vm.multiname = ('' + $scope.field.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = $scope.field.defaultValue || "" ;
        }

        /*
         * Если поле является частью двумерного массива - оно не сможет получить значение при загрузке сущности
         * поэтому оно всегда берёт значение поля из хранилища для полей-массивов.
         */

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

        /* Initial method : Регистрация экземпляра поля в EditEntityStorage */
        EditEntityStorage.addFieldController(this);

        /*
         * Field system method: Возвращает текущее значение поля с учетом
         * наличия у поля родителя ( поля типа "массив" )
         */

        this.getFieldValue = function () {

            var field = {},
                wrappedFieldValue;

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

        /*
         * Field system method: Возврашает значение поля которое используется при создании
         * новой сущности, т.е. дефолтное значение поля
         */

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
        /*
         * Публичные методы для представления
         * Добавление нового итема и удаление. Необходимы для multiple-полей
         */

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

        /* Слушатель события на покидание инпута. Необходим для превалидации поля на минимальное и максимальное значение */

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
            vm.fieldValue = $scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true ? [] : ($scope.field.defaultValue || "");
        }

        /* Слушатели событий бродкаста. */

        /*
         * Событие загрузки сущности ( созданной или пустой, т.е. создаваемой ).
         * Поле забирает данные из объекта сущности с учетом наличия родительского поля.
         */

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
                vm.fieldValue = vm.multiple ? [($scope.field.defaultValue || '')] : ($scope.field.defaultValue || '');
                if (data.hasOwnProperty($scope.field.name)) {
                    vm.fieldValue = data[$scope.field.name];
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

        /*
         * При обновлении / создании сущности может быть получена ошибка.
         * В таком случае происходит броадкаст следующего события.
         * Название события генерируется сервисом RestApiService.
         */

        $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if ($scope.$parent.vm.error.indexOf(data) < 0) {
                $scope.$parent.vm.error.push(data);
            }
        });

        /*
         * При удалении директивы она должна отправлять запрос в EditEntityStorage
         * чтобы последний удалил её из списка отслеживаемых полей.
         */

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

        /* Удаление контроллера поля из сервиса управления данными полей. Происходит при исчезании поля */

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy($scope.parentField, $scope.parentFieldIndex, $scope.field.name, vm.fieldValue);
            }
        });

        /* Очистка массива ошибок при внесении пользователем изменений в поле */

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            $scope.$parent.vm.error = [];
        }, true);

    }
})();