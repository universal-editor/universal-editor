(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('FieldsController', FieldsController);

    FieldsController.$inject = ['$scope', '$rootScope', '$location', '$controller', '$timeout', 'FilterFieldsStorage', 'RestApiService', 'moment', 'EditEntityStorage', '$q'];

    function FieldsController($scope, $rootScope, $location, $controller, $timeout, FilterFieldsStorage, RestApiService, moment, EditEntityStorage, $q) {
        /* jshint validthis: true */
        var vm = this;
        var baseController = $controller('BaseController', { $scope: $scope });
        angular.extend(vm, baseController);
        var self = $scope.vm;
        var componentSettings = self.setting.component.settings;
        var regEmail = new RegExp('^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$', 'i');
        var regUrl = new RegExp('^(?:(?:ht|f)tps?://)?(?:[\\-\\w]+:[\\-\\w]+@)?(?:[0-9a-z][\\-0-9a-z]*[0-9a-z]\\.)+[a-z]{2,6}(?::\\d{1,5})?(?:[?/\\\\#][?!^$.(){}:|=[\\]+\\-/\\\\*;&~#@,%\\wА-Яа-я]*)?$', 'i');


        self.readonly = componentSettings.readonly === true;
        self.multiname = componentSettings.multiname || null;
        self.depend = componentSettings.depend || null;
        self.width = !isNaN(+componentSettings.width) ? componentSettings.width : null;
        self.defaultValue = transformToValue(componentSettings.defaultValue);
        self.placeholder = componentSettings.placeholder || null;
        self.classComponent = 'col-lg-4 col-md-4 col-sm-4 col-xs-4 clear-padding-left';
        self.inputLeave = inputLeave;

        var values = componentSettings.values;
        var remoteValues = componentSettings.valuesRemote;
        if (values || remoteValues) {
            self.field_id = "id";
            self.field_search = "title";
            if (self.optionValues) {
                if (values) {
                    angular.forEach(componentSettings.values, function(v, key) {
                        var obj = {};
                        obj[self.field_id] = key;
                        obj[self.field_search] = v;
                        if (angular.isArray(componentSettings.values)){
                            obj[self.field_id] = v;
                        }
                        self.optionValues.push(obj);
                    });
                    componentSettings.$loadingPromise = $q.when(self.optionValues);
                } else if (remoteValues) {
                    if (remoteValues.fields) {
                        self.field_id = remoteValues.fields.value || self.field_id;
                        self.field_search = remoteValues.fields.label || self.field_id;
                    }
                    self.loadingData = true;
                    if (!componentSettings.$loadingPromise) {
                        componentSettings.$loadingPromise = RestApiService
                            .getUrlResource(remoteValues.url)
                            .then(function(response) {
                                angular.forEach(response.data.items, function(v) {
                                    self.optionValues.push(v);
                                });
                                componentSettings.$optionValues = self.optionValues;
                                return self.optionValues;
                            }, function(reject) {
                                console.error(self.constructor.name + ': Не удалось получить значения для поля \"' + self.fieldName + '\" с удаленного ресурса');
                            }).finally(function() {
                                self.loadingData = false;
                            });
                    } else {
                        if (componentSettings.$optionValues && componentSettings.$optionValues.length) {
                            self.loadingData = false;
                            self.optionValues = componentSettings.$optionValues;
                        }
                    }
                }
            }
        }

        self.fieldValue = transformToValue(self.defaultValue);

        if (self.options.filter) {
            self.multiple = false;
            self.readonly = false;
            self.required = false;
            self.fieldValue = null;
        }

        self.cols = self.width;

        if (!!self.cols) {
            if (self.cols > 12) {
                self.cols = 12;
                console.warn('Значение длины для поля ' + self.label + ' превышает максимальное значение сетки (12).');
            }
            if (self.cols < 1) {
                self.cols = 1;
                console.warn('Значение длины для поля ' + self.label + ' ниже минимального значения сетки (1).');
            }
            self.classComponent = 'col-lg-' + self.cols + ' col-md-' + self.cols + ' col-sm-' + self.cols + ' col-xs-' + self.cols + ' clear-padding-left';
        }

        //-- registration of the field's component
        if (self.options.filter) {
            FilterFieldsStorage.addFilterController(self);
        } else {
            EditEntityStorage.addFieldController(self);
        }


        //-- listener storage for handlers        
        self.listeners.push($scope.$watch(function() { return self.fieldValue; },
            function() {
                self.error = [];
                if (self.options.filter && vm.fieldValue && vm.fieldValue[vm.field_id]) {
                    vm.fieldValue = vm.fieldValue[vm.field_id];
                }
            }, true));
        if (self.options.filter) {
            $scope.$watch(function() {
                return $location.search();
            }, function(newVal) {
                if (newVal && newVal.filter) {
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
            var value;
            if (componentSettings.$fieldType === 'date') {
                value = moment(object);
                return self.multiple ? [value] : value;
            }
            if (angular.isObject(object) && !angular.isArray(object) && self.field_id) {
                value = object[self.field_id];
            } else {
                value = object;
            }
            if (value == 0) {
                return value;
            }
            return angular.copy(value) || (self.multiple ? [] : null);
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

        function onLoadDataHandler(event, data, callback) {
            if (!data.$parentComponentId || data.$parentComponentId === self.parentComponentId) {
                if (!self.options.filter) {
                    //-- functional for required fields
                    if (componentSettings.depend) {
                        $scope.$watch(function() {
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
                                            } else {
                                                result = true;
                                            }
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

                        if(!!self.newEntityLoaded){
                            self.newEntityLoaded();
                            return;
                        }

                        var obj = {};
                        self.fieldValue = transformToValue(componentSettings.defaultValue);
                        if (self.field_id) {
                            if (self.isTree) {
                                self.fieldValue = [];
                            }

                            if (!!componentSettings.defaultValue && !self.isTree) {
                                obj = {};
                                obj[self.field_id] = componentSettings.defaultValue;
                                self.fieldValue = obj;
                            }
                            if (data.hasOwnProperty(self.fieldName)) {
                                self.fieldValue = data[self.fieldName];
                            }
                        }
                        if (angular.isFunction(callback)) {
                            callback();
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
                        self.fieldValue = apiValue;
                    } else {
                        if (angular.isArray(apiValue)) {
                            self.fieldValue = [];
                            apiValue.forEach(function(item) {
                                self.fieldValue.push(self.multiname ? item[self.multiname] : item);
                            });
                        }
                    }
                    if (angular.isFunction(callback)) {
                        callback();
                    }
                }
            }
        }

        //validators
        self.typeInput = 'text';
        self.validators = self.setting.component.settings.validators;
        angular.forEach(self.setting.component.settings.validators, function(validator) {
            switch (validator.type) {
                case 'string':
                    self.minLength = validator.minLength;
                    self.maxLength = validator.maxLength;
                    self.pattern = validator.pattern;
                    self.trim = validator.trim;
                    self.contentType = validator.contentType;
                    break;
                case 'number':
                    self.typeInput = 'number';
                    self.minNumber = validator.min;
                    self.maxNumber = validator.max;
                    self.stepNumber = validator.step;
                    break;
                case 'date':
                    self.minDate = validator.minDate;
                    self.maxDate = validator.maxDate;
                    self.format = validator.format;
                    break;
                case 'mask':
                    self.isMask = true;
                    self.maskDefinitions = validator.maskDefinitions;
                    self.mask = validator.mask;
                    break;
            }
        });

        /* Слушатель события на покидание инпута. Необходим для валидации*/
        function inputLeave(val, index) {
            self.error = [];

            if (!val) {
                return;
            }

            if (self.trim) {
                if (!self.multiple) {
                    self.fieldValue = self.fieldValue.trim();
                } else {
                    self.fieldValue[index] = self.fieldValue[index].trim();
                }
                val = val.trim();
            }

            if (self.hasOwnProperty('maxLength') && val.length > self.maxLength) {
                var maxError = 'Для поля превышено максимальное допустимое значение в ' + self.maxLength + ' символов. Сейчас введено ' + val.length + ' символов.';
                if (self.error.indexOf(maxError) < 0) {
                    self.error.push(maxError);
                }
            }

            if (self.hasOwnProperty('minLength') && val.length < self.minLength) {
                var minError = 'Минимальное значение поля не может быть меньше ' + self.minLength + ' символов. Сейчас введено ' + val.length + ' символов.';
                if (self.error.indexOf(minError) < 0) {
                    self.error.push(minError);
                }
            }

            if (self.hasOwnProperty('pattern') && !val.match(new RegExp(self.pattern))) {
                var patternError = 'Введенное значение не соответствует паттерну ' + self.pattern.toString();
                if (self.error.indexOf(patternError) < 0) {
                    self.error.push(patternError);
                }
            }

            if (self.hasOwnProperty('maxNumber') && val > self.maxNumber) {
                var maxNumberError = 'Для поля превышено максимальное допустимое значение ' + self.maxNumber + '. Сейчас введено ' + val + '.';
                if (self.error.indexOf(maxNumberError) < 0) {
                    self.error.push(maxNumberError);
                }
            }

            if (self.hasOwnProperty('minNumber') && val < self.minNumber) {
                var minNumberError = 'Минимальное значение поля не может быть меньше ' + self.minNumber + '. Сейчас введено ' + val + '.';
                if (self.error.indexOf(minNumberError) < 0) {
                    self.error.push(minNumberError);
                }
            }

            if ((self.contentType == 'email') && !val.match(regEmail)) {
                var emailError = 'Введен некорректный email.';
                if (self.error.indexOf(emailError) < 0) {
                    self.error.push(emailError);
                }
            }

            if ((self.contentType == 'url') && !val.match(regUrl)) {
                var urlError = 'Введен некорректный url.';
                if (self.error.indexOf(urlError) < 0) {
                    self.error.push(urlError);
                }
            }
        }
    }
})();
