(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('BaseController', BaseController);

    function BaseController($scope, EditEntityStorage, FilterFieldsStorage, $templateCache, $compile, $translate) {
        /* jshint validthis: true */
        "ngInject";
        var vm = this;
        var self = $scope.vm;
        var componentSettings = self.setting.component.settings;

        self.resetErrors = resetErrors;

        if (self.options) {
            self.parentComponentId = self.options.$parentComponentId || '';
            self.regim = self.options.regim || 'edit';
        }

        if (componentSettings && componentSettings.mode) {
            self.regim = componentSettings.mode;
        }

        if (!self.fieldName) {
            self.fieldName = self.setting.name;
        }
        self.parentField = self.setting.parentField;
        self.parentFieldType = self.setting.parentFieldType;
        self.parentFieldIndex = angular.isNumber(self.setting.parentFieldIndex) ? self.setting.parentFieldIndex : false;

        self.label = componentSettings.label || null;
        self.hint = componentSettings.hint || null;
        self.required = componentSettings.required === true;
        self.multiple = componentSettings.multiple === true;


        //** Init dangerous and warning messages */
        self.dangers = [];
        self.warnings = [];

        self.templates = componentSettings.templates;

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

        self.isParentComponent = function isParentComponent(id, scope) {
            scope = scope || $scope;
            if (angular.isObject(id)) {
                id = id.$parentComponentId || id.$id;
            }
            if (!scope.$parent) {
                return false;
            }
            if (scope.vm.setting && scope.vm.setting.component && scope.vm.setting.component.$id === id) {
                return true;
            }
            return isParentComponent(id, scope.$parent);
        };
        self.isComponent = function isComponent(id, scope) {
            scope = scope || $scope;
            if (angular.isObject(id)) {
                id = id.$parentComponentId || id.$id;
            }
            return scope.vm.setting && scope.vm.setting.component && scope.vm.setting.component.$id === id;
        };


        self.listeners.push($scope.$on('ue:errorComponentDataLoading', function(event, rejection) {
            if (self.isParentComponent(rejection.$parentComponentId) && !rejection.canceled) {
                self.loaded = true;
                self.loadingData = false;
                function compareStatus(stack) {
                    return stack.filter(function(w) { return w.status === rejection.status; }).length > 0;
                }
                var isExist = compareStatus(self.warnings) || compareStatus(self.dangers);
                if (!isExist) {
                    var error = {};
                    error.status = rejection.status;

                    if (rejection.data && rejection.data.message) {
                        error.text = rejection.data.message;
                    } else {
                        var messageCode = error.status ? ('N' + error.status) : 'UNDEFINED';
                        $translate('RESPONSE_ERROR.' + messageCode).then(function(translation) {
                            error.text = translation.substr(0, 1).toLowerCase() + translation.substr(1);
                        });
                    }

                    if (rejection.status === -1) {
                        self.dangers.push(error);
                        $translate('RESPONSE_ERROR.UNDEFINED').then(function(translation) {
                            error.text = translation;
                        });
                    }

                    if (/^4/.test(rejection.status)) {
                        error.label = rejection.status + ': ';
                        self.warnings.push(error);
                    }
                    if (/^5/.test(rejection.status)) {
                        error.label = rejection.status + ': ';
                        self.dangers.push(error);
                    }
                    event.preventDefault();
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
            vm.errors = [];
        }

        function onErrorApiHandler(event, eventObject) {
            // for location component related errors
            if (eventObject.$parentComponentId === $scope.vm.setting.component.$id) {
                event.preventDefault();
                var fields = eventObject.data;
                $scope.$broadcast('ue:componentError', {
                    isChildComponent: true,
                    fields: fields
                });
            }

            // broadcast event for child components
            if (eventObject.isChildComponent) {
                var data = eventObject.fields.filter(function(f) {
                    return f.field === self.fieldName;
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
})();
