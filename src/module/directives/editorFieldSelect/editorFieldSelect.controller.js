(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldSelectController', EditorFieldSelectController);

    EditorFieldSelectController.$inject = ['$rootScope', '$scope', 'EditEntityStorage', 'RestApiService', 'ArrayFieldStorage', '$timeout', 'configData', '$document', '$element', '$window'];

    function EditorFieldSelectController($rootScope, $scope, EditEntityStorage, RestApiService, ArrayFieldStorage, $timeout, configData, $document, $element, $window) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;

        if ($scope.parentField) {
            if ($scope.parentFieldIndex) {
                fieldErrorName = $scope.parentField + "_" + $scope.parentFieldIndex + "_" + $scope.fieldName;
            } else {
                fieldErrorName = $scope.parentField + "_" + $scope.fieldName;
            }
        } else {
            fieldErrorName = $scope.fieldName;
        }

        var tmpObject = {};

        var remote = $scope.field.valuesRemote;

        vm.field_id = "id";
        vm.field_search = "title";
        if (remote) {
            if(remote.fields){
                if (remote.fields.value) {
                    vm.field_id = remote.fields.value;
                }
                if (remote.fields.label) {
                    vm.field_search = remote.fields.label;
                }
            }
        }

        var possibleValues = angular.element($element[0].getElementsByClassName("possible-values")[0]);

        vm.assetsPath = '../assets';
        var _selectedIds = [];
        vm.fieldName = $scope.field.name;
        vm.options = [];
        vm.selectedValues = [];
        vm.inputValue = "";
        vm.readonly = $scope.field.readonly || false;
        $scope.$parent.vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;
        vm.depend = $scope.field.depend || false;
        vm.parentValue = !vm.depend;
        vm.search = $scope.field.search;
        vm.placeholder = $scope.field.placeholder || '';
        vm.showPossible = false;
        vm.activeElement = 0;
        vm.isSelection = false;
        vm.possibleLocation = false;

        if ($scope.field.hasOwnProperty('valuesRemote') &&
            $scope.field.valuesRemote.fields.parent && $scope.field.valuesRemote.fields.childCount) {
            vm.treeParentField = $scope.field.valuesRemote.fields.parent;
            vm.treeChildCountField = $scope.field.valuesRemote.fields.childCount;
            vm.treeSelectBranches = $scope.field.selectBranches;
            vm.isTree = vm.treeParentField && vm.treeChildCountField;
            vm.sizeInput = vm.placeholder.length;
        }

        if(vm.depend){
            vm.dependField = vm.depend.fieldName;
            vm.dependFilter = vm.depend.filter;
        }

        if ($scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true) {
            vm.multiple = true;
            vm.fieldValue = [];
            if ($scope.field.multiname || angular.isString($scope.field.multiname)) {
                vm.multiname = ('' + $scope.field.multiname) || "value";
            }
        } else {
            vm.multiple = false;
            vm.fieldValue = "";
        }
        if (vm.parentFieldIndex) {
            if (vm.multiple) {
                vm.fieldValue = [];
                angular.forEach(ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name), function (item) {
                    if (vm.multiname) {
                        _selectedIds.push(item[vm.multiname]);
                    } else {
                        _selectedIds.push(item);
                    }
                });
            } else {
                if (ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name)) {
                    if (vm.isTree) {
                        _selectedIds.push(ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name));
                   } else {
                        vm.fieldValue = {};
                        vm.fieldValue[vm.field_id] = ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name);
                    }
                }
            }
        }

        EditEntityStorage.addFieldController(this);

        /*
         * Инициализация данных при загрузке поля. Необходимая часть для полей инициализирующие данные для которых
         * хранятся удалённо.
         */
        var allOptions;

        if ($scope.field.hasOwnProperty("values")) {
            if (!vm.multiple && !vm.isTree) {
                var obj = {};
                obj[vm.field_id] = null;
                obj[vm.field_search] = " ";
                vm.options.push(obj);
            }
            angular.forEach($scope.field.values, function (v, key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                vm.options.push(obj);
            });
            $scope.$evalAsync(function() {
                setSizeSelect();
            });
            allOptions = angular.copy(vm.options);
        } else if ($scope.field.hasOwnProperty("valuesRemote")) {
            if (vm.isTree) {
                if (_selectedIds.length && !vm.options.length) {
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
                .getUrlResource($scope.field.valuesRemote.url)
                .then(function (response) {
                    if (!vm.multiple && !vm.isTree) {
                        var obj = {};
                        obj[vm.field_id] = null;
                        obj[vm.field_search] = " ";
                        vm.options.push(obj);
                    }
                    angular.forEach(response.data.items, function (v) {
                        vm.options.push(v);
                    });
                    setSizeSelect();
                    allOptions = angular.copy(vm.options);
                    if (isRemoteSelectedValues) {
                        setSelectedValuesFromRemote();
                    } else {
                        setSelectedValues();
                    }
                }, function (reject) {
                    console.error('EditorFieldSelectController: Не удалось получить значения для поля \"' + $scope.field.fieldName + '\" с удаленного ресурса');
                }).finally(function () { vm.loadingData = false; });
        }

        function getRemoteSelectedValues() {
            vm.loadingData = true;
            RestApiService
                .getUrlResource($scope.field.valuesRemote.url + '?filter={"id":["' + _selectedIds.join('","') + '"]}')
                .then(function (response) {
                    if (vm.multiple) {
                        angular.forEach(response.data.items, function (v) {
                            vm.fieldValue.push(v);
                        });
                    } else {
                        vm.fieldValue = [response.data.items[0]];
                    }
                    getRemoteValues(true);
                }, function (reject) {
                    console.error('EditorFieldSelectController: Не удалось получить значения для поля \"' + $scope.field.fieldName + '\" с удаленного ресурса');
                }).finally(function () { vm.loadingData = false; });
        }

        /* ---- */

        this.getFieldValue = function () {

            var field = {};
            var wrappedFieldValue;

            if ((!vm.multiple && vm.fieldValue) || (vm.multiple && vm.fieldValue.length)) {
                if (vm.multiname) {
                    wrappedFieldValue = [];
                    angular.forEach(vm.fieldValue, function (valueItem) {
                        var tempItem = {};
                        tempItem[vm.multiname] = vm.isTree ? valueItem[vm.field_id] : valueItem;
                        wrappedFieldValue.push(tempItem);
                    });
                } else if (vm.multiple) {
                    wrappedFieldValue = [];
                    angular.forEach(vm.fieldValue, function (valueItem) {
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

            if ($scope.parentField) {
                if (vm.parentFieldIndex) {
                    field[$scope.parentField] = [];
                    field[$scope.parentField][vm.parentFieldIndex] = {};
                    field[$scope.parentField][vm.parentFieldIndex][vm.fieldName] = wrappedFieldValue;
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = wrappedFieldValue;
                }
            } else {
                field[vm.fieldName] = wrappedFieldValue;
            }

            return field;
        };

        this.getInitialValue = function () {

            var field = {};

            if ($scope.parentField) {
                if (vm.multiple) {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = [];
                } else {
                    field[$scope.parentField] = {};
                    field[$scope.parentField][vm.fieldName] = undefined;
                }
            } else {
                if (vm.multiple) {
                    field[vm.fieldName] = [];
                } else {
                    field[vm.fieldName] = undefined;
                }
            }

            return field;
        };

        function clear() {
            vm.fieldValue = $scope.field.hasOwnProperty("multiple") && $scope.field.multiple === true ? [] : "";
            vm.selectedValues = [];
            vm.inputValue = "";
        }

        $scope.$on('editor:entity_loaded', function (event, data) {

            vm.fieldValue = {};
            //-- functional for required fields
            if ($scope.field.requiredField) {
                $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField($scope.field.requiredField);
                    var result = false;
                    var endRecursion = false;
                    (function (value) {
                        var keys = Object.keys(value);
                        for (var i = keys.length; i--;) {
                            var propValue = value[keys[i]];
                            if (propValue !== null && propValue !== undefined && propValue !== "") {
                                if (angular.isObject(propValue) && !endRecursion) {
                                    arguments.callee(propValue);
                                }
                                result = true;
                                endRecursion = true;
                            }
                        }
                    })(f_value);
                    return result;
                }, function (value) {
                    if (!value) {
                        clear();
                        vm.readonly = true;
                    } else {
                        vm.readonly = $scope.field.readonly || false;
                    }
                }, true);
            }

            if (data.editorEntityType === "new") {
                vm.fieldValue = vm.multiple ? [] : {};
                if (data.hasOwnProperty($scope.field.name)) {
                    var obj = {};
                    obj[vm.field_id] = data[$scope.field.name];
                    if (!isNaN(+obj[vm.field_id])) {
                        obj[vm.field_id] = +obj[vm.field_id];
                    }
                    vm.fieldValue = obj;
                }

                if (vm.isTree) {
                    vm.fieldValue = [];
                }

                if (!!$scope.field.defaultValue && !vm.isTree) {
                    var obj = {};
                    obj[vm.field_id] = $scope.field.defaultValue;
                    vm.fieldValue = obj;
                }
                return;
            }

            vm.parentValue = !vm.dependField;

            if (!$scope.parentField) {
                if (!vm.multiple) {
                    if (vm.isTree && data[$scope.field.name]) {
                        _selectedIds.push(data[$scope.field.name]);
                    } else {
                        var obj = {};
                        obj[vm.field_id] = data[$scope.field.name];
                        vm.fieldValue = obj;
                    }
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        _selectedIds.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.field.name], function (item) {
                        _selectedIds.push(item);
                    });
                }
            } else {
                if (!vm.multiple) {
                    if (vm.isTree && data[$scope.parentField][$scope.field.name]) {
                        _selectedIds.push(data[$scope.parentField][$scope.field.name]);
                    } else {
                        var obj = {};
                        obj[vm.field_id] = data[$scope.parentField][$scope.field.name];
                        vm.fieldValue = obj;
                    }
                } else if (vm.multiname) {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        _selectedIds.push(item[vm.multiname]);
                    });
                } else {
                    vm.fieldValue = [];
                    angular.forEach(data[$scope.parentField][$scope.field.name], function (item) {
                        _selectedIds.push(item);
                    });
                }
            }
            //setSelectedValues();
        });

        $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function (error) {
                    if ($scope.$parent.vm.error.indexOf(error) < 0) {
                        $scope.$parent.vm.error.push(error);
                    }
                });
            } else {
                if ($scope.$parent.vm.error.indexOf(data) < 0) {
                    $scope.$parent.vm.error.push(data);
                }
            }
        });

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy($scope.parentField, $scope.parentFieldIndex, $scope.field.name, vm.fieldValue);
            }
        });

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function (newVal) {
            if (!vm.multiple && !vm.isTree) {
                if (vm.search) {
                    vm.filterText = '';
                    change();
                }
                vm.placeholder = (!!newVal && !!newVal[vm.field_search]) ? newVal[vm.field_search] : $scope.field.placeholder;
                vm.isSelection = (!!newVal && !!newVal[vm.field_search]);
            }
            if (vm.isTree && !vm.search) {
                vm.placeholder = $scope.field.placeholder || '';
            }
            $scope.$parent.vm.error = [];
            $rootScope.$broadcast('select_field:select_name_' + vm.fieldName, newVal);
        }, true);

        if (vm.depend) {
            $scope.$on('select_field:select_name_' + vm.dependField, function (event, data) {
                if (data && data !== "") {
                    vm.parentValue = false;
                    vm.options = [];
                    RestApiService
                        .getUrlResource($scope.field.valuesRemote.url + '?filter={"' + vm.dependFilter + '":"'+ data +'"}')
                        .then(function (response) {
                            angular.forEach(response.data.items, function (v) {
                                vm.options.push(v);
                            });
                            $timeout(function() {
                                setSizeSelect();
                            },0);
                            allOptions = angular.copy(vm.options);
                            vm.parentValue = true;
                        }, function (reject) {
                            console.error('EditorFieldSelectController: Не удалось получить значения для поля \"' + $scope.field.fieldName + '\" с удаленного ресурса');
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
                        .getUrlResource($scope.field.valuesRemote.url + '?filter={"' + vm.treeParentField + '":"'+ item[vm.field_id] +'"}')
                        .then(function (response) {
                            if (!item.childOpts) {
                                item.childOpts = [];
                            }
                            item.loadingData = false;
                            angular.forEach(response.data.items, function (v) {
                                item.childOpts.push(v);
                            });
                            if (!vm.filterText) {
                                allOptions = angular.copy(vm.options);
                            }
                            if (vm.fieldValue.length) {
                                setSelectedValuesFromRemote(item);
                            }
                        }, function (reject) {
                            console.error('EditorFieldSelectController: Не удалось получить значения для поля \"' + $scope.field.fieldName + '\" с удаленного ресурса');
                        });
                }
            } else {
                if(!angular.isArray(vm.fieldValue)){
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
                        uncheckAll(vm.options);
                        item.checked = true;
                        vm.fieldValue.push(item);
                    } else {
                        vm.fieldValue.splice(0);
                        item.checked = false;
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
                uncheckByParentId(vm.options, item[vm.treeParentField], item[vm.field_id]);
                var idx = findById(item[vm.field_id], item[vm.treeParentField]);
                if (idx !== null) {
                    vm.fieldValue.splice(idx, 1);
                }
            } else {
                var idx = findById(item[vm.field_id]);
                if (idx !== null) {
                    vm.fieldValue.splice(idx, 1);
                    for (var i = 0, len = vm.options.length; i < len; i++) {
                        if (vm.options[i][vm.field_id] === item[vm.field_id]) {
                            vm.options[i].checked = false;
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
            if (vm.fieldValue.length === 0 && !vm.filterText) {
                vm.placeholder = $scope.field.placeholder || '';
                vm.sizeInput = vm.placeholder.length;
            } else {
                vm.placeholder = '';
                vm.sizeInput = !!vm.filterText ? vm.filterText.length : 1;
            }
            if (!vm.filterText) {
                if (!vm.multiple && !vm.isTree) {
                    vm.placeholder = (!!vm.fieldValue && !!vm.fieldValue[vm.field_search]) ? vm.fieldValue[vm.field_search] : $scope.field.placeholder;
                }
                vm.sizeInput = vm.placeholder.length;
                if (allOptions) {
                    vm.options = allOptions;
                }
                for (var j = 0 ; j < vm.fieldValue.length; j++) {
                    for (var i = 0, len = vm.options.length; i < len; i++) {
                        if (vm.options[i][vm.field_id] === vm.fieldValue[j][vm.field_id]) {
                            vm.options[i].checked = true;
                        }
                    }
                }
                return;
            }
            vm.sizeInput = !!vm.filterText ? vm.filterText.length : 1;
            if (!allOptions) {
                allOptions = angular.copy(vm.options);
            }
            vm.options = filter(angular.copy(allOptions), vm.filterText);
            for (var j = 0 ; j < vm.fieldValue.length; j++) {
                for (var i = 0, len = vm.options.length; i < len; i++) {
                    if (vm.options[i][vm.field_id] === vm.fieldValue[j][vm.field_id]) {
                        vm.options[i].checked = true;
                    }
                }
            }
        }

        function filter(opts, filterText) {
            var result = [];
            result = opts.filter(function (opt) {
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
            if (!_selectedIds.length || !vm.options.length) {
                return;
            }
            vm.fieldValue = vm.options.filter(function (opt) {
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
                for (var i = 0, len = vm.options.length; i < len; i++) {
                    for (var j = 0, lenj = vm.fieldValue.length; j < lenj; j++) {
                        if (vm.options[i][vm.field_id] === vm.fieldValue[j][vm.field_id] && !vm.fieldValue[j][vm.treeParentField]) {
                            vm.options[i].checked = true;
                        }
                    }
                }
            }
        }

        vm.addToSelected = function(val) {
            var obj = {};
            obj[vm.field_id] = val[vm.field_id];
            obj[vm.field_search] = val[vm.field_search];
            vm.fieldValue = obj;
            vm.filterText = '';
            $timeout(function() {
                vm.showPossible = false;
                setColorPlaceholder();
            },0);
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
            console.log(dHeight, dropdownBottom);
            $scope.$evalAsync(function() {
                vm.possibleLocation = !(dHeight - dropdownBottom < 162);
            });
            setColorPlaceholder();
        };


        $document.bind("keydown", function (event) {
            if (vm.showPossible || $scope.isOpen) {
                switch(event.which) {
                    case 27:
                        event.preventDefault();
                        $timeout(function() {
                            vm.showPossible = false;
                            $scope.isOpen = false;
                        },0);
                        break;
                    case 13:
                        event.preventDefault();
                        if ((!vm.multiple && !vm.isTree) || vm.isTree) {
                            if (vm.options.length < 1) {
                                break;
                            }
                        }
                        $timeout(function () {
                            if ((!vm.multiple && !vm.isTree)) {
                                vm.addToSelected(vm.options[vm.activeElement]);
                            } else if (vm.isTree) {
                                vm.toggle(undefined, vm.options[vm.activeElement], true);
                            }

                        },0);

                        break;
                    case 40:
                        event.preventDefault();
                        if ((!vm.multiple && !vm.isTree) || (vm.isTree)) {
                            if(vm.options.length < 1){
                                break;
                            }

                            if (!vm.multiple && !vm.isTree) {
                                possibleValues = angular.element($element[0].getElementsByClassName("possible-values")[0]);
                            } else if (vm.isTree) {
                                possibleValues = angular.element($element[0].getElementsByClassName("dropdown__items")[0]);
                            }

                            if(vm.activeElement < vm.options.length -1){
                                $timeout(function () {
                                    vm.activeElement++;
                                },0);

                                $timeout(function () {
                                    var activeTop  = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
                                        activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
                                        wrapperScroll = possibleValues[0].scrollTop,
                                        wrapperHeight = possibleValues[0].clientHeight;

                                    if (activeTop >= (wrapperHeight + wrapperScroll - activeHeight)) {
                                        possibleValues[0].scrollTop += activeHeight + 1;
                                    }
                                },1);
                            }
                        }
                        break;
                    case 38:
                        event.preventDefault();
                        if ((!vm.multiple && !vm.isTree) || (vm.isTree)) {
                            if(vm.options.length < 1){
                                break;
                            }

                            if (!vm.multiple && !vm.isTree) {
                                possibleValues = angular.element($element[0].getElementsByClassName("possible-values")[0]);
                            } else if (vm.isTree) {
                                possibleValues = angular.element($element[0].getElementsByClassName("dropdown__items")[0]);
                            }

                            if(vm.activeElement > 0){
                                $timeout(function () {
                                    vm.activeElement--;
                                },0);

                                $timeout(function () {
                                    var activeTop  = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].offsetTop,
                                        activeHeight = angular.element(possibleValues[0].getElementsByClassName("active")[0])[0].clientHeight,
                                        wrapperScroll = possibleValues[0].scrollTop,
                                        wrapperHeight = possibleValues[0].clientHeight;

                                    if (activeTop < wrapperScroll) {
                                        possibleValues[0].scrollTop -= activeHeight + 1;
                                    }
                                },1);
                            }
                        }
                        break;
                }
            }
        });

        vm.setActiveElement = function(event, index) {
            event.stopPropagation();
            $timeout(function () {
                vm.activeElement = index;
            },0);
        };

        function setColorPlaceholder() {
            if (!vm.search) {
                vm.colorPlaceholder = !(vm.placeholder === $scope.field.placeholder) && !vm.showPossible;
            }
        }

        vm.isBlur = function() {
            vm.showPossible = false;
            $scope.isOpen = false;
            var formControl = $element.find('.select-input');
            formControl.removeClass('active');
            setColorPlaceholder();
        };

        vm.clickSelect = function() {
            $element.find('input')[0].focus();
        };

        vm.deleteToSelected = function(event) {
            if (event.which == 8 &&
                !!vm.fieldValue &&
                !!vm.fieldValue.length &&
                !vm.filterText
            ) {
                remove(null, vm.fieldValue[vm.fieldValue.length - 1]);
            }
        };

        function setSizeSelect() {
            var size = vm.options.length;
            var select = $element.find('select');
            if (!!select.length) {
                if (size <= 3) {
                    select[0].size = 3;
                } else if(size >= 7) {
                    select[0].size = 7;
                } else {
                    select[0].size = size;
                }
            }
        }

        vm.getDistanceByClass = function (className) {
            var elem = angular.element($element.find(className)[0]);
            return $window.innerHeight - elem.offset().top;
        };
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