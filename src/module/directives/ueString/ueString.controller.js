(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeStringController', UeStringController);

    UeStringController.$inject = ['$scope', 'EditEntityStorage', 'ArrayFieldStorage'];

    function UeStringController($scope, EditEntityStorage, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;
        if (vm.parentField) {
            if (vm.parentFieldIndex) {
                fieldErrorName = vm.parentField + "_" + vm.parentFieldIndex + "_" + vm.field.name;
            } else {
                fieldErrorName = vm.parentField + "_" + vm.field.name;
            }
        } else {
            fieldErrorName = vm.field.name;
        }

        vm.cols = vm.field.width;
        vm.classTextarea = 'col-lg-2 col-md-2 col-sm-3 col-xs-3';
        vm.fieldName = vm.field.name;
        vm.fieldValue = undefined;
        vm.readonly = vm.field.readonly || false;
        vm.setErrorEmpty();
        vm.parentFieldIndex = vm.parentFieldIndex || false;
        vm.mask = vm.field.mask || false;

        if (!!vm.cols) {
            if (vm.cols > 6) {
                vm.cols = 6;
            }
            if (vm.cols < 1) {
                vm.cols = 1;
            }
            vm.classTextarea = 'col-lg-' + vm.cols + ' col-md-' + vm.cols + ' col-sm-' + vm.cols + ' col-xs-' + vm.cols;
        }

        if (vm.field.hasOwnProperty("multiple") && vm.field.multiple === true) {
            vm.multiple = true;
            vm.fieldValue = [];
            if (vm.field.multiname || angular.isString(vm.field.multiname)) {
                vm.multiname = ('' + vm.field.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = vm.field.defaultValue || "" ;
        }

        /*
         * Если поле является частью двумерного массива - оно не сможет получить значение при загрузке сущности
         * поэтому оно всегда берёт значение поля из хранилища для полей-массивов.
         */

        if (vm.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue(vm.parentField, vm.parentFieldIndex, vm.field.name), function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue(vm.parentField, vm.parentFieldIndex, vm.field.name) || "";
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

        /*
         * Field system method: Возврашает значение поля которое используется при создании
         * новой сущности, т.е. дефолтное значение поля
         */

        this.getInitialValue = function () {

            var field = {};

            if (vm.parentField) {
                if (vm.multiple) {
                    field[vm.parentField] = {};
                    field[vm.parentField][vm.fieldName] = [""];
                } else {
                    field[vm.parentField] = {};
                    field[vm.parentField][vm.fieldName] = "";
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

            if(vm.field.hasOwnProperty("maxLength") && val.length > vm.field.maxLength){
                var maxError = "Для поля превышено максимальное допустимое значение в " + vm.field.maxLength + " символов. Сейчас введено " + val.length + " символов.";
                if (vm.errorIndexOf(maxError) < 0) {
                    vm.setError(maxError);
                }
            }

            if(vm.field.hasOwnProperty("minLength") && val.length < vm.field.minLength){
                var minError = "Минимальное значение поля не может быть меньше " + vm.field.minLength + " символов. Сейчас введено " + val.length + " символов.";
                if(vm.errorIndexOf(minError) < 0){
                    vm.setError(minError);
                }
            }
        };

        function clear() {
            vm.fieldValue = vm.field.hasOwnProperty("multiple") && vm.field.multiple === true ? [] : (vm.field.defaultValue || "");
        }

        /* Слушатели событий бродкаста. */

        /*
         * Событие загрузки сущности ( созданной или пустой, т.е. создаваемой ).
         * Поле забирает данные из объекта сущности с учетом наличия родительского поля.
         */

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
                if (vm.field.defaultValue) {
                    vm.fieldValue = vm.multiple ? [vm.field.defaultValue] : vm.field.defaultValue;
                } else {
                    vm.fieldValue = vm.multiple ? [] : '';
                }
                if (data.hasOwnProperty(vm.field.name)) {
                    vm.fieldValue = data[vm.field.name];
                }
                return;
            }

            if (!vm.parentField) {
                if (!vm.multiple) {
                    vm.fieldValue = data[vm.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.field.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            } else {
                if (!vm.multiple) {
                    vm.fieldValue = data[vm.parentField][vm.field.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.parentField][vm.field.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.parentField][vm.field.name], function (item) {
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
            if (vm.errorIndexOf(data) < 0) {
                vm.setError(data);
            }
        });

        /*
         * При удалении директивы она должна отправлять запрос в EditEntityStorage
         * чтобы последний удалил её из списка отслеживаемых полей.
         */

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

        /* Удаление контроллера поля из сервиса управления данными полей. Происходит при исчезании поля */

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy(vm.parentField, vm.parentFieldIndex, vm.field.name, vm.fieldValue);
            }
        });

        /* Очистка массива ошибок при внесении пользователем изменений в поле */

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            vm.setErrorEmpty();
        }, true);

    }
})();