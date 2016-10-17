(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeFilterController', UeFilterController);

    UeFilterController.$inject = ['$scope', '$element','EditEntityStorage', 'RestApiService'];

    function UeFilterController($scope, $element, EditEntityStorage, RestApiService) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;
        var settings = vm.setting.component.settings;
        vm.visiable = false;

        vm.header = settings.header;

        vm.body = [];

        angular.forEach(settings.dataSource.fields, function(field) {
            if (field.component.hasOwnProperty("settings") && (~settings.fields.indexOf(field.name))) {
                var fieldSettings = field.component.settings;
                if(field.component.settings) {
                    fieldSettings.$parentScopeId = settings.$parentScopeId;
                }

                fieldSettings.$filterOperator = "%:text%"; //-- !!!  TODO
                fieldSettings.$toFilter = function(operator, fieldValue) {
                    angular.forEach(fieldValue, function(value, key) {
                        if (operator && operator.indexOf(":text") !== -1 && operator !== ':text' && angular.isString(value)) {
                            fieldValue[key] = operator.replace(':text', value);
                        } else {
                            fieldValue[operator + key] = fieldValue[key];
                            delete fieldValue[key];
                        }
                    });
                };
                
                var group = {
                    label: fieldSettings.label,
                    filters: [{
                        field: field,
                        operators: []       ///-- TODO list of operators                
                    }]
                };

                //-- custom temrory logic for date
                if (~['ue-date', 'ue-time', 'ue-datetime'].indexOf(field.component.name)) {
                    group.filters[0].ngStyle = "display: inline-block; width: 25%; margin-left: 5px;";
                    group.filters[0].field.component.settings.$filterOperator = ">=";
                    var cloneField = angular.copy(field);
                    cloneField.component.settings.$filterOperator = "<=";
                    group.filters.push({
                        field: cloneField,
                        operator: [],
                        ngStyle: 'display: inline-block; width: 25%; margin-left: 20px;'
                    });
                }

                vm.body.push(group);
            }
        });

        vm.footer = [];
        if (!settings.footer.controls) {
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
                if(control.component.settings) {
                    control.component.settings.$parentScopeId = settings.$parentScopeId;
                    control.component.settings.$groups = vm.body;
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