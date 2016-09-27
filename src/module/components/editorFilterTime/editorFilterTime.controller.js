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

        FilterFieldsStorage.addFilterController(this);

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

        this.getInitialValue = function () {

            var filter = {};

            filter[vm.filterName] = "";

            return filter;
        };

        this.setInitialValue = function () {
            vm.filterValueStartTime = "";
            vm.filterValueEndTime = "";
        };

        $scope.$on('$destroy', function () {
            FilterFieldsStorage.deleteFilterController(vm);
        });
    }
})();
