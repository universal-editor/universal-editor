(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('FieldWrapperController',FieldWrapperController);

    FieldWrapperController.$inject = ['$scope', 'RestApiService'];

    function FieldWrapperController($scope, RestApiService){
        var vm = this;
        vm.error = [];
        var entityObject = RestApiService.getEntityObject();
        $scope.className = {};
        if(angular.isString($scope.fieldName)) {
          $scope.className['field-element-' + $scope.fieldName] = $scope.fieldName;
        }

        if($scope.parentField){
            angular.forEach(entityObject.tabs, function (tab) {
                angular.forEach(tab.fields, function (field) {
                    if(field.name == $scope.parentField){
                        angular.forEach(field.fields, function (innerField) {
                            if(innerField.name == $scope.fieldName){
                                $scope.field = innerField;
                                return;
                            }
                        });
                    }
                });
            });
        } else {
            angular.forEach(entityObject.tabs, function (tab) {
                angular.forEach(tab.fields, function (field) {
                    if(field.name == $scope.fieldName){
                        $scope.field = field;
                        return;
                    }
                });
            });
        }

        vm.fieldDisplayName = $scope.field.label;
        vm.hint = $scope.field.hint || false;
        vm.required = $scope.field.required || false;
        vm.isArray = ($scope.field.type == 'array');
    }
})();