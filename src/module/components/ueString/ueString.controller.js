(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeStringController', UeStringController);

    UeStringController.$inject = ['$scope', '$element', 'EditEntityStorage', 'ArrayFieldStorage', 'FilterFieldsStorage', '$location', '$controller'];

    function UeStringController($scope, $element, EditEntityStorage, ArrayFieldStorage, FilterFieldsStorage, $location, $controller) {
        /* jshint validthis: true */
        var vm = this;
        var baseController = $controller('FieldsController', { $scope: $scope });
        angular.extend(vm, baseController);
        var fieldErrorName;
        var componentSettings = vm.setting.component.settings;
        if (vm.setting.parentField) {
            if (vm.setting.parentFieldIndex) {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.parentFieldIndex + "_" + vm.setting.name;
            } else {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.name;
            }
        } else {
            fieldErrorName = vm.setting.name;
        }

        vm.cols = componentSettings.width;
        vm.classTextarea = '';
        vm.fieldName = vm.setting.name;
        vm.fieldValue = undefined;
        vm.readonly = componentSettings.readonly || false;
        vm.mask = componentSettings.mask || false;
        vm.fieldDisplayName = componentSettings.label;
        vm.hint = componentSettings.hint || false;
        vm.required = componentSettings.required || false;
        vm.error = [];
        vm.multiple = componentSettings.multiple === true;

        if (vm.options.filter) {
            vm.multiple = false;
            vm.readonly = false;
            vm.required = false;
        }

        vm.fieldValue = vm.multiple ? [] : (componentSettings.defaultValue || null);

        vm.multiname = componentSettings.multiname;


        if (!!vm.cols) {
            if (vm.cols > 6) {
                vm.cols = 6;
            }
            if (vm.cols < 1) {
                vm.cols = 1;
            }
        }


        vm.addItem = function() {
            vm.fieldValue.push("");
        };

        vm.removeItem = function(index) {
            angular.forEach(vm.fieldValue, function(value, key) {
                if (key == index) {
                    vm.fieldValue.splice(index, 1);
                }
            });
        };


        /* Слушатель события на покидание инпута. Необходим для превалидации поля на минимальное и максимальное значение */

        vm.inputLeave = function(val) {
            if (!val) {
                return;
            }

            /*   if(vm.setting.hasOwnProperty("maxLength") && val.length > vm.setting.maxLength){
                   var maxError = "Для поля превышено максимальное допустимое значение в " + vm.setting.maxLength + " символов. Сейчас введено " + val.length + " символов.";
                   if (vm.error.indexOf(maxError) < 0) {
                       vm.error.push(maxError);
                   }
               }
   
               if(vm.setting.hasOwnProperty("minLength") && val.length < vm.setting.minLength){
                   var minError = "Минимальное значение поля не может быть меньше " + vm.setting.minLength + " символов. Сейчас введено " + val.length + " символов.";
                   if(vm.error.indexOf(minError) < 0){
                       vm.error.push(minError);
                   }
               }*/
        };

        /* Слушатели событий бродкаста. */

        /*
         * Событие загрузки сущности ( созданной или пустой, т.е. создаваемой ).
         * Поле забирает данные из объекта сущности с учетом наличия родительского поля.
         */
        var destroyEntityLoaded = $scope.$on('editor:entity_loaded', $scope.onLoadDataHandler);

        /*
         * При удалении директивы она должна отправлять запрос в EditEntityStorage
         * чтобы последний удалил её из списка отслеживаемых полей.
         */

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

        /* Очистка массива ошибок при внесении пользователем изменений в поле */

        var destroyWatchFieldValue = $scope.$watch(function() {
            return vm.fieldValue;
        }, function() {
            vm.error = [];
        }, true);

        /* Удаление контроллера поля из сервиса управления данными полей. Происходит при исчезании поля */

        this.$onDestroy = function() {           
            destroyEntityLoaded();
            destroyErrorField();
            destroyWatchFieldValue();
            EditEntityStorage.deleteFieldController(vm, vm.parentComponentId);
            FilterFieldsStorage.deleteFilterController(vm, vm.parentComponentId);
            if (vm.setting.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy(vm.setting.parentField, vm.setting.parentFieldIndex, vm.setting.name, vm.fieldValue);
            }
        };

        this.$postLink = function() {
            $element.on('$destroy', function() {
                $scope.$destroy();
            });
        };

        /** Filter logic */
        vm.getFieldValue = getFieldValue;
        vm.clear = clear;

        if (vm.options.filter) {
            FilterFieldsStorage.addFilterController(this, vm.parentComponentId);
        } else {
            EditEntityStorage.addFieldController(this, vm.parentComponentId);
        }

        function clear() {
            if (componentSettings.multiple === true) {
                vm.fieldValue = [];
            } else {
                vm.fieldValue = componentSettings.defaultValue || '';
            }
        }

        function getFieldValue() {
            var field = {},
                wrappedFieldValue;

            if (vm.multiname) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function(valueItem) {
                    var tempItem = {};
                    tempItem[vm.multiname] = valueItem;
                    wrappedFieldValue.push(tempItem);
                });
            } else if (vm.multiple) {
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function(valueItem) {
                    wrappedFieldValue.push(valueItem);
                });
            } else {
                wrappedFieldValue = vm.fieldValue;
            }

            if (vm.setting.parentField) {
                field[vm.setting.parentField] = {};
                field[vm.setting.parentField][vm.fieldName] = wrappedFieldValue;
            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        }


    }
})();