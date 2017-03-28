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
            baseController,
            widthBootstrap = 12;

        vm.$onInit = function() {
            componentSettings = vm.setting.component.settings;
            vm.fieldName = componentSettings.name;

            baseController = $controller('BaseController', { $scope: $scope });
            vm.resourceType = vm.setting.resourceType;
            angular.extend(vm, baseController);
            EditEntityStorage.addFieldController(vm, true);

            vm.width = !isNaN(+componentSettings.width) ? componentSettings.width : null;
            vm.classGroupComponent = '.col-md-12.col-xs-12.col-sm-12.col-lg-12 clear-padding-left';

            if (!!vm.width) {
                if (vm.width > 12) {
                    vm.width = 12;
                }
                if (vm.width < 1) {
                    vm.width = 1;
                }
                vm.classGroupComponent = 'col-lg-' + vm.width + ' col-md-' + vm.width + ' col-sm-' + vm.width + ' col-xs-' + vm.width + ' clear-padding-left';
            }

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
                var field, dataSource;
                if (angular.isString(value)) {
                    dataSource = $scope.getParentDataSource();
                    if (dataSource && angular.isArray(dataSource.fields)) {
                        field = dataSource.fields.filter(function(k) {
                            return k.name == value;
                        })[0];
                    }
                } else if (value && value.component) {
                    field = value;
                }
                if (field) {
                    if (vm.fieldName && vm.resourceType) {
                        field.resourceType = vm.resourceType; //for JSONAPI
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
            vm.listeners.push($scope.$on('ue:componentDataLoaded', onLoadedHandler));
            vm.option = angular.merge({}, vm.options);
            vm.option.isGroup = true;
        };

        function onLoadedHandler(event, data) {
            if (!vm.$isOnlyChildsBroadcast && vm.setting.name) {
                var names = vm.setting.name.split('.');
                var tempObject = data;
                var partName = '';
                angular.forEach(names, function(name, i) {
                    var empty = {};
                    partName = partName ? (partName + '.' + name) : name;
                    if (name.lastIndexOf('[]') === (name.length - 2)) {
                        name = name.substr(0, name.length - 2);
                    }
                    if (angular.isArray(tempObject)) {
                        let component = vm.getParentComponent(partName);
                        if (component) {
                            var parentIndex = component.parentFieldIndex || 0;
                            tempObject = tempObject[parentIndex];
                        }
                    }
                    if (i !== (names.length - 1)) {
                        tempObject = tempObject[name];
                    } else {
                        if (angular.isArray(tempObject[name]) && tempObject[name].length) {
                            tempObject[name].forEach(vm.addItem);
                            $timeout(function() {
                                vm.$isOnlyChildsBroadcast = true;
                                $scope.$broadcast('ue:componentDataLoaded', data);
                                delete vm.$isOnlyChildsBroadcast;
                            }, 0);
                        }
                    }
                });
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