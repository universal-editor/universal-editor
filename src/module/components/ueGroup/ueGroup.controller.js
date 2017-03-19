(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeGroupController', UeGroupController);

    function UeGroupController($scope, EditEntityStorage, $timeout, YiiSoftApiService, $controller, $translate) {
        /* jshint validthis: true */
        "ngInject";
        var vm = this,
            componentSettings,
            entityObject,
            baseController,
            widthBootstrap = 12;

        vm.$onInit = function() {
            componentSettings = vm.setting.component.settings;
            entityObject = YiiSoftApiService.getEntityObject();
            vm.fieldName = componentSettings.name;

            baseController = $controller('BaseController', { $scope: $scope });
            vm.parentFieldType = vm.setting.resourceType;
            angular.extend(vm, baseController);
            EditEntityStorage.addFieldController(vm, true);

            vm.innerFields = [];
            vm.fieldsArray = [];
            vm.countInLine = componentSettings.countInLine || 1;
            widthBootstrap = Math.ceil(12 / vm.countInLine);
            vm.className = 'col-md-' + widthBootstrap + ' col-xs-' + widthBootstrap + ' col-sm-' + widthBootstrap + ' col-lg-' + widthBootstrap;

            if (vm.multiple === true && !vm.fieldName) {
                $translate('ERROR.MULTIPLE_NAME').then(function(translation) {
                    console.log('UeFormGroup:' + translation);
                });
            }

            vm.addItem = addItem;
            vm.removeItem = removeItem;

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
                        field.parentFieldType = vm.parentFieldType; //for JSONAPI
                    }
                    vm.innerFields.push(field);
                }
            });
            vm.fields = [];
            var i = -1;

            vm.innerFields.forEach(function(field, index) {
                if (index % vm.countInLine === 0) {
                    i++;
                }
                vm.fields[i] = vm.fields[i] || [];
                vm.fields[i].push(field);
            });

            vm.$isOnlyChildsBroadcast = false;
            vm.listeners.push($scope.$on('editor:entity_loaded', onLoadedHandler));
            vm.option = angular.merge({}, vm.options);
            vm.option.isGroup = true;
        };

        function onLoadedHandler(event, data) {
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
        }

        function removeItem(ind) {
            vm.fieldsArray.splice(ind, 1);
        }

        function addItem() {
            var clone = vm.innerFields.map(function(field) { return angular.extend({}, field); });
            angular.forEach(clone, function(value, index) {
                value.parentFieldIndex = vm.fieldsArray.length;
            });
            vm.fieldsArray.push(clone);
        }
    }
})();