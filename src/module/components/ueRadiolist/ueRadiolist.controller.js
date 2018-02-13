(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeRadiolistController', UeRadiolistController);

    function UeRadiolistController($scope, $element, EditEntityStorage, ApiService, FilterFieldsStorage, $controller, $q) {
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

            componentSettings = vm.setting.component.settings;
            let remotePropertiesContainer = componentSettings.valuesRemote || componentSettings;

            vm.inline = componentSettings.inline === true;

            baseController = $controller('FieldsController', { $scope: $scope, $element: $element });
            angular.extend(vm, baseController);

            delete vm.inputLeave;

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
                    if (remotePropertiesContainer && remotePropertiesContainer.$loadingPromise) {
                        remotePropertiesContainer.$loadingPromise.then(function(optionValues) {
                            vm.optionValues = optionValues;
                            vm.equalPreviewValue();
                        }).finally(function() {
                            vm.loadingData = false;
                        });
                    }
                }
            }));
        };

        function dependUpdate(dependField, dependValue) {
            if (dependValue && dependValue !== '') {
                vm.loadingData = true;
                if (!remotePropertiesContainer.$loadingPromise || remotePropertiesContainer.$loadingPromise.$$state !== 0) {
                    remotePropertiesContainer.$loadingPromise = depend();
                } else {
                    remotePropertiesContainer.$loadingPromise.then(depend);
                }

                function depend() {
                    var defer = $q.defer();
                    let candidates = ApiService.getFromStorage(vm.setting, null, { dependValue: dependValue });
                    if (!candidates) {
                        var url = ApiService.getUrlDepend(componentSettings.valuesRemote.url, {}, dependField, dependValue);
                        var config = {
                            url: url,
                            method: 'GET',
                            $id: vm.setting.component.$id,
                            serverPagination: vm.serverPagination,
                            standard: $scope.getParentDataSource().standard
                        };

                        ApiService
                            .getUrlResource(config)
                            .then(function(response) {
                                vm.optionValues = [];
                                angular.forEach(response.data.items, function(v) {
                                    vm.optionValues.push(v);
                                });
                                if (vm.optionValues.length === 0) {
                                    vm.clear();
                                }
                                ApiService.saveToStorage(vm.setting, response.data.items, { dependValue: dependValue });
                                defer.resolve(response.data.items);
                            }, function(reject) {
                                $translate('ERROR.FIELD.VALUES_REMOTE').then(function(translation) {
                                    console.error('EditorFieldDropdownController: ' + translation.replace('%name_field', vm.fieldName));
                                });
                                defer.reject(reject);
                            })
                            .finally(function() {
                                vm.loadingData = false;
                            });
                    } else {
                        vm.optionValues = [];
                        angular.forEach(candidates, function(v) {
                            vm.optionValues.push(v);
                        });
                        if (vm.optionValues.length === 0) {
                            vm.clear();
                        }
                        vm.loadingData = false;
                        defer.resolve(candidates);
                    }
                    return defer.promise;
                }
            } else {
                vm.optionValues = [];
                vm.fieldValue = vm.multiple ? [] : null;
            }
        }

        function newEntityLoaded() {
            vm.fieldValue = vm.setting.component.settings.defaultValue || null;
        }
    }
})();