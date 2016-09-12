(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterNumberController',EditorFilterNumberController);

    EditorFilterNumberController.$inject = ['$scope','FilterFieldsStorage','$location','RestApiService'];

    function EditorFilterNumberController($scope,FilterFieldsStorage,$location,RestApiService){
        /* jshint validthis: true */
        var vm = this;

        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.filterValue = $location.search()[vm.filterName] || null;

        /* Initial method : Регистрация экземпляра поля в FilterFieldsStorage */
        FilterFieldsStorage.addFilterController(this);

        /*
         * Filter system method: Возвращает текущее значение поля
         */

        this.getFilterValue = function () {

            var field = {};

            if(vm.filterValue !== null){
                field[vm.filterName] = vm.filterValue;
                return field;
            } else {
                return false;
            }
        };

        /*
         * Filter system method: Возврашает значение поля которое используется при создании
         * новой сущности, т.е. дефолтное значение поля
         */

        this.getInitialValue = function () {

            var filter = {};

            filter[vm.filterName] = null;

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
         * При инициализации поля - текущее значение поля берется соответствующее значению параметра url
         */

        $scope.$watch(function () {
            return vm.filterValue;
        }, function (newVal) {
            if(newVal !== null){
                $location.search(vm.filterName,newVal);
            } else {
                $location.search(vm.filterName,null);
            }
        });


    }
})();
