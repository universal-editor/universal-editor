(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeAutocompleteController', UeAutocompleteController);

    UeAutocompleteController.$inject = ['$scope', '$element', '$document', 'EditEntityStorage', 'RestApiService', '$timeout', 'ArrayFieldStorage', 'FilterFieldsStorage', '$controller'];

    function UeAutocompleteController($scope, $element, $document, EditEntityStorage, RestApiService, $timeout, ArrayFieldStorage, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */
        var vm = this,
            inputTimeout;
        var baseController = $controller('FieldsController', { $scope: $scope });
        angular.extend(vm, baseController);
        var fieldErrorName;
        var componentSettings = vm.setting.component.settings;

        vm.fieldName = vm.setting.name;

        if (vm.setting.parentField) {
            if (vm.setting.parentFieldIndex) {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.parentFieldIndex + "_" + vm.fieldName;
            } else {
                fieldErrorName = vm.setting.parentField + "_" + vm.fieldName;
            }
        } else {
            fieldErrorName = vm.fieldName;
        }
        var possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);

        var remote = componentSettings.valuesRemote;
        vm.field_id = "id";
        vm.field_search = "title";
        if (remote) {
            if (remote.fields) {
                if (remote.fields.value) {
                    vm.field_id = remote.fields.value;
                }
                if (remote.fields.label) {
                    vm.field_search = remote.fields.label;
                } else {
                    vm.field_search = vm.field_id;
                }
            }
        }
        vm.readonly = componentSettings.readonly || false;
        vm.selectedValues = [];
        vm.inputValue = "";
        vm.possibleValues = [];
        vm.activeElement = 0;
        vm.preloadedData = false;
        vm.searching = false;
        vm.maxItemsCount = componentSettings.maxItems || Number.POSITIVE_INFINITY;
        vm.minCount = componentSettings.minCount || 2;
        vm.sizeInput = 1;
        vm.classInput = { 'width': '1px' };
        vm.showPossible = false;
        vm.placeholder = '';
        vm.fieldDisplayName = componentSettings.label;
        vm.hint = componentSettings.hint || false;
        vm.required = componentSettings.required || false;
        vm.error = [];
        vm.multiple = componentSettings.multiple === true;

        if (vm.filter) {
            vm.multiple = false;
            vm.readonly = false;
            vm.required = false;
            loadValues();
        }

        //vm.fieldValue = vm.multiple ? [] : componentSettings.defaultValue;

        vm.fieldValue = vm.multiple ? [] : null;

        vm.multiname = componentSettings.multiname;

        if (!vm.multiple) {
            vm.classInput.width = '99%';
            vm.classInput['padding-right'] = '25px';
        }

        if (vm.setting.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.fieldName), function(item) {
                    if (vm.multiname) {
                        vm.fieldValue.push(item[vm.multiname]);
                    } else {
                        vm.fieldValue.push(item);
                    }
                });
            } else {
                vm.fieldValue = ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.fieldName) || vm.fieldValue;
            }
            vm.preloadedData = false;
            loadValues();
        }


        $element.find("input").bind("keydown", function(event) {
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

        var destroyWatchEntityLoaded;

        var destroyEntityLoaded = $scope.$on('editor:entity_loaded', function(event, data) {
            if (!vm.filter) {
                vm.preloadedData = false;
                $element.find('.autocomplete-field-search').removeClass('hidden');
                vm.inputValue = "";
                vm.selectedValues = [];
                vm.placeholder = '';

                //-- functional for required fields
                if (componentSettings.requiredField) {
                    destroyWatchEntityLoaded = $scope.$watch(function() {
                        var f_value = EditEntityStorage.getValueField(componentSettings.requiredField);
                        var result = false;
                        var endRecursion = false;
                        (function check(value) {
                            var keys = Object.keys(value);
                            for (var i = keys.length; i--;) {
                                var propValue = value[keys[i]];
                                if (propValue !== null && propValue !== undefined && propValue !== "") {
                                    if (angular.isObject(propValue) && !endRecursion) {
                                        check(propValue);
                                    }
                                    result = true;
                                    endRecursion = true;
                                }
                            }
                        })(f_value);
                        return result;
                    }, function(value) {
                        if (!value) {
                            clear();
                            vm.readonly = true;
                        } else {
                            vm.readonly = componentSettings.readonly || false;
                        }
                    }, true);
                }
                if (data.editorEntityType === 'new') {
                    vm.fieldValue = vm.multiple ? [] : componentSettings.defaultValue;
                    if (data.hasOwnProperty(vm.fieldName)) {
                        vm.fieldValue = data[vm.fieldName];
                    }
                    loadValues();
                    vm.sizeInput = 1;
                    vm.preloadedData = true;
                    return;
                }


                if (!vm.setting.parentField) {
                    if (!vm.multiple) {
                        vm.fieldValue = data[vm.fieldName];
                    } else if (vm.multiname) {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.fieldName], function(item) {
                            vm.fieldValue.push(item[vm.multiname]);
                        });
                    } else {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.fieldName], function(item) {
                            vm.fieldValue.push(item);
                        });
                    }
                } else {
                    if (!vm.multiple) {
                        vm.fieldValue = data[vm.setting.parentField][vm.fieldName];
                    } else if (vm.multiname) {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.setting.parentField][vm.fieldName], function(item) {
                            vm.fieldValue.push(item[vm.multiname]);
                        });
                    } else {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.setting.parentField][vm.fieldName], function(item) {
                            vm.fieldValue.push(item);
                        });
                    }
                }

                loadValues();
            }
        });

        var destroyErrorField = $scope.$on("editor:api_error_field_" + fieldErrorName, function(event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function(error) {
                    if (vm.error.indexOf(error) < 0) {
                        vm.error.push(error);
                    }
                });
            } else {
                if (vm.error.indexOf(data) < 0) {
                    vm.error.push(data);
                }
            }
        });

        var destroyWatchInputValue = $scope.$watch(function() {
            return vm.inputValue;
        }, function(newValue) {

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
        }, true);

        var destroyWatchFieldValue = $scope.$watch(function() {
            return vm.fieldValue;
        }, function(n) {
            vm.error = [];
        });

        /* PUBLIC METHODS */

        vm.addToSelected = function(event, obj) {
            //** if you know only id  of the record            
            if (!vm.multiple) {
                vm.selectedValues = [];
                vm.placeholder = obj[vm.field_search];
                if (!obj[vm.field_search]) {
                    vm.fieldValue = obj[vm.field_id];
                    if (!angular.isObject(vm.fieldValue)) {
                        loadValues();
                    }
                }
            }
            if (obj[vm.field_search]) {
                vm.selectedValues.push(obj);
            }
            $element.find('.autocomplete-field-search').removeClass('hidden');
            vm.inputValue = "";
            vm.sizeInput = 1;
            vm.possibleValues = [];
            if (event && !vm.multiple) {
                event.stopPropagation();
            }
        };

        vm.removeFromSelected = function(event, obj) {
            angular.forEach(vm.selectedValues, function(val, key) {
                if (val[vm.field_id] == obj[vm.field_id]) {
                    vm.selectedValues.splice(key, 1);
                    if (!vm.multiple) {
                        vm.placeholder = '';
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
                    if (containsString(v, searchString) && !alreadySelected(obj)) {
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
                            if (!alreadySelected(v) && !alreadyInPossible(v)) {
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

        function containsString(str, search) {
            return (str.toLowerCase().indexOf(search.toLowerCase()) >= 0);
        }

        function alreadyInPossible(obj) {
            var inPossible = false;

            angular.forEach(vm.possibleValues, function(v) {
                if (v[vm.field_id] == obj[vm.field_id]) {
                    inPossible = true;
                }
            });

            return inPossible;
        }

        function alreadySelected(obj) {

            var inSelected = false;

            angular.forEach(vm.selectedValues, function(v) {
                if (v[vm.field_id] == obj[vm.field_id]) {
                    inSelected = true;
                }
            });

            return inSelected;
        }

        function loadValues() {
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

                if (vm.fieldValue === undefined || vm.fieldValue === null) {
                    vm.preloadedData = true;
                    return;
                }

                var urlParam;

                if (vm.multiple && angular.isArray(vm.fieldValue) && vm.fieldValue.length > 0) {
                    urlParam = {};
                    urlParam[vm.field_id] = vm.fieldValue;
                } else if (!vm.multiple && vm.fieldValue !== '') {
                    urlParam = {};
                    urlParam[vm.field_id] = [];
                    urlParam[vm.field_id].push(vm.fieldValue);
                } else {
                    vm.preloadedData = true;
                    return;
                }

                RestApiService
                    .getUrlResource(componentSettings.valuesRemote.url + '?filter=' + JSON.stringify(urlParam))
                    .then(function(response) {
                        angular.forEach(response.data.items, function(v) {
                            if (Array.isArray(vm.fieldValue) &&
                                (vm.fieldValue.indexOf(v[vm.field_id]) >= 0 || vm.fieldValue.indexOf(String(v[vm.field_id])) >= 0) &&
                                vm.multiple
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
            $document.on('click', function(event) {
                if (!$element[0].contains(event.target)) {
                    $scope.$apply(function() {
                        vm.showPossible = false;
                    });

                }
            });

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

        this.$onDestroy = function() {
            if (angular.isFunction(destroyWatchEntityLoaded)) {
                destroyWatchEntityLoaded();
            }
            destroyEntityLoaded();
            destroyErrorField();
            destroyWatchInputValue();
            destroyWatchFieldValue();
            EditEntityStorage.deleteFieldController(vm, vm.setting.component.settings.$parentScopeId);
            FilterFieldsStorage.deleteFilterController(vm, vm.setting.component.settings.$parentScopeId);
            if (vm.setting.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy(vm.setting.parentField, vm.setting.parentFieldIndex, vm.fieldName, vm.fieldValue);
            }
        };

        vm.clear = clear;
        vm.getFieldValue = getFieldValue;

        if (vm.filter) {
            FilterFieldsStorage.addFilterController(this, vm.setting.component.settings.$parentScopeId);
        } else {
            EditEntityStorage.addFieldController(this, vm.setting.component.settings.$parentScopeId);
        }

        function clear() {
            vm.fieldValue = vm.multiple ? [] : null;
            $element.find('.autocomplete-field-search').removeClass('hidden');
            vm.inputValue = "";
            vm.sizeInput = 1;
            vm.selectedValues = [];
            vm.placeholder = '';
        }

        function getFieldValue() {

            var field = {};
            var wrappedFieldValue;

            if (vm.multiname) {
                wrappedFieldValue = [];
                angular.forEach(vm.selectedValues, function(valueItem) {
                    var tempItem = {};
                    tempItem[vm.multiname] = valueItem[vm.field_id];
                    wrappedFieldValue.push(tempItem);
                });
            } else if (vm.multiple) {
                wrappedFieldValue = [];
                angular.forEach(vm.selectedValues, function(valueItem) {
                    wrappedFieldValue.push(valueItem[vm.field_id]);
                });
            } else {
                wrappedFieldValue = vm.selectedValues.length > 0 ? vm.selectedValues[0][vm.field_id] : "";
            }
            if (vm.setting.parentField) {
                if (vm.setting.parentFieldIndex) {
                    field[vm.setting.parentField] = [];
                    field[vm.setting.parentField][vm.setting.parentFieldIndex] = {};
                    field[vm.setting.parentField][vm.setting.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[vm.setting.parentField] = {};
                    field[vm.setting.parentField][vm.fieldName] = wrappedFieldValue;
                }
            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }
            return field;
        }

    }
})();
