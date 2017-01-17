(function () {
    'use strict';

    angular
        .module('universal.editor')
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

        if (componentSettings && componentSettings.modeTemplate) {
            self.regim = componentSettings.modeTemplate;
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

        self.templates = componentSettings.templates;

        /** if template is set as a html-file */
        var htmlPattern = /[^\s]+(?=\.html$)/;
        if (angular.isObject(self.templates)) {
            ['preview', 'filter', 'edit'].forEach(function (property) {
                var template = self.templates[property];
                if (angular.isFunction(template)) {
                    template = template($scope);
                }
                if (template) {
                    if (htmlPattern.test(template)) {
                        self.templates[property] = $templateCache.get(template);
                        if (self.templates[property] === undefined) {
                            $translate('ERROR.FIELD.TEMPLATE').then(function (translation) {
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

        $scope.onErrorApiHandler = onErrorApiHandler;
        $scope.onDestroyHandler = onDestroyHandler;

        $scope.$on("$destroy", onDestroyHandler);
        self.listeners.push($scope.$on('editor:entity_loaded', function (e, data) {
            if (!data.$parentComponentId || data.$parentComponentId === self.parentComponentId && !self.options.filter) {
                if ((self.options.$dataIndex || self.options.$dataIndex === 0) && angular.isObject(data.$items)) {
                    $scope.data = self.data = data.$items[self.options.$dataIndex];
                } else {
                    $scope.data = self.data = data;
                }
            }
        }));

        function onDestroyHandler() {
            if (angular.isArray(self.listeners)) {
                self.listeners.forEach(function (listener) {
                    if (angular.isFunction(listener)) {
                        listener();
                    }
                });
            }
            EditEntityStorage.deleteFieldController(self);
            FilterFieldsStorage.deleteFilterController(self);
        }

        function onErrorApiHandler(event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function (error) {
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
