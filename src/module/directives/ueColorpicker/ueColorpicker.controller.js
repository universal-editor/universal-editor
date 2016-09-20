(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeColorpickerController',UeColorpickerController);

    UeColorpickerController.$inject = ['$scope','EditEntityStorage','ArrayFieldStorage'];

    function UeColorpickerController($scope,EditEntityStorage,ArrayFieldStorage){
        /* jshint validthis: true */
        var vm = this;
        var regExpPattern = /^#[0-9a-f]{3,6}$/i;
        var defaultColor = '#000000';
        var fieldErrorName;

        if(vm.parentField){
            if(vm.parentFieldIndex){
                fieldErrorName = vm.parentField + "_" + vm.parentFieldIndex + "_" + vm.fieldName;
            } else {
                fieldErrorName = vm.parentField + "_" + vm.fieldName;
            }
        } else {
            fieldErrorName = vm.field.name;
        }

        vm.fieldName = vm.field.name;
        vm.readonly = vm.field.readonly || false;
        vm.setErrorEmpty();
        vm.parentFieldIndex = vm.parentFieldIndex || false;

        if (vm.field.hasOwnProperty("multiple") && vm.field.multiple === true){
            vm.multiple = true;
            vm.fieldValue = [defaultColor];
            if (vm.field.multiname || angular.isString(vm.field.multiname)) {
                vm.multiname = ('' + vm.field.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = defaultColor;
        }

        if(vm.parentFieldIndex){
            if(vm.multiple){
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue(vm.parentField,vm.parentFieldIndex,vm.field.name), function (item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue(vm.parentField,vm.parentFieldIndex,vm.field.name) || "";
            }
        }

        EditEntityStorage.addFieldController(this);

        this.getFieldValue = function () {

            var field = {};
            var wrappedFieldValue;

            if(vm.multiname){
                wrappedFieldValue = [];
                angular.forEach(vm.fieldValue, function (valueItem) {
                    var tempItem = {};
                    tempItem[vm.multiname] = valueItem;
                    wrappedFieldValue.push(tempItem);
                });
            } else if(vm.multiple){
              wrappedFieldValue = [];
              angular.forEach(vm.fieldValue, function (valueItem) {
                  wrappedFieldValue.push(valueItem);
              });
            } else {
                wrappedFieldValue = vm.fieldValue;
            }

            if(vm.parentField){
                if(vm.parentFieldIndex){
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

            if(vm.parentField){
                if(vm.multiple){
                    field[vm.parentField] = {};
                    field[vm.parentField][vm.fieldName] = [defaultColor];
                } else {
                    field[vm.parentField] = {};
                    field[vm.parentField][vm.fieldName] = defaultColor;
                }
            } else {
                if(vm.multiple){
                    field[vm.fieldName] = [];
                } else {
                    field[vm.fieldName] = defaultColor;
                }
            }

            return field;
        };

        /*
         * Публичные методы множественного поля.
         * Добавление и удаление из массива елементов значения поля
         */

        vm.addItem = function () {
            vm.fieldValue.push(defaultColor);
        };

        vm.removeItem = function (index) {
            angular.forEach(vm.fieldValue, function (value,key) {
                if (key == index){
                    vm.fieldValue.splice(index,1);
                }
            });
        };

        $scope.$on('editor:entity_loaded', function (event, data) {
            if( data.editorEntityType === "new" ){
                vm.fieldValue = vm.multiple ? [(vm.field.defaultValue || defaultColor)] : (vm.field.defaultValue || defaultColor);
                return;
            }

            if(!vm.parentField){
                if(!vm.multiple){
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
                if(!vm.multiple){
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

        $scope.$on("editor:api_error_field_"+ fieldErrorName, function (event,data) {
            if(angular.isArray(data)){
                angular.forEach(data, function (error) {
                    if(vm.errorIndexOf(error) < 0){
                        vm.setError(error);
                    }
                });
            } else {
                if(vm.errorIndexOf(data) < 0){
                    vm.setError(data);
                }
            }
        });

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if(vm.parentFieldIndex){
                ArrayFieldStorage.fieldDestroy(vm.parentField,vm.parentFieldIndex,vm.field.name,vm.fieldValue);
            }
        });

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            vm.setErrorEmpty();
        });
    }
})();