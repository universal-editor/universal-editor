(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeArrayController',UeArrayController);

    UeArrayController.$inject = ['$scope', '$rootScope', '$element', 'configData', 'EditEntityStorage', '$timeout', 'ArrayFieldStorage'];

    function UeArrayController($scope, $rootScope, $element, configData, EditEntityStorage, $timeout, ArrayFieldStorage){
        /* jshint validthis: true */
        var vm = this;
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
        vm.fieldDisplayName = vm.field.label;
        vm.hint = vm.field.hint || false;
        vm.innerFields = vm.field.fields;
        vm.fieldsArray = [];

        vm.multiple = vm.field.hasOwnProperty("multiple") && vm.field.multiple === true;

        EditEntityStorage.addFieldController(this);

        this.getFieldValue = function () {


            var field = {};

            field[vm.fieldName] = vm.fieldsArray.length  > 0 ? [] : "";

            return field;

        };

        this.getInitialValue = function () {

            var field = {};

            field[vm.fieldName] = [];

            return field;
        };

        $scope.$on('editor:entity_loaded', function (event, data) {

            if(vm.multiple){
                if(data.editorEntityType === "new"){
                    vm.fieldsArray = [];
                    ArrayFieldStorage.setArrayField(vm.fieldName,[]);
                } else {
                    ArrayFieldStorage.setArrayField(vm.fieldName,JSON.parse(JSON.stringify(data[vm.field.name])));
                    vm.fieldsArray = data[vm.field.name];
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

        vm.removeItem = function (ind) {
            var tmpArray = vm.fieldsArray;
            vm.fieldsArray = [];
            $timeout(function () {
                ArrayFieldStorage.removeFieldIndex(vm.fieldName,ind);
                tmpArray.splice(ind,1);
                vm.fieldsArray = tmpArray;
            },0);
        };

        vm.addItem = function () {
            vm.fieldsArray.push("");
        };

        this.$onDestroy = function() {

        };

        this.$postLink = function(){
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        };
    }
})();