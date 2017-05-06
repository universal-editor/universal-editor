(function() {
    'use strict';

    angular
        .module('universal-editor')
        .controller('UeFormController', UeFormController);

    function UeFormController($scope, ApiService, $location, $state, $translate, EditEntityStorage, $window, $timeout, $controller, $element) {
        /* jshint validthis: true */
        'ngInject';
        var vm = this,
            pk,
            defaultEditFooterBar = [
                {
                    component: {
                        name: 'ue-button',
                        settings: {
                            label: $translate.instant('BUTTON.ACTIONS.SAVE'),
                            action: 'save',
                            useBackUrl: true,
                        }
                    }
                },
                {
                    component: {
                        name: 'ue-button',
                        settings: {
                            label: $translate.instant('BUTTON.ACTIONS.DELETE'),
                            action: 'delete',
                            useBackUrl: true,
                        }
                    }
                },
                {
                    component: {
                        name: 'ue-button',
                        settings: {
                            label: $translate.instant('BUTTON.ACTIONS.PRESAVE'),
                            action: 'presave'
                        }
                    }
                }
            ];

        vm.$onInit = function() {

            //** Nested base controller */
            angular.extend(vm, $controller('BaseController', { $scope: $scope, $element: $element }));

            vm.componentSettings = vm.setting.component.settings;
            vm.entityLoaded = false;
            vm.errors = [];
            vm.entityId = '';
            vm.editorEntityType = 'new';
            vm.editFooterBar = [];
            vm.idField = 'id';

            var dataSource = vm.componentSettings.dataSource;
            var header = vm.componentSettings.header;
            if (angular.isObject(header)) {
                vm.toolbar = header.toolbar;
                if (!angular.isArray(vm.toolbar)) {
                    vm.toolbar = [];
                }
            }

            vm.width = !isNaN(+vm.componentSettings.width) ? vm.componentSettings.width : null;
            vm.classFormComponent = '.col-md-12.col-xs-12.col-sm-12.col-lg-12 clear-padding-left';

            if (!!vm.width) {
                if (vm.width > 12) {
                    vm.width = 12;
                }
                if (vm.width < 1) {
                    vm.width = 1;
                }
                vm.classFormComponent = 'col-lg-' + vm.width + ' col-md-' + vm.width + ' col-sm-' + vm.width + ' col-xs-' + vm.width + ' clear-padding-left';
            }

            vm.options = angular.copy(vm.options);
            angular.merge(vm.options, {
                isLoading: false,
                $componentId: vm.setting.component.$id,
                $dataSource: dataSource
            });

            if (angular.isFunction(vm.componentSettings.primaryKeyValue)) {
                pk = vm.componentSettings.primaryKeyValue();
            } else {
                pk = vm.componentSettings.primaryKeyValue;
            }
            vm.isNewRecord = pk === null || pk === undefined;

            if (dataSource && dataSource.hasOwnProperty('primaryKey')) {
                vm.idField = dataSource.primaryKey || vm.idField;
            }

            /** Filling footer section */
            if (!!vm.componentSettings.footer && !!vm.componentSettings.footer.toolbar) {
                angular.forEach(vm.componentSettings.footer.toolbar, function(control) {
                    var newControl = angular.merge({}, control);
                    if (angular.isUndefined(newControl.component.settings.dataSource)) {
                        newControl.component.settings.dataSource = dataSource;
                    }
                    newControl.paginationData = {};
                    vm.editFooterBar.push(newControl);
                });
            }

            /** Default components for the footer bar */
            if (vm.editFooterBar.length === 0 && !vm.componentSettings.footer) {
                angular.forEach(defaultEditFooterBar, function(control) {
                    var newControl = angular.merge({}, control);
                    if (angular.isUndefined(newControl.component.settings.dataSource)) {
                        newControl.component.settings.dataSource = dataSource;
                    }
                    newControl.paginationData = {};
                    vm.editFooterBar.push(newControl);
                });
            }

            /** Default components for the footer bar */
            vm.components = [];
            angular.forEach(vm.componentSettings.body, function(componentObject) {
                if (angular.isObject(componentObject) && componentObject.component) {
                    vm.components.push(componentObject);
                    if (componentObject.component.settings.dataSource === undefined) {
                        componentObject.component.settings.dataSource = dataSource;
                    }
                }
                if (angular.isString(componentObject)) {
                    var dataSourceComponent = dataSource.fields.filter(function(k) {
                        return k.name == componentObject;
                    })[0];
                    if (dataSourceComponent) {
                        vm.components.push(angular.merge({}, dataSourceComponent));
                    }
                }
            });


            if (dataSource) {
                if (vm.isNewRecord) {
                    vm.entityLoaded = true;
                    $timeout(function() {
                        EditEntityStorage.newSourceEntity(vm.options.$componentId, dataSource);
                    });
                } else {
                    ApiService.getItemById(pk, vm.options).finally(function() {
                        vm.options.isLoading = false;
                    });
                }
            } else {
                vm.entityLoaded = true;
            }

            /** Watcher for value of primary key */
            if (angular.isFunction(vm.componentSettings.primaryKeyValue)) {
                var primaryKeyWatcher = $scope.$watch(function() {
                    return vm.componentSettings.primaryKeyValue();
                }, function(newVal) {
                    updateButton(newVal);
                });
                vm.listeners.push(primaryKeyWatcher);
            }

            /** Event Handlers */
            var componentDataLoadedHandler = $scope.$on('ue:componentDataLoaded', function(event, data) {
                if (vm.isParentComponent(data) && !event.defaultPrevented) {
                    vm.editorEntityType = data.editorEntityType;
                    vm.entityId = data[vm.idField];
                    vm.data = data;
                    vm.entityLoaded = true;
                }
            });

            var afterEntityUpdateHandler = $scope.$on('ue:afterEntityUpdate', function(event, data) {
                if (data.action === 'presave') {
                    vm.entityId = data;
                    vm.editorEntityType = 'exist';
                }
            });

            var beforeEntityCreateHandler = $scope.$on('ue:beforeEntityCreate', vm.resetErrors);
            var beforeEntityUpdateHandler = $scope.$on('ue:beforeEntityUpdate', vm.resetErrors);
            var beforeEntityDeleteHandler = $scope.$on('ue:beforeEntityDelete', vm.resetErrors);

            vm.listeners.push(beforeEntityCreateHandler);
            vm.listeners.push(beforeEntityDeleteHandler);
            vm.listeners.push(componentDataLoadedHandler);
            vm.listeners.push(componentDataLoadedHandler);
            vm.listeners.push(afterEntityUpdateHandler);

            EditEntityStorage.addFieldController(vm);

            vm.getFieldValue = function() {
                return EditEntityStorage.constructOutputValue(vm.options);
            };
        };
        
        function updateButton(pk) {
            angular.forEach(vm.editFooterBar, function(button) {
                button.entityId = pk;
                button.type = vm.isNewRecord ? 'create' : 'update';
            });
        }
    }
})();