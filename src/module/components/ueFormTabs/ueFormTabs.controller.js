(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeFormTabsController', UeFormTabsController);

    UeFormTabsController.$inject = ['$scope', '$state', 'EditEntityStorage', '$element'];

    function UeFormTabsController($scope, $state, EditEntityStorage, $element) {
        $element.addClass('ue-form-tabs');
        /* jshint validthis: true */

        var vm = this;
        var pkKey = 'pk' + EditEntityStorage.getLevelChild($state.current.name);
        var pk = $state.params[pkKey];
        var componentSettings = vm.setting.component.settings;

        vm.tabs = [];
        vm.indexTab = 0;
        vm.activateTab = activateTab;
        if (angular.isArray(componentSettings.tabs)) {
            angular.forEach(componentSettings.tabs, function(tab) {
                var newTab = {};
                newTab.label = tab.label;
                newTab.fields = [];
                if (angular.isArray(tab.fields)) {
                    angular.forEach(tab.fields, function(field) {
                        if (angular.isString(field)) {
                            var newField = componentSettings.dataSource.fields.filter(function(k) {
                                return k.name == field;
                            });
                            if (newField.length > 0) {
                                newTab.fields.push(newField[0]);
                            }
                        } else {
                            if (field.component.settings.dataSource === undefined) {
                                field.component.settings.dataSource = componentSettings.dataSource;
                            }
                            newTab.fields.push(field);
                        }
                    });
                }
                vm.tabs.push(newTab);
            });
        }

        function activateTab(indexTab) {
            vm.indexTab = indexTab;
        }
    }
})();