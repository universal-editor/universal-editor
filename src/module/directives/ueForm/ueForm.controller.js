(function () {
    'use strict';

    angular
        .module('universal.editor')
        .controller('UeFormController', UeFormController);

    UeFormController.$inject = ['$scope','$rootScope','configData','RestApiService','FilterFieldsStorage','$location','$document','$timeout','$httpParamSerializer','$state','toastr', '$translate', 'ConfigDataProvider'];

    function UeFormController($scope,$rootScope,configData,RestApiService,FilterFieldsStorage,$location,$document,$timeout,$httpParamSerializer,$state,toastr, $translate, ConfigDataProvider) {
        $scope.entity = RestApiService.getEntityType();
        var entityObject = RestApiService.getEntityObject();
        /* jshint validthis: true */
        var vm = this,
            pageItems = 3,
            itemsKey,
            mixEntityObject;

        vm.assetsPath = '/assets/universal-editor';

        if ($scope.entity === undefined || angular.isUndefined(entityObject)){
            console.error('Editor: Сущность с типом "' + $scope.entity + '" не описана в конфигурационном файле');
            return;
        }
        vm.configData = configData;
        vm.correctEntityType = true;
        vm.entityLoaded = false;
        vm.listLoaded = false;
        vm.loadingData = true;
        vm.tabs = entityObject.tabs;
        vm.tableFields = [];
        vm.links = [];
        vm.errors = [];
        vm.notifys = [];
        vm.tabsVisibility = [];
        vm.currentTab = vm.tabs[0].label;
        vm.entityId = "";
        vm.editorEntityType = "new";
        vm.listHeaderBar = entityObject.listHeaderBar;
        vm.editFooterBarNew = [];
        vm.editFooterBarExist = [];
        vm.parentButton = false;
        vm.filterFields = [];
        vm.visibleFilter = true;
        vm.autoCompleteFields = [];
        vm.entityType = $scope.entity;

        if (!!vm.configData.ui && !!vm.configData.ui.assetsPath) {
            vm.assetsPath = vm.configData.ui.assetsPath;
        }

        if(entityObject.backend.hasOwnProperty('fields')){
            vm.idField = entityObject.backend.fields.primaryKey || vm.idField;
        }

        var mixEntity = RestApiService.getMixModeByEntity();
        vm.isMixMode = mixEntity.existence;
        itemsKey = "items";

        angular.forEach(entityObject.tabs, function (tab) {
            angular.forEach(tab.fields, function (field) {
                if (field.list === true && (field.valuesRemote || field.values)) {
                    vm.autoCompleteFields.push(field);
                }

                if(field.hasOwnProperty("list") && field.list === true){
                    vm.tableFields.push({
                        field : field.name,
                        displayName : field.label || field.name
                    });
                }
            });
        });
        angular.forEach(entityObject.editFooterBar, function (editFooterBar) {
            switch (editFooterBar.type){
                case 'add':
                    vm.editFooterBarNew.push(editFooterBar);
                    break;
                case 'presave':
                    vm.editFooterBarNew.push(editFooterBar);
                    vm.editFooterBarExist.push(editFooterBar);
                    break;
                case 'update':
                    vm.editFooterBarExist.push(editFooterBar);
                    break;
                case 'delete':
                    vm.editFooterBarExist.push(editFooterBar);
                    break;
                case 'request':
                    vm.editFooterBarNew.push(editFooterBar);
                    vm.editFooterBarExist.push(editFooterBar);
                    break;
                case 'targetBlank':
                    vm.editFooterBarNew.push(editFooterBar);
                    vm.editFooterBarExist.push(editFooterBar);
                    break;
                case 'download':
                    vm.editFooterBarNew.push(editFooterBar);
                    vm.editFooterBarExist.push(editFooterBar);
                    break;
            }
        });

        if(mixEntity.existence){
            angular.forEach(mixEntityObject.tabs, function (tab) {
                angular.forEach(tab.fields, function (field) {
                    if(field.hasOwnProperty("list") && field.list === true && !isInTableFields(field.name) ){
                        vm.tableFields.push({
                            field : field.name,
                            displayName : field.label || field.name
                        });
                    }
                });
            });
        }

        angular.forEach(vm.tabs, function (tab,ind) {
            if(tab.fields.length > 0){
                vm.tabsVisibility.push(tab.fields[0].name);
                angular.forEach(tab.fields,function(field){
                    if(field.hasOwnProperty("filterable") && field.filterable === false) {
                        // ;)
                    } else {
                        vm.filterFields.push(field);
                    }
                });
            } else {
                vm.tabsVisibility.push("");
            }
        });


        vm.getScope = function(){
            return $scope;
        };

        vm.setTabVisible = function (index,value) {
            vm.tabsVisibility[index] = value;
        };

        vm.closeEditor = function () {
            $scope.$apply(function () {
                vm.entityLoaded = false;
            });
        };

        vm.closeButton = function () {

            vm.entityLoaded = false;
            vm.listLoaded = false;

            var params = {};
            var isReload = false;
            if($state.params.back){
                params.type = $state.params.back;
            }
            if($state.params.parent){
                params.parent = $state.params.parent;
                isReload = false;
            }
            RestApiService.getItemsList();
            $state.go('editor.type.list', params, {reload: isReload});
        };

        vm.applyFilter = function () {
            RestApiService.setFilterParams(FilterFieldsStorage.getFilterValue());
            RestApiService.getItemsList();
        };

        vm.clearFilter = function () {
            FilterFieldsStorage.setInitialValues();
            RestApiService.setFilterParams({});
            if ($state.is('editor.type.list')) {
                RestApiService.getItemsList();
            }
        };


        if (!RestApiService.isProcessing) {
            vm.clearFilter();
        }

        vm.contextAction = function (button,id) {
            RestApiService.contextMenuAction(button,id);
        };

        vm.getParent = function () {
            RestApiService.loadParent($location.search().parent);
        };

        vm.toggleFilterVisibility = function () {
            if(!vm.entityLoaded){
                vm.visibleFilter = !vm.visibleFilter;
            }
        };

        $rootScope.$broadcast('editor:set_entity_type',$scope.entity);

        $scope.$on('editor:entity_loaded', function (event,data) {
            vm.editorEntityType = data.editorEntityType;
            vm.entityId = data[vm.idField];
            vm.entityLoaded = true;
        });

        $scope.$on('editor:server_error', function (event,data) {
            vm.errors.push(data);
        });

        $scope.$on('editor:presave_entity_created', function (event,data) {
            $translate('CHANGE_RECORDS.CREATE').then(function (translation) {
                toastr.success(translation);
            });
            vm.entityId = data;
            vm.editorEntityType = "exist";
        });

        $scope.$on('editor:presave_entity_updated', function (event,data) {
            $translate('CHANGE_RECORDS.UPDATE').then(function (translation) {
                toastr.success(translation);
            });
        });

        $scope.$on('editor:entity_success_deleted', function (event,data) {
            $translate('CHANGE_RECORDS.DELETE').then(function (translation) {
                toastr.success(translation);
            });
        });

        $scope.$on('editor:field_error', function (event,data) {
            vm.errors.push(data);
        });

        $scope.$on('editor:request_start', function (event,data) {
            vm.errors = [];
            vm.notifys = [];
        });

        $scope.$watch(function () {
            return RestApiService.isProcessing;
        }, function (processingStatus) {
            vm.loadingData = processingStatus;
        });

        function isInTableFields(name) {
            var index = vm.tableFields.findIndex(function(field) {
                return field.field === name;
            });

            return (index !== -1) ? true : false;
        }

        //локализация
        if(configData.hasOwnProperty("ui") &&  configData.ui.hasOwnProperty("language")) {
            if(configData.ui.language.search(".json") !== (-1)){
                $translate.use(configData.ui.language);
            } else if(configData.ui.language !== 'ru') {
                $translate.use('assets/json/language/' + configData.ui.language + '.json');
            }
        }

        vm.clickEnter = function(event){
            if(event.keyCode === 13){
                vm.applyFilter();
            }
        }
    }
})();