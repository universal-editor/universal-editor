(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeRadiolistController', UeRadiolistController);

    function UeRadiolistController($scope, $element, EditEntityStorage, YiiSoftApiService, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */
        "ngInject";
        var vm = this,
            baseController,
            componentSettings;

        vm.$onInit = function() {
            vm.optionValues = [];
            vm.inputValue = '';
            vm.newEntityLoaded = newEntityLoaded;
            vm.dependUpdate = dependUpdate;

            baseController = $controller('FieldsController', { $scope: $scope });
            angular.extend(vm, baseController);
            componentSettings = vm.setting.component.settings;

            vm.listeners.push($scope.$on('editor:entity_loaded', function(e, data) {
                $scope.onLoadDataHandler(e, data);
                if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {
                    componentSettings.$loadingPromise.then(function(optionValues) {
                        vm.optionValues = optionValues;
                        vm.equalPreviewValue();
                    }).finally(function() {
                        vm.loadingData = false;
                    });
                }
            }));
        };

        function dependUpdate(dependField, dependValue) {
            vm.optionValues = [];
            if (dependValue && dependValue !== '') {
                vm.loadingData = true;

                var url = YiiSoftApiService.getUrlDepend(componentSettings.valuesRemote.url, {}, dependField, dependValue);
                var config = {
                    method: 'GET',
                    url: url
                };                
                config.standard = $scope.getParentDataSource().standard;
                YiiSoftApiService
                    .getUrlResource(config)
                    .then(function(response) {
                        angular.forEach(response.data.items, function(v) {
                            vm.optionValues.push(v);
                        });
                    }, function(reject) {
                        $translate('ERROR.FIELD.VALUES_REMOTE').then(function(translation) {
                            console.error('EditorFieldDropdownController: ' + translation.replace('%name_field', vm.fieldName));
                        });
                    })
                    .finally(function() {
                        vm.loadingData = false;
                    });
            }
        }

        function newEntityLoaded() {
            vm.fieldValue = vm.setting.component.settings.defaultValue || null;
        }
    }
})();