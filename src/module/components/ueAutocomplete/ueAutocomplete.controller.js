(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeAutocompleteController', UeAutocompleteController);

    function UeAutocompleteController($scope, $element, $document, EditEntityStorage, ApiService, $timeout, FilterFieldsStorage, $controller, $translate, $q) {
        'ngInject';
        /* jshint validthis: true */
        var vm = this,
            inputTimeout,
            componentSettings,
            selectedStorageComponent = [];

        vm.$onInit = function() {
            vm.optionValues = [];
            angular.extend(vm, $controller('FieldsController', { $scope: $scope, $element: $element }));
            delete vm.inputLeave;
            componentSettings = vm.setting.component.settings;
            if (componentSettings.valuesRemote) {
                selectedStorageComponent = componentSettings.valuesRemote.$selectedStorage;
            } else if (componentSettings.values) {
                selectedStorageComponent = componentSettings.values.$selectedStorage;
            }
            vm.$id = vm.setting.component.$id;
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
            vm.fillControl = fillControl;
            vm.draggable = componentSettings.draggable === true;

            vm.addToSelected = addToSelected;
            vm.insertToSelectedCollection = insertToSelectedCollection;
            vm.removeFromSelected = removeFromSelected;
            vm.focusPossible = focusPossible;
            vm.deleteToAutocomplete = deleteToAutocomplete;
            vm.loadDataById = loadDataById;
            vm.clear = clear;
            vm.moved = function(i) {
                vm.selectedValues.splice(i, 1);
                vm.fieldValue.splice(0);
                angular.forEach(vm.selectedValues, function(value) {
                    if (vm.fieldId) {
                        vm.fieldValue.push(value[vm.fieldId]);
                    }
                });
            };
            vm.drop = function(item) {
                return item;
            };


            if (!vm.multiple) {
                vm.classInput.width = '99%';
                vm.classInput['padding-right'] = '25px';
            }
            vm.dragOver = function(event) {
                var target = $(event.target).closest('.autocomplete-input-wrapper'),
                    dragging = target.find('.dndDragging.dndDraggingSource .autocomplete-item');
                target.find('.dndPlaceholder .autocomplete-item').width(dragging.width());
                return true;
            };

            vm.listeners.push($scope.$on('ue:componentDataLoaded', function(event, data) {
                if (vm.isParentComponent(data) && !vm.options.filter && !event.defaultPrevented) {
                    vm.loadingData = true;
                    $scope.onLoadDataHandler(event, data);
                    if (!vm.isSendRequest && needRequested()) {
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

            function needRequested() {
                var values = !angular.isArray(vm.fieldValue) ? [vm.fieldValue] : vm.fieldValue;
                return values.some(function(value) {
                    return value !== null && value !== undefined && !vm.selectedValues.some(
                        function(selected) { return (angular.isObject(value) ? value[vm.fieldId] : value) == selected[vm.fieldId]; });
                });
            }
            if (componentSettings.mode !== 'preview') {
                vm.listeners.push($scope.$watch(function() {
                    return vm.inputValue;
                }, function(newValue) {
                    if (vm.multiple) {
                        var input = $element.find('input'), spanValue = newValue || '';
                        if (vm.placeholder && !spanValue) {
                            spanValue = vm.placeholder;
                        }
                        var $span = $('<span>').append(spanValue).appendTo('body');
                        vm.classInput.width = ($span.width() + 10) + 'px';
                        $span.remove();
                    }
                    if (newValue) {
                        vm.sizeInput = newValue.length || 1;
                        if (inputTimeout) {
                            $timeout.cancel(inputTimeout);
                        }
                        if (newValue) {
                            vm.sizeInput = newValue.length || 1;
                            if (inputTimeout) {
                                $timeout.cancel(inputTimeout);
                            }
                            vm.showPossible = true;
                            vm.possibleValues = [];
                            inputTimeout = $timeout(function() {
                                vm.autocompleteSearch(newValue);
                            }, 300);
                        }
                    }
                }, true));
                $element.bind('keydown', function(event) {
                    var possibleValues;
                    switch (event.which) {
                        case 13:
                            event.preventDefault();
                            if (vm.possibleValues.length < 1) {
                                break;
                            }
                            $timeout(function() {
                                vm.addToSelected(vm.possibleValues[vm.activeElement], event);
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
            }
        };

        /* PUBLIC METHODS */

        function addToSelected(obj, event) {
            //** if you know only id  of the record            
            if (!vm.multiple) {
                vm.selectedValues = [];
                vm.placeholder = obj[vm.fieldSearch];
                vm.fieldValue = obj[vm.fieldId];
            } else {
                vm.fieldValue = vm.fieldValue || [];
                if (!~vm.fieldValue.indexOf(obj[vm.fieldId])) {
                    vm.fieldValue.push(obj[vm.fieldId]);
                }
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

                var url = ApiService.getUrlDepend(componentSettings.valuesRemote.url, urlParam, vm.depend, vm.dependValue);
                var config = {
                    url: url,
                    method: 'GET',
                    $id: vm.setting.component.$id,
                    serverPagination: vm.serverPagination
                };
                config.standard = $scope.getParentDataSource().standard;
                ApiService
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
            angular.forEach(options, insertToSelectedCollection);
        }

        function loadDataById(ids) {
            var defer = $q.defer();
            if (componentSettings.valuesRemote && ids !== undefined && ids !== null && (!angular.isArray(ids) || ids.length > 0)) {
                if (angular.isArray(ids)) {
                    ids = ids.map(function(id) {
                        if (angular.isObject(id) && id[vm.fieldId]) {
                            return id[vm.fieldId];
                        }
                        return id;
                    });
                } else if (angular.isObject(ids)) {
                    ids = ids[vm.fieldId];
                }
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

                return ApiService
                    .getUrlResource(config)
                    .then(function(response) {
                        angular.forEach(response.data.items, insertToSelectedCollection);
                        ApiService.saveToStorage(vm.setting, response.data.items);
                        if (!vm.optionValues.length) {
                            vm.optionValues = angular.copy(vm.selectedValues);
                        }
                    }).finally(function() { vm.preloadedData = true; });
            } else {
                defer.resolve();
            }
            return defer.promise;
        }

        function insertToSelectedCollection(v) {
            if (angular.isArray(vm.fieldValue) && vm.multiple) {
                var id = v[vm.fieldId], id_string = String(id), i = vm.fieldValue.indexOf(id);
                if (i === -1) {
                    id = vm.fieldValue.indexOf(id_string);
                }
                if (i >= 0 && !alreadyIn(v, vm.selectedValues)) {
                    vm.selectedValues[i] = v;
                }
            } else if (vm.fieldValue == v[vm.fieldId] && !vm.multiple) {
                vm.selectedValues.push(v);
                vm.placeholder = v[vm.fieldSearch];
            }
        }

        function isDefined(value) {
            return typeof value !== 'undefined' && value !== null;
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
            if (event.which == 8 && !!vm.selectedValues && !!vm.selectedValues.length && !vm.inputValue && vm.multiple) {
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
            vm.placeholder = componentSettings.placeholder || '';
        }
    }
})();
