(function() {
    'use strict';

    angular
        .module('universal-editor')
        .service('FilterFieldsStorage', FilterFieldsStorage);

    function FilterFieldsStorage($rootScope, $timeout, configData, $location) {
        'ngInject';
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
            getFilterObject: getFilterObject,
            convertFilterToString: convertFilterToString,
            isFilterSearchParamEmpty: isFilterSearchParamEmpty,
            fillFilterComponent: fillFilterComponent
        });

        function addFilterFieldController(ctrl) {
            var id = ctrl.parentComponentId;
            if (id) {
                storage[id] = storage[id] || [];
                var stackFields = storage[id];
                stackFields.push(ctrl);
                var filterCtrl = getFilterController(id);
                var readyCount = 0;
                angular.forEach(filterCtrl.body, function(group) {
                    if (angular.isArray(group.filters)) {
                        readyCount += group.filters.length;
                    }
                });
                filterCtrl.isReady = filterCtrl.body.length === 0 || stackFields.length === readyCount;
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

        function isFilterSearchParamEmpty(prefix) {
            var searchParameters = $location.search(),
                filterName = prefix ? prefix + '-filter' : 'filter',
                isEmpty = true;
            if (searchParameters && searchParameters[filterName] && !$.isEmptyObject(JSON.parse(searchParameters[filterName]))) {
                isEmpty = false;
            }
            return isEmpty;
        }

        function getFilterController(id) {
            if (id) {
                var filterCtrl = filterComponentsStorage[id];
                if (!filterCtrl) {
                    angular.forEach(filterComponentsStorage, function(ctrl, id) {
                        if (ctrl.isParentComponent(id)) {
                            filterCtrl = ctrl;
                        }
                    });
                }
                if (filterCtrl) {
                    return filterCtrl;
                }
            }
            return false;
        }

        function getFilterApi(options) {
            var id = options.$componentId;
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

        function fillFilterComponent(id, filter) {
            var ctrls = getFilterFieldController(id);
            if (angular.isArray(ctrls)) {
                ctrls.forEach(function(ctrl) {
                    if (ctrl.setting && angular.isFunction(ctrl.setting.component.settings.$parseFilter)) {
                        ctrl.setting.component.settings.$parseFilter(ctrl, filter);
                    }
                });
            }
        }

        function deleteFilterFieldController(ctrl) {
            var id = ctrl.parentComponentId;
            if (id) {
                var filterControllers = storage[id];
                if (filterControllers) {
                    angular.forEach(filterControllers, function(fc, ind) {
                        if (fc.$fieldHash === ctrl.$fieldHash) {
                            filterControllers.splice(ind, 1);
                        }
                    });
                }
            }
        }

        function clearFiltersValue(id, paramName) {
            if (storage[id]) {
                angular.forEach(storage[id], function(ctrl) {
                    ctrl.clear();
                });
                calculate(id, paramName);
            }
        }

        function calculate(id, paramName) {
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
                var filterValue = settings.$toFilter(operator, ctrl.getFieldValue(), ctrl);
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
                    filters = JSON.stringify(filterEntity);
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

        function getFilterObject(parentComponentId, originFilters) {
            var filters = {};
            var filterCtrl = getFilterFieldController(parentComponentId);
            if (filterCtrl) {
                angular.forEach(filterCtrl, function(item) {
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
                        default:
                            operator = ':value';
                    }
                    for (var key in value) {
                        if (value[key] !== undefined && value[key] !== null && value[key] !== '' && (!angular.isArray(value[key]) || value[key].length > 0)) {
                            if(originFilters && originFilters[key]) {
                                value[key] = originFilters[key];
                            }
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

        function convertFilterToString(filters) {
            var filter = '';
            angular.forEach(filters, function(value, key) {
                value.forEach(function(f) {
                    if (filter) {
                        filter += ',';
                    }
                    var k = ~f.operator.indexOf(':key') ? f.operator.replace(':key', key) : key;
                    var v = f.value;
                    if (angular.isString(v)) {
                        v = '"' + (~f.operator.indexOf(':value') ? f.operator.replace(':value', f.value) : f.value) + '"';
                    }
                    if (angular.isArray(v)) {
                        v = v.map(function(field) {
                            if (angular.isString(field)) {
                                return '"' + field + '"';
                            }
                            return field;
                        });
                    }
                    filter += '"' + k + '": ' + (angular.isArray(v) ? ('[' + v.toString() + ']') : v);
                });
            });
            if (filter) {
                return '{' + filter + '}';
            }
            return '';
        }
    }
})();
