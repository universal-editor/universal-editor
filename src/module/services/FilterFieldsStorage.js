(function () {
    'use strict';

    angular
        .module('universal-editor')
        .service('FilterFieldsStorage', FilterFieldsStorage);

    function FilterFieldsStorage($rootScope, $timeout, configData, $location) {
        "ngInject";
        var storage = {},
            filterComponentsStorage = {},
            queryObject = {},
            srvc = this,
            filterSearchString;

        /** set functions for service */
        angular.extend(srvc, {
            addFilterFieldController: addFilterFieldController,
            deleteFilterFieldController: deleteFilterFieldController,
            clearFiltersValue: clearFiltersValue,
            calculate: calculate,
            getFilterQueryObject: getFilterQueryObject,
            getFilterFieldController: getFilterFieldController,
            getFilterController: getFilterController,
            getFilterApi: getFilterApi,
            registerFilterController: registerFilterController,
            unRegisterFilterController: unRegisterFilterController,
            apply: apply,
            clear: clear,
            getFilterObject: getFilterObject
        });

        function addFilterFieldController(ctrl) {
            var id = ctrl.parentComponentId;
            if (id) {
                storage[id] = storage[id] || [];
                storage[id].push(ctrl);
                ctrl.$fieldHash = Math.random().toString(36).substr(2, 15);
            }
        }

        function registerFilterController(ctrl) {
            var id = ctrl.parentComponentId;
            if (id) {
                filterComponentsStorage[id] = filterComponentsStorage[id] || {};
                filterComponentsStorage[id] = ctrl;
            }
        }

        function unRegisterFilterController(ctrl) {
            var id = ctrl.parentComponentId;
            if (id) {
                delete filterComponentsStorage[id];
            }
        }

        function getFilterController(id) {
            if (id) {
                return filterComponentsStorage[id];
            }
            return false;
        }

        function getFilterApi(options) {
            var id = options.$parentComponentId;
            if (id) {
                var fCtrl = filterComponentsStorage[id];
                if (fCtrl) {
                    return {
                        apply: fCtrl.apply,
                        clear: fCtrl.clear
                    };
                }
            }
        }

        function getFilterFieldController(id) {
            if (id && storage[id]) {
                return storage[id];
            }
            return false;
        }

        function deleteFilterFieldController(ctrl) {
            var id = ctrl.parentComponentId;
            if (id) {
                var filterControllers = storage[id];
                if (filterControllers) {
                    angular.forEach(filterControllers, function (fc, ind) {
                        if (fc.$fieldHash === ctrl.$fieldHash) {
                            filterControllers.splice(ind, 1);
                        }
                    });
                }
            }
        }

        function clearFiltersValue(id, paramName) {
            if (storage[id]) {
                angular.forEach(storage[id], function (ctrl) {
                    ctrl.clear();
                });
                calculate(id, paramName);
            }
        }

        function calculate(id, paramName) {
            var ctrls = storage[id];
            var filters = {};
            //-- get list of filter fields
            angular.forEach(ctrls, function (ctrl) {
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
                queryObject[paramName] = angular.copy(filters);
            } else {
                delete queryObject[paramName];
                filters = false;
            }
            return filters;
        }

        function getFilterQueryObject(paramName) {
            return queryObject[paramName];
        }

        function apply(parentComponentId, filterName) {
            var filterJSON = null, filters;
            if (parentComponentId) {
                var fCtrl = filterComponentsStorage[parentComponentId];
                if (fCtrl) {
                    filterName = filterName || fCtrl.filterName;
                }
                filters = $location.search()[filterName];
                if (filters) {
                    filters = JSON.parse(filters);
                }
                var filterEntity = calculate(parentComponentId, filterName);

                if (filterEntity) {
                    filters = filters || {};
                    filters = JSON.stringify(angular.merge(filters, filterEntity));
                } else {
                    filters = null;
                }
                $location.search(filterName, filters);
                $rootScope.$broadcast('ue:collectionRefresh', parentComponentId);
            }
        }

        function clear(parentComponentId, filterName) {
            var filterJSON = null, filters;
            if (parentComponentId) {
                var fCtrl = filterComponentsStorage[parentComponentId];
                if (fCtrl) {
                    filterName = filterName || fCtrl.filterName;
                }
                filters = $location.search()[filterName];
                if (filters) {
                    filters = JSON.parse(filters);
                }
                clearFiltersValue(parentComponentId, filterName);
                $location.search(filterName, null);
                $rootScope.$broadcast('ue:collectionRefresh', parentComponentId);
            }
        }

        function getFilterObject(parentComponentId) {
            var filters = {};
            var filterCtrl = getFilterFieldController(parentComponentId);
            if (filterCtrl) {
                angular.forEach(filterCtrl, function (item) {
                    filters[item.fieldName] = filters[item.fieldName] || [];
                    var operator = item.options.filterParameters.operator;
                    var value = item.getFieldValue();
                    switch (operator) {
                        case '%:text%':
                            operator = '%:value%';
                            break;
                        case '<=':
                            operator = '<=:key';
                            break;
                        case '>=':
                            operator = '>=:key';
                            break;
                        default :
                            operator = ':value';
                    }
                    for (var key in value) {
                        if (!!value[key]) {
                            filters[item.fieldName].push({
                                operator: operator,
                                value: value[key]
                            });
                        }
                    }
                });
            }
            for (var key in filters) {
                if (filters[key].length == 0) {
                    delete filters[key];
                }
            }
            return filters;
        }
    }
})();
