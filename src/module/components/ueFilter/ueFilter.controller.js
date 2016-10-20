(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeFilterController', UeFilterController);

    UeFilterController.$inject = ['$scope', '$rootScope', '$element', 'EditEntityStorage', 'RestApiService', '$timeout', 'FilterFieldsStorage'];

    function UeFilterController($scope, $rootScope, $element, EditEntityStorage, RestApiService, $timeout, FilterFieldsStorage) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;
        var settings = vm.setting.component.settings;
        vm.visiable = false;

        vm.header = settings.header;

        vm.body = [];

        angular.forEach(settings.dataSource.fields, function(field) {
            if (field.component.hasOwnProperty("settings") && (!settings.fields || ~settings.fields.indexOf(field.name))) {
                var fieldSettings = field.component.settings;
                if (field.component.settings) {
                    fieldSettings.$parentScopeId = settings.$parentScopeId;
                }

                var group = {
                    label: fieldSettings.label,
                    operators: [],
                    filters: [{
                        field: field,
                        parameters: {
                            operator: '%:text%',
                            index: 0
                            ///-- TODO list of operators  
                        }
                    }]
                };

                /** convert to filter object from fields*/
                fieldSettings.$toFilter = fieldSettings.$toFilter || function(operator, fieldValue) {
                    angular.forEach(fieldValue, function(value, key) {
                        if (operator && operator.indexOf(":text") !== -1) {
                            if (value && (!angular.isObject(value) || !$.isEmptyObject(value))) {
                                fieldValue[key] = operator.replace(':text', value);
                            }
                            if (value === undefined || value === null || value === '' || (angular.isObject(value) && $.isEmptyObject(value))) {
                                delete fieldValue[key];
                            }
                        } else {
                            if (value) {
                                fieldValue[operator + key] = fieldValue[key];
                            }
                            delete fieldValue[key];
                        }
                    });
                    return fieldValue;
                };

                /** parse filter objects with operators*/
                fieldSettings.$parseFilter = function(vm, filterValue) {
                    var componentSettings = vm.setting.component.settings;
                    var parentScopeId = vm.parentEntityScopeId;
                    var output = {};
                    angular.forEach(filterValue, function(value, key) {
                        //** delete operators from keys and value property
                        if (angular.isString(value)) {
                            value = value.replace(/^%/, '').replace(/%$/, '');
                        }
                        if (angular.isString(key)) {
                            key = key.replace(/^\>\=/, '').replace(/^\<\=/, '');
                        }

                        /** for date is required convert into date-type (at this moment we have two fields of date) */
                        if (field.component.settings.$fieldType === 'date') {
                            output[key] = output[key] || [];
                            output[key].push(moment.utc(value));
                        } else {
                            if (field.component.settings.$fieldType === 'array') {
                                output[key] = value.split(',');
                            } else {
                                output[key] = value;
                            }
                        }
                    });
                    var value = output[vm.fieldName];
                    if (componentSettings.values || componentSettings.remoteValues) {
                        if (vm.field_id && value) {
                            if (angular.isArray(value)) {
                                vm.fieldValue = value;
                            } else {
                                vm.fieldValue = {};
                                vm.fieldValue[vm.field_id] = value;
                                if (vm.addToSelected) {
                                    vm.addToSelected(null, vm.fieldValue);
                                }
                            }
                        }
                    } else {
                        if (angular.isArray(value)) {
                            vm.fieldValue = value[vm.filterParameters.index];
                        } else {
                            vm.fieldValue = value;
                        }
                    }
                    $timeout(function() {
                        if (!FilterFieldsStorage.getFilterQueryObject(parentScopeId)) {
                            console.log("Filter calculate.");
                            FilterFieldsStorage.calculate(parentScopeId);
                            $rootScope.$broadcast('editor:read_entity_' + parentScopeId);
                        }
                    }, 0);
                    return output;
                };

                /* custom logic for operators */

                if (~['ue-select', 'ue-autocomplete', 'ue-checkbox', 'ue-radiolist', 'ue-colorpicker'].indexOf(field.component.name)) {
                    group.filters[0].parameters.operator = ":text";
                }

                if (~['ue-date', 'ue-time', 'ue-datetime'].indexOf(field.component.name)) {
                    group.filters[0].ngStyle = "display: inline-block; width: 25%; margin-left: 5px;";
                    group.filters[0].parameters.operator = ">=";
                    var cloneField = angular.copy(field);
                    group.filters.push({
                        field: cloneField,
                        parameters: {
                            operator: '<=',
                            index: 1
                        },
                        ngStyle: 'display: inline-block; width: 25%; margin-left: 20px;'
                    });
                }

                vm.body.push(group);
            }
        });

        vm.footer = [];
        if (!settings.footer || !settings.footer.controls) {
            settings.footer = {
                controls: [
                    {
                        component: {
                            name: 'ue-button-filter',
                            settings: {
                                $parentScopeId: settings.$parentScopeId,
                                $groups: vm.body,
                                label: 'Применить',
                                action: 'send'
                            }
                        }
                    },
                    {
                        component: {
                            name: 'ue-button-filter',
                            settings: {
                                $parentScopeId: settings.$parentScopeId,
                                label: 'Очистить',
                                action: 'clear'
                            }
                        }
                    }
                ]
            };
        }
        if (settings.footer && settings.footer.controls) {
            angular.forEach(settings.footer.controls, function(control) {
                var controlSetting = control.component.settings;
                if (controlSetting) {
                    controlSetting.$parentScopeId = settings.$parentScopeId;
                    controlSetting.$groups = vm.body;
                }
                vm.footer.push(control);
            });
        }

        vm.toggleFilterVisibility = function() {
            vm.visiable = !vm.visiable;
        };

        $element.on('$destroy', function() {
            $scope.$destroy();
        });
    }
})();