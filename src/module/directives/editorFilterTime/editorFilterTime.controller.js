(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFilterTimeController',EditorFilterTimeController);

    EditorFilterTimeController.$inject = ['$scope','FilterFieldsStorage','moment'];

    function EditorFilterTimeController($scope,FilterFieldsStorage,moment){
        /* jshint validthis: true */
        var vm = this;

        vm.filterName = $scope.filter.name;
        vm.filterDisplayName = $scope.filter.label;
        vm.filterValueStartTime = "";
        vm.filterValueEndTime = "";

        /* Initial method : Регистрация экземпляра поля в FilterFieldsStorage */
        FilterFieldsStorage.addFilterController(this);

        /*
         * Filter system method: Возвращает текущее значение поля
         */

        this.getFilterValue = function () {

            var field = {};

            if(
                vm.filterValueStartTime === "" &&
                vm.filterValueEndTime === ""
            ){
                return false;
            } else {
                if(vm.filterValueStartTime !== "" && vm.filterValueEndTime === ""){
                    field[">=" + vm.filterName] = moment(vm.filterValueStartTime).format("HH:mm:ss");
                } else if (vm.filterValueStartTime === "" && vm.filterValueEndTime !== ""){
                    field["<=" + vm.filterName] = moment(vm.filterValueEndTime).format("HH:mm:ss");
                } else {
                    field[">=" + vm.filterName] = moment(vm.filterValueStartTime).format("HH:mm:ss");
                    field["<=" + vm.filterName] = moment(vm.filterValueEndTime).format("HH:mm:ss");
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
            vm.filterValueStartTime = "";
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
