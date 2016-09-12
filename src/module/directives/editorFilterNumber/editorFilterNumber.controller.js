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

        FilterFieldsStorage.addFilterController(this);
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
            filter[vm.filterName] = null;
            return filter;
        };

        this.setInitialValue = function () {
            vm.filterValue = null;
        };

        $scope.$on('$destroy', function () {
            FilterFieldsStorage.deleteFilterController(vm);
        });

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
