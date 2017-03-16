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

        FilterFieldsStorage.addFilterController(this);

        this.getFilterValue = function () {

            var field = {};

            if(vm.filterValueStartDateTime === "" && vm.filterValueEndDateTime === ""){
                return false;
            } else {
                if(vm.filterValueStartDateTime !== "" && vm.filterValueEndDateTime === ""){
                    field["=>" + vm.filterName] = moment.utc(vm.filterValueStartDateTime).format("YYYY-MM-DD HH:mm:ss");
                } else if (vm.filterValueStartDateTime === "" && vm.filterValueEndDateTime !== ""){
                    field["<=" + vm.filterName] = moment.utc(vm.filterValueEndDateTime).format("YYYY-MM-DD HH:mm:ss");
                } else {
                    field["=>" + vm.filterName] = moment.utc(vm.filterValueStartDateTime).format("YYYY-MM-DD HH:mm:ss");
                    field["<=" + vm.filterName] = moment.utc(vm.filterValueEndDateTime).format("YYYY-MM-DD HH:mm:ss");
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
            vm.filterValueStartDateTime = "";
            vm.filterValueEndDateTime = "";
        };

        $scope.$on('$destroy', function () {
            FilterFieldsStorage.deleteFilterController(vm);
        });
    }
})();
