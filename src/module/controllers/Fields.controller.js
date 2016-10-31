(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('FieldsController', FieldsController);

    FieldsController.$inject = ['$scope', '$rootScope', '$location', '$controller', '$timeout', 'FilterFieldsStorage', 'RestApiService', 'moment', 'EditEntityStorage'];

    function FieldsController($scope, $rootScope, $location, $controller, $timeout, FilterFieldsStorage, RestApiService, moment, EditEntityStorage) {
        /* jshint validthis: true */
        var vm = this;
        var baseController = $controller('BaseController', { $scope: $scope });
        angular.extend(vm, baseController);
        var self = $scope.vm;
        var componentSettings = self.setting.component.settings;
        self.parentComponentId = self.options.$parentComponentId || '';
        self.fieldName = self.setting.name;
        self.parentField = self.setting.parentField;
        self.parentFieldIndex = angular.isNumber(self.setting.parentFieldIndex) ? self.setting.parentFieldIndex : false;

        self.readonly = componentSettings.readonly === true;
        self.label = componentSettings.label || null;
        self.hint = componentSettings.hint || null;
        self.required = componentSettings.required === true;
        self.multiple = componentSettings.multiple === true;
        self.multiname = componentSettings.multiname || null;
        self.depend = componentSettings.depend || null;
        self.width = !isNaN(+componentSettings.width) ? componentSettings.width : null;
        self.defaultValue = transformToValue(componentSettings.defaultValue) || (self.multiple ? [] : null);
        self.placeholder = componentSettings.placeholder || null;



        var values = componentSettings.values;
        var remoteValues = componentSettings.valuesRemote;
        if (values || remoteValues) {
            self.field_id = "id";
            self.field_search = "title";
            if (values) {
                if (self.optionValues) {
                    angular.forEach(componentSettings.values, function(v, key) {
                        var obj = {};
                        obj[self.field_id] = key;
                        obj[self.field_search] = v;
                        self.optionValues.push(obj);
                    });
                }
            } else if (remoteValues) {
                if (remoteValues.fields) {
                    self.field_id = remoteValues.fields.value || self.field_id;
                    self.field_search = remoteValues.fields.label || self.field_id;
                }
                RestApiService
                    .getUrlResource(remoteValues.url)
                    .then(function(response) {
                        if (self.optionValues) {
                            angular.forEach(response.data.items, function(v) {
                                self.optionValues.push(v);
                            });
                        }
                    }, function(reject) {
                        console.error(self.constructor.name + ': Не удалось получить значения для поля \"' + self.fieldName + '\" с удаленного ресурса');
                    });
            }
        }

        self.error = [];

        self.fieldValue = transformToValue(self.defaultValue);

        if (self.options.filter) {
            self.multiple = false;
            self.readonly = false;
            self.required = false;
            self.fieldValue = null;
        }

        self.cols = self.width;
        if (!!vm.cols) {
            if (vm.cols > 12) {
                vm.cols = 12;
                console.warn('Значение длины для поля ' + self.label + ' превышает максимальное значение сетки (12).');
            }
            if (vm.cols < 1) {
                vm.cols = 1;
                console.warn('Значение длины для поля ' + self.label + ' ниже минимального значения сетки (1).');
            }
            vm.classComponent = 'col-lg-' + vm.cols + ' col-md-' + vm.cols + ' col-sm-' + vm.cols + ' col-xs-' + vm.cols;
        }

        //-- registration of the field's component
        if (self.options.filter) {
            FilterFieldsStorage.addFilterController(self);
        } else {
            EditEntityStorage.addFieldController(self);
        }

        //-- Error handler

        var fieldErrorName;
        if (self.parentField) {
            if (self.parentFieldIndex) {
                fieldErrorName = self.parentField + "_" + self.parentFieldIndex + "_" + self.fieldName;
            } else {
                fieldErrorName = self.parentField + "_" + self.fieldName;
            }
        } else {
            fieldErrorName = self.fieldName;
        }

        //-- listener storage for handlers
        self.listeners = [];
        self.listeners.push($scope.$on("editor:api_error_field_" + fieldErrorName, onErrorApiHandler));
        self.listeners.push($scope.$watch(function() { return self.fieldValue; },
            function() {
                self.error = [];
                if (self.options.filter && vm.fieldValue && vm.fieldValue[vm.field_id]) {
                    vm.fieldValue = vm.fieldValue[vm.field_id];
                }
            }, true));

        $scope.$on("$destroy", function() {
            self.listeners.forEach(function(listener) {
                if (angular.isFunction(listener)) {
                    listener();
                }
            });
            EditEntityStorage.deleteFieldController(self);
            FilterFieldsStorage.deleteFilterController(self);
        });


        if (self.options.filter) {
            $scope.$watch(function() {
                return $location.search();
            }, function(newVal) {             
                if (newVal && newVal.filter) {
                    console.log("Filter generate.");
                    var filter = JSON.parse(newVal.filter);
                    componentSettings.$parseFilter($scope.vm, filter[self.parentComponentId]);
                }
            });
        }

        self.clear = clear;
        self.getFieldValue = getFieldValue;

        function clear() {
            self.fieldValue = self.multiple ? [] : null;
        }


        function transformToValue(object) {
            if (componentSettings.$fieldType === 'date') {
                if (moment.isMoment(object)) {
                    return moment(object).format('YYYY-MM-DD HH:mm:ss');
                } else {
                    return moment(object, 'YYYY-MM-DD HH:mm:ss');
                }
            }
            return angular.isObject(object) && !angular.isArray(object) && self.field_id ? object[self.field_id] : object;
        }

        function getFieldValue() {
            var field = {},
                wrappedFieldValue;
            if (self.multiple) {
                wrappedFieldValue = [];
                self.fieldValue.forEach(function(value) {
                    var temp;
                    var output = transformToValue(value);

                    if (self.multiname) {
                        temp = {};
                        temp[self.multiname] = output;
                    }
                    wrappedFieldValue.push(temp || output);
                });
            } else {
                wrappedFieldValue = transformToValue(self.fieldValue);
            }

            if (self.parentField) {
                field[self.parentField] = {};
                field[self.parentField][self.fieldName] = wrappedFieldValue;
            } else {
                field[self.fieldName] = wrappedFieldValue;
            }
            return field;
        }

        $scope.onLoadDataHandler = onLoadDataHandler;
        $scope.onErrorApiHandler = onErrorApiHandler;

        function onErrorApiHandler(event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function(error) {
                    if (self.error.indexOf(error) < 0) {
                        self.error.push(error);
                    }
                });
            } else {
                if (self.error.indexOf(data) < 0) {
                    self.error.push(data);
                }
            }
        }

        function onLoadDataHandler(event, data) {
            if (!data.$parentComponentId || data.$parentComponentId === self.parentComponentId) {
                if (!self.options.filter) {
                    //-- functional for required fields
                    if (componentSettings.depend) {
                        destroyWatchEntityLoaded = $scope.$watch(function() {
                            var f_value = EditEntityStorage.getValueField(self.parentComponentId, componentSettings.depend);
                            var result = false;
                            if (f_value !== false) {
                                (function check(value) {
                                    var keys = Object.keys(value);
                                    for (var i = keys.length; i--;) {
                                        var propValue = value[keys[i]];
                                        if (propValue !== null && propValue !== undefined && propValue !== "") {
                                            if (angular.isObject(propValue) && !result) {
                                                check(propValue);
                                            }
                                            result = true;
                                        }
                                    }
                                })(f_value);
                            }
                            return result;
                        }, function(value) {
                            if (!value) {
                                self.clear();
                                self.readonly = true;
                            } else {
                                self.readonly = componentSettings.readonly || false;
                            }
                        }, true);
                    }

                    if (data.editorEntityType === "new") {
                        self.fieldValue = transformToValue(componentSettings.defaultValue) || (self.multiple ? [] : null);

                        if (self.field_id) {
                            if (self.isTree) {
                                self.fieldValue = [];
                            }

                            if (!!componentSettings.defaultValue && !self.isTree) {
                                obj = {};
                                obj[self.field_id] = componentSettings.defaultValue;
                                self.fieldValue = obj;
                            }
                        }
                        return;
                    }

                    var apiValue;
                    if (!self.parentField) {
                        apiValue = data[self.fieldName];
                    } else {
                        apiValue = data[self.parentField];
                        if (angular.isArray(data[self.parentField]) && angular.isNumber(self.parentFieldIndex)) {
                            apiValue = apiValue[self.parentFieldIndex];
                        }
                        apiValue = apiValue[self.fieldName];
                    }

                    if (!self.multiple) {
                        self.fieldValue = transformToValue(apiValue);
                    } else {
                        if (angular.isArray(apiValue)) {
                            self.fieldValue = [];
                            apiValue.forEach(function(item) {
                                self.fieldValue.push(transformToValue(self.multiname ? item[self.multiname] : item));
                            });
                        }
                    }
                }
            }
        }
    }
})();
