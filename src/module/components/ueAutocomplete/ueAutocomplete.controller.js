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
            componentSettings;

        vm.$onInit = function() {
            vm.optionValues = [];
            angular.extend(vm, $controller('FieldsController', { $scope: $scope }));
            componentSettings = vm.setting.component.settings;

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

            if (!vm.multiple) {
                vm.classInput.width = '99%';
                vm.classInput['padding-right'] = '25px';
            }

            if (vm.options.filter) {
                loadValues();
            }

            vm.listeners.push($scope.$on('editor:entity_loaded', function(event, data) {
                if (!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId && !vm.options.filter) {
                    vm.loadingData = true;
                    $scope.onLoadDataHandler(event, data);
                    componentSettings.$loadingPromise.then(function(optionValues) {
                        vm.optionValues = optionValues;
                        vm.equalPreviewValue();
                    }).finally(function() {
                        vm.loadingData = false;
                    });
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
                            vm.classInput.width = 'initial';
                        }
                    }
                    inputTimeout = $timeout(function() {
                        autocompleteSearch(newValue);
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
        }

        function removeFromSelected(event, obj) {
            if (!vm.multiple) {
                vm.fieldValue = null;
            }
            angular.forEach(vm.selectedValues, function(val, key) {
                if (val[vm.fieldId] == obj[vm.fieldId]) {
                    vm.selectedValues.splice(key, 1);
                    if (!vm.multiple) {
                        vm.placeholder = '';
                    } else {
                        vm.fieldValue.splice(key, 1);
                    }
                }
            });
        }

        /* PRIVATE METHODS */

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
                    if (v.toLowerCase().indexOf(searchString.toLowerCase()) >= 0 && !alreadyIn(obj, vm.selectedValues)) {
                        vm.possibleValues.push(obj);
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
                    method: 'GET',
                    url: componentSettings.valuesRemote.url,
                    $id: vm.setting.component.$id
                };
                config.standard = $scope.getParentDataSource().standard;
                YiiSoftApiService
                    .getUrlResource(config)
                    .then(function(response) {
                        angular.forEach(response.data.items, function(v) {
                            if (!alreadyIn(v, vm.selectedValues) && !alreadyIn(v, vm.possibleValues)) {
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

        function loadValues() {
            vm.preloadedData = false;
            if (componentSettings.hasOwnProperty('values')) {
                angular.forEach(componentSettings.values, function(v, key) {
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
                });
                vm.preloadedData = true;
            } else if (componentSettings.hasOwnProperty('valuesRemote')) {

                if (!vm.fieldValue) {
                    vm.preloadedData = true;
                    return;
                }

                var config = {
                    method: 'GET',
                    url: componentSettings.valuesRemote.url
                };
                config.filter[vm.fieldId] = [{
                    operator: 'value',
                    value: vm.fieldValue,
                    $id: vm.setting.component.$id
                }];
                config.standard = $scope.getParentDataSource().standard;

                YiiSoftApiService
                    .getUrlResource(config)
                    .then(function(response) {
                        angular.forEach(response.data.items, function(v) {
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

        vm.clear = clear;
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
