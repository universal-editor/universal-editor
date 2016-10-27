(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeFormGroupController', UeFormGroupController);

    UeFormGroupController.$inject = ['$scope', '$rootScope', '$element', 'configData', 'EditEntityStorage', '$timeout', 'ArrayFieldStorage', 'RestApiService'];

    function UeFormGroupController($scope, $rootScope, $element, configData, EditEntityStorage, $timeout, ArrayFieldStorage, RestApiService) {
        /* jshint validthis: true */
        var vm = this;
        var fieldErrorName;
        var componentSettings = vm.setting.component.settings;
        vm.fieldName = componentSettings.name;
        vm.parentComponentId = vm.options.$parentComponentId || '';
        if (vm.setting.parentField) {
            if (vm.setting.parentFieldIndex) {
                fieldErrorName = vm.setting.parentField + "_" + vm.setting.parentFieldIndex + "_" + vm.fieldName;
            } else {
                fieldErrorName = vm.setting.parentField + "_" + vm.fieldName;
            }
        } else {
            fieldErrorName = vm.fieldName;
        }

        var entityObject = RestApiService.getEntityObject();

        vm.fieldDisplayName = componentSettings.label;
        vm.hint = componentSettings.hint || false;
        vm.innerFields = [];
        vm.fieldsArray = [];
        vm.multiple = componentSettings.multiple === true;
        vm.countInLine = componentSettings.countInLine || 1;
        var widthBootstrap = Math.ceil(12 / vm.countInLine);
        vm.className = 'col-md-' + widthBootstrap + ' col-xs-' + widthBootstrap + ' col-sm-' + widthBootstrap + ' col-lg-' + widthBootstrap;

        // EditEntityStorage.addFieldController(this);

        angular.forEach(componentSettings.fields, function(value, index) {
            var field;
            if (angular.isString(value)) {
                field = entityObject.dataSource.fields.filter(function(k) {
                    return k.name == value;
                })[0];
            } else if (value && value.component) {
                field = value;
            }
            if (field) {
                if (vm.fieldName) {
                    field.parentField = vm.fieldName;
                }
                vm.innerFields.push(field);
            }
        });

        vm.$isOnlyChildsBroadcast = false;
        var destroyEntityLoaded = $scope.$on('editor:entity_loaded', function(event, data) {
            if (!vm.$isOnlyChildsBroadcast) {
                var group = data[vm.fieldName];
                if (group) {
                    if (vm.multiple && angular.isArray(group)) {
                        group.forEach(vm.addItem);
                        $timeout(function() {
                            vm.$isOnlyChildsBroadcast = true;
                            $scope.$broadcast('editor:entity_loaded', data);
                            delete vm.$isOnlyChildsBroadcast;
                        }, 0);
                    }
                }
            }
        });

        var destroyErrorField = $scope.$on("editor:api_error_field_" + fieldErrorName, function(event, data) {
            if (angular.isArray(data)) {
                angular.forEach(data, function(error) {
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

        vm.removeItem = function(ind) {
            var tmpArray = vm.fieldsArray;
            vm.fieldsArray.splice(ind, 1);
        };

        vm.addItem = function() {
            var clone = vm.innerFields.map(function(field) { return angular.extend({}, field); });
            angular.forEach(clone, function(value, index) {
                value.parentFieldIndex = vm.fieldsArray.length;
            });
            vm.fieldsArray.push(clone);
        };

        this.$onDestroy = function() {
            destroyEntityLoaded();
            destroyErrorField();
            destroyComponentInit();
        };

        this.$postLink = function() {
            $element.on('$destroy', function() {
                $scope.$destroy();
            });
        };
    }
})();