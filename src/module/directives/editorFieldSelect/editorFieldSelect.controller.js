(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('EditorFieldSelectController', EditorFieldSelectController);

    EditorFieldSelectController.$inject = ['$rootScope', '$scope', 'EditEntityStorage', 'RestApiService', 'ArrayFieldStorage', '$timeout', 'configData'];

    function EditorFieldSelectController($rootScope, $scope, EditEntityStorage, RestApiService, ArrayFieldStorage, $timeout, configData) {
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

        vm.assetsPath = '../assets';

        var _selectedIds = [];
        vm.fieldName = $scope.field.name;
        vm.fieldDisplayName = $scope.field.label;
        vm.options = [];
        vm.selectedValues = [];
        vm.inputValue = "";
        vm.readonly = $scope.field.readonly || false;
        vm.hint = $scope.field.hint || false;
        vm.required = $scope.field.required || false;
        vm.error = [];
        vm.parentFieldIndex = $scope.parentFieldIndex || false;
        vm.depend = $scope.field.depend || false;
        vm.parentValue = !vm.depend;
        vm.search = $scope.field.search;
        //vm.multiname = $scope.field.multiname || "value";

        // Настройки режима "Дерево"
        if ($scope.field.hasOwnProperty("valuesRemote") && $scope.field.tree &&
            $scope.field.tree.parentField && $scope.field.tree.childCountField) {
            vm.treeParentField = $scope.field.tree.parentField;
            vm.treeChildCountField = $scope.field.tree.childCountField;
            vm.treeSelectBranches = $scope.field.tree.selectBranches;
            vm.isTree = vm.treeParentField && vm.treeChildCountField;
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
                        vm.fieldValue = ArrayFieldStorage.getFieldValue($scope.parentField, $scope.parentFieldIndex, $scope.field.name);
                    }
                }
            }
        }

        EditEntityStorage.addFieldController(this);

        /*
         * Инициализация данных при загрузке поля. Необходимая часть для полей инициализирующие данные для которых
         * хранятся удалённо.
         */

        if ($scope.field.hasOwnProperty("values")) {
            angular.forEach($scope.field.values, function (v, key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                vm.options.push(obj);
            });
        } else if ($scope.field.hasOwnProperty("valuesRemote")) {
            if (vm.isTree) {
                if (_selectedIds.length && !vm.options.length) {
                    getRemoteSelectedValues();
                }
                else if (!_selectedIds.length) {
                    getRemoteValues();
                }
            }
        } else {
            console.error('EditorFieldSelectController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
        }

        function getRemoteValues(isRemoteSelectedValues) {
            vm.loadingData = true;
            RestApiService
                .getUrlResource($scope.field.valuesRemote.url)
                .then(function (response) {
                    angular.forEach(response.data.items, function (v) {
                        vm.options.push(v);
                    });
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
                vm.fieldValue = vm.multiple ? [] : undefined;
                if (data.hasOwnProperty($scope.field.name)) {
                    var obj = {};
                    obj[vm.field_id] = data[$scope.field.name];
                    if (!isNaN(+obj[vm.field_id])) {
                        obj[vm.field_id] = +obj[vm.field_id];
                    }
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

        $scope.$on('$destroy', function () {
            EditEntityStorage.deleteFieldController(vm);
            if (vm.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy($scope.parentField, $scope.parentFieldIndex, $scope.field.name, vm.fieldValue);
            }
        });

        $scope.$watch(function () {
            return vm.fieldValue;
        }, function (newVal) {
            vm.error = [];
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
                            vm.parentValue = true;
                        }, function (reject) {
                            console.error('EditorFieldSelectController: Не удалось получить значения для поля \"' + $scope.field.fieldName + '\" с удаленного ресурса');
                        });
                } else {
                    vm.parentValue = false;
                }
            });
        }

        var allOptions;

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
            e.stopPropagation();
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
            e.stopPropagation();
        }

        function focus(e) {
            $scope.toggleDropdown(e);
            $scope.isOpen = true;
            e.stopPropagation();
        }

        function change() {
            if (!vm.filterText) {
                if (allOptions) {
                    vm.options = allOptions;
                }
                return;
            }
            if (!allOptions) {
                allOptions = angular.copy(vm.options);
            }
            vm.options = filter(angular.copy(allOptions), vm.filterText);
        }

        function filter(opts, filterText) {
            var result = [];
            result = opts.filter(function (opt) {
                if (opt.childOpts && opt.childOpts.length) {
                    opt.childOpts = filter(opt.childOpts, filterText);
                }
                return opt[vm.field_search].indexOf(filterText) > -1 || (opt.childOpts && opt.childOpts.length);
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