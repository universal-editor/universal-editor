(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('FieldsController', FieldsController);

    function FieldsController($scope, $rootScope, $location, $controller, $timeout, FilterFieldsStorage, YiiSoftApiService, moment, EditEntityStorage, $q, $translate) {
        /* jshint validthis: true */
        "ngInject";
        var vm = this;
        var baseController = $controller('BaseController', { $scope: $scope });
        angular.extend(vm, baseController);
        var self = $scope.vm;
        var componentSettings = self.setting.component.settings;
        var regEmail = new RegExp('^[-a-z0-9~!$%^&*_=+}{\'?]+(\.[-a-z0-9~!$%^&*_=+}{\'?]+)*@([a-z0-9_][-a-z0-9_]*(\.[-a-z0-9_]+[a-z][a-z])|([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}))(:[0-9]{1,5})?$', 'i');
        var regUrl = new RegExp('^(?:(?:ht|f)tps?://)?(?:[\\-\\w]+:[\\-\\w]+@)?(?:[0-9a-z][\\-0-9a-z]*[0-9a-z]\\.)+[a-z]{2,6}(?::\\d{1,5})?(?:[?/\\\\#][?!^$.(){}:|=[\\]+\\-/\\\\*;&~#@,%\\wА-Яа-я]*)?$', 'i');

        if (typeof self.serverPagination !== 'boolean') {
            self.serverPagination = componentSettings.serverPagination === true;
        }
        self.isVisible = true;

        self.readonly = componentSettings.readonly === true;
        self.multiname = componentSettings.multiname || null;
        self.depend = componentSettings.depend || null;
        self.width = !isNaN(+componentSettings.width) ? componentSettings.width : null;
        self.defaultValue = componentSettings.defaultValue;
        self.placeholder = componentSettings.placeholder || null;
        self.classComponent = 'col-lg-4 col-md-4 col-sm-4 col-xs-4 clear-padding-left';
        self.inputLeave = inputLeave;
        self.disabled = componentSettings.disabled;
        self.clientErrors = [];

        var values = componentSettings.values;
        var remoteValues = componentSettings.valuesRemote;
        var timeUpdateDepend;

        if (values || remoteValues) {
            self.fieldId = "id";
            self.fieldSearch = "title";
            if (self.optionValues) {
                if (values) {
                    angular.forEach(componentSettings.values, function(v, key) {
                        var obj = {};
                        obj[self.fieldId] = key;
                        obj[self.fieldSearch] = v;
                        if (angular.isArray(componentSettings.values)) {
                            obj[self.fieldId] = v;
                        }
                        self.optionValues.push(obj);
                    });
                    componentSettings.$loadingPromise = $q.when(self.optionValues);
                } else if (remoteValues) {
                    if (remoteValues.fields) {
                        self.fieldId = remoteValues.fields.value || self.fieldId;
                        self.fieldSearch = remoteValues.fields.label || self.fieldId;
                    }
                    if (self.initDataSource) {
                        self.loadingData = true;
                        self.loadingPossibleData = true;
                        if (!componentSettings.$loadingPromise) {
                            var config = {
                                method: 'GET',
                                url: remoteValues.url,
                                $id: self.setting.component.$id,
                                serverPagination: self.serverPagination
                            };
                            var dataSource = $scope.getParentDataSource();
                            config.standard = dataSource.standard;
                            componentSettings.$loadingPromise = YiiSoftApiService
                                .getUrlResource(config)
                                .then(function(response) {
                                    if (!componentSettings.depend) {
                                        angular.forEach(response.data.items, function(v) {
                                            self.optionValues.push(v);
                                        });
                                    }
                                    componentSettings.$optionValues = self.optionValues;
                                    return self.optionValues;
                                }, function(reject) {
                                    $translate('ERROR.FIELD.VALUES_REMOTE').then(function(translation) {
                                        console.error(self.constructor.name + translation.replace('%name_field', self.fieldName));
                                    });
                                }).finally(function() {
                                    self.loadingPossibleData = false;
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
        }

        self.cols = self.width;

        if (self.options.filter) {
            self.multiple = false;
            self.readonly = false;
            self.required = false;
            self.fieldValue = null;
            self.cols = 12;
        }

        if (!!self.cols) {
            if (self.cols > 12) {
                self.cols = 12;
                $translate('ERROR.FIELD.MAX_SIZE').then(function(translation) {
                    console.warn(translation.replace('%label_field', self.label));
                });
            }
            if (self.cols < 1) {
                self.cols = 1;
                $translate('ERROR.FIELD.MIN_SIZE').then(function(translation) {
                    console.warn(translation.replace('%label_field', self.label));
                });
            }
            self.classComponent = 'col-lg-' + self.cols + ' col-md-' + self.cols + ' col-sm-' + self.cols + ' col-xs-' + self.cols + ' clear-padding-left';
        }

        //-- registration of the field's component
        if (self.options.filter) {
            FilterFieldsStorage.addFilterFieldController(self);
        } else {
            EditEntityStorage.addFieldController(self);
        }


        //-- listener storage for handlers        
        self.listeners.push($scope.$watch(
            function() {
                return self.fieldValue;
            },
            function(value) {
                self.error = [];
                if (self.disabled === true) {
                    self.isVisible = angular.isObject(value) ? checkForEmptyValue(value) : !!value;
                }
            }, true)
        );

        if (self.options.filter) {
            $scope.$watch(function() {
                return $location.search();
            }, function(newVal) {
                var filterName = self.options.paramsPefix ? self.options.paramsPefix + '-filter' : 'filter';
                if (newVal && newVal[filterName]) {
                    var filter = JSON.parse(newVal[filterName]);
                    componentSettings.$parseFilter($scope.vm, filter);
                }
            });
        }


        self.clear = clear;
        self.getFieldValue = getFieldValue;
        self.equalPreviewValue = equalPreviewValue;

        self.clearDefault = clear;

        function clear() {
            self.fieldValue = self.multiple ? [] : null;
        }

        function transformToValue(object) {
            var value;
            if (componentSettings.$fieldType === 'date') {
                if (object) {
                    if (self.multiple) {
                        if (angular.isArray(object)) {
                            value = [];
                            object.forEach(function(date, index) {
                                value[index] = angular.isString(self.format) ? moment(date, self.format) : moment(date);
                            });
                        }
                    } else {
                        if (object) {
                            value = angular.isString(self.format) ? moment(object, self.format) : moment(object);
                        }
                    }
                    return value;
                }
                return self.multiple ? [] : null;
            }
            if (angular.isObject(object) && !angular.isArray(object) && self.fieldId) {
                value = object[self.fieldId];
            } else {
                value = object;
            }
            if (value == 0) {
                return value;
            }
            return angular.copy(value) || (self.multiple ? [] : null);
        }

        function equalPreviewValue(source) {
            source = source || self.optionValues || [];
            if (angular.isArray(self.fieldValue)) {
                self.previewValue = [];
            }
            if (self.fieldValue !== null && !angular.isUndefined(self.fieldValue)) {
                if ((componentSettings.values || componentSettings.valuesRemote)) {
                    if (angular.isArray(source)) {
                        source.forEach(function(option) {
                            if (angular.isObject(self.fieldValue) && !angular.isArray(self.fieldValue)) {
                                compareId(self.fieldValue[self.fieldId], option, false);
                            }
                            if (angular.isArray(self.fieldValue)) {
                                self.fieldValue.forEach(function(value) {
                                    if (angular.isObject(value)) {
                                        compareId(value[self.fieldId], option, true);
                                    }
                                    if (angular.isNumber(value) || angular.isString(value)) {
                                        compareId(value, option, true);
                                    }
                                });
                            }
                            if (angular.isNumber(self.fieldValue) || angular.isString(self.fieldValue)) {
                                compareId(self.fieldValue, option, false);
                            }
                        });
                    }
                } else {
                    self.previewValue = self.fieldValue;
                }
            }

            function compareId(id, option, multiple) {
                if (option && id == option[self.fieldId]) {
                    if (multiple) {
                        self.previewValue = self.previewValue || [];
                        self.previewValue.push(option[self.fieldSearch]);
                    } else {
                        self.previewValue = option[self.fieldSearch];
                    }
                }
            }
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
                if (self.parentFieldType) {
                    field[self.parentField].__type = self.parentFieldType;
                }
            } else {
                field[self.fieldName] = wrappedFieldValue;
            }

            return field;
        }

        $scope.onLoadDataHandler = onLoadDataHandler;

        function checkForEmptyValue(value) {
            var result = false;
            if (value !== false) {
                (function check(value) {
                    var keys = Object.keys(value);
                    for (var i = keys.length; i--;) {
                        var propValue = value[keys[i]];
                        if (propValue !== null && propValue !== undefined && propValue !== '') {
                            if (angular.isObject(propValue) && !result) {
                                check(propValue);
                            } else {
                                result = true;
                            }
                        }
                    }
                })(value);
            }
            return result;
        }

        function onLoadDataHandler(event, data, callback) {
            if (!data.$parentComponentId || self.isParentComponent(data.$parentComponentId)) {
                if (!self.options.filter) {
                    //-- functional for required fields
                    if (componentSettings.depend) {
                        $scope.$watch(function() {
                            var f_value = EditEntityStorage.getValueField(self.parentComponentId, componentSettings.depend);
                            var result = checkForEmptyValue(f_value);
                            var oldValue = self.dependValue;
                            self.dependValue = undefined;
                            if (result) {
                                self.dependValue = f_value[componentSettings.depend];
                            }
                            if (!angular.equals(oldValue, self.dependValue) && angular.isFunction(self.dependUpdate)) {
                                self.loadingData = true;
                                $timeout.cancel(timeUpdateDepend);
                                timeUpdateDepend = $timeout(function() {
                                    self.dependUpdate(componentSettings.depend, self.dependValue);
                                    $timeout.cancel(timeUpdateDepend);
                                }, 500);
                            }
                            return result;
                        }, function(value) {
                            if (!value) {
                                self.clear();
                                self.readonly = true;
                                self.loadingData = false;
                            } else {
                                self.readonly = componentSettings.readonly || false;
                            }
                        }, true);
                    }

                    if (data.editorEntityType === 'new' && self.regim !== 'preview') {

                        if (!!self.newEntityLoaded) {
                            self.newEntityLoaded();
                            return;
                        }

                        var obj = {};
                        self.fieldValue = transformToValue(componentSettings.defaultValue);
                        if (self.fieldId) {
                            if (self.isTree) {
                                self.fieldValue = [];
                            }

                            if (!!componentSettings.defaultValue && !self.isTree) {
                                obj = {};
                                obj[self.fieldId] = componentSettings.defaultValue;
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

                    $scope.data = self.data = ((self.options.$dataIndex >= 0) && angular.isObject(data.$items)) ? data.$items[self.options.$dataIndex] : data;

                    var apiValue;
                    if (!self.parentField) {
                        apiValue = self.data[self.fieldName];
                    } else {
                        apiValue = self.data[self.parentField];
                        if (angular.isArray(self.data[self.parentField]) && angular.isNumber(self.parentFieldIndex)) {
                            apiValue = apiValue[self.parentFieldIndex];
                        }
                        if (apiValue) {
                            apiValue = apiValue[self.fieldName];
                        }
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
                    equalPreviewValue([$scope.data['$' + self.fieldName]]);
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
                    self.minView = validator.minView;
                    self.maxView = validator.maxView;
                    self.view = validator.view;
                    self.format = validator.format || 'DD.MM.YYYY HH:mm:ss';
                    break;
                case 'mask':
                    self.isMask = true;
                    self.maskDefinitions = validator.maskDefinitions;
                    self.mask = validator.mask;
                    break;
            }
        });
        self.fieldValue = transformToValue(self.defaultValue);
        equalPreviewValue();

        /* Слушатель события на покидание инпута. Необходим для валидации*/
        function inputLeave(val, index) {
            if (angular.isNumber(index)) {
                self.clientErrors[index] = [];
            } else {
                self.clientErrors = [];
            }

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

            function setClientError(error) {
                if (angular.isNumber(index)) {
                    self.clientErrors[index] = self.clientErrors[index] || [];
                    if (self.clientErrors[index].indexOf(error) < 0) {
                        self.clientErrors[index].push(error);
                    }
                } else {
                    if (self.clientErrors.indexOf(error) < 0) {
                        self.clientErrors.push(error);
                    }
                }
            }

            if (self.hasOwnProperty('maxLength') && val.length > self.maxLength) {
                $translate('VALIDATION.STRING_MAX').then(function(translation) {
                    setClientError(translation.replace('%maxLength', self.maxLength).replace('%val', val.length));
                });
            }

            if (self.hasOwnProperty('minLength') && val.length < self.minLength) {
                $translate('VALIDATION.STRING_MIN').then(function(translation) {
                    setClientError(translation.replace('%minLength', self.minLength).replace('%val', val.length));
                });
            }

            if (self.hasOwnProperty('pattern') && !val.match(new RegExp(self.pattern))) {
                $translate('VALIDATION.INVALID_PATTERN').then(function(translation) {
                    setClientError(translation.replace('%pattern', self.pattern.toString()));
                });
            }

            if (self.hasOwnProperty('maxNumber') && val > self.maxNumber) {
                $translate('VALIDATION.NUMBER_MAX').then(function(translation) {
                    setClientError(translation.replace('%max', self.maxNumber).replace('%val', val));
                });
            }

            if (self.hasOwnProperty('minNumber') && val < self.minNumber) {
                $translate('VALIDATION.NUMBER_MIN').then(function(translation) {
                    setClientError(translation.replace('%min', self.minNumber).replace('%val', val));
                });
            }

            if ((self.contentType == 'email') && !val.match(regEmail)) {
                $translate('VALIDATION.INVALID_IMAIL').then(function(translation) {
                    setClientError(translation);
                });
                setClientError('Введен некорректный email.');
            }

            if ((self.contentType == 'url') && !val.match(regUrl)) {
                $translate('VALIDATION.INVALID_URL').then(function(translation) {
                    setClientError(translation);
                });
            }
        }
    }
})();
