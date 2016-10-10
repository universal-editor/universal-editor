(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeRadiolistController', UeRadiolistController);

    UeRadiolistController.$inject = ['$scope', '$element', 'EditEntityStorage', 'RestApiService', 'ArrayFieldStorage'];

    function UeRadiolistController($scope, $element, EditEntityStorage, RestApiService, ArrayFieldStorage) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;

        if (vm.setting.parentField) {
            if (vm.setting.parentFieldIndex) {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.parentFieldIndex + "_" + vm.setting.name;
            } else {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.name;
            }
        } else {
            fieldErrorName = vm.setting.name;
        }

        var remote = vm.setting.valuesRemote;
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
        vm.selectedValues = [];
        vm.inputValue = "";
        vm.readonly = vm.setting.readonly || false;
        vm.fieldDisplayName = vm.setting.component.settings.label;
        vm.hint = vm.setting.hint || false;
        vm.required = vm.setting.required || false;
        vm.error = [];

        if (vm.setting.multiname || angular.isString(vm.setting.multiname)) {
            vm.multiname = ('' + vm.setting.multiname) || "value";
        }

        EditEntityStorage.addFieldController(this);

        if (vm.setting.parentFieldIndex) {
            vm.fieldValue = [];
            var value = ArrayFieldStorage.getFieldValue(vm.setting.parentField, vm.setting.parentFieldIndex, vm.setting.name);
            if (value) {
                if (vm.multiname) {
                    vm.fieldValue = value[vm.multiname];
                } else {
                    vm.fieldValue = value;
                }
            }
        }

        /*
         * Инициализация данных при загрузке поля. Необходимая часть для полей инициализирующие данные для которых
         * хранятся удалённо.
         */

        if (vm.setting.hasOwnProperty("values")) {
            angular.forEach(vm.setting.component.settings.values, function (v, key) {
                var obj = {};
                obj[vm.field_id] = key;
                obj[vm.field_search] = v;
                if (key === vm.setting.defaultValue) {
                    vm.fieldValue = key;
                }
                vm.selectedValues.push(obj);
            });
        } else if (vm.setting.hasOwnProperty("valuesRemote")){
            RestApiService
                .getUrlResource(vm.setting.component.settings.valuesRemote.url)
                .then(function (response) {
                    angular.forEach(response.data.items, function (v) {
                        if (vm.setting.defaultValue && v[vm.field_id] === vm.setting.defaultValue) {
                            vm.fieldValue = v[vm.field_id];
                        }
                        vm.selectedValues.push(v);
                    });
                }, function (reject) {
                    console.error('EditorFieldRadiolistController: Не удалось получить значения для поля \"' + vm.setting.name + '\" с удаленного ресурса');
                });
        } else {
            console.error('EditorFieldRadiolistController: Для поля не указан ни один тип получения значений ( локальный или удаленный )');
        }

        /* ------- */

        this.getFieldValue = function () {
            var field = {};
            var wrappedFieldValue;

            if (vm.multiname) {
                var tempItem = {};
                tempItem[vm.multiname] = vm.fieldValue;
                wrappedFieldValue = tempItem;
            } else {
                wrappedFieldValue = vm.fieldValue;
            }

            if (vm.setting.parentField) {
                if (vm.setting.parentFieldIndex) {
                    field[vm.setting.parentField] = [];
                    field[vm.setting.parentField][vm.setting.parentFieldIndex] = {};
                    field[vm.setting.parentField][vm.setting.parentFieldIndex][vm.setting.name] = wrappedFieldValue;
                } else {
                    field[vm.setting.parentField] = {};
                    field[vm.setting.parentField][vm.setting.name] = wrappedFieldValue;
                }

            } else {
                field[vm.setting.name] = wrappedFieldValue;
            }

            return field;
        };

        this.getInitialValue = function () {

            var field = {};

            if (vm.setting.parentField) {
                field[vm.setting.parentField] = {};
                field[vm.setting.parentField][vm.setting.name] = null;
            } else {
                field[vm.setting.name] = null;
            }

            return field;
        };

        function clear() {
            vm.fieldValue = vm.setting.parentFieldIndex ? [] : (vm.setting.defaultValue || null);
        }
        var destroyWatchEntityLoaded;
        var destroyEntityLoaded = $scope.$on('editor:entity_loaded', function (event, data) {
            //-- functional for required fields
            if (vm.setting.requiredField) {
                destroyWatchEntityLoaded = $scope.$watch(function () {
                    var f_value = EditEntityStorage.getValueField(vm.setting.requiredField);
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
                }, function (value) {
                    if (!value) {
                        clear();
                        vm.readonly = true;
                    } else {
                        vm.readonly = vm.setting.readonly || false;
                    }
                }, true);
            }
            if (data.editorEntityType === "new") {
                vm.fieldValue = vm.setting.defaultValue || null;
                return;
            }

            if (!vm.setting.parentField) {
                if (vm.multiname) {
                    vm.fieldValue = data[vm.setting.name][vm.multiname];
                } else {
                    vm.fieldValue = data[vm.setting.name];
                }
            } else {
                if (vm.multiname) {
                    vm.fieldValue = data[vm.setting.parentField][vm.setting.name][vm.multiname];
                } else {
                    vm.fieldValue = data[vm.setting.parentField][vm.setting.name];
                }
            }
        });

        var destroyErrorField = $scope.$on("editor:api_error_field_" + fieldErrorName, function (event, data) {
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

        var destroyWatchFieldValue = $scope.$watch(function () {
            return vm.fieldValue;
        }, function () {
            vm.error = [];
        }, true);

        this.$onDestroy = function() {
            if (angular.isFunction(destroyWatchEntityLoaded)) {
                destroyWatchEntityLoaded();
            }
            destroyEntityLoaded();
            destroyErrorField();
            destroyWatchFieldValue();
            EditEntityStorage.deleteFieldController(vm);
            if (vm.setting.parentFieldIndex) {
                ArrayFieldStorage.fieldDestroy(vm.setting.parentField, vm.setting.parentFieldIndex, vm.setting.name, vm.fieldValue);
            }
        };

        this.$postLink = function() {
            $element.on('$destroy', function () {
                $scope.$destroy();
            });
        };
    }
})();