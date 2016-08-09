(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterDateController',EditorFilterDateController);

    EditorFilterDateController.$inject = ['$scope','FilterFieldsStorage','moment'];

    function EditorFilterDateController($scope,FilterFieldsStorage,moment){
        /* jshint validthis: true */
        var vm = this;

        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.filterValueStartDate = "";
        vm.filterValueStartTime = "";
        vm.filterValueEndDate = "";
        vm.filterValueEndTime = "";

        /* Initial method : Регистрация экземпляра поля в FilterFieldsStorage */
        FilterFieldsStorage.addFilterController(this);

        /*
         * Filter system method: Возвращает текущее значение поля
         */

        this.getFilterValue = function () {

            var field = {};

            if(
                vm.filterValueStartDate === "" &&
                vm.filterValueEndDate === "" &&
                vm.filterValueStartTime === "" &&
                vm.filterValueEndTime === ""
            ){
                return false;
            } else {

                var st = moment.isMoment(vm.filterValueStartTime) ? " " + moment(vm.filterValueStartTime).format("HH:mm:ss") : "";
                var et = moment.isMoment(vm.filterValueEndTime) ? " " + moment(vm.filterValueEndTime).format("HH:mm:ss") : "";

                if(vm.filterValueStartDate !== "" && vm.filterValueEndDate === ""){


                    field[vm.filterName] = ">=" + moment(vm.filterValueStartDate).format("YYYY-MM-DD") + st;
                } else if (vm.filterValueStartDate === "" && vm.filterValueEndDate !== ""){
                    field[vm.filterName] = "<=" + moment(vm.filterValueEndDate).format("YYYY-MM-DD") + et;
                } else {
                    field[vm.filterName] = [];
                    field[vm.filterName].push(">=" + moment(vm.filterValueStartDate).format("YYYY-MM-DD") + st);
                    field[vm.filterName].push("<=" + moment(vm.filterValueEndDate).format("YYYY-MM-DD") + et);
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
            vm.filterValueStartDate = "";
            vm.filterValueStartTime = "";
            vm.filterValueEndDate = "";
            vm.filterValueEndTime = "";
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
