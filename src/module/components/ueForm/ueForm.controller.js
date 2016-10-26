(function() {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeFormController', UeFormController);

    UeFormController.$inject = ['$scope', '$rootScope', 'configData', 'RestApiService', 'FilterFieldsStorage', '$location',
        '$document', '$timeout', '$httpParamSerializer', '$state', 'toastr', '$translate', 'ConfigDataProvider',
        'ModalService', 'EditEntityStorage'];

    function UeFormController($scope, $rootScope, configData, RestApiService, FilterFieldsStorage, $location,
        $document, $timeout, $httpParamSerializer, $state, toastr, $translate, ConfigDataProvider,
        ModalService, EditEntityStorage) {
        $scope.entity = RestApiService.getEntityType();
        var entityObject = RestApiService.getEntityObject();
        /* jshint validthis: true */
        var vm = this,
            pageItems = 3,
            itemsKey,
            mixEntityObject;

        vm.assetsPath = '/assets/universal-editor';

        vm.configData = configData;
        vm.correctEntityType = true;
        vm.entityLoaded = false;
        vm.listLoaded = false;
        vm.loadingData = true;
        vm.links = [];
        vm.errors = [];
        vm.notifys = [];
       // vm.currentTab = vm.setting.component.settings.body[0].component.settings.label;
        vm.entityId = "";
        vm.editorEntityType = "new";
        vm.editFooterBar = [];
        vm.editFooterBarNew = [];
        vm.editFooterBarExist = [];
        vm.parentButton = false;
        vm.filterFields = [];
        vm.idField = 'id';
        vm.visibleFilter = true;
        vm.autoCompleteFields = [];
        vm.entityType = $scope.entity;
        vm.componentState = {
            isLoading: false,
            $parentComponentId: vm.options.$parentComponentId || ''
        };


        var pkKey = 'pk' + EditEntityStorage.getLevelChild($state.current.name);
        var pk = $state.params[pkKey];

        if (!!vm.configData.ui && !!vm.configData.ui.assetsPath) {
            vm.assetsPath = vm.configData.ui.assetsPath;
        }

        if (vm.setting.component.settings.dataSource.hasOwnProperty('primaryKey')) {
            vm.idField = vm.setting.component.settings.dataSource.primaryKey || vm.idField;
        }
        itemsKey = "items";

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

        angular.forEach(vm.editFooterBar, function(button, index) {
            if (pk === 'new') {
                button.type = 'create';
            } else {
                button.type = 'update';
            }
        });
        vm.components = [];

        angular.forEach(vm.setting.component.settings.body, function(componentObject) {
            if (angular.isObject(componentObject) && componentObject.component) {
                vm.components.push(componentObject);
                if(!componentObject.component.settings.dataSource) {
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

        vm.closeEditor = function() {
            $scope.$apply(function() {
                vm.entityLoaded = false;
            });
        };

        vm.closeButton = function() {
            vm.entityLoaded = false;
            vm.listLoaded = false;

            var params = {};
            var isReload = true;
            var stateIndex = EditEntityStorage.getStateConfig('index');
            if ($state.params.back) {
                params.type = $state.params.back;
            }
            if ($state.params.parent) {
                params.parent = $state.params.parent;
                isReload = false;
            }
            var request = { 
                url: vm.setting.component.settings.dataSource.url,
                options: vm.componentState
            };
            RestApiService.getItemsList(request);
            $state.go(stateIndex.name, params, { reload: isReload });
        };

        $scope.$on('editor:entity_loaded', function(event, data) {
            if(!data.$parentComponentId || data.$parentComponentId === vm.options.$parentComponentId) {
                vm.editorEntityType = data.editorEntityType;
                vm.entityId = data[vm.idField];
                vm.entityLoaded = true;
            }
        });

        $scope.$on('editor:server_error', function(event, data) {
            vm.errors.push(data);
        });

        if (pk !== 'new') {
            if (pk) {
                if (vm.setting.component.settings.modal) {
                    RestApiService.isProcessing = false;
                }
                RestApiService.getItemById(pk, vm.setting.component.settings.dataSource, vm.componentState);
            } else if (vm.setting.pk) {
                RestApiService.getItemById(vm.setting.pk, vm.setting.component.settings.dataSource, vm.componentState);
            }
        }

        $scope.$on('editor:presave_entity_created', function(event, data) {
            $translate('CHANGE_RECORDS.CREATE').then(function(translation) {
                toastr.success(translation);
            });
            vm.entityId = data;
            vm.editorEntityType = "exist";
        });

        $scope.$on('editor:presave_entity_updated', function(event, data) {
            $translate('CHANGE_RECORDS.UPDATE').then(function(translation) {
                toastr.success(translation);
            });
        });

        $scope.$on('editor:entity_success_deleted', function(event, data) {
            $translate('CHANGE_RECORDS.DELETE').then(function(translation) {
                toastr.success(translation);
            });
        });

        $scope.$on('editor:field_error', function(event, data) {
            vm.errors.push(data);
        });

        $scope.$on('editor:request_start', function(event, data) {
            vm.errors = [];
            vm.notifys = [];
        });

        //локализация
        if (configData.hasOwnProperty("ui") && configData.ui.hasOwnProperty("language")) {
            if (configData.ui.language.search(".json") !== (-1)) {
                $translate.use(configData.ui.language);
            } else if (configData.ui.language !== 'ru') {
                $translate.use('assets/json/language/' + configData.ui.language + '.json');
            }
        }

        if (pk === 'new') {
            vm.entityLoaded = true;
        }

    }
})();