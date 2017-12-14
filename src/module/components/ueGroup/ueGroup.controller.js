(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeGroupController', UeGroupController);

    function UeGroupController($scope, EditEntityStorage, $timeout, $controller, $translate, $element) {
        /* jshint validthis: true */
        'ngInject';
        var vm = this,
            componentSettings,
            baseController,
            widthBootstrap = 12, 
            dataSource;

        vm.$onInit = function() {
            componentSettings = vm.setting.component.settings;
            vm.fieldName = componentSettings.name;

            baseController = $controller('BaseController', { $scope: $scope, $element: $element });
            vm.resourceType = vm.setting.resourceType;
            angular.extend(vm, baseController);
            EditEntityStorage.addFieldController(vm, true);
            dataSource = $scope.getParentDataSource();

            if (vm.multiple && vm.setting.name) {
                vm.setting.name = vm.setting.name + '[]';
            }

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
            if (vm.countInLine > 1) {
                vm.className += ' auto-width';
            }

            if (vm.multiple === true && !vm.setting.name) {
                $translate('ERROR.MULTIPLE_NAME').then(function(translation) {
                    console.log('UeFormGroup:' + translation);
                });
            }

            vm.addItem = addItem;
            vm.removeItem = removeItem;

            angular.forEach(componentSettings.fields, function(value, index) {
                var field;
                if (angular.isString(value)) {
                    if (vm.setting.name && value.indexOf(vm.setting.name) === -1) {
                        value = vm.setting.name + '.' + value;
                    }                    
                    if (dataSource && angular.isArray(dataSource.fields)) {
                        field = dataSource.fields.filter(function(k) {
                            return k.name == value;
                        })[0];
                    }
                    if (field) {
                        field = angular.merge({}, field);
                    }
                } else if (value && value.component) {
                    field = value;
                }
                if (field) {
                    if (vm.setting.name && field.name.indexOf(vm.setting.name) === -1) {
                        field.name = vm.setting.name + '.' + field.name;
                    }
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
            if (!vm.$isOnlyChildsBroadcast && angular.isString(vm.setting.name)) {
                var names = vm.setting.name.split('.');
                var tempObject = data;
                var partName = '';
                data.$dataSource = dataSource;
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

        function removeItem(uid) {
            angular.forEach(vm.fieldsArray, function(group, groupIndex, array) {
                if (group.uid === uid) {
                    array.splice(groupIndex, 1);
                }
            });
            angular.forEach(vm.fieldsArray, function(group, groupIndex) {
                angular.forEach(group, function(setting) {
                    let component = EditEntityStorage.getComponentBySetting(setting);
                    if (component) {
                        component.setting.parentFieldIndex = groupIndex;
                        component.parentFieldIndex = groupIndex;
                    }
                });
            });
        }

        function addItem() {
            var clone = vm.innerFields.map(function(field) { delete field.component.$id; return angular.merge({}, field); });
            angular.forEach(clone, function(value, index) {
                value.parentFieldIndex = vm.fieldsArray.length;
            });
            clone.uid = getRandomId();
            vm.fieldsArray.push(clone);
        }

        function getRandomId() {
            return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,
                function(c) {
                    var r = Math.random() * 16 | 0, v = c == 'x' ? r : r & 0x3 | 0x8; return v.toString(16);
                }
            );
        }

    }
})();