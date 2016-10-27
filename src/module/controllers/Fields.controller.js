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

        if (self.options.filter) {
            $scope.$watch(function() {
                return $location.search();
            }, function(newVal) {

                var propFilter = 'filter' + self.parentComponentId;
                if (newVal && newVal[propFilter]) {
                    console.log("Filter generate.");
                    var filter = JSON.parse(newVal[propFilter]);
                    componentSettings.$parseFilter($scope.vm, filter);
                }
            });
        }

        var destroyWatchEntityLoaded;

        $scope.onLoadDataHandler = function(event, data) {
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

                    var cast = function(castValue) {
                        return componentSettings.$fieldType === 'date' ? moment.utc(castValue, 'YYYY-MM-DD HH:mm:ss') : castValue;
                    };

                    if (data.editorEntityType === "new") {
                        self.fieldValue = cast(componentSettings.defaultValue) || (self.multiple ? [] : null);

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
                        self.fieldValue = cast(apiValue);
                    } else {
                        if (angular.isArray(apiValue)) {
                            self.fieldValue = [];
                            apiValue.forEach(function(item) {
                                self.fieldValue.push(cast(self.multiname ? item[self.multiname] : item));
                            });
                        }
                    }
                }
            }
        };
    }
})();
