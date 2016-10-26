(function() {
    'use strict';

    angular
        .module('universal.editor')
        .service('FilterFieldsStorage', FilterFieldsStorage);

    FilterFieldsStorage.$inject = ['$rootScope', '$timeout', 'configData'];

    function FilterFieldsStorage($rootScope, $timeout, configData) {
        var entityType,
            storage = {},
            queryObject = [],
            srvc = this,
            filterSearchString;
        
        /** set functions for service */
        angular.extend(srvc, {
            addFilterController: addFilterController,
            deleteFilterController: deleteFilterController,
            clearFiltersValue: clearFiltersValue,
            calculate: calculate,
            getFilterQueryObject: getFilterQueryObject
        });      

        function addFilterController(ctrl, id) {
            storage[id] = storage[id] || [];
            storage[id].push(ctrl);
            ctrl.$fieldHash = Math.random().toString(36).substr(2, 15);
        }

        function deleteFilterController(ctrl, id) {
            var filterControllers = storage[id];
            if (filterControllers) {
                angular.forEach(filterControllers, function(fc, ind) {
                    if (fc.$fieldHash === ctrl.$fieldHash) {
                        filterControllers.splice(ind, 1);
                    }
                });
            }
        }

        function clearFiltersValue(id) {
            if (storage[id]) {
                angular.forEach(storage[id], function(ctrl) {
                    ctrl.clear();
                });
                calculate(id);
            }
        }

        function calculate(id) {
            var ctrls = storage[id];
            var filters = {};
            //-- get list of filter fields
            angular.forEach(ctrls, function(ctrl) {
                //--get settings of the field
                var settings = ctrl.setting.component.settings;
                //--get operator from settings of the field
                var operator = ctrl.options.filterParameters.operator;
                //--get value of the field
                var fieldValue = ctrl.getFieldValue();

                //-- genarate filter objects with prepared filters
                var filterValue = settings.$toFilter(operator, ctrl.getFieldValue());
                angular.extend(filters, filterValue);
            });

            //** storage filter object
            if (!$.isEmptyObject(filters)) {
                queryObject[id] = angular.copy(filters);
            } else {
                delete queryObject[id];
                filters = false;
            }
            return filters;
        }

        function getFilterQueryObject(id) {
            return queryObject[id];
        }

        $rootScope.$on('editor:set_entity_type', function(event, type) {
            entityType = type;
        });
    }
})();
