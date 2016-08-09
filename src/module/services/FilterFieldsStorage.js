(function () {
    'use strict';

    angular
        .module('universal.editor')
        .service('FilterFieldsStorage',FilterFieldsStorage);

    FilterFieldsStorage.$inject = ['$rootScope','$timeout','configData'];

    function FilterFieldsStorage($rootScope,$timeout,configData){
        var filterControllers = [],
            entityType;

        this.addFilterController = function (ctrl) {
            filterControllers.push(ctrl);
            ctrl.$fieldHash = Math.random().toString(36).substr(2, 15);
        };

        this.deleteFilterController = function (ctrl) {
            angular.forEach(filterControllers, function (fc, ind) {
                if (fc.$fieldHash === ctrl.$fieldHash){
                    filterControllers.splice(ind,1);
                }
            });
        };

        this.getFilterValue = function(){

            var filterValue = {};

            angular.forEach(filterControllers, function (fc,ind){
                if(fc.getFilterValue()){
                    angular.extend(filterValue,fc.getFilterValue());
                }
            });

            return filterValue;
        };

        this.setInitialValues = function () {
            angular.forEach(filterControllers, function (fc,ind){
                fc.setInitialValue();
            });
        };

        $rootScope.$on('editor:set_entity_type',function (event,type) {
            entityType = type;
            filterControllers = [];
        });
    }
})();
