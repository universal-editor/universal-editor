(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeFormGroupController',UeFormGroupController);

    UeFormGroupController.$inject = ['$scope', '$rootScope', '$element', 'configData', 'EditEntityStorage', '$timeout', 'ArrayFieldStorage', 'RestApiService'];

    function UeFormGroupController($scope, $rootScope, $element, configData, EditEntityStorage, $timeout, ArrayFieldStorage, RestApiService){
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;
        if(vm.setting.parentField){
            if(vm.setting.parentFieldIndex){
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.parentFieldIndex + "_" + vm.setting.name;
            } else {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.name;
            }
        } else {
            fieldErrorName = vm.setting.name;
        }

        var entityObject = RestApiService.getEntityObject();

        vm.fieldDisplayName = vm.setting.label;
        vm.hint = vm.setting.hint || false;
        vm.innerFields = [];
        vm.fieldsArray = [];

        vm.multiple = vm.setting.hasOwnProperty("multiple") && vm.setting.multiple === true;

        EditEntityStorage.addFieldController(this);

        angular.forEach(vm.setting.component.settings.fields, function(value) {
            var field = entityObject.dataSource.fields.filter(function(k) {
                return k.name == value;
            });
            if(field.length > 0) {
                vm.innerFields.push(field[0]);
            }
        });

        this.getFieldValue = function () {


            var field = {};

            field[vm.setting.name] = vm.fieldsArray.length  > 0 ? [] : "";

            return field;

        };

        this.getInitialValue = function () {

            var field = {};

            field[vm.setting.name] = [];

            return field;
        };

        var destroyEntityLoaded = $scope.$on('editor:entity_loaded', function (event, data) {

            if(vm.multiple) {
                if(data.editorEntityType === "new"){
                    vm.fieldsArray = [];
                    ArrayFieldStorage.setArrayField(vm.setting.name,[]);
                } else {
                    ArrayFieldStorage.setArrayField(vm.setting.name,JSON.parse(JSON.stringify(data[vm.setting.name])));
                    vm.fieldsArray = data[vm.field.name];
                }
            }
        });

        var destroyErrorField = $scope.$on("editor:api_error_field_"+ fieldErrorName, function (event,data) {
            if(angular.isArray(data)){
                angular.forEach(data, function (error) {
                    if(vm.setting.errorIndexOf(error) < 0){
                        vm.setting.setError(error);
                    }
                });
            } else {
                if(vm.setting.errorIndexOf(data) < 0){
                    vm.setting.setError(data);
                }
            }
        });

        vm.removeItem = function (ind) {
            var tmpArray = vm.fieldsArray;
            vm.fieldsArray = [];
            $timeout(function () {
                ArrayFieldStorage.removeFieldIndex(vm.setting.name,ind);
                tmpArray.splice(ind,1);
                vm.fieldsArray = tmpArray;
            },0);
        };

        this.$onDestroy = function() {
            destroyEntityLoaded();
            destroyErrorField();
        };

        this.$postLink = function(){
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        };
    }
})();