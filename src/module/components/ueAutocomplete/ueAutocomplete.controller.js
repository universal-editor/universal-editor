(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeAutocompleteController', UeAutocompleteController);

    function UeAutocompleteController($scope, $element, $document, EditEntityStorage, YiiSoftApiService, $timeout, FilterFieldsStorage, $controller, $translate) {
        "ngInject";
        /* jshint validthis: true */
        var vm = this,
            inputTimeout,
            componentSettings,
            selectedStorageComponent = [];

        vm.$onInit = function() {
            vm.optionValues = [];
            angular.extend(vm, $controller('FieldsController', { $scope: $scope }));
            componentSettings = vm.setting.component.settings;
            if (componentSettings.valuesRemote) {
                selectedStorageComponent = componentSettings.valuesRemote.$selectedStorage;
            } else if (componentSettings.values) {
                selectedStorageComponent = componentSettings.values.$selectedStorage;
            }

            vm.selectedValues = [];
            vm.inputValue = '';
            vm.possibleValues = [];
            vm.activeElement = 0;
            vm.preloadedData = true;
            vm.searching = false;
            vm.maxItemsCount = componentSettings.maxItems || Number.POSITIVE_INFINITY;
            vm.minCount = componentSettings.minCount || 2;
            vm.sizeInput = 1;
            vm.classInput = { 'width': '1px' };
            vm.showPossible = false;

            vm.addToSelected = addToSelected;
            vm.removeFromSelected = removeFromSelected;
            vm.focusPossible = focusPossible;
            vm.deleteToAutocomplete = deleteToAutocomplete;
            vm.loadDataById = loadDataById;
            vm.clear = clear;

            if (!vm.multiple) {
                vm.classInput.width = '99%';
                vm.classInput['padding-right'] = '25px';
            }

            vm.listeners.push($scope.$on('ue:componentDataLoaded', function(event, data) {
                if (vm.isParentComponent(data) && !vm.options.filter && !event.defaultPrevented) {
                    vm.loadingData = true;                    
                    $scope.onLoadDataHandler(event, data);
                    if (!vm.options.isSendRequest) {
                        vm.loadDataById(vm.fieldValue).then(function() {
                            vm.equalPreviewValue();
                        }).finally(function() {
                            vm.loadingData = false;
                        });
                    } else {
                        vm.loadingData = false;
                    }
                }
            }));

            vm.listeners.push($scope.$watch(function() {
                return vm.inputValue;
            }, function(newValue) {
                if (newValue) {
                    if (inputTimeout) {
                        $timeout.cancel(inputTimeout);
                    }
                    vm.showPossible = true;
                    vm.possibleValues = [];
                    if (vm.multiple) {
                        vm.sizeInput = newValue.length || 1;
                        if (vm.sizeInput === 1 && (newValue.length != 1)) {
                            vm.classInput.width = '1px';
                        } else {
                            vm.classInput.width = '100%';
                        }
                    }
                    inputTimeout = $timeout(function() {
                        vm.autocompleteSearch(newValue);
                    }, 300);
                }
            }, true));
        };

        $element.bind('keydown', function(event) {
            var possibleValues;
            switch (event.which) {
                case 13:
                    event.preventDefault();
                    if (vm.possibleValues.length < 1) {
                        break;
                    }

                    $timeout(function() {
                        vm.addToSelected(event, vm.possibleValues[vm.activeElement]);
                    }, 0);

                    break;
                case 40:
                    event.preventDefault();
                    if (vm.possibleValues.length < 1) {
                        break;
                    }

                    possibleValues = angular.element($element[0].getElementsByClassName('possible-scroll')[0]);

                    if (vm.activeElement < vm.possibleValues.length - 1) {
                        $timeout(function() {
                            vm.activeElement++;
                        }, 0);

                        $timeout(function() {
                            var activeTop = angular.element(possibleValues[0].getElementsByClassName('active')[0])[0].offsetTop,
                                activeHeight = angular.element(possibleValues[0].getElementsByClassName('active')[0])[0].clientHeight,
                                wrapperScroll = possibleValues[0].scrollTop,
                                wrapperHeight = possibleValues[0].clientHeight;

                            if (activeTop >= (wrapperHeight + wrapperScroll - activeHeight)) {
                                possibleValues[0].scrollTop += activeHeight + 1;
                            }
                        }, 1);
                    }
                    break;
                case 38:
                    event.preventDefault();
                    if (vm.possibleValues.length < 1) {
                        break;
                    }

                    possibleValues = angular.element($element[0].getElementsByClassName('possible-scroll')[0]);

                    if (vm.activeElement > 0) {
                        $timeout(function() {
                            vm.activeElement--;
                        }, 0);

                        $timeout(function() {
                            var activeTop = angular.element(possibleValues[0].getElementsByClassName('active')[0])[0].offsetTop,
                                activeHeight = angular.element(possibleValues[0].getElementsByClassName('active')[0])[0].clientHeight,
                                wrapperScroll = possibleValues[0].scrollTop,
                                wrapperHeight = possibleValues[0].clientHeight;

                            if (activeTop < wrapperScroll) {
                                possibleValues[0].scrollTop -= activeHeight + 1;
                            }
                        }, 1);
                    }
                    break;
            }
        });

        /* PUBLIC METHODS */

        function addToSelected(event, obj) {
            //** if you know only id  of the record            
            if (!vm.multiple) {
                vm.selectedValues = [];
                vm.placeholder = obj[vm.fieldSearch];
                vm.fieldValue = obj[vm.fieldId];
            } else {
                vm.fieldValue.push(obj[vm.fieldId]);
            }
            vm.selectedValues.push(obj);
            $element.find('.autocomplete-field-search').removeClass('hidden');
            vm.inputValue = '';
            vm.sizeInput = 1;
            vm.possibleValues = [];
            if (event && !vm.multiple) {
                event.stopPropagation();
            }
            vm.equalPreviewValue();
        }

        function removeFromSelected(event, obj) {
            if (!vm.multiple) {
                clear();
            } else {
                angular.forEach(vm.selectedValues, function(val, key) {
                    if (val[vm.fieldId] == obj[vm.fieldId]) {
                        vm.selectedValues.splice(key, 1);
                        vm.fieldValue.splice(key, 1);
                    }
                });
            }
            vm.equalPreviewValue();
        }

        /* PRIVATE METHODS */
        vm.autocompleteSearch = autocompleteSearch;
        vm.alreadyIn = alreadyIn;

        function autocompleteSearch(searchString) {
            vm.error = [];
            if (searchString === '' || searchString.length <= vm.minCount) {
                return;
            }
            vm.searching = true;
            if (componentSettings.hasOwnProperty('values')) {
                angular.forEach(componentSettings.values, function(v, key) {
                    var obj = {};
                    if (angular.isArray(componentSettings.values)) {
                        obj[vm.fieldId] = v;
                    } else {
                        obj[vm.fieldId] = key;
                    }
                    obj[vm.fieldSearch] = v;
                    if (angular.isString(v)) {
                        if (v.toLowerCase().indexOf(searchString.toLowerCase()) >= 0 && !alreadyIn(obj, vm.selectedValues) && selectedStorageComponent.indexOf(obj[vm.fieldId]) === -1) {
                            vm.possibleValues.push(obj);
                        }
                    }
                });
                vm.activeElement = 0;
                vm.searching = false;
            } else {
                var urlParam = {};
                urlParam.filter = {};
                urlParam.filter[vm.fieldSearch] = "%" + searchString + "%";

                var url = YiiSoftApiService.getUrlDepend(componentSettings.valuesRemote.url, urlParam, vm.depend, vm.dependValue);
                var config = {
                    url: url,
                    method: 'GET',
                    $id: vm.setting.component.$id,
                    serverPagination: vm.serverPagination
                };
                config.standard = $scope.getParentDataSource().standard;
                YiiSoftApiService
                    .getUrlResource(config)
                    .then(function(response) {
                        angular.forEach(response.data.items, function(v) {
                            if (!alreadyIn(v, vm.selectedValues) && !alreadyIn(v, vm.possibleValues) && selectedStorageComponent.indexOf(v[vm.fieldId]) === -1) {
                                vm.possibleValues.push(v);
                            }
                        });
                        vm.activeElement = 0;
                        vm.searching = false;
                    }, function(reject) {
                        $translate('ERROR.FIELD.VALUES_REMOTE').then(function(translation) {
                            console.error('EditorFieldAutocompleteController: ' + translation.replace('%name_field', vm.fieldName));
                        });
                        vm.searching = false;
                    });
            }
        }

        function alreadyIn(obj, list) {
            if (list) {
                return list.filter(function(v) {
                    return v[vm.fieldId] == obj[vm.fieldId];
                }).length;
            }
            return false;
        }

        function fillControl(options) {
            angular.forEach(options, function(v) {
                if (Array.isArray(vm.fieldValue) &&
                    (vm.fieldValue.indexOf(v[vm.fieldId]) >= 0 || vm.fieldValue.indexOf(String(v[vm.fieldId])) >= 0) &&
                    vm.multiple && !alreadyIn(v, vm.selectedValues)
                ) {
                    vm.selectedValues.push(v);
                } else if (vm.fieldValue == v[vm.fieldId] && !vm.multiple) {
                    vm.selectedValues.push(v);
                    vm.placeholder = v[vm.fieldSearch];
                }
            });
        }

        function loadValues() {
            vm.preloadedData = false;
            if (componentSettings.hasOwnProperty('values')) {
                angular.forEach(componentSettings.values, function(v, key) {
                    if (angular.isString(v)) {
                        var obj = {};
                        if (Array.isArray(vm.fieldValue) && vm.fieldValue.indexOf(key) >= 0 && vm.multiple) {
                            if (angular.isArray(componentSettings.values)) {
                                obj[vm.fieldId] = v;
                            } else {
                                obj[vm.fieldId] = key;
                            }
                            obj[vm.fieldSearch] = v;
                            vm.selectedValues.push(obj);
                        } else if ((vm.fieldValue == key || vm.fieldValue == v) && !vm.multiple) {
                            if (angular.isArray(componentSettings.values)) {
                                obj[vm.fieldId] = v;
                            } else {
                                obj[vm.fieldId] = key;
                            }
                            obj[vm.fieldSearch] = v;
                            vm.selectedValues.push(obj);
                            vm.placeholder = obj[vm.fieldSearch];
                        }
                    }
                });
                vm.preloadedData = true;
            } else if (componentSettings.hasOwnProperty('valuesRemote')) {

                if (!vm.fieldValue) {
                    vm.preloadedData = true;
                    return;
                }

                var config = {
                    method: 'GET',
                    url: componentSettings.valuesRemote.url,
                    $id: vm.setting.component.$id,
                    serverPagination: vm.serverPagination
                };
                config.filter[vm.fieldId] = [{
                    operator: 'value',
                    value: vm.fieldValue
                }];
                config.standard = $scope.getParentDataSource().standard;

                YiiSoftApiService
                    .getUrlResource(config)
                    .then(function(response) {
                        fillControl(response.data.items);
                        vm.preloadedData = true;
                    }, function(reject) {
                        vm.preloadedData = true;
                        $translate('ERROR.FIELD.VALUES_REMOTE').then(function(translation) {
                            console.error('EditorFieldAutocompleteController: ' + translation.replace('%name_field', vm.fieldName));
                        });
                    });
            } else {
                vm.preloadedData = true;
                $translate('ERROR.FIELD.NOT_TYPE_VALUE').then(function(translation) {
                    console.error('EditorFieldAutocompleteController: ' + translation);
                });
            }
        }

        function loadDataById(ids) {
            var config = {
                method: 'GET',
                url: componentSettings.valuesRemote.url,
                $id: vm.setting.component.$id,
                serverPagination: vm.serverPagination
            };

            config.filter = config.filter || {};
            config.filter[vm.fieldId] = [{
                operator: 'value',
                value: ids
            }];

            config.filter = config.filter || {};
            config.filter[vm.fieldId] = [{
                operator: 'value',
                value: ids
            }];

            config.standard = $scope.getParentDataSource().standard;

            return YiiSoftApiService
                .getUrlResource(config)
                .then(function(response) {
                    angular.forEach(response.data.items, function(v) {
                        if (angular.isArray(vm.fieldValue) &&
                            (vm.fieldValue.indexOf(v[vm.fieldId]) >= 0 || vm.fieldValue.indexOf(String(v[vm.fieldId])) >= 0) &&
                            vm.multiple && !alreadyIn(v, vm.selectedValues)
                        ) {
                            vm.selectedValues.push(v);
                        } else if (vm.fieldValue == v[vm.fieldId] && !vm.multiple) {
                            vm.selectedValues.push(v);
                            vm.placeholder = v[vm.fieldSearch];
                        }
                    });
                    if (!vm.optionValues.length) {
                        vm.optionValues = angular.copy(vm.selectedValues);
                    }
                }).finally(function() { vm.preloadedData = true; });
        }

        function focusPossible(isActive) {
            vm.isActivePossible = isActive;
            if (!isActive) {
                vm.showPossible = false;
            }
            if (!vm.multiple) {
                if ($element.find('.autocomplete-item').length > 0) {
                    if (isActive) {
                        $element.find('.autocomplete-field-search').removeClass('hidden');
                        $element.find('.autocomplete-item').addClass('opacity-item');
                    } else {
                        $element.find('.autocomplete-field-search').addClass('hidden');
                        $element.find('.autocomplete-item').removeClass('opacity-item');
                    }
                }
            }
        }

        function deleteToAutocomplete(event) {
            if (event.which == 8 && !!vm.selectedValues && !!vm.selectedValues.length && !vm.inputValue &&
                vm.multiple
            ) {
                vm.removeFromSelected(event, vm.selectedValues[vm.selectedValues.length - 1]);
            }
        }

        this.$postLink = function() {

            $scope.inputFocus = function() {
                if (!vm.multiple) {
                    $element.find('.autocomplete-field-search').removeClass('hidden');
                    $element.find('.autocomplete-item').addClass('opacity-item');
                }
                vm.showPossible = true;
                $element.find('input')[0].focus();
            };

            $element.on('$destroy', function() {
                $scope.$destroy();
            });
        };

        function clear() {
            vm.fieldValue = vm.multiple ? [] : null;
            $element.find('.autocomplete-field-search').removeClass('hidden');
            vm.inputValue = '';
            vm.sizeInput = 1;
            vm.selectedValues = [];
            vm.placeholder = '';
        }
    }
})();
