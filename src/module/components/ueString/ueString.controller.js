(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeStringController', UeStringController);

    UeStringController.$inject = ['$scope', '$element', 'EditEntityStorage', 'ArrayFieldStorage'];

    function UeStringController($scope, $element ,EditEntityStorage, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;
        if (vm.setting.parentField) {
            if (vm.setting.parentFieldIndex) {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.parentFieldIndex + "_" + vm.setting.name;
            } else {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.name;
            }
        } else {
            fieldErrorName = vm.setting.name;
        }

        vm.cols = vm.setting.width;
        vm.classTextarea = '';//'col-lg-2 col-md-2 col-sm-3 col-xs-3';
        vm.fieldName = vm.setting.name;
        vm.fieldValue = undefined;
        vm.readonly = vm.setting.readonly || false;
        vm.setting.setErrorEmpty();
        vm.setting.parentFieldIndex = vm.setting.parentFieldIndex || false;
        vm.mask = vm.setting.mask || false;

        if (!!vm.cols) {
            if (vm.cols > 6) {
                vm.cols = 6;
            }
            if (vm.cols < 1) {
                vm.cols = 1;
            }
            //vm.classTextarea = 'col-lg-' + vm.cols + ' col-md-' + vm.cols + ' col-sm-' + vm.cols + ' col-xs-' + vm.cols;
        }

        if (vm.setting.hasOwnProperty("multiple") && vm.setting.multiple === true) {
            vm.multiple = true;
            vm.fieldValue = [];
            if (vm.setting.multiname || angular.isString(vm.setting.multiname)) {
                vm.multiname = ('' + vm.setting.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = vm.setting.defaultValue || "" ;
        }

        /*
         * Если поле является частью двумерного массива - оно не сможет получить значение при загрузке сущности
         * поэтому оно всегда берёт значение поля из хранилища для полей-массивов.
         */

        if (vm.setting.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.setting.name), function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.setting.name) || "";
            }
        }

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
        };

        /*
         * Field system method: Возврашает значение поля которое используется при создании
         * новой сущности, т.е. дефолтное значение поля
         */

        this.getInitialValue = function () {

            var field = {};

            if (vm.setting.parentField) {
                if (vm.multiple) {
                    field[vm.setting.parentField] = {};
                    field[vm.setting.parentField][vm.fieldName] = [""];
                } else {
                    field[vm.setting.parentField] = {};
                    field[vm.setting.parentField][vm.fieldName] = "";
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

            if(vm.setting.hasOwnProperty("maxLength") && val.length > vm.setting.maxLength){
                var maxError = "Для поля превышено максимальное допустимое значение в " + vm.setting.maxLength + " символов. Сейчас введено " + val.length + " символов.";
                if (vm.setting.errorIndexOf(maxError) < 0) {
                    vm.setting.setError(maxError);
                }
            }

            if(vm.setting.hasOwnProperty("minLength") && val.length < vm.setting.minLength){
                var minError = "Минимальное значение поля не может быть меньше " + vm.setting.minLength + " символов. Сейчас введено " + val.length + " символов.";
                if(vm.setting.errorIndexOf(minError) < 0){
                    vm.setting.setError(minError);
                }
            }
        };

        function clear() {
            vm.fieldValue = vm.setting.hasOwnProperty("multiple") && vm.setting.multiple === true ? [] : (vm.setting.defaultValue || "");
        }

        /* Слушатели событий бродкаста. */

        /*
         * Событие загрузки сущности ( созданной или пустой, т.е. создаваемой ).
         * Поле забирает данные из объекта сущности с учетом наличия родительского поля.
         */
        var destroyWatchEntityLoaded;
        var destroyEntityLoaded = $scope.$on('editor:entity_loaded', function (event, data) {

            //-- functional for required fields
            if (vm.setting.requiredField) {
                destroyWatchEntityLoaded = $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField(vm.setting.requiredField);
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
                        vm.readonly = vm.setting.readonly || false;
                    }
                }, true);
            }

            if (data.editorEntityType === "new") {
                if (vm.setting.defaultValue) {
                    vm.fieldValue = vm.multiple ? [vm.setting.defaultValue] : vm.setting.defaultValue;
                } else {
                    vm.fieldValue = vm.multiple ? [] : '';
                }
                if (data.hasOwnProperty(vm.setting.name)) {
                    vm.fieldValue = data[vm.setting.name];
                }
                return;
            }

            if (!vm.setting.parentField) {
                if (!vm.multiple) {
                    vm.fieldValue = data[vm.setting.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.setting.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.setting.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            } else {
                if (!vm.multiple) {
                    vm.fieldValue = data[vm.setting.parentField][vm.setting.name];
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.setting.parentField][vm.setting.name], function (item) {
                        vm.fieldValue.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[vm.setting.parentField][vm.setting.name], function (item) {
                        vm.fieldValue.push(item);
                    });
                }
            }
        });

        /*
         * При удалении директивы она должна отправлять запрос в EditEntityStorage
         * чтобы последний удалил её из списка отслеживаемых полей.
         */

        var destroyErrorField = $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function (error) {
                    if (vm.setting.errorIndexOf(error) < 0) {
                        vm.setting.setError(error);
                    }
                });
            } else {
                if (vm.setting.errorIndexOf(data) < 0) {
                    vm.setting.setError(data);
                }
            }
        });

        /* Очистка массива ошибок при внесении пользователем изменений в поле */

        var destroyWatchFieldValue = $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            vm.setting.setErrorEmpty();
        }, true);

        /* Удаление контроллера поля из сервиса управления данными полей. Происходит при исчезании поля */

        this.$onDestroy = function() {
            if (angular.isFunction(destroyWatchEntityLoaded)) {
                destroyWatchEntityLoaded();
            }
            destroyEntityLoaded();
            destroyErrorField();
            destroyWatchFieldValue();
            EditEntityStorage.deleteFieldController(vm);
            if (vm.setting.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy(vm.setting.parentField, vm.setting.parentFieldIndex, vm.setting.name, vm.fieldValue);
            }
        };

        this.$postLink = function() {
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        };

        /* Initial method : Регистрация экземпляра поля в EditEntityStorage */
        EditEntityStorage.addFieldController(this);
    }
})();