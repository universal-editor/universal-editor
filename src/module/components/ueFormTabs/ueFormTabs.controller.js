(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeFormTabsController', UeFormTabsController);

    function UeFormTabsController($scope, $state, EditEntityStorage, $element) {
        /* jshint validthis: true */
        'ngInject';
        $element.addClass('ue-form-tabs');
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
                    var isAllDisabled = true;
                    if (angular.isArray(tab.fields)) {
                        angular.forEach(tab.fields, function(field) {
                            if (angular.isString(field)) {
                                var newField = componentSettings.dataSource.fields.filter(function(k) {
                                    return k.name == field;
                                })[0];
                                if (newField) {
                                    newTab.fields.push(angular.merge({}, newField));
                                    if (newField.component && newField.component.settings && newField.component.settings.disabled !== true) {
                                        isAllDisabled = false;
                                    }
                                }
                            } else {
                                if (field.component && field.component.settings && field.component.settings.disabled !== true) {
                                    isAllDisabled = false;
                                }
                                if (field.component.settings.dataSource === undefined) {
                                    field.component.settings.dataSource = componentSettings.dataSource;
                                }
                                newTab.fields.push(field);

                            }
                        });
                    }
                    newTab.unVisible = isAllDisabled;
                    vm.tabs.push(newTab);
                });
            }
        };

        function activateTab(indexTab) {
            vm.indexTab = indexTab;
        }
    }
})();