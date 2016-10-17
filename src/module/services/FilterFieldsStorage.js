(function () {
    'use strict';

    angular
        .module('universal.editor')
        .service('FilterFieldsStorage',FilterFieldsStorage);

    FilterFieldsStorage.$inject = ['$rootScope','$timeout','configData'];

    function FilterFieldsStorage($rootScope,$timeout,configData){
        var filterControllers = [],
            entityType,
            storage = {};
        

        this.addFilterController = function (ctrl, id) {
            filterControllers.push(ctrl);
            storage[id] = storage[id] || [];
            storage[id].push(ctrl);
            ctrl.setting.component.settings.$fieldHash = Math.random().toString(36).substr(2, 15);
        };

        this.deleteFilterController = function (ctrl) {
            angular.forEach(filterControllers, function (fc, ind) {
                if (fc.$fieldHash === ctrl.$fieldHash){
                    filterControllers.splice(ind,1);
                }
            });
        };

        this.calculate = function(id) {
            var ctrls = storage[id];
            var filters = {};
            //-- get list of filter fields
            angular.forEach(ctrls, function(ctrl) {
                //--get settings of the field
                var settings = ctrl.setting.component.settings;
                //--get operator from settings of the field
                var operator = settings.$filterOperator;
                //--get value of the field
                var fieldValue = ctrl.getFieldValue();        

                //-- genarate filter objects with prepared filters
                angular.extend(settings.$toFilter(operator, ctrl.getFieldValue()), filters);
            });
            return filters;
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
