(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterSelectController',EditorFilterSelectController);

    EditorFilterSelectController.$inject = ['$scope','FilterFieldsStorage','RestApiService','$location','$timeout'];

    function EditorFilterSelectController($scope,FilterFieldsStorage,RestApiService,$location,$timeout){
        /* jshint validthis: true */
        var vm = this;

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

        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.selectedValues = [];

        FilterFieldsStorage.addFilterController(this);

        if($scope.filter.hasOwnProperty("values")){
            angular.forEach($scope.filter.values, function (v,key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                vm.selectedValues.push(obj);
            });
            if($location.search()[vm.filterName]){
                vm.filterValue = parseInt($location.search()[vm.filterName]);
            }
        } else if ($scope.filter.hasOwnProperty("valuesRemote")){
            RestApiService
                .getUrlResource($scope.filter.valuesRemote.url)
                .then(function (response) {
                    angular.forEach(response.data.items, function (v) {
                        vm.selectedValues.push(v);
                    });

                    if($location.search()[vm.filterName]){
                        vm.filterValue = parseInt($location.search()[vm.filterName]);
                    }
                }, function (reject) {
                    console.error('EditorFilterSelectController: Не удалось получить значения для поля \"' + $scope.filter.fieldName + '\" с удаленного ресурса');
                });
        } else {
            console.error('EditorFilterSelectController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
        }

        this.getFilterValue = function () {

            var field = {};

            if(vm.filterValue !== null){
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
            vm.filterValue = null;
        };

        /*
         * При удалении директивы она должна отправлять запрос в FilterFieldsStorage
         * чтобы последний удалил её из списка отслеживаемых фильтров.
         */

        $scope.$on('$destroy', function () {
            FilterFieldsStorage.deleteFilterController(vm);
        });

        /*
         * При изменении значения поля - меняется параметр url.
         * При инициализации поля - текущее значение селекта берется соответствующее значению параметра url
         */

        $scope.$watch(function () {
            return vm.filterValue;
        }, function (newVal) {
            if(newVal !== undefined){
                $location.search(vm.filterName,newVal);
            }
        });
    }
})();
