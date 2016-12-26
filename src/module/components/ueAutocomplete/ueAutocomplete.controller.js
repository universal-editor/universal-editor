(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeAutocompleteController', UeAutocompleteController);

    UeAutocompleteController.$inject = ['$scope', '$element', '$document', 'EditEntityStorage', 'RestApiService', '$timeout', 'FilterFieldsStorage', '$controller'];

    function UeAutocompleteController($scope, $element, $document, EditEntityStorage, RestApiService, $timeout, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */
        var vm = this,
            inputTimeout;
        vm.optionValues = [];
        angular.extend(vm, $controller('FieldsController', { $scope: $scope }));
        var componentSettings = vm.setting.component.settings;

        vm.selectedValues = [];
        vm.inputValue = "";
        vm.possibleValues = [];
        vm.activeElement = 0;
        vm.preloadedData = true;
        vm.searching = false;
        vm.maxItemsCount = componentSettings.maxItems || Number.POSITIVE_INFINITY;
        vm.minCount = componentSettings.minCount || 2;
        vm.sizeInput = 1;
        vm.classInput = { 'width': '1px' };
        vm.showPossible = false;

        if (!vm.multiple) {
            vm.classInput.width = '99%';
            vm.classInput['padding-right'] = '25px';
        }

        if (vm.options.filter) {
            loadValues();
        }

        $element.bind("keydown", function(event) {
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

                    possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);

                    if (vm.activeElement < vm.possibleValues.length - 1) {
                        $timeout(function() {
                            vm.activeElement++;
                        }, 0);

                        $timeout(function() {
                            var activeTop = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
                                activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
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

                    possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);

                    if (vm.activeElement > 0) {
                        $timeout(function() {
                            vm.activeElement--;
                        }, 0);

                        $timeout(function() {
                            var activeTop = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
                                activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
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

        /* PUBLIC METHODS */

        vm.addToSelected = function(event, obj) {
            //** if you know only id  of the record            
            if (!vm.multiple) {
                vm.selectedValues = [];
                vm.placeholder = obj[vm.field_search];
                vm.fieldValue = obj[vm.field_id];
            } else {
                vm.fieldValue.push(obj[vm.field_id]);
            }
            vm.selectedValues.push(obj);
            $element.find('.autocomplete-field-search').removeClass('hidden');
            vm.inputValue = "";
            vm.sizeInput = 1;
            vm.possibleValues = [];
            if (event && !vm.multiple) {
                event.stopPropagation();
            }
        };

        vm.removeFromSelected = function(event, obj) {
            if (!vm.multiple) {
                vm.fieldValue = null;
            }
            angular.forEach(vm.selectedValues, function(val, key) {
                if (val[vm.field_id] == obj[vm.field_id]) {
                    vm.selectedValues.splice(key, 1);
                    if (!vm.multiple) {
                        vm.placeholder = '';
                    } else {
                        vm.fieldValue.splice(key, 1);
                    }
                }
            });
        };

        /* PRIVATE METHODS */

        function autocompleteSearch(searchString) {
            vm.error = [];

            if (searchString === "" || searchString.length <= vm.minCount) {
                return;
            }
            vm.searching = true;
            if (componentSettings.hasOwnProperty("values")) {
                angular.forEach(componentSettings.values, function(v, key) {
                    var obj = {};
                    if (angular.isArray(componentSettings.values)) {
                        obj[vm.field_id] = v;
                    } else {
                        obj[vm.field_id] = key;
                    }
                    obj[vm.field_search] = v;
                    if (v.toLowerCase().indexOf(searchString.toLowerCase()) >= 0 && !alreadyIn(obj, vm.selectedValues)) {
                        vm.possibleValues.push(obj);
                    }
                });
                vm.activeElement = 0;
                vm.searching = false;
            } else {
                var urlParam = {};
                urlParam[vm.field_search] = "%" + searchString + "%";
                RestApiService
                    .getUrlResource(componentSettings.valuesRemote.url + "?filter=" + JSON.stringify(urlParam))
                    .then(function(response) {
                        angular.forEach(response.data.items, function(v) {
                            if (!alreadyIn(v, vm.selectedValues) && !alreadyIn(v, vm.possibleValues)) {
                                vm.possibleValues.push(v);
                            }
                        });
                        vm.activeElement = 0;
                        vm.searching = false;
                    }, function(reject) {
                        console.error('EditorFieldAutocompleteController: Не удалось получить значения для поля \"' + vm.fieldName + '\" с удаленного ресурса');
                        vm.searching = false;
                    });
            }
        }

        function alreadyIn(obj, list) {
            if (list) {
                return list.filter(function(v) { return v[vm.field_id] == obj[vm.field_id]; }).length;
            }
            return false;
        }

        function loadValues() {
            vm.preloadedData = false;
            if (componentSettings.hasOwnProperty("values")) {
                angular.forEach(componentSettings.values, function(v, key) {
                    var obj = {};
                    if (Array.isArray(vm.fieldValue) && vm.fieldValue.indexOf(key) >= 0 && vm.multiple) {
                        if (angular.isArray(componentSettings.values)) {
                            obj[vm.field_id] = v;
                        } else {
                            obj[vm.field_id] = key;
                        }
                        obj[vm.field_search] = v;
                        vm.selectedValues.push(obj);
                    } else if ((vm.fieldValue == key || vm.fieldValue == v) && !vm.multiple) {
                        if (angular.isArray(componentSettings.values)) {
                            obj[vm.field_id] = v;
                        } else {
                            obj[vm.field_id] = key;
                        }
                        obj[vm.field_search] = v;
                        vm.selectedValues.push(obj);
                        vm.placeholder = obj[vm.field_search];
                    }
                });
                vm.preloadedData = true;
            } else if (componentSettings.hasOwnProperty('valuesRemote')) {

                if (!vm.fieldValue) {
                    vm.preloadedData = true;
                    return;
                }

                var urlParam = {};
                if (angular.isArray(vm.fieldValue)) {
                    urlParam[vm.field_id] = vm.fieldValue;
                } else {
                    urlParam[vm.field_id] = [];
                    urlParam[vm.field_id].push(vm.fieldValue);
                }

                RestApiService
                    .getUrlResource(componentSettings.valuesRemote.url + '?filter=' + JSON.stringify(urlParam))
                    .then(function(response) {
                        angular.forEach(response.data.items, function(v) {
                            if (Array.isArray(vm.fieldValue) &&
                                (vm.fieldValue.indexOf(v[vm.field_id]) >= 0 || vm.fieldValue.indexOf(String(v[vm.field_id])) >= 0) &&
                                vm.multiple && !alreadyIn(v, vm.selectedValues)
                            ) {
                                vm.selectedValues.push(v);
                            } else if (vm.fieldValue == v[vm.field_id] && !vm.multiple) {
                                vm.selectedValues.push(v);
                                vm.placeholder = v[vm.field_search];
                            }

                        });
                        vm.preloadedData = true;
                    }, function(reject) {
                        vm.preloadedData = true;
                        console.error('EditorFieldAutocompleteController: Не удалось получить значения для поля \"' + vm.fieldName + '\" с удаленного ресурса');
                    });
            } else {
                vm.preloadedData = true;
                console.error('EditorFieldAutocompleteController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
            }
        }

        vm.focusPossible = function(isActive) {
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
        };

        vm.deleteToAutocomplete = function(event) {
            if (event.which == 8 &&
                !!vm.selectedValues &&
                !!vm.selectedValues.length &&
                !vm.inputValue &&
                vm.multiple
            ) {
                vm.removeFromSelected(event, vm.selectedValues[vm.selectedValues.length - 1]);
            }
        };

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
            vm.inputValue = "";
            vm.sizeInput = 1;
            vm.selectedValues = [];
            vm.placeholder = '';
        }
    }
})();
