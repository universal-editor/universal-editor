(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeSelectController', UeSelectController);

    UeSelectController.$inject = ['$rootScope', '$scope', 'EditEntityStorage', 'RestApiService', 'ArrayFieldStorage', '$timeout', 'configData', '$document', '$element', '$window', 'FilterFieldsStorage', '$controller'];

    function UeSelectController($rootScope, $scope, EditEntityStorage, RestApiService, ArrayFieldStorage, $timeout, configData, $document, $element, $window, FilterFieldsStorage, $controller) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;
        var baseController = $controller('FieldsController', { $scope: $scope });
        angular.extend(vm, baseController);
        vm.parentComponentId = vm.options.$parentComponentId || '';

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
                }
            }
        }

        var possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);

        vm.assetsPath = '/assets/universal-editor';
        if (!!configData.ui && !!configData.ui.assetsPath) {
            vm.assetsPath = configData.ui.assetsPath;
        }
        var _selectedIds = [];
        vm.optionValues = [];
        vm.selectedValues = [];
        vm.inputValue = "";
        vm.readonly = componentSettings.readonly || false;
        vm.parentFieldIndex = vm.setting.parentFieldIndex || false;
        vm.depend = componentSettings.depend || false;
        vm.parentValue = !vm.depend;
        vm.search = componentSettings.search;
        vm.placeholder = componentSettings.placeholder || '';
        vm.showPossible = false;
        vm.activeElement = 0;
        vm.isSelection = false;
        vm.possibleLocation = true;
        vm.isSpanSelectDelete = false;
        vm.fieldDisplayName = componentSettings.label;
        vm.hint = componentSettings.hint || false;
        vm.required = componentSettings.required || false;
        vm.error = [];
        vm.multiple = componentSettings.multiple === true && !vm.options.filter ? true : false;



        if (componentSettings.hasOwnProperty('valuesRemote') &&
            componentSettings.valuesRemote.fields.parent && componentSettings.valuesRemote.fields.childCount) {
            vm.treeParentField = componentSettings.valuesRemote.fields.parent;
            vm.treeChildCountField = componentSettings.valuesRemote.fields.childCount;
            vm.treeSelectBranches = componentSettings.selectBranches;
            vm.isTree = vm.treeParentField && vm.treeChildCountField;
            vm.sizeInput = vm.placeholder.length;
        }

        if (vm.depend) {
            vm.dependField = vm.depend.fieldName;
            vm.dependFilter = vm.depend.filter;
        }

        if (angular.isString(componentSettings.multiname)) {
            vm.multiname = ('' + componentSettings.multiname) || "value";
        }

        if (!componentSettings.multiple) {
            vm.styleInput = { 'width': '99%' };
        }

        if (vm.options.filter) {
            vm.multiple = false;
            vm.readonly = false;
            vm.required = false;
            vm.isTree = false;
        }

        vm.fieldValue = vm.multiple ? [] : {};

        if (vm.setting.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.fieldName), function(item) {
                    if (vm.multiname) {
                        _selectedIds.push(item[vm.multiname]);
                    } else {
                        _selectedIds.push(item);
                    }
                });
            } else {
                if (ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.fieldName)) {
                    if (vm.isTree) {
                        _selectedIds.push(ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.fieldName));
                    } else {
                        vm.fieldValue = {};
                        vm.fieldValue[vm.field_id] = ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.fieldName);
                    }
                }
            }
        }


        /*
         * Инициализация данных при загрузке поля. Необходимая часть для полей инициализирующие данные для которых
         * хранятся удалённо.
         */
        var allOptions;

        if (componentSettings.hasOwnProperty("values")) {
            angular.forEach(componentSettings.values, function(v, key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                vm.optionValues.push(obj);
            });
            $scope.$evalAsync(function() {
                setSizeSelect();
            });
            allOptions = angular.copy(vm.optionValues);
        } else if (componentSettings.hasOwnProperty("valuesRemote")) {
            if (vm.isTree) {
                if (_selectedIds.length && !vm.optionValues.length) {
                    getRemoteSelectedValues();
                }
                else if (!_selectedIds.length) {
                    getRemoteValues();
                }
            } else {
                getRemoteValues();
            }
        } else {
            console.error('EditorFieldSelectController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
        }

        function getRemoteValues(isRemoteSelectedValues) {
            vm.loadingData = true;
            RestApiService
                .getUrlResource(componentSettings.valuesRemote.url)
                .then(function(response) {
                    angular.forEach(response.data.items, function(v) {
                        vm.optionValues.push(v);
                    });
                    setSizeSelect();
                    allOptions = angular.copy(vm.optionValues);
                    if (isRemoteSelectedValues) {
                        setSelectedValuesFromRemote();
                    } else {
                        setSelectedValues();
                    }
                }, function(reject) {
                    console.error('EditorFieldSelectController: Не удалось получить значения для поля \"' + vm.fieldName + '\" с удаленного ресурса');
                }).finally(function() { vm.loadingData = false; });
        }

        function getRemoteSelectedValues() {
            vm.loadingData = true;
            RestApiService
                .getUrlResource(componentSettings.valuesRemote.url + '?filter={"id":["' + _selectedIds.join('","') + '"]}')
                .then(function(response) {
                    if (vm.multiple) {
                        angular.forEach(response.data.items, function(v) {
                            vm.fieldValue.push(v);
                        });
                    } else {
                        vm.fieldValue = [response.data.items[0]];
                    }
                    getRemoteValues(true);
                }, function(reject) {
                    console.error('EditorFieldSelectController: Не удалось получить значения для поля \"' + vm.fieldName + '\" с удаленного ресурса');
                }).finally(function() { vm.loadingData = false; });
        }

        /* ---- */

        var destroyWatchEntityLoaded;
      //   var destroyEntityLoaded = $scope.$on('editor:entity_loaded', );
        var destroyEntityLoaded = $scope.$on('editor:entity_loaded', function(event, data) {
            if(!data.$parentComponentId || data.$parentComponentId === vm.parentComponentId) {
            if (!vm.options.filter) {

                vm.fieldValue = {};
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
                vm.data = data;

                if (data.editorEntityType === "new") {
                    setInitialValue();
                    return;
                }

                vm.parentValue = !vm.dependField;
                if (!vm.setting.parentField) {
                    if (!vm.multiple) {
                        if (vm.isTree && data[vm.fieldName]) {
                            _selectedIds.push(data[vm.fieldName]);
                        } else {
                            var obj = {};
                            obj[vm.field_id] = data[vm.fieldName];
                            vm.fieldValue = obj;
                        }
                    } else if (vm.multiname) {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.fieldName], function(item) {
                            _selectedIds.push(item[vm.multiname]);
                        });
                    } else {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.fieldName], function(item) {
                            _selectedIds.push(item);
                        });
                    }
                } else {
                    if (!vm.multiple) {
                        if (vm.isTree && data[vm.setting.parentField][vm.fieldName]) {
                            _selectedIds.push(data[vm.setting.parentField][vm.fieldName]);
                        } else {
                            var obj = {};
                            obj[vm.field_id] = data[vm.setting.parentField][vm.fieldName];
                            vm.fieldValue = obj;
                        }
                    } else if (vm.multiname) {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.setting.parentField][vm.fieldName], function(item) {
                            _selectedIds.push(item[vm.multiname]);
                        });
                    } else {
                        vm.fieldValue = [];
                        angular.forEach(data[vm.setting.parentField][vm.fieldName], function(item) {
                            _selectedIds.push(item);
                        });
                    }
                }
                //setSelectedValues();
            }
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

        var destroyWatchFieldValue = $scope.$watch(function() {
            return vm.fieldValue;
        }, function(newVal) {
            if (!vm.multiple && !vm.isTree) {
                if (vm.search) {
                    vm.filterText = '';
                    change();
                }
                vm.placeholder = (!!newVal && !!newVal[vm.field_search]) ? newVal[vm.field_search] : componentSettings.placeholder;
                vm.isSelection = (!!newVal && !!newVal[vm.field_search]);
            }
            if (vm.isTree && !vm.search) {
                vm.placeholder = componentSettings.placeholder || '';
            }
            if (vm.isTree && !vm.multiple) {
                vm.placeholder = (!!newVal.length && !!newVal[0][vm.field_search]) ? newVal[0][vm.field_search] : componentSettings.placeholder;
            }
            vm.setColorPlaceholder();
            vm.error = [];
            $rootScope.$broadcast('select_field:select_name_' + vm.fieldName, newVal);
        }, true);

        var destroySelectField;

        if (vm.depend) {
            destroySelectField = $scope.$on('select_field:select_name_' + vm.dependField, function(event, data) {
                if (data && data !== "") {
                    vm.parentValue = false;
                    vm.optionValues = [];
                    RestApiService
                        .getUrlResource(componentSettings.valuesRemote.url + '?filter={"' + vm.dependFilter + '":"' + data + '"}')
                        .then(function(response) {
                            angular.forEach(response.data.items, function(v) {
                                vm.optionValues.push(v);
                            });
                            $timeout(function() {
                                setSizeSelect();
                            }, 0);
                            allOptions = angular.copy(vm.optionValues);
                            vm.parentValue = true;
                        }, function(reject) {
                            console.error('EditorFieldSelectController: Не удалось получить значения для поля \"' + vm.fieldName + '\" с удаленного ресурса');
                        });
                } else {
                    vm.parentValue = false;
                }
            });
        }

        // dropdown functions
        vm.toggle = toggle;
        vm.remove = remove;
        vm.focus = focus;
        vm.change = change;

        function toggle(e, item, loadChilds) {
            if (loadChilds && item[vm.treeChildCountField]) {
                item.isOpen = !item.isOpen;
                if (item[vm.treeChildCountField] && !item.childOpts) {
                    item.loadingData = true;
                    RestApiService
                        .getUrlResource(componentSettings.valuesRemote.url + '?filter={"' + vm.treeParentField + '":"' + item[vm.field_id] + '"}')
                        .then(function(response) {
                            if (!item.childOpts) {
                                item.childOpts = [];
                            }
                            item.loadingData = false;
                            angular.forEach(response.data.items, function(v) {
                                item.childOpts.push(v);
                            });
                            if (!vm.filterText) {
                                allOptions = angular.copy(vm.optionValues);
                            }
                            if (vm.fieldValue.length) {
                                setSelectedValuesFromRemote(item);
                            }
                        }, function(reject) {
                            console.error('EditorFieldSelectController: Не удалось получить значения для поля \"' + vm.fieldName + '\" с удаленного ресурса');
                        });
                }
            } else {
                if (!angular.isArray(vm.fieldValue)) {
                    vm.fieldValue = [];
                }
                var idx = findById(item[vm.field_id]);
                if (vm.multiple) {
                    if (idx !== null) {
                        item.checked = false;
                        vm.fieldValue.splice(idx, 1);
                    } else {
                        item.checked = true;
                        vm.fieldValue.push(item);
                    }
                } else {
                    if (idx === null) {
                        vm.fieldValue.splice(0);
                        uncheckAll(vm.optionValues);
                        item.checked = true;
                        vm.isSpanSelectDelete = true;
                        vm.fieldValue.push(item);
                    } else {
                        vm.fieldValue.splice(0);
                        item.checked = false;
                        vm.isSpanSelectDelete = false;
                    }
                }
                if (!vm.multiple) {
                    $timeout(function() {
                        vm.isBlur();
                        $element.find('input')[0].blur();
                    }, 0);
                }
            }
            if (vm.fieldValue.length === 0 && !vm.filterText) {
                vm.placeholder = componentSettings.placeholder || '';
                vm.sizeInput = vm.placeholder.length;
            } else {
                vm.placeholder = (vm.multiple) ? '' : vm.fieldValue[0][vm.field_search];
                vm.sizeInput = !!vm.filterText ? vm.filterText.length : 1;
            }
            if (!!e) {
                e.stopPropagation();
                e.preventDefault();
            }
        }

        function uncheckAll(arr) {
            for (var i = 0, len = arr.length; i < len; i++) {
                arr[i].checked = false;
                if (arr[i].childOpts) {
                    uncheckAll(arr[i].childOpts);
                }
            }
        }

        function remove(e, item) {
            if (vm.treeParentField && item[vm.treeParentField] && vm.multiple) {
                uncheckByParentId(vm.optionValues, item[vm.treeParentField], item[vm.field_id]);
                var idx = findById(item[vm.field_id], item[vm.treeParentField]);
                if (idx !== null) {
                    vm.fieldValue.splice(idx, 1);
                }
            } else {
                var idx = findById(item[vm.field_id]);
                if (idx !== null) {
                    vm.fieldValue.splice(idx, 1);
                    for (var i = 0, len = vm.optionValues.length; i < len; i++) {
                        if (vm.optionValues[i][vm.field_id] === item[vm.field_id]) {
                            vm.optionValues[i].checked = false;
                        }
                    }
                }
            }

            if (vm.fieldValue.length === 0 && !vm.filterText) {
                vm.placeholder = $scope.field.placeholder || '';
                vm.sizeInput = vm.placeholder.length;
            } else {
                vm.placeholder = '';
                vm.sizeInput = !!vm.filterText ? vm.filterText.length : 1;
            }
        }

        function focus(e) {
            $scope.toggleDropdown(e);
            $scope.isOpen = true;
        }

        function change() {
            vm.activeElement = 0;
            if (vm.fieldValue && vm.fieldValue.length === 0 && !vm.filterText) {
                vm.placeholder = componentSettings.placeholder || '';
                vm.sizeInput = vm.placeholder.length;
            } else {
                vm.placeholder = '';
                vm.sizeInput = !!vm.filterText ? vm.filterText.length : 1;
            }

            if (!vm.filterText) {
                if (!vm.multiple && !vm.isTree) {
                    if (vm.optionValues && vm.optionValues.length && vm.fieldValue) {
                        var finded = vm.optionValues.filter(function(record) { return record[vm.field_id] === vm.fieldValue[vm.field_id]; });
                        if (finded.length) {
                            vm.fieldValue = finded[0];
                        }
                    }
                    vm.placeholder = (!!vm.fieldValue && !!vm.fieldValue[vm.field_search]) ? vm.fieldValue[vm.field_search] : componentSettings.placeholder;
                } else if (!vm.multiple && vm.isTree) {
                    vm.placeholder = (!!vm.fieldValue.length && !!vm.fieldValue[0][vm.field_search]) ? vm.fieldValue[0][vm.field_search] : componentSettings.placeholder;
                }
                if (allOptions) {
                    vm.optionValues = allOptions;
                }

                for (var j = 0; j < vm.fieldValue.length; j++) {
                    for (var i = 0, len = vm.optionValues.length; i < len; i++) {
                        if (vm.optionValues[i][vm.field_id] === vm.fieldValue[j][vm.field_id]) {
                            vm.optionValues[i].checked = true;
                        }
                    }
                }
                return;
            }
            vm.sizeInput = !!vm.filterText ? vm.filterText.length : 1;
            if (!allOptions) {
                allOptions = angular.copy(vm.optionValues);
            }
            vm.optionValues = filter(angular.copy(allOptions), vm.filterText);
            for (var j = 0; j < vm.fieldValue.length; j++) {
                for (var i = 0, len = vm.optionValues.length; i < len; i++) {
                    if (vm.optionValues[i][vm.field_id] === vm.fieldValue[j][vm.field_id]) {
                        vm.optionValues[i].checked = true;
                    }
                }
            }
        }

        function filter(opts, filterText) {
            var result = [];
            result = opts.filter(function(opt) {
                if (opt.childOpts && opt.childOpts.length) {
                    opt.childOpts = filter(opt.childOpts, filterText);
                }
                return (opt[vm.field_search].toLowerCase()).indexOf(filterText.toLowerCase()) > -1 || (opt.childOpts && opt.childOpts.length);
            });

            return result;
        }

        function findById(id, parentId) {
            if (parentId) {
                for (var i = 0, len = vm.fieldValue.length; i < len; i++) {
                    if (vm.fieldValue[i][vm.field_id] === id && vm.fieldValue[i][vm.treeParentField] === parentId) {
                        return i;
                    }
                }
            } else {
                for (var i = 0, len = vm.fieldValue.length; i < len; i++) {
                    if (vm.fieldValue[i][vm.field_id] === id) {
                        return i;
                    }
                }
            }
            return null;
        }

        function uncheckByParentId(arr, parentId, id) {
            for (var i = 0, len = arr.length; i < len; i++) {
                if (arr[i][vm.field_id] === parentId && arr[i].childOpts) {
                    for (var j = 0, lenj = arr[i].childOpts.length; j < lenj; j++) {
                        if (arr[i].childOpts[j][vm.field_id] === id) {
                            arr[i].childOpts[j].checked = false;
                        }
                    }
                } else {
                    if (arr[i].childOpts && arr[i].childOpts.length) {
                        uncheckByParentId(arr[i].childOpts, parentId, id);
                    }
                }
            }
        }

        function setSelectedValues() {
            if (!_selectedIds.length || !vm.optionValues.length) {
                return;
            }
            vm.fieldValue = vm.optionValues.filter(function(opt) {
                for (var i = 0, len = _selectedIds.length; i < len; i++) {
                    if (opt[vm.field_id] === _selectedIds[i]) {
                        opt.checked = true;
                        return true;
                    }
                }
            });
            _selectedIds.splice(0);
        }

        function setSelectedValuesFromRemote(item) {
            if (item) {
                for (var i = 0, len = item.childOpts.length; i < len; i++) {
                    for (var j = 0, lenj = vm.fieldValue.length; j < lenj; j++) {
                        if (item[vm.field_id] === vm.fieldValue[j][vm.treeParentField] && item.childOpts[i][vm.field_id] === vm.fieldValue[j][vm.field_id]) {
                            item.childOpts[i].checked = true;
                        }
                    }
                }
            } else {
                for (var i = 0, len = vm.optionValues.length; i < len; i++) {
                    for (var j = 0, lenj = vm.fieldValue.length; j < lenj; j++) {
                        if (vm.optionValues[i][vm.field_id] === vm.fieldValue[j][vm.field_id] && !vm.fieldValue[j][vm.treeParentField]) {
                            vm.optionValues[i].checked = true;
                        }
                    }
                }
            }
        }

        vm.addToSelected = function(event, val) {
            if (vm.multiple && !vm.options.filter) {
                vm.fieldValue.push(val);
            } else {
                vm.fieldValue = val;
                if (!vm.fieldValue[vm.field_search]) {
                    angular.forEach(vm.optionValues, function(v) {
                        if (v[vm.field_id] == vm.fieldValue[vm.field_id]) {
                            vm.fieldValue[vm.field_search] = v[vm.field_search];
                        }
                    });
                }
            }
            vm.filterText = '';
            $timeout(function() {
                vm.isSpanSelectDelete = true;
                vm.showPossible = false;
                vm.setColorPlaceholder();
            }, 0);
        };

        vm.isShowPossible = function() {
            vm.activeElement = 0;
            vm.showPossible = !vm.showPossible;
            var formControl = $element.find('.select-input');
            if (vm.showPossible) {
                formControl.addClass('active');
            }
            var dHeight = $window.innerHeight;
            var dropdownHost = $element.find('.select-input-wrapper');
            var dropdownHeight = dropdownHost.height();
            var dropdownOffset = dropdownHost.offset();
            var dropdownBottom = dropdownOffset.top + dropdownHeight;
            $scope.$evalAsync(function() {
                vm.possibleLocation = !(dHeight - dropdownBottom < 162);
            });
            vm.setColorPlaceholder();
        };


        $document.bind("keydown", function(event) {
            if (vm.showPossible || $scope.isOpen) {
                switch (event.which) {
                    case 27:
                        event.preventDefault();
                        $timeout(function() {
                            vm.showPossible = false;
                            $scope.isOpen = false;
                        }, 0);
                        break;
                    case 13:
                        event.preventDefault();
                        if ((!vm.multiple && !vm.isTree) || vm.isTree) {
                            if (vm.optionValues.length < 1) {
                                break;
                            }
                        }
                        $timeout(function() {
                            if ((!vm.multiple && !vm.isTree)) {
                                vm.addToSelected(null, vm.optionValues[vm.activeElement]);
                            } else if (vm.isTree) {
                                vm.toggle(undefined, vm.optionValues[vm.activeElement], true);
                            }

                        }, 0);

                        break;
                    case 40:
                        event.preventDefault();
                        if ((!vm.multiple && !vm.isTree) || (vm.isTree)) {
                            if (vm.optionValues.length < 1) {
                                break;
                            }

                            if (!vm.multiple && !vm.isTree) {
                                possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);
                            } else if (vm.isTree) {
                                possibleValues = angular.element($element[0].getElementsByClassName("dropdown__items")[0]);
                            }

                            if (vm.activeElement < vm.optionValues.length - 1) {
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
                        }
                        break;
                    case 38:
                        event.preventDefault();
                        if ((!vm.multiple && !vm.isTree) || (vm.isTree)) {
                            if (vm.optionValues.length < 1) {
                                break;
                            }

                            if (!vm.multiple && !vm.isTree) {
                                possibleValues = angular.element($element[0].getElementsByClassName("possible-scroll")[0]);
                            } else if (vm.isTree) {
                                possibleValues = angular.element($element[0].getElementsByClassName("dropdown__items")[0]);
                            }

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
                        }
                        break;
                }
            }
        });

        vm.setActiveElement = function(event, index) {
            event.stopPropagation();
            $timeout(function() {
                vm.activeElement = index;
            }, 0);
        };

        vm.setColorPlaceholder = function() {
            if (!vm.search && !vm.isTree) {
                vm.colorPlaceholder = !(vm.placeholder === componentSettings.placeholder) && !vm.showPossible;
            } else {
                vm.colorPlaceholder = !(vm.placeholder === componentSettings.placeholder) && !$scope.isOpen;
            }
        };

        vm.isBlur = function() {
            vm.showPossible = false;
            $scope.isOpen = false;
            var formControl = $element.find('.select-input');
            formControl.removeClass('active');
            vm.setColorPlaceholder();
        };

        vm.clickSelect = function() {
            $element.find('input')[0].focus();
        };

        vm.deleteToSelected = function(event, isKeydown) {
            if (isKeydown &&
                event.which == 8 &&
                !!vm.fieldValue &&
                !!vm.fieldValue.length &&
                !vm.filterText &&
                vm.multiple
            ) {
                remove(null, vm.fieldValue[vm.fieldValue.length - 1]);
            } else if (!vm.isTree && !isKeydown) {
                vm.isSpanSelectDelete = false;
                vm.fieldValue = {};
                event.stopPropagation();
            } else if (vm.isTree && !isKeydown) {
                vm.isSpanSelectDelete = false;
                remove(null, vm.fieldValue[0]);
                event.stopPropagation();
            }
        };

        function setSizeSelect() {
            var size = vm.optionValues.length;
            var select = $element.find('select');
            if (!!select.length) {
                if (size <= 3) {
                    select[0].size = 3;
                } else if (size >= 7) {
                    select[0].size = 7;
                } else {
                    select[0].size = size;
                }
            }
        }

        vm.getDistanceByClass = function(className) {
            var elem = angular.element($element.find(className)[0]);
            return $window.innerHeight - elem.offset().top;
        };

        this.$onDestroy = function() {
            if (angular.isFunction(destroyWatchEntityLoaded)) {
                destroyWatchEntityLoaded();
            }
            destroyEntityLoaded();
            destroyWatchFieldValue();
            destroyErrorField();
            if (angular.isFunction(destroySelectField)) {
                destroySelectField();
            }
            EditEntityStorage.deleteFieldController(vm, vm.parentComponentId);
            FilterFieldsStorage.deleteFilterController(vm, vm.parentComponentId);
            if (vm.setting.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy(vm.setting.parentField, vm.setting.parentFieldIndex, vm.fieldName, vm.fieldValue);
            }
        };

        this.$postLink = function() {
            $element.on('$destroy', function() {
                $scope.$destroy();
            });

            $scope.isOpen = false;

            $document.on('click', function(event) {
                if (!$element[0].contains(event.target)) {
                    $scope.$apply(function() {
                        $scope.vm.isBlur();
                    });

                }
            });

            $scope.toggleDropdown = function() {
                $element.find('input')[0].focus();
                var dHeight = $document.height();
                var dropdownHost = $element.find('.dropdown__host');
                var dropdownHeight = dropdownHost.height();
                var dropdownOffset = dropdownHost.offset();
                var dropdownBottom = dropdownOffset.top + dropdownHeight;
                $element.find('.dropdown__items').removeClass('dropdown-top');
                $element.find('.dropdown__items').removeClass('dropdown-bottom');
                if (dHeight - dropdownBottom < 300) {
                    $element.find('.dropdown__items').addClass('dropdown-top');
                } else {
                    $element.find('.dropdown__items').addClass('dropdown-bottom');
                }
                $scope.isOpen = !$scope.isOpen;
                if ($scope.isOpen) {
                    var formControl = $element.find('.select-input');
                    formControl.addClass('active');
                }
                vm.setColorPlaceholder();
            };
        };

        vm.getFieldValue = getFieldValue;
        vm.clear = clear;

        if (vm.options.filter) {
            FilterFieldsStorage.addFilterController(this, vm.parentComponentId);
        } else {
            EditEntityStorage.addFieldController(this, vm.parentComponentId);
        }

        function setInitialValue() {
            var obj = {};
            vm.fieldValue = vm.multiple ? [] : {};
            if (vm.data.hasOwnProperty(vm.fieldName)) {
                obj = {};
                obj[vm.field_id] = vm.data[vm.fieldName];
                if (!isNaN(+obj[vm.field_id])) {
                    obj[vm.field_id] = +obj[vm.field_id];
                }
                vm.fieldValue = obj;
            }

            if (vm.isTree) {
                vm.fieldValue = [];
            }

            if (!!componentSettings.defaultValue && !vm.isTree) {
                obj = {};
                obj[vm.field_id] = componentSettings.defaultValue;
                vm.fieldValue = obj;
            }
        }

        function getFieldValue() {

            var field = {};
            var wrappedFieldValue;

            if ((!vm.multiple && vm.fieldValue) || (vm.multiple && vm.fieldValue.length)) {
                if (vm.multiname) {
                    wrappedFieldValue = [];
                    angular.forEach(vm.fieldValue, function(valueItem) {
                        var tempItem = {};
                        tempItem[vm.multiname] = vm.isTree ? valueItem[vm.field_id] : valueItem;
                        wrappedFieldValue.push(tempItem);
                    });
                } else if (vm.multiple) {
                    wrappedFieldValue = [];
                    angular.forEach(vm.fieldValue, function(valueItem) {
                        wrappedFieldValue.push(vm.isTree ? valueItem[vm.field_id] : valueItem);
                    });
                } else {
                    if (vm.isTree && vm.fieldValue.length) {
                        wrappedFieldValue = vm.fieldValue[0][vm.field_id];
                    } else {
                        wrappedFieldValue = vm.fieldValue[vm.field_id];
                    }
                }
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

        function clear() {
            vm.fieldValue = componentSettings.multiple === true ? [] : "";
            vm.selectedValues = [];
            vm.inputValue = "";
        }
    }

    angular
        .module('universal.editor')
        .filter('selectedValues', function() {
            return function(arr, fieldSearch) {
                var titles = arr.map(function(item) {
                    return item[fieldSearch];
                });
                return titles.join(', ');
            };
        });
})();