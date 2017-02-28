(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeFormTabsController', UeFormTabsController);

    UeFormTabsController.$inject = ['$scope', '$state', 'EditEntityStorage', '$element'];

    function UeFormTabsController($scope, $state, EditEntityStorage, $element) {
        $element.addClass('ue-form-tabs');
        /* jshint validthis: true */

        var vm = this,
            pkKey,
            pk,
            componentSettings;


        vm.$onInit = function() {
            pkKey = 'pk';
            pk = $state.params[pkKey];
            componentSettings = vm.setting.component.settings;

            vm.tabs = [];
            vm.indexTab = 0;
            vm.activateTab = activateTab;
            if (angular.isArray(componentSettings.tabs)) {
                angular.forEach(componentSettings.tabs, function(tab) {
                    var newTab = {};
                    newTab.label = tab.label;
                    newTab.fields = [];
                    var isAllReadonly = true;
                    if (angular.isArray(tab.fields)) {
                        angular.forEach(tab.fields, function(field) {
                            if (angular.isString(field)) {
                                var newField = componentSettings.dataSource.fields.filter(function(k) {
                                    return k.name == field;
                                })[0];
                                if (newField) {
                                    newTab.fields.push(newField);
                                    if (newField.component && newField.component.settings && newField.component.settings.readonly !== true) {
                                        isAllReadonly = false;
                                    }
                                    checkReadonlyEmpty(newField);
                                }
                            } else {
                                if (field.component && field.component.settings && field.component.settings.readonly !== true) {
                                    isAllReadonly = false;
                                }
                                if (field.component.settings.dataSource === undefined) {
                                    field.component.settings.dataSource = componentSettings.dataSource;
                                }
                                checkReadonlyEmpty(field);
                                newTab.fields.push(field);

                            }
                        });
                    }
                    newTab.unVisible = isAllReadonly;
                    vm.tabs.push(newTab);
                });
            }
        };
        function checkReadonlyEmpty(control) {
            if (control.component && control.component.settings && control.component.settings.readonly === true && vm.options.isNewRecord) {
                control.component.settings.unVisible = true;
            }
        }

        function activateTab(indexTab) {
            vm.indexTab = indexTab;
        }
    }
})();