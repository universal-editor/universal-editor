(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('BaseController', BaseController);

    BaseController.$inject = ['$scope', 'EditEntityStorage', 'FilterFieldsStorage', '$templateCache', '$compile', '$translate'];

    function BaseController($scope, EditEntityStorage, FilterFieldsStorage, $templateCache, $compile, $translate) {
        /* jshint validthis: true */
        var vm = this;
        var self = $scope.vm;
        var componentSettings = self.setting.component.settings;
        var fieldErrorName;

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
        if (self.fieldName) {
            if (self.parentField) {
                if (self.parentFieldIndex) {
                    fieldErrorName = self.parentField + '_' + self.parentFieldIndex + '_' + self.fieldName;
                } else {
                    fieldErrorName = self.parentField + '_' + self.fieldName;
                }
            } else {
                fieldErrorName = self.fieldName;
            }
        }

        //-- listener storage for handlers
        self.listeners = [];
        if (fieldErrorName) {
            self.listeners.push($scope.$on('editor:api_error_field_' + fieldErrorName, onErrorApiHandler));
        }

        self.isParentComponent = function isParentComponent(id, scope) {
            scope = scope || $scope;
            if (!scope.$parent) {
                return false;
            }
            if (scope.vm.setting && scope.vm.setting.component && scope.vm.setting.component.$id === id) {
                return true;
            }
            return isParentComponent(id, scope.$parent);
        };

        self.listeners.push($scope.$on('editor:error_get_data', function(event, rejection) {
            if (self.isParentComponent(rejection.$parentComponentId) && !rejection.canceled) {
                self.loaded = true;
                self.loadingData = false;
                var error = {};
                if (rejection.status !== -1) {
                    error.status = rejection.status;
                }

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
    }
})();
