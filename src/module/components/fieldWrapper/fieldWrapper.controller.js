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
        console.log(entityObject);
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
            //angular.forEach(entityObject.body, function (tab) {
            //    angular.forEach(tab.component.settings.fields, function (field) {
            //        if(angular.isString(field) && (field == $scope.fieldName)){
            //            $scope.field = field;
            //            return;
            //        }
            //        //if(field.name == $scope.fieldName){
            //        //    $scope.field = field;
            //        //    return;
            //        //}
            //    });
            //});
            angular.forEach(entityObject.dataSource.fields, function(field) {
                if(field.name == $scope.fieldName){
                    $scope.field = field;
                    return;
                }
            });
        }

        vm.fieldDisplayName = $scope.field.label;
        vm.hint = $scope.field.hint || false;
        vm.required = $scope.field.required || false;
        vm.isArray = ($scope.field.type == 'ue-array');

        $scope.setError = function(error) {
            vm.error.push(error);
        };

        $scope.setEmpty = function() {
            vm.error = [];
        };

        $scope.errorIndexOf = function(error) {
            return vm.error.indexOf(error);
        };
    }
})();