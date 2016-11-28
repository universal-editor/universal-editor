(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('BaseController', BaseController);

    BaseController.$inject = ['$scope', 'EditEntityStorage', 'FilterFieldsStorage'];

    function BaseController($scope, EditEntityStorage, FilterFieldsStorage) {
        /* jshint validthis: true */
        var vm = this;
        var self = $scope.vm;
        var componentSettings = self.setting.component.settings;
        var fieldErrorName;

        self.parentComponentId = self.options.$parentComponentId || '';
        if (!self.fieldName) {
            self.fieldName = self.setting.name;
        }
        self.parentField = self.setting.parentField;
        self.parentFieldIndex = angular.isNumber(self.setting.parentFieldIndex) ? self.setting.parentFieldIndex : false;

        self.label = componentSettings.label || null;
        self.hint = componentSettings.hint || null;
        self.required = componentSettings.required === true;
        self.multiple = componentSettings.multiple === true;

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

        function onDestroyHandler() {
            if (angular.isArray(self.listeners)) {
                self.listeners.forEach(function(listener) {
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
