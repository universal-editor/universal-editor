(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeFormController', UeFormController);

    UeFormController.$inject = ['$scope', 'RestApiService', '$location', '$state', '$translate', 'EditEntityStorage', '$window', 'ModalService', '$timeout'];

    function UeFormController($scope, RestApiService, $location, $state, $translate, EditEntityStorage, $window, ModalService, $timeout) {

        /* jshint validthis: true */
        var vm = this,
            mixEntityObject,
            pkKey,
            pk;

        var defaultEditFooterBar = [
            {
                component: {
                    name: 'ue-button-service',
                    settings: {
                        label: 'Сохранить',
                        action: 'save'
                    }
                }
            },
            {
                component: {
                    name: 'ue-button-service',
                    settings: {
                        label: 'Удалить',
                        action: 'delete'
                    }
                }
            },
            {
                component: {
                    name: 'ue-button-service',
                    settings: {
                        label: 'Сохранить',
                        action: 'presave'
                    }
                }
            }
        ];

        vm.$onInit = function() {
            vm.componentSettings = vm.setting.component.settings;
            var dataSource = vm.componentSettings.dataSource;
            var header = vm.componentSettings.header;
            if (angular.isObject(header)) {
                vm.toolbar = header.toolbar;
                if (!angular.isArray(vm.toolbar)) {
                    vm.toolbar = [];
                }
            }
            vm.entityLoaded = false;
            vm.listLoaded = false;
            vm.errors = [];
            vm.notifys = [];
            vm.entityId = '';
            vm.editorEntityType = 'new';
            vm.editFooterBar = [];
            vm.editFooterBarNew = [];
            vm.editFooterBarExist = [];
            vm.idField = 'id';

            vm.options = angular.copy(vm.options);
            angular.merge(vm.options, {
                isLoading: false,
                $parentComponentId: vm.setting.component.$id,
                $dataSource: dataSource
            });

            pkKey = 'pk';
            pk = $state.params[pkKey];

            if (dataSource.hasOwnProperty('primaryKey')) {
                vm.idField = dataSource.primaryKey || vm.idField;
            }

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

            if (vm.editFooterBar.length === 0) {
                angular.forEach(defaultEditFooterBar, function(control) {
                    var newControl = angular.merge({}, control);
                    if (angular.isUndefined(newControl.component.settings.dataSource)) {
                        newControl.component.settings.dataSource = dataSource;
                    }
                    newControl.paginationData = {};
                    vm.editFooterBar.push(newControl);
                });
            }
            updateButton();

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
                    });
                    if (dataSourceComponent.length > 0) {
                        vm.components.push(dataSourceComponent[0]);
                    }
                }
            });


            if (pk !== 'new') {
                if (pk) {
                    RestApiService.getItemById(pk, dataSource, vm.options);
                } else if (vm.setting.pk) {
                    RestApiService.getItemById(vm.setting.pk, dataSource, vm.options);
                }
            }

            if (pk === 'new') {
                vm.entityLoaded = true;
                if (pk === 'new' && !ModalService.isModalOpen()) {
                    $timeout(function() {
                        if (pk === 'new' && !ModalService.isModalOpen()) {
                            EditEntityStorage.newSourceEntity(vm.options.$parentComponentId, vm.setting.component.settings.dataSource.parentField);
                        }
                    });
                }
            }
        };

        function updateButton() {
            pkKey = 'pk';
            pk = $state.params[pkKey];
            angular.forEach(vm.editFooterBar, function(button, index) {
                if (pk === 'new') {
                    button.type = 'create';
                } else {
                    button.type = 'update';
                }
            });
        }

        $scope.$watch(function() {
            return $state.params;
        }, function(newVal) {
            updateButton();
        });


        $scope.$on('editor:entity_loaded', function(event, data) {
            if (!data.$parentComponentId || data.$parentComponentId === vm.options.$parentComponentId) {
                vm.editorEntityType = data.editorEntityType;
                vm.entityId = data[vm.idField];
                vm.entityLoaded = true;
            }
        });

        $scope.$on('editor:server_error', function(event, data) {
            vm.errors.push(data);
        });

        $scope.$on('editor:presave_entity_created', function(event, data) {
            vm.entityId = data;
            vm.editorEntityType = 'exist';
        });

        $scope.$on('editor:field_error', function(event, data) {
            vm.errors.push(data);
        });

        $scope.$on('editor:request_start', function(event, data) {
            vm.errors = [];
            vm.notifys = [];
        });
    }
})();