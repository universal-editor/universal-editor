(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeFormController', UeFormController);

    UeFormController.$inject = ['$scope', 'configData', 'RestApiService', '$location', '$state', '$translate', 'EditEntityStorage'];

    function UeFormController($scope, configData, RestApiService, $location, $state, $translate, EditEntityStorage) {
        // var entityObject = RestApiService.getEntityObject();
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
            vm.configData = configData;
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
                $dataSource: vm.setting.component.settings.dataSource
            });

            pkKey = 'pk' + EditEntityStorage.getLevelChild($state.current.name);
            pk = $state.params[pkKey];

            if (vm.setting.component.settings.dataSource.hasOwnProperty('primaryKey')) {
                vm.idField = vm.setting.component.settings.dataSource.primaryKey || vm.idField;
            }

            if (!!vm.setting.component.settings.footer && !!vm.setting.component.settings.footer.controls) {
                angular.forEach(vm.setting.component.settings.footer.controls, function(control) {
                    var newControl = angular.merge({}, control);
                    if (angular.isUndefined(newControl.component.settings.dataSource)) {
                        newControl.component.settings.dataSource = vm.setting.component.settings.dataSource;
                    }
                    newControl.paginationData = {};
                    vm.editFooterBar.push(newControl);
                });
            }

            if (vm.editFooterBar.length === 0) {
                angular.forEach(defaultEditFooterBar, function(control) {
                    var newControl = angular.merge({}, control);
                    if (angular.isUndefined(newControl.component.settings.dataSource)) {
                        newControl.component.settings.dataSource = vm.setting.component.settings.dataSource;
                    }
                    newControl.paginationData = {};
                    vm.editFooterBar.push(newControl);
                });
            }
            updateButton();

            vm.components = [];

            angular.forEach(vm.setting.component.settings.body, function(componentObject) {
                if (angular.isObject(componentObject) && componentObject.component) {
                    vm.components.push(componentObject);
                    if (componentObject.component.settings.dataSource === undefined) {
                        componentObject.component.settings.dataSource = vm.setting.component.settings.dataSource;
                    }
                }
                if (angular.isString(componentObject)) {
                    var dataSourceComponent = vm.setting.component.settings.dataSource.fields.filter(function(k) {
                        return k.name == componentObject;
                    });
                    if (dataSourceComponent.length > 0) {
                        vm.components.push(dataSourceComponent[0]);
                    }
                }
            });

            vm.closeButton = closeButton;

            if (pk !== 'new') {
                if (pk) {
                    RestApiService.getItemById(pk, vm.setting.component.settings.dataSource, vm.options);
                } else if (vm.setting.pk) {
                    RestApiService.getItemById(vm.setting.pk, vm.setting.component.settings.dataSource, vm.options);
                }
            }
        };

        function updateButton() {
            pkKey = 'pk' + EditEntityStorage.getLevelChild($state.current.name);
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

        function closeButton() {
            vm.entityLoaded = false;
            vm.listLoaded = false;

            var params = {};
            var isReload = true;

            if ($location.search().back) {
                params.type = $location.search().back;
            }
            if ($location.search().parent) {
                params.parent = $location.search().parent;
                isReload = false;
            }
            var stateIndex = EditEntityStorage.getStateConfig();
            var searchString = $location.search();
            $state.go(stateIndex.name, params, { reload: isReload }).then(function() {
                if (searchString.back) {
                    delete searchString.back;
                }
                $location.search(searchString);
            });
        }

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

        if (pk === 'new') {
            vm.entityLoaded = true;
        }
    }
})();