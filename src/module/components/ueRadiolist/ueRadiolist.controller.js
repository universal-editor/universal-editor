(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeRadiolistController', UeRadiolistController);

    function UeRadiolistController($scope, $element, EditEntityStorage, ApiService, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */
        'ngInject';
        var vm = this,
            baseController,
            componentSettings;

        vm.$onInit = function() {
            vm.optionValues = [];
            vm.inputValue = '';
            vm.newEntityLoaded = newEntityLoaded;
            vm.dependUpdate = dependUpdate;
            vm.initDataSource = true;            
            angular.extend(vm, baseController);
            componentSettings = vm.setting.component.settings;
            vm.inline = componentSettings.inline === true;

            baseController = $controller('FieldsController', { $scope: $scope, $element: $element });

            vm.listeners.push($scope.$watch('vm.fieldValue',
                function(value) {
                    if (angular.isNumber(value) && !isNaN(value)) {
                        vm.fieldValue = value.toString();
                    }
                }, true)
            );

            vm.listeners.push($scope.$on('ue:componentDataLoaded', function(e, data) {
                if (vm.isParentComponent(data) && !vm.options.filter && !e.defaultPrevented) {
                    $scope.onLoadDataHandler(e, data);
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

                var url = ApiService.getUrlDepend(componentSettings.valuesRemote.url, {}, dependField, dependValue);
                var config = {
                    method: 'GET',
                    url: url,
                    $id: vm.setting.component.$id,
                    serverPagination: vm.serverPagination
                };
                config.standard = $scope.getParentDataSource().standard;
                ApiService
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