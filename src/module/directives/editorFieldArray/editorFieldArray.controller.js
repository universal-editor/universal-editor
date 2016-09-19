(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldArrayController',EditorFieldArrayController);

    EditorFieldArrayController.$inject = ['$scope','$rootScope','configData','EditEntityStorage','$timeout','ArrayFieldStorage'];

    function EditorFieldArrayController($scope,$rootScope,configData,EditEntityStorage,$timeout,ArrayFieldStorage){
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;

        if($scope.parentField){
            if($scope.parentFieldIndex){
                fieldErrorName = $scope.parentField + "_" + $scope.parentFieldIndex + "_" + $scope.fieldName;
            } else {
                fieldErrorName = $scope.parentField + "_" + $scope.fieldName;
            }
        } else {
            fieldErrorName = $scope.fieldName;
        }

        vm.fieldName = $scope.field.name;
        vm.fieldDisplayName = $scope.field.label;
        vm.hint = $scope.field.hint || false;
        vm.innerFields = $scope.field.fields;
        vm.fieldsArray = [];

        vm.multiple = $scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true;

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
                    ArrayFieldStorage.setArrayField(vm.fieldName,JSON.parse(JSON.stringify(data[$scope.field.name])));
                    vm.fieldsArray = data[$scope.field.name];
                }
            }
        });

        $scope.$on("editor:api_error_field_"+ fieldErrorName, function (event,data) {
            if(angular.isArray(data)){
                angular.forEach(data, function (error) {
                    if($scope.errorIndexOf(error) < 0){
                        $scope.setError(error);
                    }
                });
            } else {
                if($scope.errorIndexOf(data) < 0){
                    $scope.setError(data);
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
    }
})();