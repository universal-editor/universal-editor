(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterCheckboxController',EditorFilterCheckboxController);

    EditorFilterCheckboxController.$inject = ['$scope','FilterFieldsStorage','RestApiService'];

    function EditorFilterCheckboxController($scope,FilterFieldsStorage,RestApiService){
        /* jshint validthis: true */
        var vm = this;

        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.filterValue = [];
        vm.selectedValues = [];
        var remote = $scope.filter.valuesRemote;
        vm.field_id = "id";
        vm.field_search = "title";
        if (remote) {
            if(remote.fields){
                if (remote.fields.value) {
                    vm.field_id = remote.fields.value;
                }
                if (remote.fields.label) {
                    vm.field_search = remote.fields.label;
                }
            }
        }
        FilterFieldsStorage.addFilterController(this);

        if($scope.filter.hasOwnProperty("values")){
            angular.forEach($scope.filter.values, function (v,key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                vm.selectedValues.push(obj);
            });
        } else if ($scope.filter.hasOwnProperty("valuesRemote")){
            RestApiService
                .getUrlResource($scope.filter.valuesRemote.url)
                .then(function (response) {
                    angular.forEach(response.data.items, function (v) {
                        vm.selectedValues.push(v);
                    });
                }, function (reject) {
                    console.error('EditorFilterCheckboxController: Не удалось получить значения для поля \"' + $scope.filter.fieldName + '\" с удаленного ресурса');
                });
        } else {
            console.error('EditorFilterCheckboxController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
        }

        this.getFilterValue = function () {

            var field = {};

            if(vm.filterValue.length !== 0){
                field[vm.filterName] = vm.filterValue;
                return field;
            } else {
                return false;
            }
        };

        this.getInitialValue = function () {

            var filter = {};

            filter[vm.filterValue] = [];

            return filter;
        };

        this.setInitialValue = function () {
            vm.filterValue = [];
        };

        /*
         * При удалении директивы она должна отправлять запрос в FilterFieldsStorage
         * чтобы последний удалил её из списка отслеживаемых фильтров.
         */

        $scope.$on('$destroy', function () {
            FilterFieldsStorage.deleteFilterController(vm);
        });
    }
})();
