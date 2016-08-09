(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterDateTimeController',EditorFilterDateTimeController);

    EditorFilterDateTimeController.$inject = ['$scope','FilterFieldsStorage','moment'];

    function EditorFilterDateTimeController($scope,FilterFieldsStorage,moment){
        /* jshint validthis: true */
        var vm = this;

        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.filterValueStartDateTime = "";
        vm.filterValueEndDateTime = "";

        /* Initial method : Регистрация экземпляра поля в FilterFieldsStorage */
        FilterFieldsStorage.addFilterController(this);

        /*
         * Filter system method: Возвращает текущее значение поля
         */

        this.getFilterValue = function () {

            var field = {};

            if(vm.filterValueStartDateTime === "" && vm.filterValueEndDateTime === ""){
                return false;
            } else {
                if(vm.filterValueStartDateTime !== "" && vm.filterValueEndDateTime === ""){
                    field[vm.filterName] = ">=" + moment.utc(vm.filterValueStartDateTime).format("YYYY-MM-DD HH:mm:ss");
                } else if (vm.filterValueStartDateTime === "" && vm.filterValueEndDateTime !== ""){
                    field[vm.filterName] = "<=" + moment.utc(vm.filterValueEndDateTime).format("YYYY-MM-DD HH:mm:ss");
                } else {
                    field[vm.filterName] = [];
                    field[vm.filterName].push(">=" + moment.utc(vm.filterValueStartDateTime).format("YYYY-MM-DD HH:mm:ss"));
                    field[vm.filterName].push("<=" + moment.utc(vm.filterValueEndDateTime).format("YYYY-MM-DD HH:mm:ss"));
                }
                return field;
            }
        };

        /*
         * Filter system method: Возврашает значение поля которое используется при создании
         * новой сущности, т.е. дефолтное значение поля
         */

        this.getInitialValue = function () {
            var filter = {};
            filter[vm.filterName] = "";
            return filter;
        };

        this.setInitialValue = function () {
            vm.filterValueStartDateTime = "";
            vm.filterValueEndDateTime = "";
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
