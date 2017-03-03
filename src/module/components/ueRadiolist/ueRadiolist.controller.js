(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeRadiolistController', UeRadiolistController);

    UeRadiolistController.$inject = ['$scope', '$element', 'EditEntityStorage', 'RestApiService', 'FilterFieldsStorage', '$controller'];

    function UeRadiolistController($scope, $element, EditEntityStorage, RestApiService, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */
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
            vm.inline = componentSettings.inline === true;

            vm.listeners.push($scope.$watch('vm.fieldValue',
                function(value) {
                    if(angular.isNumber(value) && !isNaN(value)) {
                        vm.fieldValue = value.toString();
                    }
                }, true)
            );

            vm.listeners.push($scope.$on('editor:entity_loaded', function(e, data) {
                $scope.onLoadDataHandler(e, data);
                if (!data.$parentComponentId || vm.isParentComponent(data.$parentComponentId) && !vm.options.filter) {
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

                var url = RestApiService.getUrlDepend(componentSettings.valuesRemote.url, {}, dependField, dependValue);

                var request = {
                    url: url,
                    $id: vm.setting.component.$id
                };
                RestApiService
                    .getUrlResource(request)
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