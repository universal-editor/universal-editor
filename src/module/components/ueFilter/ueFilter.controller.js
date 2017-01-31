(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeFilterController', UeFilterController);

    UeFilterController.$inject = ['$scope', '$rootScope', '$element', 'EditEntityStorage', 'RestApiService', '$timeout', 'FilterFieldsStorage', '$compile', '$document'];

    function UeFilterController($scope, $rootScope, $element, EditEntityStorage, RestApiService, $timeout, FilterFieldsStorage, $compile, $document) {
        /* jshint validthis: true */
        var vm = this,
            settings,
            fieldErrorName;

        vm.$onInit = function () {
            var elementParent = vm.options.getParentElement().parents('.grid-toolbar');//.parent().find('.grid-filter-edit');
            var templateEditorFilter = $compile('<div class="editor-filter" data-ng-hide="!vm.visiable"><div class="editor-filter-wrapper" ng-keyup="vm.clickEnter($event)">' +
                '<div class="editor-filter-body"><div class="filter-content-wrapper" ng-repeat="group in vm.body track by $index">' +
                '<label class="filter-name-label" ng-bind="group.label" title="{{group.label}}"></label>' +
                '<component-wrapper ng-repeat="filter in group.filters" data-setting="filter.field" data-options="filter.options" style="{{filter.ngStyle}};"></component-wrapper>' +
                '</div></div><div class="editor-filter-footer"><component-wrapper data-ng-repeat="button in vm.footer track by $index" data-setting="button" data-options="vm.options" data-button-class="header">' +
                '</component-wrapper></div></div></div>')($scope);

            if (elementParent.length !== 0 && elementParent.parent().find('.grid-filter-edit').length !== 0) {
                var el = elementParent.parent().find('.grid-filter-edit');
                el.addClass('filter-component');
                el.append(templateEditorFilter);
            } else {
                $element.find('.filter-component').append(templateEditorFilter);
            }


            settings = vm.setting.component.settings;
            vm.visiable = false;
            vm.header = settings.header;
            vm.body = [];

            angular.forEach(settings.dataSource.fields, function (field) {
                if (field.component.hasOwnProperty('settings') && (!settings.fields || ~settings.fields.indexOf(field.name)) && field.component.settings.filterable !== false) {
                    var fieldSettings = field.component.settings;


                    var group = {
                        label: fieldSettings.label,
                        operators: [],
                        filters: [{
                            field: field,
                            options: {
                                filterParameters: {
                                    operator: '%:text%',
                                    index: 0
                                },
                                filter: true,
                                $parentComponentId: vm.options.$parentComponentId,
                                paramsPefix: vm.options.prefixGrid
                            }
                        }]
                    };

                    /** convert to filter object from fields*/
                    fieldSettings.$toFilter = fieldSettings.$toFilter || function (operator, fieldValue) {
                            angular.forEach(fieldValue, function (value, key) {
                                if (operator && operator.indexOf(':text') !== -1) {
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
                    fieldSettings.$parseFilter = function (model, filterValue) {
                        var componentSettings = model.setting.component.settings;
                        var parentComponentId = model.parentComponentId;
                        var output = {};
                        angular.forEach(filterValue, function (value, key) {
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
                                output[key].push(moment.utc(value, model.format));
                            } else {
                                output[key] = value;
                            }
                        });
                        var value = output[model.fieldName];
                        if (angular.isArray(value)) {
                            value = value[model.options.filterParameters.index];
                        }
                        if (field.component.settings.$fieldType === 'array') {
                            if (!angular.isString(value)) {
                                value  = value.toString();
                            }
                            model.fieldValue = value.split(',');
                        } else {
                            model.fieldValue = value;
                            if (model.addToSelected && value) {
                                model.fieldValue = {};
                                model.fieldValue[model.field_id] = value;
                                model.addToSelected(null, model.fieldValue);
                            }
                        }
                        $timeout(function () {
                            var paramName = vm.options.prefixGrid ? vm.options.prefixGrid + '-filter' : 'filter';
                            if (!FilterFieldsStorage.getFilterQueryObject(paramName)) {
                                FilterFieldsStorage.calculate(parentComponentId, paramName);
                                $rootScope.$broadcast('editor:read_entity', model.options);
                                vm.visiable = true;
                            }
                        }, 0);
                        return output;
                    };

                    /*temprory custom logic for operators */

                    if (~['ue-dropdown', 'ue-autocomplete', 'ue-checkbox', 'ue-radiolist', 'ue-colorpicker'].indexOf(field.component.name)) {
                        group.filters[0].options.filterParameters.operator = ':text';
                    }

                    if (~['ue-date', 'ue-time', 'ue-datetime'].indexOf(field.component.name)) {
                        group.filters[0].ngStyle = 'display: inline-block; width: 25%; margin-left: 5px;';
                        group.filters[0].options.filterParameters.operator = '>=';
                        var cloneField = angular.copy(field);
                        group.filters.push({
                            field: cloneField,
                            options: {
                                filterParameters: {
                                    operator: '<=',
                                    index: 1
                                },
                                filter: true,
                                $parentComponentId: vm.options.$parentComponentId
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
                                    label: 'Очистить',
                                    action: 'clear'
                                }
                            }
                        }
                    ]
                };
            }

            if (settings.footer && settings.footer.controls) {
                angular.forEach(settings.footer.controls, function (control) {
                    vm.footer.push(control);
                });
            }

            vm.toggleFilterVisibility = toggleFilterVisibility;
        };

        function toggleFilterVisibility() {
            vm.visiable = !vm.visiable;
        }

        $element.on('$destroy', function () {
            $scope.$destroy();
        });
    }
})();