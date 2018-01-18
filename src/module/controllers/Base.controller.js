(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('BaseController', BaseController);

    function BaseController($scope, EditEntityStorage, FilterFieldsStorage, $templateCache, $compile, $translate, $element, toastr) {
        /* jshint validthis: true */
        'ngInject';
        var vm = this;
        var self = $scope.vm;
        var componentSettings = self.setting.component.settings;
        var componentValueChangedHandler;

        self.useable = true;
        self.unShowComponentIfError = true;

        if (angular.isFunction(componentSettings.readonly)) {
            self.readonlyCallback = componentSettings.readonly;
        } else {
            self.readonly = componentSettings.readonly === true;
        }

        if (angular.isFunction(componentSettings.useable)) {
            self.useableCallback = componentSettings.useable;
        }

        self.isNumber = false;
        if (angular.isArray(componentSettings.validators)) {
            self.isNumber = componentSettings.validators.some(function(f) { return f.type === 'number'; });
        }

        self.resetErrors = resetErrors;

        if (self.options) {
            self.parentComponentId = self.options.$componentId || '';
            self.regim = self.options.regim || 'edit';
        }

        if (componentSettings && componentSettings.mode) {
            self.regim = componentSettings.mode;
        }

        if (!self.fieldName) {
            self.fieldName = self.setting.name;
        }
        self.parentField = self.setting.parentField;
        self.resourceType = self.setting.resourceType;
        self.parentFieldIndex = angular.isNumber(self.setting.parentFieldIndex) ? self.setting.parentFieldIndex : false;

        self.label = componentSettings.label || null;
        self.hint = componentSettings.hint || null;
        self.required = componentSettings.required === true;
        self.multiple = componentSettings.multiple === true;


        //** Init dangerous and warning messages */
        self.dangers = [];
        self.warnings = [];

        self.templates = angular.merge({}, componentSettings.templates);

        /** if template is set as a html-file */
        var htmlPattern = /[^\s]+(?=\.(html|jade)$)/;
        if (angular.isObject(self.templates)) {
            ['preview', 'filter', 'edit'].forEach(function(property) {
                var template = self.templates[property];
                if (angular.isFunction(template)) {
                    template = template($scope);
                }
                if (template) {
                    if (htmlPattern.test(template)) {
                        self.templates[property] = $templateCache.get(template);
                        if (self.templates[property] === undefined) {
                            $translate('ERROR.FIELD.TEMPLATE').then(function(translation) {
                                console.warn(translation.replace('%template', template));
                            });
                        }
                    } else {
                        self.templates[property] = template;
                    }
                }
            });
        }

        self.error = [];

        //-- listener storage for handlers
        self.listeners = [];
        self.listeners.push($scope.$on('ue:componentError', onErrorApiHandler));

        /** logic for usable and readonly parameters */
        if (componentSettings.mode !== 'preview') {
            var valueWatcher = $scope.$watch(
                function() { return self.fieldValue; },
                function(value, oldValue) {
                    if (self.options && self.options.$componentId) {
                        EditEntityStorage.updateComponents(self.options.$componentId);
                    }
                }, true);
            self.listeners.push(valueWatcher);
        }
        if (angular.isFunction(self.useableCallback) || angular.isFunction(self.readonlyCallback)) {
            componentValueChangedHandler = $scope.$on('ue:componentValueChanged', function(event, data) {
                if (self.isParentComponent(data)) {
                    if (angular.isFunction(self.useableCallback)) {
                        self.useable = self.useableCallback(data);
                        var rootElement = $element.closest('.component-wrapper');
                        if (self.useable === false) {
                            rootElement.addClass('unuseable');
                        } else {
                            rootElement.removeClass('unuseable');
                        }
                        $scope.$broadcast('ue-group:forceUseable', {
                            $componentId: self.setting.component.$id,
                            value: self.useable
                        });
                    }
                    if (angular.isFunction(self.readonlyCallback)) {
                        self.readonly = self.readonlyCallback(data);
                        $scope.$broadcast('ue-group:forceReadonly', {
                            $componentId: self.setting.component.$id,
                            value: self.readonly
                        });
                    }
                }
            });
        }

        var forceReadonlyHandler = $scope.$on('ue-group:forceReadonly', function(event, data) {
            if (self.isParentComponent(data) && componentSettings.readonly !== true) {
                self.readonly = data.value;
            }
        });

        var forceUseableHandler = $scope.$on('ue-group:forceUseable', function(event, data) {
            if (self.isParentComponent(data)) {
                self.useable = data.value;
            }
        });

        self.listeners.push(forceReadonlyHandler);
        self.listeners.push(componentValueChangedHandler);

        self.isParentComponent = function isParentComponent(id, scope) {
            scope = scope || $scope;
            if (angular.isObject(id)) {
                id = id.$componentId || id.$id;
            }
            if (!scope.$parent) {
                return false;
            }
            if (scope.vm && scope.vm.setting && scope.vm.setting.component && scope.vm.setting.component.$id === id) {
                return true;
            }
            return isParentComponent(id, scope.$parent);
        };

        self.isComponent = function isComponent(id, scope) {
            scope = scope || $scope;
            if (angular.isObject(id)) {
                id = id.$componentId || id.$id;
            }
            return scope.vm && scope.vm.setting && scope.vm.setting.component && scope.vm.setting.component.$id === id;
        };

        self.getParentSetting = function getParentSetting(scope) {
            scope = scope || $scope;
            if (!scope.$parent) {
                return null;
            }
            if (scope.vm && scope.vm.setting && scope.vm.setting.component) {
                return scope.vm.setting;
            }
            return getParentSetting(scope);
        };

        self.getParentComponent = function getParentComponent(name, scope) {
            scope = scope || $scope;
            if (!scope.$parent) {
                return null;
            }
            if (scope.vm) {
                if (name) {
                    if (scope.vm.setting && scope.vm.setting.name && (scope.vm.setting.name === name)) {
                        return scope.vm;
                    }
                } else {
                    if (scope.vm.setting && scope.vm.setting.component) {
                        return scope.vm;
                    }
                }
            }
            return getParentComponent(name, scope.$parent);
        };

        self.listeners.push($scope.$on('ue:errorComponentDataLoading', function(event, rejection) {
            function compareStatus(stack) {
                return stack.filter(function(w) { return w.status === rejection.status; }).length > 0;
            }
            if (self.isComponent(rejection) && !rejection.canceled) {
                if (rejection.config && rejection.config.canceled !== true) {
                    self.loaded = true;
                    self.loadingData = false;
                    var isExist = compareStatus(self.warnings) || compareStatus(self.dangers);
                    if (!isExist) {
                        var error = {};
                        error.status = rejection.status;

                        if (rejection.data && rejection.data.message) {
                            error.text = rejection.data.message;
                        } else {
                            var messageCode = error.status ? ('N' + error.status) : 'UNDEFINED';
                            $translate('RESPONSE_ERROR.' + messageCode).then(function(translation) {
                                var parts = translation.replace('%code', error.status).split(':');
                                error.label = parts[0];
                                if (parts[1]) {
                                    error.text = ':' + parts[1];
                                }
                            });
                        }

                        if (rejection.status === -1) {
                            self.dangers.push(error);
                            $translate('RESPONSE_ERROR.UNDEFINED').then(function(translation) {
                                error.text = translation;
                            });
                        }

                        if (/^4/.test(rejection.status)) {
                            self.warnings.push(error);
                        }
                        if (/^5/.test(rejection.status)) {
                            $translate('RESPONSE_ERROR.SERVICE_UNAVAILABLE').then(function(translation) {
                                toastr.error(translation);
                            });
                        }
                        event.preventDefault();
                    }
                } else {
                    self.loaded = true;
                    self.isLoading = false;
                }
            }
        }));

        $scope.onErrorApiHandler = onErrorApiHandler;
        $scope.onDestroyHandler = onDestroyHandler;
        $scope.$on("$destroy", onDestroyHandler);

        function onDestroyHandler() {
            if (angular.isArray(self.listeners)) {
                self.listeners.forEach(function(listener) {
                    if (angular.isFunction(listener)) {
                        listener();
                    }
                });
            }
            self.warnings = [];
            self.dangers = [];
            EditEntityStorage.deleteFieldController(self);
            FilterFieldsStorage.deleteFilterFieldController(self);
        }

        function resetErrors() {
            self.error = [];
        }

        $scope.$on('ue:beforeEntityCreate', resetErrors);
        $scope.$on('ue:beforeEntityUpdate', resetErrors);
        $scope.$on('ue:beforeEntityDelete', resetErrors);

        function onErrorApiHandler(event, eventObject) {
            // for location component related errors
            if (eventObject.$componentId && $scope.vm.setting.component.$id && eventObject.$componentId === $scope.vm.setting.component.$id) {
                event.preventDefault();
                var fields = eventObject.data;
                $scope.$broadcast('ue:componentError', {
                    isChildComponent: true,
                    fields: fields
                });
            }

            // broadcast event for child components
            if (eventObject.isChildComponent) {
                if (angular.isObject(eventObject) && angular.isArray(eventObject.fields)) {
                    var data = eventObject.fields.filter(function(f) {
                        var fieldName = self.fieldName;
                        if (self.setting.hasOwnProperty('parentFieldIndex')) {
                            fieldName = self.fieldName.replace('[]', '[' + self.setting.parentFieldIndex + ']');
                        }
                        return f.field === fieldName;
                    });
                    if (data.length > 0) {
                        event.preventDefault();
                        if (data[0].message) {
                            self.error.push(data[0].message);
                        }
                        if (angular.isArray(data.fields)) {
                            $scope.$broadcast('ue:componentError', {
                                isChildComponent: true,
                                fields: data.fields
                            });
                        }
                    }
                }
            }
        }
    }
})();